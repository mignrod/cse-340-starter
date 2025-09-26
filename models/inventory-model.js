const { check } = require('express-validator');
const pool = require('../database/');

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    'SELECT * FROM public.classification ORDER BY classification_name'
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error('getInventoryByClassificationId error: ' + error);
  }
}

/* ***************************
 *  Get data for specific inventory item by inventory_id
 * ************************** */
async function getByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1`,
      [inventory_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error('getInventoryById error: ' + error);
  }
}

/* ***************************
 *  Save new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql =
      'INSERT INTO classification (classification_name) VALUES ($1) RETURNING *';
    const data = await pool.query(sql, [classification_name]);
    return data.rows[0];
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Check for existing classification name
 * ************************** */
async function checkExistingClassificationName(classification_name) {
  try {
    const sql = 'SELECT * FROM classification WHERE classification_name = $1';
    const classification = await pool.query(sql, [classification_name]);
    return classification.rowCount;
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  checkExistingClassificationName,
  getByInventoryId,
  addClassification
};
