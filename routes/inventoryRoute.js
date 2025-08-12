// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")
const reviewValidate = require("../utilities/review-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

//Route to build management view
router.get(
  "/", 
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildManagement)
);

// Route to build the add classification view
router.get(
  "/add-classification", 
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildAddClassification)
);

//Route to build the add inventory view
router.get(
  "/add-inventory",
  utilities.checkAuthorization,
  utilities.handleErrors(invController.buildAddInventory)
);

// Process the new classification data
router.post(
  "/add-classification",
  utilities.checkAuthorization,
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
  );
  
// Process the new inventory data
router.post(
  "/add-inventory",
  utilities.checkAuthorization,
  invValidate.addInventoryRules(),
  invValidate.checkData,
  utilities.handleErrors(invController.addInventory)
);

//Process the new review data
router.post(
  "/add-review",
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(invController.addReview)
);

module.exports = router;