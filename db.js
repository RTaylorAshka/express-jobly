"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabase, DATABASE_PASSWORD } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    database: getDatabase(),
    user: 'postgres',
    password: DATABASE_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  db = new Client({
    database: getDatabase(),
    user: 'postgres',
    password: DATABASE_PASSWORD,

  });
}

db.connect();

module.exports = db;