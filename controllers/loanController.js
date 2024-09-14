
const { Loan , Applicant} = require('../models');
const upload = require('../middleware/fileUpload');


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

module.exports.getLoansByApplicantId = async (req, res)=>{
  const {applicantId} = req.params
  console.log(applicantId)
  try{
    const loans = await Loan.findAll({where : {applicantId: applicantId}})
    if(loans.le){
    res.status(400).json({ message: 'No loans', error: error.message });

    }
    res.status(200).json(loans)

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


module.exports.getLoanRequests = async (req, res) => {
  try {
    // console.log("running")
    const requests = await Loan.findAll({
      where: { approvalStatus: 'pending' },
      include: [{
        model: Applicant,
      }]
    });
    res.status(200).json(requests);
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