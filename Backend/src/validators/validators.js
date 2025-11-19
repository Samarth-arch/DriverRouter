// src/validators/validators.js
const Joi = require('joi');

const locationSchema = Joi.object({
  driver_id: Joi.string().uuid().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  timestamp: Joi.string().isoDate().optional()
});

const createTaskSchema = Joi.object({
  driver_id: Joi.string().uuid().allow(null), // can be assigned later
  delivery_address: Joi.string().min(5).max(1024).required()
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('assigned','enroute','delivered').required()
});

const createDriverSchema = Joi.object({
  name: Joi.string().min(2).max(128).required(),
  phone: Joi.string().allow('', null)
});

module.exports = {
  locationSchema,
  createTaskSchema,
  updateStatusSchema,
  createDriverSchema
};
