import { useState } from "react";
import { publicTracking } from "../api/api";
import MapView from "../components/MapView";

export default function Tracking() {
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);

  const search = async () => {
    if (!code) return;
    const res = await publicTracking(code);
    setData(res.data);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Customer Tracking</h2>

      <input
        placeholder="Enter tracking code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={search}>Track</button>

      {data && (
        <>
          <h3>Status: {data.task.status}</h3>
          <h4>Address: {data.task.delivery_address}</h4>

          {data.latest_location ? (
            <MapView
              latitude={data.latest_location.latitude}
              longitude={data.latest_location.longitude}
            />
          ) : (
            <p>No location available</p>
          )}
        </>
      )}
    </div>
  );
}
