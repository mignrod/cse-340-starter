const express = require('express');
const router = new express.Router();
const baseController = require('../controllers/baseController');
const utilities = require('../utilities');

// Error testing route
router.get('/error', utilities.handleErrors(baseController.triggerError));

module.exports = router;
