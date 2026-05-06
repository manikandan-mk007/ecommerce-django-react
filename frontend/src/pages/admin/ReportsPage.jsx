import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";
import StatCard from "../../components/StatCard";
import API from "../../api/axiosInstance";
import { FiPackage, FiTag, FiShoppingCart, FiClipboard } from "react-icons/fi";

function ReportsPage() {
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
      console.error("Report fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminTopbar title="Reports" />

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
            title="Total Cart Items"
            value={summary.total_cart_items}
            icon={<FiShoppingCart />}
          />

          <StatCard
            title="Basic Orders"
            value={summary.basic_order_count}
            icon={<FiClipboard />}
          />
        </div>

        <div className="admin-panel-card">
          <h3>Report Summary</h3>
          <p>
            This section displays real-time summary data from your Django REST
            API.
          </p>
        </div>
      </main>
    </div>
  );
}

export default ReportsPage;