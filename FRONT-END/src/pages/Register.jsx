import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Building2 } from "lucide-react";
import API from "../api/axios";

function Register({ roleType }) {
  const navigate = useNavigate();
  const isOwner = roleType === "owner";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

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
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const res = await API.post("/auth/register", {
        ...formData,
        role: roleType,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/vehicles");
      }

      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center">
      <div className="glass w-full max-w-md rounded-[2rem] p-7">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          {isOwner ? <Building2 /> : <UserPlus />}
        </div>

        <h2 className="text-3xl font-black text-slate-950">
          {isOwner ? "Owner Register" : "Customer Register"}
        </h2>

        <p className="mt-2 text-slate-500">
          {isOwner
            ? "Create owner account to manage vehicles and bookings."
            : "Create customer account to browse and book vehicles."}
        </p>

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="mt-6 space-y-4">
          <input
            className="input-style"
            type="text"
            name="name"
            placeholder={isOwner ? "Owner / Agency Name" : "Full Name"}
            value={formData.name}
            onChange={changeHandler}
          />

          <input
            className="input-style"
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={changeHandler}
          />

          <input
            className="input-style"
            type="password"
            name="password"
            placeholder="Password minimum 6 characters"
            value={formData.password}
            onChange={changeHandler}
          />

          <button className="btn-primary w-full" type="submit">
            {isOwner ? "Create Owner Account" : "Create Customer Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isOwner ? (
            <p>
              Already owner?{" "}
              <Link to="/staff" className="font-bold text-blue-700">
                Go to Staff Portal
              </Link>
            </p>
          ) : (
            <p>
              Already customer?{" "}
              <Link to="/customer-login" className="font-bold text-blue-700">
                Customer Login
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
