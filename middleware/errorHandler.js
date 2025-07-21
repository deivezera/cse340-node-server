const utilities = require("../utilities/")
async function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    console.error(err.stack || err.message);
  } else {
    console.error(err.message);
  }
  let nav = await utilities.getNav()
  res.render('./error', {
    title: err.message,
    message: err.message,
    statusCode,
    nav,
  })
}

module.exports = errorHandler;