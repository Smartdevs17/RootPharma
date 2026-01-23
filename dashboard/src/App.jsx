import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import {
  ManufacturerDashboard,
  DoctorDashboard,
  PharmacyDashboard,
  PatientDashboard,
  AuditorDashboard,
  Traceability
} from "./pages/RoleDashboards";
import { useWeb3 } from "./context/Web3Context";
import { ROLES } from "./constants";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, account, loading } = useWeb3();

  if (loading) return null; // Handled by Layout's loading state generally

  if (!account) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role.id))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/trace" element={<Traceability />} />

          <Route
            path="/manufacturer"
            element={
              <ProtectedRoute allowedRoles={[ROLES.MANUFACTURER.id]}>
                <ManufacturerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR.id]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pharmacy"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PHARMACY.id]}>
                <PharmacyDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PATIENT.id]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/audit"
            element={
              <ProtectedRoute allowedRoles={[ROLES.AUDITOR.id]}>
                <AuditorDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
