// Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities');

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

module.exports = router;
