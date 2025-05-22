import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SparePartPage from "./pages/SparePartPage";
import StockInPage from "./pages/StockInPage";
import StockOutPage from "./pages/StockOutPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/spareparts" element={<SparePartPage />} />
        <Route path="/stockin" element={<StockInPage />} />
        <Route path="/stockout" element={<StockOutPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;