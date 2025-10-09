const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/login', {
    title: 'login',
    nav,
    errors: null
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/registration', {
    title: 'Register',
    nav,
    errors: null
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      'notice',
      'Sorry, there was an error processing the registration.'
    );
    res.status(500).render('account/registration', {
      title: 'Registration',
      nav,
      errors: null
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      'notice',
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render('account/login', {
      title: 'Login',
      nav,
      errors: null
    });
  } else {
    req.flash('notice', 'Sorry, the registration failed.');
    res.status(501).render('account/registration', {
      title: 'Registration',
      nav,
      errors: null
    });
  }
}

/* ****************************************
 *  Process Login request
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash('notice', 'Please, check your credentials and try again!');
    res.status(400).render('account/login', {
      title: 'Login',
      nav,
      errors: null,
      account_email
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === 'development') {
        res.cookie('jwt', accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000
        });
      }
      req.session.account_firstname = accountData.account_firstname;
      req.session.account_id = accountData.account_id;
      req.session.account_type = accountData.account_type;
      req.session.loggedin = 1;
      return res.redirect('/account/');
    } else {
      req.flash(
        'message notice',
        'Please check your credentials and try again.'
      );
      res.status(400).render('account/login', {
        title: 'Login',
        nav,
        errors: null,
        account_email
      });
    }
  } catch (error) {
    throw new Error('Access Forbidden');
  }
}

/* ****************************************
 *  Process the request and build the account view
 * *************************************** */
async function buildAccountView(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/management', {
    title: 'Account Management',
    nav,
    errors: null,
    firstname: req.session.account_firstname,
    account_id: req.session.account_id,
    account_type: req.session.account_type
  });
}

/* ****************************************
 *  Build update account view
 * *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav();
  console.log(req.params.account_id);
  const account = await accountModel.getAccountById(req.params.account_id);
  if (!account) {
    req.flash('notice', 'Account not found.');
    return res.redirect('/account/');
  }
  res.render('account/update-account', {
    title: 'Update Account',
    nav,
    errors: null,
    account_id: account.account_id,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    account_password: account.account_password,
    account_type: account.account_type
  });
}

/* ****************************************
 *  Process the update account request
 * *************************************** */
async function processAccountUpdate(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
  if (updateResult) {
    req.session.account_firstname = account_firstname;
    req.flash('notice', 'Your account was successfully updated.');
    const account = await accountModel.getAccountById(account_id);
    res.render('account/management', {
      title: 'Update Management',
      nav,
      errors: null,
      account_id: account.account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email,
      account_type: account.account_type,
      firstname: req.session.account_firstname
    });
  } else {
    req.flash('notice', 'Sorry, the update failed.');
    res.status(501).render('account/update-account', {
      title: 'Update Account',
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    });
  }
}

/* ****************************************
 *  Process the password update
 * *************************************** */
async function processPasswordUpdate(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
    const updateResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
    );

    if (updateResult) {
      req.flash('notice', 'Your password was successfully updated.');
      res.redirect('/account/');
    } else {
      req.flash('notice', 'Sorry, the password update failed.');
      res.status(501).render('account/update-account', {
        title: 'Update Account',
        nav,
        errors: null,
        account_id,
        account_password
      });
    }
  } catch (error) {
    req.flash('notice', 'There was an error processing your request.');
    res.status(500).render('account/update-account', {
      title: 'Update Account',
      nav,
      errors: null,
      account_id,
      account_password
    });
  }
}

/* ****************************************
 *  Logout process
 * *************************************** */
async function accountLogout(req, res, next) {
  res.clearCookie('jwt');
  req.session.destroy(() => {
    res.redirect('/');
  });
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountView,
  buildUpdateAccount,
  processAccountUpdate,
  processPasswordUpdate,
  accountLogout
};
