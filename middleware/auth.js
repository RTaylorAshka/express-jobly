"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/**
 * Middleware: Set Auth Header
 * 
 * If token in session, set Authorization header to token
 */

function setAuthHeaderFromSession(req, res, next) {
  try {
    console.log('HERE!')
    console.log(req.session.authToken)
    if (req.session.authToken) {
      const token = req.session.authToken;
      res.setHeader("Authorization", `Bearer ${token}`)
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

function ensurePermissions(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();


    if (req.params.username) {

      if ((res.locals.user.username == req.params.username)) {

        return next();

      }
    }


    if ((!res.locals.user.isAdmin)) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  setAuthHeaderFromSession,
  ensurePermissions
};
