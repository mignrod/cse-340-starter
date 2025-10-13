const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');
const reviewModel = require('../models/review-model');
const session = require('express-session');

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
  const reviews = await reviewModel.getReviewsByInventoryId(inventory_id);
  // Obtain a average rating if there are reviews
  let avgRating = null;
  if (reviews && reviews.length > 0) {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    avgRating = (sum / reviews.length).toFixed(1);
  }
  res.render('inventory/details', {
    title: name,
    nav,
    detailView,
    reviews,
    avgRating,
    inv_id: inventory_id,
    loggedin: req.session.loggedin,
    session_account_id: req.session.account_id
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
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async (req, res, next) => {
  let nav = await utilities.getNav();
  let data = await invModel.getClassifications();
  let classificationSelect = await utilities.buildClassificationList(data);
  res.render('inventory/add-inventory', {
    title: 'Add Inventory',
    nav,
    errors: null,
    classificationSelect
  });
};

/* ***************************
 *  Add inventory item
 * ************************** */
invCont.addInventory = async (req, res, next) => {
  let nav = await utilities.getNav();
  let data = await invModel.getClassifications();
  let classificationSelect = await utilities.buildClassificationList(data);
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
      nav,
      classificationSelect
    });
  } else {
    req.flash('notice', 'Sorry, the registration failed.');
    res.status(501).render('inventory/add-inventory', {
      title: 'Add Inventory',
      nav,
      errors: null,
      classificationSelect
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

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.inventory_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getByInventoryId(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render('inventory/edit-inventory', {
    title: `Edit ${itemName}`,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
};

/* ***************************
 *  Update inventory item
 * ************************** */
invCont.updateInventory = async (req, res, next) => {
  let nav = await utilities.getNav();
  const {
    inv_id,
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

  const updateResult = await invModel.updateInventory(
    inv_id,
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
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + ' ' + updateResult.inv_model;
    req.flash('notice', `The ${itemName} was successfully updated.`);
    res.redirect('/inv/');
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash('notice', 'Sorry, the insert failed.');
    res.status(501).render('inventory/edit-inventory', {
      title: 'Edit ' + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
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
    });
  }
};

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.inventory_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getByInventoryId(inv_id);

  const itemName = `${itemData.inv_make} ${itemData.inv_model} in ${itemData.classification_name} category`;
  res.render('inventory/delete-confirm', {
    title: `Delete ${itemName}`,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
};

/* ***************************
 *  Delete inventory item
 * ************************** */
invCont.deleteInventory = async (req, res, next) => {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventory(inv_id);

  if (deleteResult) {
    req.flash('notice', `The inventory item was successfully deleted.`);
    res.redirect('/inv/');
  } else {
    req.flash('notice', 'Sorry, the delete failed.');
    // Fetch itemData to re-render the form with correct info
    const itemData = await invModel.getByInventoryId(inv_id);
    res.status(501).render('inventory/delete-confirm', {
      title: 'Delete Inventory Item',
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    });
  }
};

module.exports = invCont;
