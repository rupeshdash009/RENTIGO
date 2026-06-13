import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vehicles from "./pages/Vehicles";
import VehicleDetails from "./pages/VehicleDetails";
import MyBookings from "./pages/MyBookings";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import OwnerPortal from "./pages/OwnerPortal";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/:id" element={<VehicleDetails />} />

        {/* Customer auth */}
        <Route
          path="/customer-login"
          element={<Login expectedRole="customer" />}
        />
        <Route
          path="/customer-register"
          element={<Register roleType="customer" />}
        />

        {/* Owner / staff portal */}
        <Route path="/staff" element={<OwnerPortal />} />
        <Route path="/owner" element={<OwnerPortal />} />

        <Route path="/owner-login" element={<Login expectedRole="owner" />} />
        <Route path="/owner-register" element={<Register roleType="owner" />} />

        {/* Admin auth */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Customer protected dashboard */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* Owner protected dashboard */}
        <Route
          path="/owner-dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner", "admin"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin protected dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Old route redirects */}
        <Route
          path="/login"
          element={<Navigate to="/customer-login" replace />}
        />
        <Route
          path="/register"
          element={<Navigate to="/customer-register" replace />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
