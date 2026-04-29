import React from "react";
import { Outlet } from "react-router-dom"; // Outlet import karna zaroori hai
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 selection:bg-warning selection:text-dark">
      {/* NAVBAR SECTION */}
      <header className="sticky top-0 z-50 shadow-sm bg-white">
        <Navbar />
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow flex flex-col transition-all duration-300 ease-in-out">
        <div className="container-fluid mx-auto px-4 py-6 md:py-10 max-w-7xl w-100">
          {/* Ab yahan {children} ki jagah <Outlet /> aayega.
            Ye automatic handle karega ki Home, About ya Electricity mein se 
            kaunsa page render karna hai.
          */}
          <section className="fade-in-content">
            <Outlet /> 
          </section>
        </div>
      </main>

      {/* FOOTER SECTION */}
      <Footer />

      {/* Smooth Transitions & Animations */}
      <style>{`
        .fade-in-content {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Mobile scroll behavior improvement */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default UserLayout;