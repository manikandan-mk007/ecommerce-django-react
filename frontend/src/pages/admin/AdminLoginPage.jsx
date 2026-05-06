import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { saveAdminToken } from "../../utils/auth";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password.trim()) {
      setError("Username and password are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/accounts/admin-login/", form);

      saveAdminToken(res.data.token);
      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">S</div>
        <h1>Admin Login</h1>
        <p>Login to manage products, deals and reports.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter admin username"
            value={form.username}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter admin password"
            value={form.password}
            onChange={handleChange}
          />

          <button className="primary-btn full-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default AdminLoginPage;