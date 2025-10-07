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
router.get(
  '/',
  utilities.requireAdminOrEmployee,
  utilities.handleErrors(invController.buildManagement)
);

//Add classification view
router.get(
  '/add-classification',
  utilities.requireAdminOrEmployee,
  utilities.handleErrors(invController.buildAddClassification)
);

// Post a new classification
router.post(
  '/add-classification',
  utilities.requireAdminOrEmployee,
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

//Add inventory view
router.get(
  '/add-inventory',
  utilities.requireAdminOrEmployee,
  utilities.handleErrors(invController.buildAddInventory)
);

// Post an inventory item
router.post(
  '/add-inventory',
  utilities.requireAdminOrEmployee,
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Get inventory by classificationId - returns JSON
router.get(
  '/getInventory/:classification_id',
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route for edit inventory item
router.get(
  '/edit/:inventory_id',
  utilities.requireAdminOrEmployee,
  utilities.handleErrors(invController.buildEditInventory)
);

// Post updates to an inventory item
router.post(
  '/update/',
  utilities.requireAdminOrEmployee,
  invValidate.addInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route for delete process
router.get(
  '/delete/:inventory_id',
  utilities.requireAdminOrEmployee,
  utilities.handleErrors(invController.buildDeleteInventory)
);

// Post delete confirmation
router.post(
  '/deleting/',
  utilities.requireAdminOrEmployee,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
