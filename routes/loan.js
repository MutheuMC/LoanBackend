const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const loanCalcController = require('../controllers/loanCalculator')

router.get('/', loanController.getLoans);
router.post('/', loanController.createLoan);
router.get('/:id', loanController.getLoanById);
router.patch('/:id', loanController.updateLoan);
router.delete('/:id', loanController.deleteLoan);

router.post('/calculate',loanCalcController.calculateLoan)

module.exports = router;