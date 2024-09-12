const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const loanCalcController = require('../controllers/loanCalculator')
const paymentController = require('../controllers/loanPaymentStatement')

router.get('/', loanController.getLoans);
router.post('/', loanController.createLoan);
router.get('/:id', loanController.getLoanById);
router.patch('/:id', loanController.updateLoan);
router.delete('/:id', loanController.deleteLoan);

router.post('/calculate', loanCalcController.calculateLoan)
router.post('/payment/:loanId', paymentController.processPayment)
router.get('/statement/:loanId', paymentController.generateLoanStatement)



module.exports = router;