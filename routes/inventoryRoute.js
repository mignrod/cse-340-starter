// Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');

// Route to build the inventory classification view
router.get('/type/:classificationId', invController.buildByClassificationId);

// Route to build the inventory detail view
router.get('/detail/:inventoryId', invController.buildByInventoryId);

module.exports = router;
