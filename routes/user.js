const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const forgotPasswordController = require('../controllers/forgotPassword')

router.get('/', userController.getUsers);
router.post('/login', userController.login);
router.post('/register', userController.createUser);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

router.post('/forgotPassword', forgotPasswordController.forgotPassword)
router.post('/resetPassword', forgotPasswordController.resetPassword)

module.exports = router;