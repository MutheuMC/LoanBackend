const express = require('express');
const router = express.Router();
const applicantController = require('../controllers/applicantController');

router.get('/', applicantController.getApplicants);
router.post('/create/:userId', applicantController.createApplicant);
router.get('/:id', applicantController.getApplicantById);
router.put('/:id', applicantController.updateApplicant);
router.delete('/:id', applicantController.deleteApplicant);

module.exports = router;