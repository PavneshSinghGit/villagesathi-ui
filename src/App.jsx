import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
import ContactMessages from "./pages/admin/ContactMessages";
import ManageSchemes from "./pages/admin/ManageSchemes";

// Electricity (Admin)
import ElectricityStatus from "./pages/admin/electricity/UpdateElectricityStatus";
import ElectricityHistory from "./pages/admin/electricity/ElectricityHistory";

// Blog (Admin)
import ManageBlogs from "./pages/admin/blog/ManageBlogs";
import BlogForm from "./pages/admin/blog/BlogForm";

// Master (Admin)
import Country from "./pages/admin/master/Country";
import State from "./pages/admin/master/State";
import District from "./pages/admin/master/District";
import SupplyCenter from "./pages/admin/master/SupplyCenter";
import Village from "./pages/admin/master/Village";

// User Management (Admin)
import User from "./pages/admin/user/User";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =======================
            USER ROUTES (Public)
            ======================= 
            Note: UserLayout ke andar Outlet use karein taaki children render hon
        */}
        <Route element={<UserLayout />}>
          {/* Base route redirect to home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blogdetail/:slug" element={<BlogDetail />} />

          {/* Services Section */}
          <Route path="/services/electricity" element={<Electricity />} />
          <Route path="/services/governmentschemes" element={<GovernmentSchemes />} />
          <Route path="/services/weather" element={<Weather />} />
          <Route path="/services/farmerhelp" element={<FarmerHelp />} />
        </Route>


        {/* =======================
            ADMIN AUTH
            ======================= 
        */}
        <Route path="/admin/login" element={<Login />} />


        {/* =======================
            PROTECTED ADMIN ROUTES
            ======================= 
        */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Index route for admin /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="contactmessages" element={<ContactMessages />} />
          <Route path="manageschemes" element={<ManageSchemes />} />
          {/* Master Management */}
          <Route path="master/country" element={<Country />} />
          <Route path="master/state" element={<State />} />
          <Route path="master/district" element={<District />} />
          <Route path="master/supplycenter" element={<SupplyCenter />} />
          <Route path="master/village" element={<Village />} />

          {/* Electricity Management */}
          <Route path="electricity/updateElectricityStatus" element={<ElectricityStatus />} />
          <Route path="electricity/electricityHistory" element={<ElectricityHistory />} />

          {/* Blog Management */}
          <Route path="blog/manageblogs" element={<ManageBlogs />} />
          <Route path="blog/form" element={<BlogForm />} />

          {/* User Management */}
          <Route path="user/manage" element={<User />} />
        </Route>


        {/* =======================
            CATCH ALL (404)
            ======================= 
        */}
        <Route path="*" element={
          <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center px-3">
            <h1 className="display-1 fw-bold text-warning">404</h1>
            <h2 className="fw-semibold">Page Not Found</h2>
            <p className="lead text-secondary">
              Oops! The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/home" className="btn btn-warning px-4 py-2 mt-3 rounded-pill fw-bold">
              Back to Home
            </Link>
          </div>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;