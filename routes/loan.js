const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const loanCalcController = require('../controllers/loanCalculator')
const paymentController = require('../controllers/loanPaymentStatement')
const applicantController = require('../controllers/applicantController')



router.get('/', loanController.getLoans);
router.get('/loans/:applicantId', loanController.getLoansByApplicantId);
router.get('/:id', loanController.getLoanById);
router.patch('/:id', loanController.updateLoan);
router.delete('/:id', loanController.deleteLoan);

router.post('/updateDisbursment/:loanId', applicantController.updateLoanDisbursement)
router.post('/calculate', loanCalcController.calculateLoan)
router.post('/payment/:loanId', paymentController.processPayment)
router.get('/statement/:loanId', paymentController.generateLoanStatement)






module.exports = router;