const invModel = require("../models/inventory-model")
const revModel = require("../models/reviews-model")
const utilities = require("../utilities/")
const invValidation = require("../utilities/inventory-validation")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * Build vehicle detail view
 * ************************** */

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getVehicleByInvId(inv_id);
  const reviews = await revModel.getReviewsByInventoryId(inv_id);
  const detail = await utilities.buildVehicleDetail(data);
  const reviewsHTML = await utilities.buildReviews(reviews);
  let nav = await utilities.getNav();
  const vehicleName = `${data.inv_make} ${data.inv_model}`;
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail,
    reviewsHTML,
    errors: null,
    inv_id,
  });

};

/* ***************************
 * Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  });
};

/* ***************************
 * Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: "",
  });
};

/* ***************************
 * Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
  });
};

/* ****************************************
* Process Add Classification
* *************************************** */
invCont.addClassification = async function (req, res) {
    const { classification_name } = req.body
    const addResult = await invModel.addClassification(classification_name)
    let nav = await utilities.getNav()
    if (addResult) {
      req.flash("notice", `Congratulations, you have added ${classification_name}.`)
      res.status(201).render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the new classification could not be added.")
      res.status(501).render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
      })
    }
  }

/* ****************************************
* Process Add Inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    const addResult = await invModel.addInventory(
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
    )
    if (addResult) {
      req.flash("notice", `Congratulations, you have added the ${inv_make} ${inv_model}.`)
      let nav = await utilities.getNav()
      res.status(201).render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the new vehicle could not be added.")
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(classification_id)
      res.status(501).render("./inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,
        errors: null,
        // Sticky form data
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
    }
  }

   /* ***************************
 * Process new review submission
 * ************************** */
invCont.addReview = async function (req, res, next) {
  const { review_text, inv_id, account_id } = req.body;
  const addResult = await revModel.addReview(
      review_text,
      inv_id,
      account_id
  );

  if (addResult) {
      req.flash("notice", "Thank you for your review!");
  } else {
      req.flash("notice", "Sorry, there was an error submitting your review.");
  }
  res.redirect(`/inv/detail/${inv_id}`);
}


  module.exports = invCont
