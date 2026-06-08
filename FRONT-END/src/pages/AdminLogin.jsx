import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import axios from "axios";

const API_BASE_URL = "https://rento-backend-gmlw.onrender.com/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const res = await axios.post(`${API_BASE_URL}/auth/login`, formData);

      if (res.data.user.role !== "admin") {
        setError("This is not an admin account.");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/admin-dashboard");
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-4">
      <div className="glass w-full max-w-md rounded-[2rem] p-7">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <ShieldCheck />
        </div>

        <h1 className="text-3xl font-black text-slate-950">Admin Login</h1>

        <p className="mt-2 text-slate-500">
          Login to manage RentiGo platform operations.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="mt-6 space-y-4">
          <input
            className="input-style"
            type="email"
            name="email"
            placeholder="Admin email"
            value={formData.email}
            onChange={changeHandler}
            required
          />

          <input
            className="input-style"
            type="password"
            name="password"
            placeholder="Admin password"
            value={formData.password}
            onChange={changeHandler}
            required
          />

          <button
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLogin;
