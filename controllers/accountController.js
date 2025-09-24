const utilities = require('../utilities');

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/login', {
    title: 'login',
    nav
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

module.exports = {
  buildLogin,
  buildRegister
};
