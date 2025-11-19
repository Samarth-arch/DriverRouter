import { useEffect, useState } from "react";
import { getDrivers, saveLocation } from "../api/api";

export default function Driver() {
  const [drivers, setDrivers] = useState([]);
  const [driverId, setDriverId] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    const res = await getDrivers();
    setDrivers(res.data.drivers);
  };

  const sendLocation = async () => {
    if (!driverId || !location.lat || !location.lng) return;

    await saveLocation({
      driver_id: driverId,
      latitude: Number(location.lat),
      longitude: Number(location.lng),
    });

    alert("Location updated!");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Driver Simulator</h2>

      <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
        <option value="">--select driver--</option>
        {drivers.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <div>
        <input
          type="number"
          placeholder="Latitude"
          onChange={(e) => setLocation({ ...location, lat: e.target.value })}
        />
        <br />
        <input
          type="number"
          placeholder="Longitude"
          onChange={(e) => setLocation({ ...location, lng: e.target.value })}
        />
      </div>

      <button onClick={sendLocation}>Send Location</button>
    </div>
  );
}
