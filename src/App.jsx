import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { getRedirectResult } from "firebase/auth";
import { auth } from "./firebase";
import { googleLogin } from "./api/auth.api";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Homepage/Home";
import SuccessStories from "./pages/SuccessStories/SuccessStories";
import Contact from "./pages/Contact/Contact";
import MatchesAwait from "./pages/MatchesAwait";
import UserProfile from "./pages/UserProfile";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Register from "./pages/Authentication/Register";
import Login from "./pages/Authentication/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProfileSetup from "./pages/Dashboard/ProfileSetup";
import VerificationUpload from "./pages/Dashboard/VerificationUpload";
import Search from "./pages/Dashboard/Search";
import Interests from "./pages/Dashboard/Interests";
import Messages from "./pages/Dashboard/Messages";
import SubmitStory from "./pages/Dashboard/SubmitStory";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPending from "./pages/admin/AdminPending";
import AdminStories from "./pages/admin/AdminStories";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminPayments from "./pages/admin/AdminPayments";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role === "admin") return <Navigate to="/admin" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/dashboard" />;
  return children;
};

function AppContent() {
  const { login } = useAuth();

  useEffect(() => {
    getRedirectResult(auth).then(async (result) => {
      console.log("redirect result:", result);
      if (!result) return;
      const idToken = await result.user.getIdToken();
      const res = await googleLogin(idToken);
      login(res.data.token, res.data.user);
      window.location.href = res.data.user.role === "admin" ? "/admin" : "/dashboard";
    }).catch((err) => { console.error("redirect error:", err); });
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/success-stories" element={<MainLayout><SuccessStories /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        {/* <Route path="/about" element={<MainLayout><AboutUs /></MainLayout>} /> */}
        <Route path="/matches" element={<MainLayout><MatchesAwait /></MainLayout>} />
        <Route path="/profile/:id" element={<MainLayout><UserProfile /></MainLayout>} />
        <Route path="/payment/success" element={<MainLayout><PaymentSuccess /></MainLayout>} />
        <Route path="/payment/cancel" element={<MainLayout><PaymentCancel /></MainLayout>} />
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardLayout><Dashboard /></DashboardLayout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><DashboardLayout><ProfileSetup /></DashboardLayout></PrivateRoute>} />
        <Route path="/verify-identity" element={<PrivateRoute><DashboardLayout><VerificationUpload /></DashboardLayout></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><DashboardLayout><Search /></DashboardLayout></PrivateRoute>} />
        <Route path="/interests" element={<PrivateRoute><DashboardLayout><Interests /></DashboardLayout></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><DashboardLayout><Messages /></DashboardLayout></PrivateRoute>} />
        <Route path="/submit-story" element={<PrivateRoute><DashboardLayout><SubmitStory /></DashboardLayout></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminLayout><AdminOverview /></AdminLayout></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
        <Route path="/admin/pending" element={<AdminRoute><AdminLayout><AdminPending /></AdminLayout></AdminRoute>} />
        <Route path="/admin/stories" element={<AdminRoute><AdminLayout><AdminStories /></AdminLayout></AdminRoute>} />
        <Route path="/admin/messages" element={<AdminRoute><AdminLayout><AdminMessages /></AdminLayout></AdminRoute>} />
        <Route path="/admin/payments" element={<AdminRoute><AdminLayout><AdminPayments /></AdminLayout></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
