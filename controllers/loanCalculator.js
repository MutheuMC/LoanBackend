const { Loan, RepaymentSchedule } = require('../models');
const { INTEREST_RATE, MAX_LOAN_TERM } = require('../config/loanConfig');
const moment = require('moment');

exports.calculateLoan = async (req, res) => {
  try {
    const { loanAmount, loanTerm, paymentFrequency } = req.body;
    
    if (!loanAmount || !loanTerm || loanAmount <= 0 || loanTerm <= 0 || loanTerm > MAX_LOAN_TERM) {
      return res.status(400).json({ message: 'Invalid loan parameters' });
    }

    if (!['weekly', 'bi-weekly', 'monthly'].includes(paymentFrequency)) {
      return res.status(400).json({ message: 'Invalid payment frequency. Choose "weekly", "bi-weekly", or "monthly".' });
    }

    const periodsPerYear = paymentFrequency === 'weekly' ? 52 : (paymentFrequency === 'bi-weekly' ? 26 : 12);

    // Calculate interest
    const interestRate = INTEREST_RATE / 100 / periodsPerYear; // Interest rate per period
    const totalPayments = loanTerm * (periodsPerYear / 12); // Convert loanTerm (in months) to number of payments

    // Calculate payment per period
    const payment = (loanAmount * interestRate * Math.pow(1 + interestRate, totalPayments)) /
                    (Math.pow(1 + interestRate, totalPayments) - 1);

    // Calculate total interest
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

    // Prepare repayment schedule preview
    const repaymentSchedulePreview = [];
    let remainingBalance = loanAmount;
    let currentDate = moment(firstPaymentDate);

    for (let period = 1; period <= totalPayments; period++) {
      const interestPayment = remainingBalance * interestRate;
      const principalPayment = payment - interestPayment;
      remainingBalance -= principalPayment;

      repaymentSchedulePreview.push({
        repaymentDate: currentDate.format('YYYY-MM-DD'),
        amountDue: payment.toFixed(2),
        principal: principalPayment.toFixed(2),
        interest: interestPayment.toFixed(2),
        remainingBalance: Math.max(0, remainingBalance).toFixed(2)
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

    res.status(200).json({
      loanAmount,
      loanTerm,
      paymentFrequency,
      paymentAmount: payment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: (loanAmount + totalInterest).toFixed(2),
      firstPaymentDate: firstPaymentDate.format('YYYY-MM-DD'),
      lastPaymentDate: lastPaymentDate.format('YYYY-MM-DD'),
      numberOfPayments: totalPayments,
      repaymentSchedulePreview
    });
  } catch (error) {
    console.error('Error calculating loan details:', error);
    res.status(500).json({ message: 'Error calculating loan details', error: error.message });
  }
};

exports.createLoan = async (req, res) => {
  try {
    const { loanAmount, loanTerm, paymentFrequency, applicantId } = req.body;
    
    // Recalculate loan details to ensure accuracy
    const periodsPerYear = paymentFrequency === 'weekly' ? 52 : (paymentFrequency === 'bi-weekly' ? 26 : 12);
    const interestRate = INTEREST_RATE / 100 / periodsPerYear;
    const totalPayments = loanTerm * (periodsPerYear / 12);
    const payment = (loanAmount * interestRate * Math.pow(1 + interestRate, totalPayments)) /
                    (Math.pow(1 + interestRate, totalPayments) - 1);
    const totalInterest = (payment * totalPayments) - loanAmount;

    // Create loan record
    const loan = await Loan.create({
      applicantId,
      loanAmount,
      interestAmount: totalInterest,
      interestRate: INTEREST_RATE / 100,
      loanTerm,
      paymentFrequency,
      balanceDue: loanAmount + totalInterest,
      penaltyAmount: 0, // Set initial penalty to 0
      collateralType: 'other', // This should be provided by the user
      collateralValue: 0, // This should be provided by the user
    });

    // Create repayment schedule records
    const repaymentSchedules = [];
    let remainingBalance = loanAmount;
    let currentDate = moment(loan.firstPaymentDate);

    for (let period = 1; period <= totalPayments; period++) {
      const interestPayment = remainingBalance * interestRate;
      const principalPayment = payment - interestPayment;
      remainingBalance -= principalPayment;

      repaymentSchedules.push({
        loanId: loan.uuid,
        repaymentDate: currentDate.toDate(),
        amountDue: payment,
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

    await RepaymentSchedule.bulkCreate(repaymentSchedules);

    res.status(201).json({
      message: 'Loan created successfully',
      loanId: loan.uuid,
      firstPaymentDate: loan.firstPaymentDate,
      lastPaymentDate: loan.lastPaymentDate
    });
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({ message: 'Error creating loan', error: error.message });
  }
};