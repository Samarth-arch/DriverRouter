// src/controllers/driverController.js
const db = require('../db');

/**
 * createDriver(req, res)
 * POST /api/v1/drivers
 */
function createDriver(req, res) {
  const { name, phone } = req.body;
  const { v4: uuidv4 } = require('uuid');
  const id = uuidv4();
  const stmt = db.prepare('INSERT INTO drivers (id, name, phone) VALUES (?, ?, ?)');
  try {
    stmt.run(id, name, phone || null);
    return res.status(201).json({ status: 'success', driver: { id, name, phone } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'could not create driver' });
  }
}

function listDrivers(req, res) {
  const rows = db.prepare('SELECT id, name, phone, created_at FROM drivers').all();
  res.json({ status: 'success', drivers: rows });
}

/**
 * POST /api/v1/driver/location
 * body: { driver_id, latitude, longitude, timestamp? }
 */
function saveDriverLocation(req, res) {
  const { driver_id, latitude, longitude, timestamp } = req.body;

  // check driver exists
  const driver = db.prepare('SELECT id FROM drivers WHERE id = ?').get(driver_id);
  if (!driver) {
    return res.status(400).json({ status: 'error', message: 'driver not found' });
  }

  const stmt = db.prepare(`
    INSERT INTO driver_locations (driver_id, latitude, longitude, timestamp)
    VALUES (?, ?, ?, ?)
  `);
  const ts = timestamp || new Date().toISOString();
  try {
    stmt.run(driver_id, latitude, longitude, ts);
    return res.json({ status: 'success', message: 'location saved' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'could not save location' });
  }
}

/**
 * GET /api/v1/driver/location/latest?driver_id=...
 */
function getLatestDriverLocation(req, res) {
  const driver_id = req.query.driver_id;
  if (!driver_id) {
    return res.status(400).json({ status: 'error', message: 'driver_id required' });
  }
  const row = db.prepare(`
    SELECT latitude, longitude, timestamp
    FROM driver_locations
    WHERE driver_id = ?
    ORDER BY timestamp DESC, id DESC
    LIMIT 1
  `).get(driver_id);

  if (!row) {
    return res.status(404).json({ status: 'error', message: 'no location found' });
  }
  res.json({ status: 'success', ...row });
}

/**
 * GET /api/v1/driver/location/history?driver_id=&limit=50
 */
function getDriverLocationHistory(req, res) {
  const driver_id = req.query.driver_id;
  const limit = Math.min(500, Number(req.query.limit) || 50);
  if (!driver_id) return res.status(400).json({ status: 'error', message: 'driver_id required' });

  const rows = db.prepare(`
    SELECT latitude, longitude, timestamp
    FROM driver_locations
    WHERE driver_id = ?
    ORDER BY timestamp DESC, id DESC
    LIMIT ?
  `).all(driver_id, limit);

  res.json({ status: 'success', locations: rows });
}

module.exports = {
  createDriver,
  listDrivers,
  saveDriverLocation,
  getLatestDriverLocation,
  getDriverLocationHistory
};
