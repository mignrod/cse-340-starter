// Resources
const express = require('express');
const router = new express.Router();
const utilities = require('../utilities');
const accountController = require('../controllers/accountController');

// Route that will be sent when "My account" link is clicked
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Route to process of registration
router.get(
  '/registration',
  utilities.handleErrors(accountController.buildRegister)
);

module.exports = router;
