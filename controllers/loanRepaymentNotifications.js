require('dotenv').config();
const cron = require('node-cron');
const { Op } = require('sequelize');
const moment = require('moment');
const nodemailer = require('nodemailer');
const twilio = require('twilio');


const { Loan, RepaymentSchedule, Applicant, User } = require('../models');



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:'cheldeanmutheu1@gmail.com', 
      pass: 'krrn hlmk cysl mhyx' 
    }
  });

// Configure Twilio client
const twilioClient = twilio('AC859cf2a9a00a2de1e6249b4cbc579ddb', '60806d7328b6554ee534a35d2f4395ea');

async function sendNotification(applicant, repaymentSchedule, loan) {
  const message = `Dear ${applicant.fullName}, this is a reminder that your loan payment of ${repaymentSchedule.amountDue} is due tomorrow.`;

  // Send email
  await transporter.sendMail({
    from: 'cheldeanmutheu1@gmail.com',
    to: applicant.User.email,
    subject: 'Loan Repayment Reminder',
    text: message,
  });

  // Send SMS
  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: applicant.phoneNumber,
  });
}

async function checkRepayments() {
  const tomorrow = moment().add(1, 'day').startOf('day');
  const dayAfterTomorrow = moment(tomorrow).add(1, 'day');

  const dueRepayments = await RepaymentSchedule.findAll({
    where: {
      repaymentDate: {
        [Op.gte]: tomorrow.toDate(),
        [Op.lt]: dayAfterTomorrow.toDate(),
      },
      paymentStatus: 'pending',
    },
    include: [{
      model: Loan,
      include: [{
        model: Applicant,
        include: [User],
      }],
    }],
  });

  for (const repayment of dueRepayments) {
    await sendNotification(repayment.Loan.Applicant, repayment, repayment.Loan);
  }
}

// Schedule the job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily repayment check...');
  try {
    await checkRepayments();
    console.log('Daily repayment check completed successfully.');
  } catch (error) {
    console.error('Error in daily repayment check:', error);
  }
});

// You can also expose a function to run the check manually if needed
// You can also expose a function to run the check manually if needed
module.exports = {
    runManualCheck: checkRepayments,
  }; 
// Manually trigger repayment check
checkRepayments()
  .then(() => {
    console.log('Manual repayment check completed successfully.');
  })
  .catch((error) => {
    console.error('Error in manual repayment check:', error);
  });