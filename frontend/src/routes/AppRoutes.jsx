import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/user/LandingPage";
import ProductsPage from "../pages/user/ProductsPage";
import CartPage from "../pages/user/CartPage";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProductManagePage from "../pages/admin/ProductManagePage";
import DealManagePage from "../pages/admin/DealManagePage";
import ReportsPage from "../pages/admin/ReportsPage";

import ProtectedAdminRoute from "./ProtectedAdminRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/cart" element={<CartPage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedAdminRoute>
            <ProductManagePage />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/deals"
        element={
          <ProtectedAdminRoute>
            <DealManagePage />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedAdminRoute>
            <ReportsPage />
          </ProtectedAdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;