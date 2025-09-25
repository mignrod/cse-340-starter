// Resources
const express = require('express');
const router = new express.Router();
const utilities = require('../utilities');
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation');

// Route that will be sent when "My account" link is clicked
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Route to process of registration
router.get(
  '/registration',
  utilities.handleErrors(accountController.buildRegister)
);

// Route to submit the registration form
router.post(
  '/registration',
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  (req, res) => {
    res.status(200).send('login process');
  }
);

module.exports = router;
