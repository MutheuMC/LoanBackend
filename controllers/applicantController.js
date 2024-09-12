const { Applicant,Loan, RepaymentSchedule } = require('../models');
const { INTEREST_RATE, MAX_LOAN_TERM } = require('../config/loanConfig');
const moment = require('moment');

const { sequelize } = require('../models'); 

module.exports.getApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.findAll();
    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applicants", error: error.message });
  }
};


module.exports.createApplicant = async (req, res) => {
  const {userId} = req.params
  const transaction = await sequelize.transaction();

  try {
    const { 
      fullName, phoneNumber, idNumber, maritalStatus, spouseName, spouseIdNumber, 
      village, location, county, subCounty, businessName, businessLocation, nextOfKin, 
      nextOfKinPhone, loanAmount, loanTerm, paymentFrequency, collateralType, 
      collateralValue 
    } = req.body;

    // Input validation
    if (!loanAmount || !loanTerm || loanAmount <= 0 || loanTerm <= 0 || loanTerm > MAX_LOAN_TERM) {
      return res.status(400).json({ message: 'Invalid loan parameters' });
    }

    if (!['weekly', 'bi-weekly', 'monthly'].includes(paymentFrequency)) {
      return res.status(400).json({ message: 'Invalid payment frequency. Choose "weekly", "bi-weekly", or "monthly".' });
    }

    // Create the applicant
    const newApplicant = await Applicant.create({ userId,
      fullName, phoneNumber, idNumber, maritalStatus, spouseName, spouseIdNumber, 
      village, location, county, subCounty, businessName, businessLocation, nextOfKin, 
      nextOfKinPhone
    }, { transaction });

    // Loan calculations
    const periodsPerYear = paymentFrequency === 'weekly' ? 52 : (paymentFrequency === 'bi-weekly' ? 26 : 12);
    const interestRate = INTEREST_RATE / 100 / periodsPerYear;
    const totalPayments = loanTerm * (periodsPerYear / 12);
    const payment = (loanAmount * interestRate * Math.pow(1 + interestRate, totalPayments)) /
                    (Math.pow(1 + interestRate, totalPayments) - 1);
    const totalInterest = (payment * totalPayments) - loanAmount;

    // Calculate dates
    const dateBorrowed = moment();
    const firstPaymentDate = moment(dateBorrowed).add(1, 'month');
    let lastPaymentDate;

    switch(paymentFrequency) {
      case 'weekly':
        lastPaymentDate = moment(firstPaymentDate).add(totalPayments - 1, 'weeks');
        break;
      case 'bi-weekly':
        lastPaymentDate = moment(firstPaymentDate).add((totalPayments - 1) * 2, 'weeks');
        break;
      case 'monthly':
        lastPaymentDate = moment(firstPaymentDate).add(totalPayments - 1, 'months');
        break;
    }

    // Create loan record
    const loan = await Loan.create({
      applicantId: newApplicant.uuid,
      loanAmount,
      interestAmount: totalInterest,
      interestRate: INTEREST_RATE / 100,
      loanTerm,
      paymentFrequency,
      balanceDue: loanAmount + totalInterest,
      penaltyAmount: 0,
      collateralType,
      collateralValue,
      dateBorrowed: dateBorrowed.toDate(), 
      firstPaymentDate: firstPaymentDate.toDate(),
      lastPaymentDate: lastPaymentDate.toDate()
    }, { transaction });

    // Create repayment schedule records
    const repaymentSchedules = [];
    let remainingBalance = loanAmount;
    let currentDate = moment(firstPaymentDate);

    for (let period = 1; period <= totalPayments; period++) {
      const interestPayment = remainingBalance * interestRate;
      const principalPayment = payment - interestPayment;
      remainingBalance -= principalPayment;

      repaymentSchedules.push({
        loanId: loan.uuid,
        repaymentDate: currentDate.toDate(),
        amountDue: payment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, remainingBalance),
        paymentStatus: 'pending'
      });

      // Move to next payment date
      switch(paymentFrequency) {
        case 'weekly':
          currentDate.add(1, 'week');
          break;
        case 'bi-weekly':
          currentDate.add(2, 'weeks');
          break;
        case 'monthly':
          currentDate.add(1, 'month');
          break;
      }
    }

    await RepaymentSchedule.bulkCreate(repaymentSchedules, { transaction });

    // Commit the transaction if all operations are successful
    await transaction.commit();

    res.status(201).json({
      message: 'Applicant, Loan, and Repayment Schedule created successfully',
      applicantId: newApplicant.uuid,
      loanId: loan.uuid,
      loanAmount,
      loanTerm,
      paymentFrequency,
      paymentAmount: payment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: (loanAmount + totalInterest).toFixed(2),
      firstPaymentDate: firstPaymentDate.format('YYYY-MM-DD'),
      lastPaymentDate: lastPaymentDate.format('YYYY-MM-DD'),
      numberOfPayments: totalPayments
    });
  } catch (error) {
    // Rollback the transaction if there is an error
    await transaction.rollback();
    console.error('Error creating applicant, loan, and repayment schedule:', error);
    res.status(500).json({ message: 'Error creating applicant, loan, and repayment schedule', error: error.message });
  }
};

module.exports.getApplicantById = async (req, res) => {
  try {
    const applicant = await Applicant.findByPk(req.params.id);
    if (applicant) {
      res.status(200).json(applicant);
    } else {
      res.status(404).json({ message: "Applicant not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching applicant", error: error.message });
  }
};

module.exports.updateApplicant = async (req, res) => {
  try {
    const [updated] = await Applicant.update(req.body, {
      where: { uuid: req.params.id }
    });
    if (updated) {
      const updatedApplicant = await Applicant.findByPk(req.params.id);
      res.status(200).json(updatedApplicant);
    } else {
      res.status(404).json({ message: "Applicant not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error updating applicant", error: error.message });
  }
};

module.exports.deleteApplicant = async (req, res) => {
  try {
    const deleted = await Applicant.destroy({
      where: { uuid: req.params.id }
    });
    if (deleted) {
      res.status(204).send("Applicant deleted");
    } else {
      res.status(404).json({ message: "Applicant not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting applicant", error: error.message });
  }
};