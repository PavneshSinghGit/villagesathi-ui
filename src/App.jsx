import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- SEO & LEGAL PAGES ---
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Disclaimer from "./pages/Disclaimer";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

// --- TOOLS & UTILITIES ---
import ToolsHome from "./components/Tools/ToolsHome";
import ResumeBuilder from "./components/Tools/ResumeBuilder";
import AgriCalc from "./components/Tools/AgriCalc";
// --- AUTH & LAYOUTS ---
import Login from "./pages/admin/Login";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import MerchantLayout from "./layouts/MerchantLayout";
import UserLayout from "./layouts/UserLayout";
import SathiMarketLayout from "./layouts/SathiMarketLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// --- USER PUBLIC PAGES ---
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";

// --- VILLAGE SERVICES ---
import Electricity from "./pages/services/Electricity";
import GovernmentSchemes from "./pages/services/GovernmentSchemes";
import Weather from "./pages/services/Weather";
import FarmerHelp from "./pages/services/FarmerHelp";

// --- SATHIMARKET CUSTOMER PAGES ---
import CustomerLogin from "./pages/SathiMarket/Customer/CustomerLogin";
import CustomerRegister from "./pages/SathiMarket/Customer/CustomerRegister";
import ManageAddresses from "./pages/SathiMarket/Customer/ManageAddresses";
import CustomerDashBoard from "./pages/SathiMarket/Customer/CustomerDashBoard";
import SathiMarket from "./pages/SathiMarket/Customer/SathiMarket";
import ShopDetails from "./pages/SathiMarket/Customer/ShopDetails";
import Cart from "./pages/SathiMarket/Customer/Cart";
import MyOrders from "./pages/SathiMarket/Customer/MyOrders";
import Wishlist from "./pages/SathiMarket/Customer/WishList";

// --- BUSINESS / SHOPKEEPER PAGES ---
import MerchantLogin from "./pages/SathiMarket/Merchant/MerchantLogin";
import MerchantRegister from "./pages/SathiMarket/Merchant/MerchantRegister";
import MerchantDashBoard from "./pages/SathiMarket/Merchant/MerchantDashBoard";
import ManageInventory from "./pages/SathiMarket/Merchant/ManageInventory";
import ManageProfile from "./pages/SathiMarket/Merchant/ManageProfile";
import ShopOrders from "./pages/SathiMarket/Merchant/ShopOrders";

// --- ADMIN PAGES ---
import AdminDashboard from "./pages/admin/AdminDashboard";
import ContactMessages from "./pages/admin/ContactMessages";
import ManageSchemes from "./pages/admin/ManageSchemes";
import ElectricityStatus from "./pages/admin/electricity/UpdateElectricityStatus";
import ElectricityHistory from "./pages/admin/electricity/ElectricityHistory";
import ManageBlogs from "./pages/admin/blog/ManageBlogs";
import BlogForm from "./pages/admin/blog/BlogForm";
import UserManagement from "./pages/admin/user/User";

// --- ADMIN MASTER DATA ---
import Country from "./pages/admin/master/Country";
import State from "./pages/admin/master/State";
import District from "./pages/admin/master/District";
import SupplyCenter from "./pages/admin/master/SupplyCenter";
import Village from "./pages/admin/master/Village";

function App() {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        {/* ============================================================
          1. PUBLIC ROUTES (UserLayout) - Home, About, Blog, etc.
      ============================================================ */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blogdetail/:slug" element={<BlogDetail />} />

          {/*  --- TOOLS & UTILITIES ---*/}
          <Route path="/tools" element={<ToolsHome />} />
          <Route path="/tools/resume-builder" element={<ResumeBuilder />} />
          <Route path="/tools/agri-calc" element={<AgriCalc />} />
          
          {/* Village Specific Services */}
          <Route path="/services/electricity" element={<Electricity />} />
          <Route path="/services/governmentschemes" element={<GovernmentSchemes />} />
          <Route path="/services/weather" element={<Weather />} />
          <Route path="/services/farmerhelp" element={<FarmerHelp />} />

          {/* SEO & Legal Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        {/* ============================================================
          2. CUSTOMER MARKETPLACE ROUTES (SathiMarketLayout)
      ============================================================ */}
        <Route element={<SathiMarketLayout />}>
          {/* Marketplace Public Access */}
          <Route path="/sathi-market" element={<SathiMarket />} />
          <Route path="/shop-details/:id" element={<ShopDetails />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/customer-register" element={<CustomerRegister />} />

          {/* Private Customer Access (Auth Required) */}
          <Route
            path="/customer-dashboard"
            element={<ProtectedRoute allowedRole={3}><CustomerDashBoard /></ProtectedRoute>}
          />
          <Route
            path="/manage-addresses"
            element={<ProtectedRoute allowedRole={3}><ManageAddresses /></ProtectedRoute>}
          />
          <Route
            path="/cart"
            element={<ProtectedRoute allowedRole={3}><Cart /></ProtectedRoute>}
          />
          <Route
            path="/my-orders"
            element={<ProtectedRoute allowedRole={3}><MyOrders /></ProtectedRoute>}
          />
           <Route
            path="/Wishlist"
            element={<ProtectedRoute allowedRole={3}><Wishlist /></ProtectedRoute>}
          />
        </Route>

        {/* ============================================================
          3. AUTHENTICATION (Standalone Pages)
      ============================================================ */}
        <Route path="/merchant-login" element={<MerchantLogin />} />
        <Route path="/merchant-register" element={<MerchantRegister />} />

        {/* ============================================================
          4. BUSINESS / SHOPKEEPER PANEL (MerchantLayout - Protected)
      ============================================================ */}
        <Route
          path="/merchant"
          element={
            <ProtectedRoute allowedRole={2}>
              <MerchantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MerchantDashBoard />} />
          <Route path="manage-profile" element={<ManageProfile />} />
          <Route path="manage-inventory" element={<ManageInventory />} />
          <Route path="shop-orders" element={<ShopOrders />} />
        </Route>

        {/* ============================================================
          5. ADMIN CONTROL PANEL (AdminLayout - Protected)
      ============================================================ */}
        {/* =======================
            ADMIN AUTH
            ======================= 
        */}
        <Route path="/admin/login" element={<AdminLogin />} />


        {/* =======================
            PROTECTED ADMIN ROUTES
            ======================= 
        */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole={1}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* ✅ ये सही जगह है */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="contactmessages" element={<ContactMessages />} />
          <Route path="manageschemes" element={<ManageSchemes />} />

          {/* Master */}
          <Route path="master/country" element={<Country />} />
          <Route path="master/state" element={<State />} />
          <Route path="master/district" element={<District />} />
          <Route path="master/supplycenter" element={<SupplyCenter />} />
          <Route path="master/village" element={<Village />} />

          {/* Electricity */}
          <Route path="electricity/updateElectricityStatus" element={<ElectricityStatus />} />
          <Route path="electricity/electricityHistory" element={<ElectricityHistory />} />

          {/* Blog */}
          <Route path="blog/manageblogs" element={<ManageBlogs />} />
          <Route path="blog/form" element={<BlogForm />} />

          {/* Users */}
          <Route path="user/manage" element={<UserManagement />} />
        </Route>
        {/* ============================================================
          6. 404 - PAGE NOT FOUND
      ============================================================ */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div >
  );
}

export default App;