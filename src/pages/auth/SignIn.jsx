import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FormInput from "../../components/common/FormInput";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signIn({
        username: form.username.trim(),
        password: form.password,
      });
      if (res && res.user) {
        const fallback =
          res.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
        const dest = location.state?.from?.pathname || fallback;
        navigate(dest);
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    const usersRaw = localStorage.getItem("users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    setAdminExists(users.some((u) => u.role === "ADMIN"));
  }, []);

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Username (Email for Admin or Employee ID)"
          name="username"
          value={form.username}
          onChange={handleChange}
          error={error ? " " : ""}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
          {!adminExists && (
            <a href="/auth/signup" className="text-sm text-gray-600">
              Create Admin
            </a>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignIn;
