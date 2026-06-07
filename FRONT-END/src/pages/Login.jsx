import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Building2 } from "lucide-react";
import API from "../api/axios";

function Login({ expectedRole }) {
  const navigate = useNavigate();

  const isOwner = expectedRole === "owner";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const res = await API.post("/auth/login", formData);

      const loggedInUser = res.data.user;

      if (loggedInUser.role !== expectedRole) {
        if (loggedInUser.role === "owner") {
          setError("This is an owner account. Please use Owner Login.");
        } else if (loggedInUser.role === "customer") {
          setError("This is a customer account. Please use Customer Login.");
        } else {
          setError("Invalid account role.");
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
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center">
      <div className="glass w-full max-w-md rounded-[2rem] p-7">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          {isOwner ? <Building2 /> : <LogIn />}
        </div>

        <h2 className="text-3xl font-black text-slate-950">
          {isOwner ? "Owner Login" : "Customer Login"}
        </h2>

        <p className="mt-2 text-slate-500">
          {isOwner
            ? "Login as rental owner to manage vehicles and booking requests."
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
          />

          <input
            className="input-style"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={changeHandler}
          />

          <button className="btn-primary w-full" type="submit">
            {isOwner ? "Login as Owner" : "Login as Customer"}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-slate-500">
          {isOwner ? (
            <>
              <p>
                New owner?{" "}
                <Link to="/owner-register" className="font-bold text-blue-700">
                  Owner Register
                </Link>
              </p>

              <p>
                Are you customer?{" "}
                <Link to="/customer-login" className="font-bold text-blue-700">
                  Customer Login
                </Link>
              </p>
            </>
          ) : (
            <>
              <p>
                New customer?{" "}
                <Link
                  to="/customer-register"
                  className="font-bold text-blue-700"
                >
                  Customer Register
                </Link>
              </p>

              <p>
                Are you rental owner?{" "}
                <Link to="/owner-login" className="font-bold text-blue-700">
                  Owner Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
