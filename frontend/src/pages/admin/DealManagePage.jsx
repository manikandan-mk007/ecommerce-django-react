import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";
import API from "../../api/axiosInstance";
import { FiEdit, FiTrash2 } from "react-icons/fi";

function DealManagePage() {
  const emptyForm = {
    product: "",
    title: "",
    description: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
    is_active: true,
  };

  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    const res = await API.get("/products/");
    setProducts(res.data);
  };

  const fetchDeals = async () => {
    const res = await API.get("/deals/");
    setDeals(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchDeals();
  }, []);

  const handleChange = (e) => {
    const value =
      e.target.name === "is_active" ? e.target.checked : e.target.value;

    setForm({ ...form, [e.target.name]: value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.patch(`/deals/${editingId}/`, form);
        alert("Deal updated successfully.");
      } else {
        await API.post("/deals/", form);
        alert("Deal added successfully.");
      }

      resetForm();
      fetchDeals();
    } catch (error) {
      console.error(error.response?.data);
      alert("Deal save failed. Check all fields.");
    }
  };

  const handleEdit = (deal) => {
    setEditingId(deal.id);
    setForm({
      product: deal.product,
      title: deal.title,
      description: deal.description,
      discount_percentage: deal.discount_percentage,
      start_date: deal.start_date,
      end_date: deal.end_date,
      is_active: deal.is_active,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this deal?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/deals/${id}/`);
      fetchDeals();
      alert("Deal deleted successfully.");
    } catch (error) {
      alert("Deal delete failed.");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminTopbar title="Deal Management" />

        <div className="admin-grid">
          <div className="admin-form-card">
            <h3>{editingId ? "Edit Deal" : "Add Deal"}</h3>

            <form onSubmit={handleSubmit}>
              <label>Select Product</label>
              <select
                name="product"
                value={form.product}
                onChange={handleChange}
                required
              >
                <option value="">Choose product</option>
                {products.map((product) => (
                  <option value={product.id} key={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>

              <label>Deal Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
              />

              <label>Discount Percentage</label>
              <input
                type="number"
                name="discount_percentage"
                value={form.discount_percentage}
                onChange={handleChange}
                required
              />

              <label>Start Date</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
              />

              <label>End Date</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                required
              />

              <label className="check-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                Active Deal
              </label>

              <button className="primary-btn full-btn">
                {editingId ? "Update Deal" : "Add Deal"}
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
            <h3>Deal List</h3>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Product</th>
                    <th>Discount</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {deals.map((deal) => (
                    <tr key={deal.id}>
                      <td>{deal.title}</td>
                      <td>{deal.product_name}</td>
                      <td>{deal.discount_percentage}%</td>
                      <td>₹{deal.discounted_price}</td>
                      <td>
                        <span
                          className={
                            deal.is_active ? "success-badge" : "danger-badge"
                          }
                        >
                          {deal.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="action-row">
                          <button onClick={() => handleEdit(deal)}>
                            <FiEdit />
                          </button>
                          <button onClick={() => handleDelete(deal.id)}>
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {deals.length === 0 && (
                    <tr>
                      <td colSpan="6">No deals found.</td>
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

export default DealManagePage;