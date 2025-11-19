import { useEffect, useState } from "react";
import { getDrivers, createTask, getTasksForDriver } from "../api/api";
import CreateTaskForm from "../components/CreateTaskForm";
import TaskList from "../components/TaskList";

export default function Dispatcher() {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    const res = await getDrivers();
    setDrivers(res.data.drivers);
  };

  const loadTasks = async (driverId) => {
    if (!driverId) return;
    const res = await getTasksForDriver(driverId);
    setTasks(res.data.tasks);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dispatcher Dashboard</h2>

      <h3>Select Driver</h3>
      <select
        value={selectedDriver}
        onChange={(e) => {
          setSelectedDriver(e.target.value);
          loadTasks(e.target.value);
        }}
      >
        <option value="">--select--</option>
        {drivers.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <CreateTaskForm
        driverId={selectedDriver}
        onTaskCreated={() => loadTasks(selectedDriver)}
      />

      <TaskList tasks={tasks} />
    </div>
  );
}
