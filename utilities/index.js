const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetail = async function(data) {
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.inv_price);
  const miles = new Intl.NumberFormat('en-US').format(data.inv_miles);
  let detail = '<div id="detail-view">';
  detail += `<img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">`;
  detail += '<div id="detail-data">';
  detail += `<h2>${data.inv_make} ${data.inv_model} Details</h2>`;
  detail += `<p><strong>Price:</strong> ${price}</p>`;
  detail += `<p><strong>Description:</strong> ${data.inv_description}</p>`;
  detail += `<p><strong>Color:</strong> ${data.inv_color}</p>`;
  detail += `<p><strong>Miles:</strong> ${miles}</p>`;
  detail += '</div>';
  detail += '</div>';
  return detail;
}


/* ****************************************
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build the classification list HTML
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Check JWT token
* ************************************ */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return next();
     }
     res.locals.accountData = accountData
     res.locals.loggedin = true;
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
* Check for Admin or Employee Authorization
* ************************************ */
Util.checkAuthorization = (req, res, next) => {
    if (res.locals.loggedin && (res.locals.accountData.account_type === 'Employee' || res.locals.accountData.account_type === 'Admin')) {
        next();
    } else {
        req.flash("notice", "You are not authorized to view this page.");
        return res.redirect("/account/login");
    }
}

/* ****************************************
 * Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* **************************************
* Build the reviews view HTML
* ************************************ */
Util.buildReviews = async function(reviews) {
    let reviewsHTML = '<div id="reviews-section">';
    if (reviews && reviews.length > 0) {
        reviewsHTML += '<h3>Customer Reviews</h3>';
        reviewsHTML += '<ul>';
        reviews.forEach(review => {
            const reviewDate = new Date(review.review_date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            reviewsHTML += '<li>';
            reviewsHTML += `<p><strong>${review.account_firstname} ${review.account_lastname.charAt(0)}.</strong> wrote on ${reviewDate}:</p>`;
            reviewsHTML += `<p>"${review.review_text}"</p>`;
            reviewsHTML += '</li>';
        });
        reviewsHTML += '</ul>';
    } else {
        reviewsHTML += '<p>Be the first to write a review!</p>';
    }
    reviewsHTML += '</div>';
    return reviewsHTML;
}

module.exports = Util