
const upload = require('../middleware/fileUpload');
const { Applicant, Loan, RepaymentSchedule, Payment } = require('../models');
const { Op } = require('sequelize');
const path = require('path');



module.exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll();
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loans', error: error.message });
  }
};

module.exports.createLoan = [
  upload.single('collateralFile'), // 'collateralFile' should match the name attribute in your form
  async (req, res) => {
    try {
      const loanData = req.body;
      if (req.file) {
        loanData.collateralFilePath = req.file.path;
      }
      const newLoan = await Loan.create(loanData);
      res.status(201).json(newLoan);
    } catch (error) {
      res.status(400).json({ message: 'Error creating loan', error: error.message });
    }
  }
];



module.exports.getLoansByUserId = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const applicants = await Applicant.findAll({ 
      where: { 
        userId: {
          [Op.eq]: userId
        }
      },
      include: [{
        model: Loan,
        include: [{
          model: RepaymentSchedule
        }]
      }]
    });

    if (!applicants || applicants.length === 0) {
      return res.status(404).json({ message: 'No applicants found for this user' });
    }

    const loans = applicants.flatMap(applicant => applicant.Loans);

    if (loans.length === 0) {
      return res.status(404).json({ message: 'No loans found for this user' });
    }

    const processedLoans = loans.map(loan => {
      const loanData = loan.get({ plain: true });
      
      // Process RepaymentSchedules
      loanData.repaymentSchedules = loan.RepaymentSchedules.map(schedule => ({
        id: schedule.id,
        repaymentDate: schedule.repaymentDate,
        amountDue: schedule.amountDue,
        amountPaid: schedule.amountPaid,
        paymentStatus: schedule.paymentStatus
      }));

      // Calculate total amount paid and total amount due
      loanData.totalAmountPaid = loanData.repaymentSchedules.reduce((sum, schedule) => sum + Number(schedule.amountPaid), 0);
      loanData.totalAmountDue = loanData.repaymentSchedules.reduce((sum, schedule) => sum + Number(schedule.amountDue), 0);

      // Calculate upcoming payments
      const now = new Date();
      loanData.upcomingPayments = loanData.repaymentSchedules
        .filter(schedule => new Date(schedule.repaymentDate) > now && schedule.paymentStatus === 'pending')
        .map(schedule => ({
          repaymentDate: schedule.repaymentDate,
          amountDue: schedule.amountDue
        }));

      return loanData;
    });

    res.status(200).json(processedLoans);

  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ message: 'Error fetching loans', error: error.message });
  }
};

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




module.exports.getLoanRequests = async (req, res) => {
  try {
    const requests = await Loan.findAll({
      where: { approvalStatus: 'pending' },
      include: [{
        model: Applicant,
      }],
      attributes: {
        include: ['collateralFilePath']
      }
    });

    // Transform the data to include correct URL for collateralFilePath
    const transformedRequests = requests.map(request => {
      const plainRequest = request.get({ plain: true });
      if (plainRequest.collateralFilePath) {
        // Extract just the filename from the path
        const fileName = path.basename(plainRequest.collateralFilePath);
        
        // Construct the correct URL
        plainRequest.collateralFileUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;
        
        // Optionally, update the collateralFilePath to the correct value
        plainRequest.collateralFilePath = `uploads/${fileName}`;
      }
      return plainRequest;
    });

    res.status(200).json(transformedRequests);
  } catch (error) {
    res.status(400).json({ message: 'Error getting loan requests', error: error.message });
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