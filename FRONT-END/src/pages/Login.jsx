import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Building2 } from "lucide-react";
import axios from "axios";

const API_BASE_URL = "https://rento-backend-gmlw.onrender.com/api";

function Login({ expectedRole }) {
  const navigate = useNavigate();
  const isOwner = expectedRole === "owner";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      if (user.role === "customer") {
        navigate("/vehicles");
      } else if (user.role === "owner") {
        navigate("/owner-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      }
    }
  }, [navigate]);

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
      const loggedInUser = res.data.user;

      if (loggedInUser.role !== expectedRole) {
        if (loggedInUser.role === "owner") {
          setError("This is an owner account. Please login from Staff Portal.");
        } else if (loggedInUser.role === "admin") {
          setError("This is an admin account. Please login from Staff Portal.");
        } else {
          setError("This is a customer account. Please use Customer Login.");
        }

        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      if (loggedInUser.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/vehicles");
      }

      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-4">
      <div className="glass w-full max-w-md rounded-[2rem] p-7">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          {isOwner ? <Building2 /> : <LogIn />}
        </div>

        <h2 className="text-3xl font-black text-slate-950">
          {isOwner ? "Owner Login" : "Customer Login"}
        </h2>

        <p className="mt-2 text-slate-500">
          {isOwner
            ? "Login as rental owner to manage vehicles and bookings."
            : "Login as customer to browse and book vehicles."}
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
            placeholder="Email Address"
            value={formData.email}
            onChange={changeHandler}
            required
          />

          <input
            className="input-style"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={changeHandler}
            required
          />

          <button
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : isOwner
                ? "Login as Owner"
                : "Login as Customer"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isOwner ? (
            <p>
              Need owner account?{" "}
              <Link to="/staff" className="font-bold text-blue-700">
                Go to Staff Portal
              </Link>
            </p>
          ) : (
            <p>
              New customer?{" "}
              <Link to="/customer-register" className="font-bold text-blue-700">
                Create Customer Account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
