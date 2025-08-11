const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const validate = require("../utilities/account-validation");
const utilities = require("../utilities/");

// Route to build login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
);

router.post(
  "/login",
  utilities.handleErrors(accountController.accountLogin)
);

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData, // You will need to create this in account-validation.js
  utilities.handleErrors(accountController.registerAccount)
);

// Route to build the update view
router.get(
  "/update/:accountId",
  utilities.handleErrors(accountController.buildUpdateView)
);

// Process the account update
router.post(
  "/update-account",
  validate.updateAccountRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.handleUpdateAccount)
);

// Process the password change
router.post(
  "/change-password",
  validate.changePasswordRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.handleChangePassword)
);

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

module.exports = router;