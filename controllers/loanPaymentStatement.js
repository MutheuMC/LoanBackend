const { sequelize, Loan, RepaymentSchedule, Payment, Applicant } = require('../models');
const { Op } = require('sequelize');


async function processPayment(req, res) {
  const {loanId} =req.params
  const { amountPaid, paymentDate, paymentMethod } = req.body;
  const t = await sequelize.transaction();

  try {
    const loan = await Loan.findByPk(loanId, { transaction: t });
    if (!loan) {
      throw new Error('Loan not found');
    }

    // Find the earliest unpaid or partially paid repayment schedule
    const repaymentSchedules = await RepaymentSchedule.findAll({
      where: {
        loanId,
        paymentStatus: {
          [Op.ne]: 'paid'
        }
      },
      order: [['repaymentDate', 'ASC']],
      transaction: t
    });

    if (repaymentSchedules.length === 0) {
      throw new Error('No unpaid repayment schedules found');
    }

    let remainingAmount = parseFloat(amountPaid);
    let updatedSchedules = [];

    for (const schedule of repaymentSchedules) {
      if (remainingAmount <= 0) break;

      const scheduleDue = parseFloat(schedule.amountDue) - parseFloat(schedule.amountPaid);
      const amountToPayForSchedule = Math.min(remainingAmount, scheduleDue);

      const newAmountPaid = parseFloat(schedule.amountPaid) + amountToPayForSchedule;
      const newStatus = newAmountPaid >= parseFloat(schedule.amountDue) ? 'paid' : 'pending';

      await schedule.update({
        amountPaid: newAmountPaid,
        paymentStatus: newStatus
      }, { transaction: t });

      updatedSchedules.push(schedule);

      remainingAmount -= amountToPayForSchedule;
    }

    if (remainingAmount > 0) {
      // If there's still money left, we might want to handle this case
      // For now, we'll throw an error, but you might want to handle this differently
      throw new Error(`Overpayment of ${remainingAmount}. Please adjust the payment amount.`);
    }

    // Create payment record
    const payment = await Payment.create({
      loanId,
      amountPaid,
      paymentDate,
      paymentMethod,
      status: 'Completed',
      repaymentScheduleId: updatedSchedules[0].id, // Link to the first updated schedule
      dueDate: updatedSchedules[0].repaymentDate // Use the repayment date of the first updated schedule
    }, { transaction: t });

    // Update loan balance
    const newBalance = parseFloat(loan.balanceDue) - parseFloat(amountPaid);
    await loan.update({ balanceDue: newBalance }, { transaction: t });

    await t.commit();
    
    res.status(200).json({
      message: 'Payment processed successfully',
      payment: payment,
      updatedSchedules: updatedSchedules
    });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ message: 'Error processing payment', error: error.message });
  }
}


async function generateLoanStatement(req,res) {
  const {loanId} = req.params
  const loan = await Loan.findByPk(loanId, {
    include: [
      { model: Applicant },
      { model: Payment, order: [['paymentDate', 'ASC']] },
      { model: RepaymentSchedule, order: [['repaymentDate', 'ASC']] }
    ]
  });

  if (!loan) {
    throw new Error('Loan not found');
  }

  const statement = {
    applicantName: loan.Applicant.fullName,
    loanAmount: loan.loanAmount,
    interestAmount: loan.interestAmount,
    dateBorrowed: loan.dateBorrowed,
    paymentHistory: [],
    currentBalance: loan.balanceDue,
    remainingSchedule: []
  };

  let runningBalance = parseFloat(loan.loanAmount) + parseFloat(loan.interestAmount);

  // Add payment history
  for (const payment of loan.Payments) {
    runningBalance -= parseFloat(payment.amountPaid);
    statement.paymentHistory.push({
      date: payment.paymentDate,
      amountPaid: payment.amountPaid,
      balanceAfterPayment: runningBalance
    });
  }

  // Add remaining schedule
  for (const schedule of loan.RepaymentSchedules) {
    if (schedule.paymentStatus !== 'paid') {
      statement.remainingSchedule.push({
        dueDate: schedule.repaymentDate,
        amountDue: schedule.amountDue,
        status: schedule.paymentStatus
      });
    }
  }

  return statement;
}

module.exports = {
  processPayment,
  generateLoanStatement
};