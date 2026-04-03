import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginUser, googleLogin } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

const isLocalhost = window.location.hostname === "localhost";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = localStorage.getItem("redirectAfterLogin") || new URLSearchParams(location.search).get("redirect") || null;
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
      }
    } catch (err) {
      console.error("Google login error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled.");
      } else {
        setError(err.response?.data?.message || err.message || "Google login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (

      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back 
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Login to continue your journey
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
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-800"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-5">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button onClick={handleGoogle} disabled={loading} className="btn bg-white text-black border-[#e5e5e5] w-full">
  <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
  Login with Google
</button>
        {/* Register */}
        <p className="text-center mt-5 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-500 font-medium hover:underline">
            Register
          </Link>
        </p>

      </div>
   
  );
}

