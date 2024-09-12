const { Applicant } = require('../models');

module.exports.getApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.findAll();
    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applicants", error: error.message });
  }
};

const { Sequelize, Applicant, Loan } = require('../models'); // Make sure you import your models properly

module.exports.createApplicant = async (req, res) => {
  const { loanData, ...applicantData } = req.body; // Assuming loanData contains the loan information

  const transaction = await Sequelize.transaction();

  try {
    // Create the applicant information
    const newApplicant = await Applicant.create(applicantData, { transaction });

    // Create the loan information with the foreign key 'applicantId'
    const newLoan = await Loan.create({
      ...loanData,
      applicantId: newApplicant.id // Assuming 'id' is the primary key of Applicant
    }, { transaction });

    // Commit the transaction if both operations are successful
    await transaction.commit();

    res.status(201).json({
      message: 'Applicant and Loan created successfully',
      applicant: newApplicant,
      loan: newLoan
    });
  } catch (error) {
    // Rollback the transaction if there is an error
    await transaction.rollback();
    res.status(400).json({ message: 'Error creating applicant and loan', error: error.message });
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