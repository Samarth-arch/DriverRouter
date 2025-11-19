// src/routes/tasks.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { createTaskSchema, updateStatusSchema } = require('../validators/validators');
const Joi = require('joi');

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', message: error.message });
    next();
  };
}

router.post('/', validate(createTaskSchema), taskController.createTask);

router.get('/:taskId', taskController.getTask);

router.patch('/:taskId/status', validate(updateStatusSchema), taskController.updateTaskStatus);

// List tasks for a driver
router.get('/driver/:driverId', taskController.listTasksForDriver);

// Public tracking by tracking code
router.get('/tracking/:trackingCode', taskController.publicTracking);

module.exports = router;
