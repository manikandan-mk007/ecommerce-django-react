import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import API from "../../api/axiosInstance";

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);

  const fetchHomeData = async () => {
    try {
      const productRes = await API.get("/products/");
      const dealRes = await API.get("/deals/active/");

      setProducts(productRes.data.slice(0, 4));
      setDeals(dealRes.data);
    } catch (error) {
      console.error("Home data fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const findDeal = (productId) => {
    return deals.find((deal) => deal.product === productId);
  };

  const addToCart = async (productId) => {
    try {
      await API.post("/cart/add/", {
        product_id: productId,
        quantity: 1,
      });
      alert("Product added to cart!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product.");
    }
  };

  return (
    <>
      <Navbar />

      <section className="hero-section">
        <div className="page-container hero-grid">
          <div className="hero-content">
            <span className="hero-tag">Premium Daily Shopping</span>
            <h1>Shop smart with warm deals and fresh products.</h1>
            <p>
              A simple full-stack e-commerce platform built with React, Django,
              DRF, SQLite and Axios.
            </p>

            <div className="hero-actions">
              <Link to="/products" className="primary-btn">
                Shop Products
              </Link>
              <Link to="/cart" className="secondary-btn">
                View Cart
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-discount">30% OFF</div>
            <h2>Festival Sale</h2>
            <p>Fresh deals managed by admin panel.</p>
            <div className="hero-price">Starting ₹499</div>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="page-container">
          <PageTitle
            title="Featured Products"
            subtitle="Latest products from our store"
          />

          {products.length === 0 ? (
            <div className="empty-box">No products available.</div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  deal={findDeal(product.id)}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

function PageTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

export default LandingPage;