// src/db.js
// Simple wrapper for better-sqlite3
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'database.sqlite');

const db = new Database(dbFile);

// Export prepared query helpers if desired.
// We'll export the db instance for direct use in controllers.
module.exports = db;
