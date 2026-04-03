import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, googleLogin } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

const isLocalhost = window.location.hostname === "localhost";

const passwordRules = [
  { label: "At least 6 characters", test: (p) => p.length >= 6 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const isPasswordValid = passwordRules.every((r) => r.test(form.password));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isPasswordValid) { setError("Password does not meet the requirements."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await registerUser({ name: form.name, email: form.email, password: form.password });
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await googleLogin(idToken);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled.");
      } else {
        setError(err.response?.data?.message || "Google sign up failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Create Account
      </h2>
      <p className="text-center text-gray-500 mb-6 text-sm">
        Join us and find your perfect match
      </p>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-600 px-3 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Password with rules */}
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={form.password}
            onChange={handleChange}
            onFocus={() => setShowRules(true)}
            required
          />
          {showRules && (
            <ul className="mt-2 text-xs flex flex-col gap-1 pl-1">
              {passwordRules.map((rule) => (
                <li
                  key={rule.label}
                  className={`flex items-center gap-1 ${rule.test(form.password) ? "text-green-500" : "text-gray-400"}`}
                >
                  <span>{rule.test(form.password) ? "✓" : "○"}</span>
                  {rule.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition duration-300 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner" /> : "Register"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-2 my-5">
        <div className="flex-1 h-[1px] bg-gray-300"></div>
        <span className="text-gray-400 text-sm">OR</span>
        <div className="flex-1 h-[1px] bg-gray-300"></div>
      </div>

      {/* Google */}
      <button onClick={handleGoogle} disabled={loading} className="btn bg-white text-black border-[#e5e5e5] w-full">
        <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
        Register with Google
      </button>

      <p className="text-center mt-5 text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-orange-500 font-medium hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

