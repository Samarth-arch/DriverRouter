// src/routes/drivers.js
const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { locationSchema, createDriverSchema } = require('../validators/validators');
const Joi = require('joi');

// helper to validate
function validate(schema) {
  return (req, res, next) => {
    const obj = req.body && Object.keys(req.body).length ? req.body : req.query;
    const { error } = schema.validate(obj);
    if (error) return res.status(400).json({ status: 'error', message: error.message });
    next();
  };
}

// create driver
router.post('/', validate(createDriverSchema), driverController.createDriver);

// list drivers (dispatcher dropdown)
router.get('/', driverController.listDrivers);

// save driver location (POST)
router.post('/location', validate(locationSchema), driverController.saveDriverLocation);

// latest location (GET) -> expects ?driver_id=...
router.get('/location/latest', driverController.getLatestDriverLocation);

// location history
router.get('/location/history', driverController.getDriverLocationHistory);

module.exports = router;
