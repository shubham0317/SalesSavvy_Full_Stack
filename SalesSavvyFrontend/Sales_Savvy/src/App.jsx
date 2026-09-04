import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Register from "./Pages/Register";
import Login from "./Pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Default page */}
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;