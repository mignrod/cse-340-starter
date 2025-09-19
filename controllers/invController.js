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

module.exports = invCont;
