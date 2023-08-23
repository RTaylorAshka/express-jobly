"use strict";

/** Express app for jobly. */

const express = require("express");
const session = require("express-session")
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT, setAuthHeaderFromSession } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const companiesRoutes = require("./routes/companies");
const usersRoutes = require("./routes/users");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(session({
  secret: 'aj!76848m',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(setAuthHeaderFromSession);
app.use(authenticateJWT);


app.use("/auth", authRoutes);
app.use("/companies", companiesRoutes);
app.use("/users", usersRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
