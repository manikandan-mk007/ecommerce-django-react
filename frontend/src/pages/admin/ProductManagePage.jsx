import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";
import API from "../../api/axiosInstance";
import { FiEdit, FiTrash2 } from "react-icons/fi";

function ProductManagePage() {
  const emptyForm = {
    name: "",
    price: "",
    description: "",
    category: "Electronics",
    stock_quantity: "",
    image: null,
  };

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const categories = [
    "Electronics",
    "Fashion",
    "Grocery",
    "Home",
    "Beauty",
    "Sports",
    "Other",
  ];

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/");
      setProducts(res.data);
    } catch (error) {
      console.error("Products fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("stock_quantity", form.stock_quantity);

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      if (editingId) {
        await API.patch(`/products/${editingId}/`, formData);
        alert("Product updated successfully.");
      } else {
        await API.post("/products/", formData);
        alert("Product added successfully.");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(error.response?.data);
      alert("Product save failed. Check all fields.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      stock_quantity: product.stock_quantity,
      image: null,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}/`);
      fetchProducts();
      alert("Product deleted successfully.");
    } catch (error) {
      alert("Product delete failed.");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminTopbar title="Product Management" />

        <div className="admin-grid">
          <div className="admin-form-card">
            <h3>{editingId ? "Edit Product" : "Add Product"}</h3>

            <form onSubmit={handleSubmit}>
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label>Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />

              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label>Stock Quantity</label>
              <input
                type="number"
                name="stock_quantity"
                value={form.stock_quantity}
                onChange={handleChange}
                required
              />

              <label>Product Image</label>
              <input type="file" name="image" onChange={handleChange} />

              <button className="primary-btn full-btn">
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-btn full-btn"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          <div className="admin-table-card">
            <h3>Product List</h3>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        {product.image_url ? (
                          <img
                            className="table-img"
                            src={product.image_url}
                            alt={product.name}
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>₹{product.price}</td>
                      <td>{product.stock_quantity}</td>
                      <td>
                        <span
                          className={
                            product.is_available
                              ? "success-badge"
                              : "danger-badge"
                          }
                        >
                          {product.stock_status}
                        </span>
                      </td>
                      <td>
                        <div className="action-row">
                          <button onClick={() => handleEdit(product)}>
                            <FiEdit />
                          </button>
                          <button onClick={() => handleDelete(product.id)}>
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {products.length === 0 && (
                    <tr>
                      <td colSpan="7">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductManagePage;