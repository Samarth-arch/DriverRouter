import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#222", color: "#fff" }}>
      <Link to="/" style={{ marginRight: 20, color: "white" }}>
        Dispatcher
      </Link>
      <Link to="/driver" style={{ marginRight: 20, color: "white" }}>
        Driver
      </Link>
      <Link to="/track" style={{ color: "white" }}>
        Public Tracking
      </Link>
    </nav>
  );
}
