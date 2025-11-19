import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dispatcher from "./pages/Dispatcher";
import Driver from "./pages/Driver";
import Tracking from "./pages/Tracking";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dispatcher />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/track" element={<Tracking />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
