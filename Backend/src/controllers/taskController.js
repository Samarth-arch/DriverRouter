// src/controllers/taskController.js
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /api/v1/tasks
 * body: { driver_id?, delivery_address }
 */
function createTask(req, res) {
  const { driver_id, delivery_address } = req.body;
  // If driver_id provided, ensure exists
  if (driver_id) {
    const d = db.prepare('SELECT id FROM drivers WHERE id = ?').get(driver_id);
    if (!d) return res.status(400).json({ status: 'error', message: 'driver not found' });
  }
  const id = uuidv4();
  // tracking_code: short unique (use part of uuid)
  const tracking_code = uuidv4().split('-')[0] + id.split('-')[0];

  try {
    db.prepare(`
      INSERT INTO tasks (id, driver_id, delivery_address, status, tracking_code)
      VALUES (?, ?, ?, 'assigned', ?)
    `).run(id, driver_id || null, delivery_address, tracking_code);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    return res.status(201).json({ status: 'success', task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'could not create task' });
  }
}

/**
 * GET /api/v1/tasks/:taskId
 */
function getTask(req, res) {
  const id = req.params.taskId;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!task) return res.status(404).json({ status: 'error', message: 'task not found' });
  res.json({ status: 'success', task });
}

/**
 * PATCH /api/v1/tasks/:taskId/status
 * body: { status }
 */
function updateTaskStatus(req, res) {
  const id = req.params.taskId;
  const { status } = req.body;

  const validStatuses = ['assigned','enroute','delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ status: 'error', message: 'invalid status' });
  }
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!task) return res.status(404).json({ status: 'error', message: 'task not found' });

  try {
    db.prepare('UPDATE tasks SET status = ?, updated_at = datetime("now") WHERE id = ?').run(status, id);
    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    return res.json({ status: 'success', task: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'could not update status' });
  }
}

/**
 * GET /api/v1/drivers/:driverId/tasks
 * list tasks for a driver
 */
function listTasksForDriver(req, res) {
  const driverId = req.params.driverId;
  const tasks = db.prepare('SELECT * FROM tasks WHERE driver_id = ? ORDER BY created_at DESC').all(driverId);
  res.json({ status: 'success', tasks });
}

/**
 * GET /api/v1/tracking/:trackingCode
 * Public tracking: return task + latest driver location (if assigned)
 */
function publicTracking(req, res) {
  const code = req.params.trackingCode;
  const task = db.prepare('SELECT * FROM tasks WHERE tracking_code = ?').get(code);
  if (!task) return res.status(404).json({ status: 'error', message: 'tracking not found' });

  let latestLocation = null;
  if (task.driver_id) {
    latestLocation = db.prepare(`
      SELECT latitude, longitude, timestamp
      FROM driver_locations
      WHERE driver_id = ?
      ORDER BY timestamp DESC, id DESC
      LIMIT 1
    `).get(task.driver_id) || null;
  }

  res.json({
    status: 'success',
    task: {
      id: task.id,
      delivery_address: task.delivery_address,
      status: task.status,
      tracking_code: task.tracking_code,
      driver_id: task.driver_id,
      updated_at: task.updated_at,
      created_at: task.created_at
    },
    latest_location: latestLocation
  });
}

module.exports = {
  createTask,
  getTask,
  updateTaskStatus,
  listTasksForDriver,
  publicTracking
};
