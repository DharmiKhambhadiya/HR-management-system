import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FormInput from "../../components/common/FormInput";

const SignUp = () => {
  const navigate = useNavigate();
  const { signUpAdmin, isLoading } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
      e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    if (!/(?=.*[A-Za-z])(?=.*\d).{8,}/.test(form.password))
      e.password =
        "Password must be at least 8 characters and contain letters and numbers (special characters allowed)";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await signUpAdmin({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/admin/dashboard");
    } catch (err) {
      setErrors({ submit: err.message || "Error during signup" });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Admin Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          error={errors.firstName}
          required
        />
        <FormInput
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          error={errors.lastName}
          required
        />
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        {errors.submit && (
          <div className="text-sm text-red-600">{errors.submit}</div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Admin"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/auth/signin")}
            className="text-sm text-gray-600"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
