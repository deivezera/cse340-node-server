const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
    });
  } catch (error) {
    next(error);
  }
}
/* ****************************************
 *  Deliver register view
 * *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let hashedPassword;
  try {
    let nav = await utilities.getNav();
    const {
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    } = req.body;
    hashedPassword = await bcrypt.hashSync(account_password, 10);
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      });
    }
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Login
 * *************************************** */
async function accountLogin(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      const refreshToken = jwt.sign(
        accountData,
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: 3600 * 1000,
        }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
        res.cookie("refresh-token", refreshToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
        });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
        res.cookie("refresh-token", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    res.locals.loggedin = 0;
    res.clearCookie("jwt");
    const nav = await utilities.getNav();
    res.render("index", { title: "Home", nav });
  } catch (error) {
    next(error);
  }
}

async function buildManagement(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./account/management", {
      title: "Account Management",
      nav,
    });
  } catch (error) {
    next(error);
  }
}

async function getEditAccount(req, res, next) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } =
      res.locals.accountData;
    let nav = await utilities.getNav();
    res.render("./account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  } catch (error) {
    next(error);
  }
}

async function updateAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_id, account_firstname, account_lastname, account_email } =
      req.body;
    const updateResult = accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    );
    if (updateResult) {
      req.flash("notice", `Your account was successfully updated.`);
      const { account_type } = res.locals.accountData;
      const newData = {
        account_id,
        account_type,
        account_firstname,
        account_email,
        account_lastname,
      };
      jwt.verify(
        req.cookies.refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        () => {
          const accessToken = jwt.sign(
            newData,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: 3600 * 1000 }
          );
          const newRefreshToken = jwt.sign(
            newData,
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: 3600 * 1000 }
          );
          if (process.env.NODE_ENV === "development") {
            res.cookie("jwt", accessToken, {
              httpOnly: true,
              maxAge: 3600 * 1000,
            });
            res.cookie("refresh-token", newRefreshToken, {
              httpOnly: true,
              maxAge: 3600 * 1000,
            });
          } else {
            res.cookie("jwt", accessToken, {
              httpOnly: true,
              secure: true,
              maxAge: 3600 * 1000,
            });
            res.cookie("refresh-token", newRefreshToken, {
              httpOnly: true,
              secure: true,
              maxAge: 3600 * 1000,
            });
          }
        }
      );
      res.redirect("/account/");
    } else {
      req.flash("notice", "Sorry, the update failed.");
      res.status(501).render("./account/edit-account", {
        title: "Edit Account",
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    next(error);
  }
}
async function changePassword(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_id, account_password } = req.body;
    hashedPassword = await bcrypt.hashSync(account_password, 10);
    const updateResult = await accountModel.changePassword(
      hashedPassword,
      account_id
    );
    if (updateResult) {
      req.flash("notice", `Your password was successfully updated.`);
      res.redirect("/account/");
    } else {
      req.flash("notice", "Sorry, the update failed.");
      const { account_firstname, account_lastname, account_email } = req.locals.accountData
      res.status(501).render("./account/edit-account", {
        title: "Edit Account",
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    next(error);
  }
}
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  logout,
  buildManagement,
  getEditAccount,
  updateAccount,
  changePassword,
};
