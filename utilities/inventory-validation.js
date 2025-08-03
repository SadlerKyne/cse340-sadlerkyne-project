const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const validate = {};

/* **********************************
 * Add Classification Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
    // classification_name is required and must be string
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .isAlpha()
      .withMessage("Provide a correct classification name."),
  ];
};

/* **********************************
 * Add Inventory Validation Rules
 * ********************************* */
validate.addInventoryRules = () => {
  return [
    // All fields are required. Add specific checks as needed.
    body("inv_make").trim().isLength({ min: 1 }).withMessage("Please provide a make."),
    body("inv_model").trim().isLength({ min: 1 }).withMessage("Please provide a model."),
    body("inv_year").trim().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage("Please provide a valid year."),
    body("inv_description").trim().isLength({ min: 1 }).withMessage("Please provide a description."),
    body("inv_image").trim().isLength({ min: 1 }).withMessage("Please provide an image path."),
    body("inv_thumbnail").trim().isLength({ min: 1 }).withMessage("Please provide a thumbnail path."),
    body("inv_price").trim().isDecimal().withMessage("Please provide a valid price."),
    body("inv_miles").trim().isInt({ min: 0 }).withMessage("Please provide valid miles."),
    body("inv_color").trim().isLength({ min: 1 }).withMessage("Please provide a color."),
    body("classification_id").trim().isInt({ min: 1 }).withMessage("Please select a classification."),
  ];
};

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(classification_id)
      res.render("inventory/add-inventory", {
        errors,
        title: "Add New Inventory",
        nav,
        classificationList,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
      })
      return
    }
    next()
  }

/* ******************************
 * Check classification data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}

module.exports = validate;