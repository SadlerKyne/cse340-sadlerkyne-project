const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const revModel = require("../models/reviews-model");
const validate = {};

/* **********************************
 * Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter a review."),
  ];
};

/* ******************************
 * Check review data and return errors or continue to controller
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { review_text, inv_id } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const data = await invModel.getVehicleByInvId(inv_id);
    const reviews = await revModel.getReviewsByInventoryId(inv_id);
    const detail = await utilities.buildVehicleDetail(data);
    const reviewsHTML = await utilities.buildReviews(reviews);
    const vehicleName = `${data.inv_make} ${data.inv_model}`;
    res.render("./inventory/detail", {
      title: vehicleName,
      nav,
      detail,
      reviewsHTML,
      errors,
      inv_id,
    });
    return;
  }
  next();
};

module.exports = validate;