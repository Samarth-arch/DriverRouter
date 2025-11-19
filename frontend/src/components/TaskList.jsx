export default function TaskList({ tasks }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Driver Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        <ul>
          {tasks.map((t) => (
            <li key={t.id}>
              {t.delivery_address} — <b>{t.status}</b>  
              <br />
              Tracking: {t.tracking_code}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
