const { where } = require('sequelize');
const { Loan } = require('../models');

module.exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll();
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loans', error: error.message });
  }
};

module.exports.getLoansByApplicantId = async (req, res)=>{
  const {applicantId} = req.params
  try{
    const loans = await Loan.findAll({where :{ applicantId : applicantId}})

  }catch (error) {
    res.status(500).json({ message: 'Error fetching loans', error: error.message });
  }
}

module.exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (loan) {
      res.status(200).json(loan);
    } else {
      res.status(404).json({ message: 'Loan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loan', error: error.message });
  }
};

module.exports.updateLoan = async (req, res) => {
  try {
    const [updated] = await Loan.update(req.body, {
      where: { uuid: req.params.id }
    });
    if (updated) {
      const updatedLoan = await Loan.findByPk(req.params.id);
      res.status(200).json(updatedLoan);
    } else {
      res.status(404).json({ message: 'Loan not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating loan', error: error.message });
  }
};

module.exports.deleteLoan = async (req, res) => {
  try {
    const deleted = await Loan.destroy({
      where: { uuid: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Loan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting loan', error: error.message });
  }
};