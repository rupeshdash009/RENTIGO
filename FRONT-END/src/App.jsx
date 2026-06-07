import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Vehicles from "./pages/Vehicles";
import VehicleDetails from "./pages/VehicleDetails";
import MyBookings from "./pages/MyBookings";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerPortal from "./pages/OwnerPortal";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="px-4 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />

          {/* Customer Auth */}
          <Route
            path="/customer-register"
            element={<Register roleType="customer" />}
          />

          <Route
            path="/customer-login"
            element={<Login expectedRole="customer" />}
          />

          {/* Hidden Owner Portal */}
          <Route path="/owner" element={<OwnerPortal />} />

          <Route
            path="/owner-register"
            element={<Register roleType="owner" />}
          />

          <Route
            path="/owner-login"
            element={<Login expectedRole="owner" />}
          />

          {/* Old routes redirect to customer auth */}
          <Route
            path="/register"
            element={<Navigate to="/customer-register" replace />}
          />

          <Route
            path="/login"
            element={<Navigate to="/customer-login" replace />}
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner-dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;