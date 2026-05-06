import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";
import StatCard from "../../components/StatCard";
import API from "../../api/axiosInstance";
import { FiPackage, FiTag, FiShoppingCart, FiClipboard } from "react-icons/fi";

function AdminDashboard() {
  const [summary, setSummary] = useState({
    total_products: 0,
    total_active_deals: 0,
    total_cart_items: 0,
    basic_order_count: 0,
  });

  const fetchSummary = async () => {
    try {
      const res = await API.get("/reports/admin-summary/");
      setSummary(res.data);
    } catch (error) {
      console.error("Summary fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminTopbar title="Dashboard" />

        <div className="stats-grid">
          <StatCard
            title="Total Products"
            value={summary.total_products}
            icon={<FiPackage />}
          />

          <StatCard
            title="Active Deals"
            value={summary.total_active_deals}
            icon={<FiTag />}
          />

          <StatCard
            title="Cart Items"
            value={summary.total_cart_items}
            icon={<FiShoppingCart />}
          />

          <StatCard
            title="Orders"
            value={summary.basic_order_count}
            icon={<FiClipboard />}
          />
        </div>

        <div className="admin-panel-card">
          <h3>Welcome Admin</h3>
          <p>
            Manage your products, offers, cart reports and orders from this
            dashboard.
          </p>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;