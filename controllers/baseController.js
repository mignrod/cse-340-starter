const utilities = require('../utilities');
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  req.flash('notice', 'This is a flash message.');
  res.render('index', { title: 'Home', nav });
};

baseController.triggerError = (req, res, next) => {
  throw new Error('This is an intentional 500 error for testing purposes.');
};

module.exports = baseController;
