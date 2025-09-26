const utilities = require('.');
const { body, validationResult } = require('express-validator');
const validate = {};
const invModel = require('../models/inventory-model');

/*  **********************************
 *  Add a classification data rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
    body('classification_name')
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage(
        'Classification name must be between 2 and 30 characters long'
      )
      .matches(/^[A-Za-z0-9]+$/)
      .custom(async (value) => {
        const classification = await invModel.checkExistingClassificationName(
          value
        );
        if (classification) {
          throw new Error(
            'Classification name already exists, please try again!.'
          );
        }
      })
  ];
};

/*  **********************************
 *  check classification data
 * ********************************* */
validate.checkClassificationData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('inventory/add-classification', {
      title: 'Add New Classification',
      nav: utilities.getNav(),
      errors
    });
  }
  next();
};

module.exports = validate;
