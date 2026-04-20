import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- AUTH & LAYOUTS ---
import Login from "./pages/admin/login";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// --- USER PAGES ---
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Electricity from "./pages/services/Electricity";
import GovernmentSchemes from "./pages/services/GovernmentSchemes";
import Weather from "./pages/services/Weather";
import FarmerHelp from "./pages/services/FarmerHelp";

// --- ADMIN PAGES ---
import Dashboard from "./pages/admin/dashboard";

// Electricity
import ElectricityStatus from "./pages/admin/electricity/UpdateElectricityStatus";
import ElectricityHistory from "./pages/admin/electricity/ElectricityHistory";

//Blog
import ManageBlogs from "./pages/admin/blog/ManageBlogs";
import BlogForm from "./pages/admin/blog/BlogForm";

// Master (Fixed Import Paths)
import Country from "./pages/admin/master/Country";
import State from "./pages/admin/master/State";
import SupplyCenter from "./pages/admin/master/SupplyCenter";
import Village from "./pages/admin/master/Village";

// User Management (Fixed Import Path)
import User from "./pages/admin/user/User";

  
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =======================
            PUBLIC / USER ROUTES
        ======================= */}
        {/* Base route redirect to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<UserLayout><Home /></UserLayout>} />
        <Route path="/about" element={<UserLayout><About /></UserLayout>} />
        <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />
        <Route path="/services" element={<UserLayout><Services /></UserLayout>} />
        <Route path="/blog" element={<UserLayout><Blog /></UserLayout>} />
        <Route path="/BlogDetail/:slug" element={<UserLayout><BlogDetail /></UserLayout>} />
        {/* Services */}
        <Route path="/services/Electricity" element={<UserLayout><Electricity /></UserLayout>} />
        <Route path="/services/GovernmentSchemes" element={<UserLayout><GovernmentSchemes /></UserLayout>} />
        <Route path="/services/Weather" element={<UserLayout><Weather /></UserLayout>} />
        <Route path="/services/FarmerHelp" element={<UserLayout><FarmerHelp /></UserLayout>} />


        {/* =======================
            ADMIN AUTH
        ======================= */}
        <Route path="/admin/login" element={<Login />} />


        {/* =======================
            PROTECTED ADMIN ROUTES
        ======================= */}
        {/* Ye Parent Route automatically AdminLayout aur ProtectedRoute apply karega iske sabhi children par */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Outlet yahan render hoga */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Master Routes (Removed duplicate 'admin/' from paths) */}
          <Route path="master/country" element={<Country />} />
          <Route path="master/state" element={<State />} />
          <Route path="master/supplycenter" element={<SupplyCenter />} />
          <Route path="master/village" element={<Village />} />

          {/* Electricity Routes (Lowercased to match Sidebar links) */}
          <Route path="electricity/UpdateElectricityStatus" element={<ElectricityStatus />} />
          <Route path="electricity/ElectricityHistory" element={<ElectricityHistory />} />
          
          {/* Blog Routes */}
          <Route path="blog/ManageBlogs" element={<ManageBlogs />} />
          <Route path="blog/BlogForm" element={<BlogForm />} />

          {/* User Routes */}
          <Route path="user/User" element={<User />} />
        </Route>


        {/* =======================
            CATCH ALL (404)
        ======================= */}
        <Route path="*" element={<h1 className="text-center mt-5">404 Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;