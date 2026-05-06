import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageHeader from "../../components/PageHeader";
import API from "../../api/axiosInstance";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

function CartPage() {
  const [cart, setCart] = useState({
    items: [],
    total_items: 0,
    total_amount: 0,
  });

  const [customerName, setCustomerName] = useState("");

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart/");
      setCart(res.data);
    } catch (error) {
      console.error("Cart fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (item, quantity) => {
    if (quantity < 1) return;

    try {
      await API.patch(`/cart/${item.id}/update/`, { quantity });
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.quantity || "Quantity update failed.");
    }
  };

  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/${id}/remove/`);
      fetchCart();
    } catch (error) {
      alert("Remove failed.");
    }
  };

  const createOrder = async () => {
    try {
      const res = await API.post("/orders/create/", {
        customer_name: customerName || "Guest Customer",
      });

      alert(res.data.message);
      setCustomerName("");
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "Order failed.");
    }
  };

  return (
    <div className="site-shell">
      <Navbar />

      <main className="page-container cart-page page-fill">
        <PageHeader
          title="Your Cart"
          subtitle="Update quantity, remove items, and place a basic order."
        />

        {cart.items.length === 0 ? (
          <div className="empty-box">Your cart is empty.</div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {cart.items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-img">
                    {item.product_image_url ? (
                      <img
                        src={item.product_image_url}
                        alt={item.product_name}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>

                  <div className="cart-info">
                    <h3>{item.product_name}</h3>

                    {item.has_deal && (
                      <span className="cart-deal-badge">
                        {item.discount_percentage}% OFF Applied
                      </span>
                    )}

                    <p>
                      Price:{" "}
                      {item.has_deal && (
                        <span className="cart-old-price">
                          ₹{item.original_price}
                        </span>
                      )}{" "}
                      <strong>₹{Number(item.product_price).toFixed(2)}</strong>
                    </p>

                    <p>
                      Subtotal:{" "}
                      <strong>₹{Number(item.subtotal).toFixed(2)}</strong>
                    </p>
                  </div>

                  <div className="qty-box">
                    <button onClick={() => updateQuantity(item, item.quantity - 1)}>
                      <FiMinus />
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => updateQuantity(item, item.quantity + 1)}>
                      <FiPlus />
                    </button>
                  </div>

                  <button
                    className="danger-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Total Items</span>
                <strong>{cart.total_items}</strong>
              </div>

              <div className="summary-row">
                <span>Total Amount</span>
                <strong>₹{Number(cart.total_amount).toFixed(2)}</strong>
              </div>

              <input
                type="text"
                placeholder="Customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <button className="primary-btn full-btn" onClick={createOrder}>
                Place Basic Order
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CartPage;