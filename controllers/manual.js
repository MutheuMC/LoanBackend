const { runManualCheck } = require('./loanRepaymentNotifications');

// Trigger the manual repayment check
runManualCheck()
  .then(() => {
    console.log('Manual repayment check completed successfully.');
  })
  .catch((error) => {
    console.error('Error in manual repayment check:', error);
  });
