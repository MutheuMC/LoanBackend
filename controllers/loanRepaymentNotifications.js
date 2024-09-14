require('dotenv').config();
const cron = require('node-cron');
const { Op } = require('sequelize');
const moment = require('moment');
const nodemailer = require('nodemailer');
const twilio = require('twilio');


const { Loan, RepaymentSchedule, Applicant, User } = require('../models');


console.log('Twilio Account SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('Twilio Auth Token:', process.env.TWILIO_AUTH_TOKEN);


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Configure Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, '');

async function sendNotification(applicant, repaymentSchedule, loan) {
  const message = `Dear ${applicant.fullName}, this is a reminder that your loan payment of ${repaymentSchedule.amountDue} is due tomorrow.`;

  // Send email
  console.log(applicant.User.email)
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: 'chelddymusingila@gmail.com',
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

  console.log(`Found ${dueRepayments.length} due repayments for tomorrow.`);
  console.log('Twilio Account SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('Twilio Auth Token:', process.env.TWILIO_AUTH_TOKEN);

  for (const repayment of dueRepayments) {
    console.log(`Processing repayment for applicant: ${repayment.Loan.Applicant.fullName}`);
    await sendNotification(repayment.Loan.Applicant, repayment, repayment.Loan);

  }

  console.log('Finished processing all due repayments.');
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