import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiPackage,
  FiTag,
  FiBarChart2,
  FiLogOut,
  FiHome,
} from "react-icons/fi";
import { removeAdminToken } from "../utils/auth";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAdminToken();
    navigate("/admin/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <span>S</span>
        <strong>ShopEase Admin</strong>
      </div>

      <nav className="admin-menu">
        <NavLink to="/admin/dashboard">
          <FiGrid />
          Dashboard
        </NavLink>

        <NavLink to="/admin/products">
          <FiPackage />
          Products
        </NavLink>

        <NavLink to="/admin/deals">
          <FiTag />
          Deals
        </NavLink>

        <NavLink to="/admin/reports">
          <FiBarChart2 />
          Reports
        </NavLink>

        <NavLink to="/">
          <FiHome />
          User Site
        </NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <FiLogOut />
        Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;