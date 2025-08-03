// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by detail view
router.get("/detail/:invId", invController.buildByInvId);

//Route to build management view
router.get("/", invController.buildManagement);

// Route to build the add classification view
router.get("/add-classification", invController.buildAddClassification);

//Route to build the add inventory view
router.get("/add-inventory", invController.buildAddInventory);

// Process the new classification data
router.post(
    "/add-classification",
    invValidate.addClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
  );
  
// Process the new inventory data
router.post(
"/add-inventory",
invValidate.addInventoryRules(),
invValidate.checkData,
utilities.handleErrors(invController.addInventory)
);

module.exports = router;