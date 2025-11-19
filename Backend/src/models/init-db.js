// src/models/init-db.js
// Run: npm run init-db
const fs = require('fs');
const path = require('path');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// Create tables: drivers, driver_locations, tasks
db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS drivers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS driver_locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  driver_id TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  timestamp TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  driver_id TEXT,
  delivery_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'assigned', -- assigned | enroute | delivered
  tracking_code TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(driver_id) REFERENCES drivers(id)
);
`);

// Seed a couple of drivers if none exist
const row = db.prepare('SELECT count(*) as cnt FROM drivers').get();
if (row.cnt === 0) {
  const insert = db.prepare('INSERT INTO drivers (id, name, phone) VALUES (?, ?, ?)');
  insert.run(uuidv4(), 'Driver One', '+911234567890');
  insert.run(uuidv4(), 'Driver Two', '+919876543210');
  console.log('Seeded drivers.');
}

console.log('DB initialized at', process.env.DB_FILE || path.join(__dirname, '..', '..', 'data', 'database.sqlite'));
process.exit(0);
