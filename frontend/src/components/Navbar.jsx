import { Link, NavLink } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

function Navbar() {
  return (
    <header className="navbar">
      <div className="page-container nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">S</span>
          <span>ShopEase</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/cart" className="cart-link">
            <FiShoppingCart />
            Cart
          </NavLink>
          <NavLink to="/admin/login" className="admin-link">
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;