import { useState } from "react";
import { createTask } from "../api/api";

export default function CreateTaskForm({ driverId, onTaskCreated }) {
  const [address, setAddress] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await createTask({
      driver_id: driverId || null,
      delivery_address: address,
    });
    setAddress("");
    onTaskCreated();
  };

  return (
    <form onSubmit={submit} style={{ marginTop: 20 }}>
      <h3>Create Task</h3>
      <input
        placeholder="Delivery address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button>Create</button>
    </form>
  );
}
