import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function UserLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar ko 'sticky' ya 'fixed' banane ka option navbar.css mein hai, 
         isliye yahan extra wrapper ki zarurat nahi hai. 
      */}
      <Navbar />

      {/* Main Content Area */}
      {/* 1. 'mt-navbar' (optional): Agar navbar fixed hai toh margin-top chahiye hoga.
         2. 'max-w-7xl': Ek standard maximum width set karna desktop ke liye accha rehta hai.
      */}
      <main className="flex-grow">
         <div className="container mx-auto px-4 py-8 max-w-7xl">
            {children}
         </div>
      </main>
      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}

export default UserLayout;