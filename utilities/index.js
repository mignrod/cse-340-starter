const invModel = require('../models/inventory-model');
const Util = {};

/* ******************************************
 * Construct the navigation HTML unordered list
 ******************************************* */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<ul>';
  list += "<li><a href='/' title='Home page'>Home</a></li>";
  data.rows.forEach((row) => {
    list += '<li>';
    list +=
      "<a href='/inv/type/" +
      row.classification_id +
      "' title='See our inventory of " +
      row.classification_name +
      " vehicles'>" +
      row.classification_name +
      '</a>';
    list += '</li>';
  });
  list += '</ul>';
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
// Build grid function
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' on CSE Motors"></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        '</a>';
      grid += '</h2>';
      grid +=
        '<span>$' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
        '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build details view HTML
 * ************************************ */
Util.buildDetailsView = async function (data) {
  let detailView;
  if (data) {
    detailView = '<div id="inv-detail">';
    detailView +=
      '<h1>' + data.inv_make + ' ' + data.inv_model + ' ' + 'Details' + '</h1>';
    detailView +=
      '<img src="' +
      data.inv_image +
      '" alt="Image of ' +
      data.inv_make +
      ' ' +
      data.inv_model +
      '">';
    detailView +=
      '<p><strong>Price:</strong> $' +
      new Intl.NumberFormat('en-US').format(data.inv_price) +
      '</p>';
    detailView +=
      '<p><strong>Description:</strong> ' + data.inv_description + '</p>';
    // Capitalize the first letter of the color
    const color =
      data.inv_color.charAt(0).toUpperCase() + data.inv_color.slice(1);
    detailView +=
      '<p><strong>Color:</strong> ' +
      color +
      ' <span style="display:inline-block;width:20px;height:20px;background-color:' +
      data.inv_color +
      ';border:1px solid #000;margin-left:8px;vertical-align:middle;"></span></p>';
    detailView += '<p><strong>Year:</strong> ' + data.inv_year + '</p>';
    detailView +=
      '<p><strong>Miles:</strong> ' +
      new Intl.NumberFormat('en-US').format(data.inv_miles) +
      '</p>';
    detailView += '</div>';
  } else {
    detailView =
      '<p class="notice">Sorry, no matching vehicle could be found.</p>';
  }
  return detailView;
};

/*  **********************************
 *  Build classification Lists
 * ********************************* */
Util.buildClassificationList = async function (selectedId = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classification_id" required>';
  classificationList += '<option value="">Choose a Classification</option>';
  data.rows.forEach((row) => {
    let selected = selectedId == row.classification_id ? 'selected' : '';
    classificationList += `<option value="${row.classification_id}" ${selected}>${row.classification_name}</option>`;
  });
  classificationList += '</select>';
  return classificationList;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
