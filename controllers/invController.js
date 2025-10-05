const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async (req, res, next) => {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const classname = data[0].classification_name;
  res.render('inventory/classification', {
    title: classname + ' vehicles',
    nav,
    grid
  });
};

/* ***************************
 *  Build inventory by detail view
 * ************************** */
invCont.buildByInventoryId = async (req, res, next) => {
  const inventory_id = req.params.inventoryId;
  const data = await invModel.getByInventoryId(inventory_id);
  const detailView = await utilities.buildDetailsView(data);
  const nav = await utilities.getNav();
  const name = data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model;
  res.render('inventory/details', {
    title: name,
    nav,
    detailView
  });
};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async (req, res, next) => {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render('inventory/management', {
    title: 'Inventory Management',
    nav,
    classificationSelect
  });
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async (req, res, next) => {
  const nav = await utilities.getNav();
  res.render('inventory/add-classification', {
    title: 'Add New Classification',
    nav,
    errors: null
  });
};

/* ***************************
 *  Add new classification
 * ************************** */
invCont.addClassification = async (req, res, next) => {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const regResult = await invModel.addClassification(classification_name);

  if (regResult) {
    req.flash(
      'notice',
      `The new classification ${classification_name} was added successfully.`
    );
    const nav = await utilities.getNav();
    res.status(201).render('inventory/management', {
      title: 'Inventory Management',
      nav
    });
  } else {
    req.flash('notice', 'Sorry, the registration failed.');
    res.status(501).render('inventory/add-classification', {
      title: 'Add New Classification',
      nav,
      errors: null
    });
  }
};

/* ***************************
 *  Build inventory by detail view
 * ************************** */
invCont.buildAddInventory = async (req, res, next) => {
  let nav = await utilities.getNav();
  let data = await invModel.getClassifications();
  let classificationList = await utilities.buildClassificationList(data);
  res.render('inventory/add-inventory', {
    title: 'Add Inventory',
    nav,
    errors: null,
    classificationList
  });
};

/* ***************************
 *  Add inventory item
 * ************************** */
invCont.addInventory = async (req, res, next) => {
  let nav = await utilities.getNav();
  let data = await invModel.getClassifications();
  let classificationList = await utilities.buildClassificationList(data);
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body;

  const classificationIdNum = parseInt(classification_id, 10);

  const regResult = await invModel.addInventoryItem(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classificationIdNum
  );

  if (regResult) {
    req.flash(
      'notice',
      `The new inventory item ${inv_make} ${inv_model} was added successfully.`
    );
    res.status(201).render('inventory/management', {
      title: 'Inventory Management',
      nav
    });
  } else {
    req.flash('notice', 'Sorry, the registration failed.');
    res.status(501).render('inventory/add-inventory', {
      title: 'Add Inventory',
      nav,
      errors: null,
      classificationList
    });
  }
};

/* ***************************
 *  Return inventory items as JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error('No data returned'));
  }
};

module.exports = invCont;
