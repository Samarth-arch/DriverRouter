# Package Delivery Route Tracker (Node.js, Express, SQLite, React)

This project is a complete package delivery tracking system built with:
- Node.js and Express for the backend API
- SQLite as the database
- React and Vite for the frontend
- Leaflet.js for displaying live location on a map

The system allows dispatchers to create delivery tasks, assign drivers, and track the status of a package. Drivers can update their GPS location. Customers can track their package using a public tracking page.

------------------------------------------------------------

## 1. Project Folder Structure

project-root/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── validators/
│   │   ├── db.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── pages/
    │   ├── components/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── index.html

------------------------------------------------------------

## 2. Backend Setup (Node.js + Express + SQLite)

1. Open the backend folder:

    cd backend

2. Install backend dependencies:

    npm install

3. Create the SQLite database:

    npm run init-db

4. Start the backend server:

    npm run dev

The backend will run on:
http://localhost:4000

------------------------------------------------------------

## 3. Backend Environment Variables

Create a file named `.env` inside the backend folder and add:

PORT=4000
DB_FILE=./data/database.sqlite

------------------------------------------------------------

## 4. Backend Server Code (src/index.js)

Below is the complete working code for the backend server:

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const driversRoutes = require('./routes/drivers');
const tasksRoutes = require('./routes/tasks');
const taskController = require('./controllers/taskController');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) =>
  res.json({ status: 'ok', message: 'Package Delivery API' })
);

app.use('/api/v1/drivers', driversRoutes);
app.use('/api/v1/tasks', tasksRoutes);

app.get('/api/v1/tracking/:trackingCode', taskController.publicTracking);

app.use((req, res) =>
  res.status(404).json({ status: 'error', message: 'not found' })
);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`If this is the first time, run: npm run init-db`);
});

------------------------------------------------------------

## 5. Backend API Endpoints

### Drivers
POST /api/v1/drivers            Create driver  
GET  /api/v1/drivers            Get all drivers  
POST /api/v1/drivers/location   Save driver location  
GET  /api/v1/drivers/location/latest?driver_id=ID  
GET  /api/v1/drivers/location/history?driver_id=ID  

### Tasks
POST   /api/v1/tasks                   Create task  
GET    /api/v1/tasks/:taskId           Get task  
PATCH  /api/v1/tasks/:taskId/status    Update status  
GET    /api/v1/tasks/driver/:driverId  Tasks for driver  

### Public Tracking
GET /api/v1/tracking/:trackingCode    Public tracking endpoint  

------------------------------------------------------------

## 6. Frontend Setup (React + Vite)

1. Open the frontend folder:

    cd frontend

2. Install frontend dependencies:

    npm install

3. Start the frontend:

    npm run dev

The frontend will run on:
http://localhost:5173

------------------------------------------------------------

## 7. Frontend API Setup

In frontend/src/api/api.js:

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1"
});

export default API;

------------------------------------------------------------

## 8. How the System Works

1. Dispatcher creates drivers.  
2. Dispatcher creates delivery tasks and assigns them to drivers.  
3. Driver updates GPS location using the driver page.  
4. Customer enters tracking code to see the current package location.  
5. The map shows the driver’s latest location using Leaflet.  

------------------------------------------------------------

## 9. Requirements

- Node.js version 16 or higher  
- SQLite database (no installation required, it is file-based)  
- React 18+  
- Vite  

------------------------------------------------------------

## 10. Notes

- The backend and frontend must run at the same time.  
- If you see CORS errors, confirm that the backend has the correct CORS setup.  
- The SQLite database is stored inside the backend/data folder.

------------------------------------------------------------

End of README.
