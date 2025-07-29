/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const errorHandler = require('./middleware/errorHandler');
const AppError = require("./utilities/AppError")
const session = require("express-session")
const pool = require('./database/')
const routes = require('./routes')
/* ***********************
 * Routes
 *************************/
app.use(static)

/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/*************
 * Middlewares
 *************/

 app
  .use(session({
    store: new (require('connect-pg-simple')(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
  }))
  .use(require('connect-flash')())
  .use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res)
    next()
  })
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    res.setHeader('Access-Controll-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  })
  .use("/", routes)
  .use((req, res, next) => {
    next(new AppError('Oh no! There was a crash. maybe try a different route? ', 500))
  })
  .use(errorHandler)

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})




