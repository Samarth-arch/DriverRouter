// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const driversRoutes = require('./routes/drivers');
const tasksRoutes = require('./routes/tasks');
const taskController = require('./controllers/taskController');

const app = express();
const PORT = process.env.PORT || 4000;

// ----------- CORS FIX 100% WORKING ------------
app.use(
  cors({
    origin: "http://localhost:5173",   // allow React app
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// ----------------------------------------------

// middleware
app.use(morgan('dev'));
app.use(express.json());

// base route
app.get('/', (req, res) =>
  res.json({ status: 'ok', message: 'Package Delivery API' })
);

// mount API v1
app.use('/api/v1/drivers', driversRoutes);
app.use('/api/v1/tasks', tasksRoutes);

// public tracking for customers
app.get('/api/v1/tracking/:trackingCode', taskController.publicTracking);

// 404 handling
app.use((req, res) =>
  res.status(404).json({ status: 'error', message: 'not found' })
);

// start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(
    `If first time, run: npm run init-db  (to create SQLite database)`
  );
});
