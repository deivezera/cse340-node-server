const invModel = require("../models/inventory-model")
const Util = {}

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
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
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
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildDetailPage = async function (data) {
  let page
  if (data) {
    page = '<div class="container">'
    page += `<img class="car-image" src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors" />`
    page += '<div class="details">'
    page += `<h3>${data.inv_make} ${data.inv_model} Details</h3>`
    page += `<p><span class="label">Price: ${new Intl.NumberFormat('en-US', {
      style: "currency",
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(data.inv_price)}</span></p>`
    page += `<p><span class="label">Description:</span> ${data.inv_description}</p>`
    page += `<p><span class="label">Color:</span> ${data.inv_color}</p>`
    page += `<p><span class="label">Miles:</span> ${data.inv_miles.toLocaleString('en-US')}</p>`
    page += '</div>'
  } else {
    page = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return page
}

module.exports = Util