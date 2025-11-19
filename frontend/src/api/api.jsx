import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:4000/api/v1"
});

// Drivers
export const getDrivers = () => API.get("/drivers");
export const addDriver = (data) => API.post("/drivers", data);
export const saveLocation = (data) => API.post("/drivers/location", data);
export const getDriverLatestLocation = (driverId) =>
    API.get(`/drivers/location/latest?driver_id=${driverId}`);

// Tasks
export const createTask = (data) => API.post("/tasks", data);
export const getTasksForDriver = (driverId) =>
    API.get(`/tasks/driver/${driverId}`);
export const updateTaskStatus = (taskId, status) =>
    API.patch(`/tasks/${taskId}/status`, { status });

// Public tracking
export const publicTracking = (trackingCode) =>
    API.get(`/tracking/${trackingCode}`);
