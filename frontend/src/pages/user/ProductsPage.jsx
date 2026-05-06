import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import PageHeader from "../../components/PageHeader";
import API from "../../api/axiosInstance";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const productRes = await API.get("/products/");
      const dealRes = await API.get("/deals/active/");

      setProducts(productRes.data);
      setDeals(dealRes.data);
    } catch (error) {
      console.error("Product fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const interval = setInterval(() => {
      fetchProducts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((item) => item.category))];
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

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
    <div className="site-shell">
      <Navbar />

      <main className="page-container products-page page-fill">
        <PageHeader
          title="Explore Products"
          subtitle="Products automatically refresh every 5 seconds when admin changes data."
        />

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading-text">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-box products-empty-box">
            <h3>No products found</h3>
            <p>
              Try another product name or change the selected category.
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                deal={findDeal(product.id)}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ProductsPage;