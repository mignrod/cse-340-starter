// Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities');
const invValidate = require('../utilities/inventory-validation');

// Route to build the inventory classification view
router.get(
  '/type/:classificationId',
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build the inventory detail view
router.get(
  '/detail/:inventoryId',
  utilities.handleErrors(invController.buildByInventoryId)
);

//Management view route
router.get('/', utilities.handleErrors(invController.buildManagement));

//Add classification view
router.get(
  '/add-classification',
  utilities.handleErrors(invController.buildAddClassification)
);

// Post a new classification
router.post(
  '/add-classification',
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

//Add inventory view
router.get(
  '/add-inventory',
  utilities.handleErrors(invController.buildAddInventory)
);

// Post an inventory item
router.post(
  '/add-inventory',
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
