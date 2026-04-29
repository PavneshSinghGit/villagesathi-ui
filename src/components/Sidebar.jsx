import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Mail, Globe, Map, Pin, Home, 
  Warehouse, Zap, History, FileText, PlusCircle, 
  Users, Briefcase, ChevronRight 
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const styles = {
    container: {
      width: "260px",
      background: "#111827", 
      color: "#f3f4f6",
      height: "100vh",
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid #1f2937",
      position: "sticky",
      top: 0
    },
    brand: {
      padding: "0 12px 24px",
      borderBottom: "1px solid #1f2937",
      marginBottom: "20px",
    },
    navArea: {
      flexGrow: 1,
      overflowY: "auto",
      paddingRight: "4px",
      scrollbarWidth: "none", 
    },
    sectionTitle: {
      color: "#4b5563",
      fontSize: "0.7rem",
      textTransform: "uppercase",
      fontWeight: "800",
      marginTop: "24px",
      marginBottom: "8px",
      paddingLeft: "12px",
      letterSpacing: "1.5px",
    }
  };

  const getNavLinkStyle = (path) => {
    const isActive = location.pathname === path;
    const isHovered = hoveredItem === path;

    return {
      color: isActive ? "#fff" : isHovered ? "#fff" : "#9ca3af",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      padding: "10px 12px",
      borderRadius: "8px",
      marginBottom: "4px",
      fontSize: "0.9rem",
      transition: "all 0.2s ease-in-out",
      background: isActive ? "#2563eb" : isHovered ? "#1f2937" : "transparent",
      fontWeight: isActive ? "600" : "400",
      position: "relative",
    };
  };

  const NavItem = ({ to, icon: Icon, label }) => (
    <li>
      <Link
        to={to}
        style={getNavLinkStyle(to)}
        onMouseEnter={() => setHoveredItem(to)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <Icon size={18} style={{ marginRight: "12px" }} />
        <span style={{ flexGrow: 1 }}>{label}</span>
        {location.pathname === to && <ChevronRight size={14} />}
      </Link>
    </li>
  );

  return (
    <div style={styles.container}>
      {/* Brand Header */}
      <div style={styles.brand}>
        <h2 style={{ fontSize: "1.4rem", margin: 0, color: "#3b82f6", fontWeight: "800", letterSpacing: "-0.5px" }}>
          Village<span style={{ color: "#fff" }}>Sathi</span>
        </h2>
        <p style={{ fontSize: "0.65rem", color: "#6b7280", margin: "4px 0 0", fontWeight: "600" }}>ADMIN ENGINE</p>
      </div>

      {/* Navigation */}
      <nav style={styles.navArea}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/admin/ContactMessages" icon={Mail} label="Contact Messages" />
          
          {/* --- NEW SERVICES SECTION --- */}
          <li style={styles.sectionTitle}>Government Schemes</li>
          <NavItem to="/admin/ManageSchemes" icon={Briefcase} label="Manage Schemes" />

          <li style={styles.sectionTitle}>Geography</li>
          <NavItem to="/admin/master/Country" icon={Globe} label="Country" />
          <NavItem to="/admin/master/State" icon={Map} label="State" />
          <NavItem to="/admin/master/District" icon={Pin} label="District" />
          <NavItem to="/admin/master/Village" icon={Home} label="Village" />
          <NavItem to="/admin/master/SupplyCenter" icon={Warehouse} label="Supply Center" />

          <li style={styles.sectionTitle}>Electricity</li>
          <NavItem to="/admin/electricity/UpdateElectricityStatus" icon={Zap} label="Live Status" />
          <NavItem to="/admin/electricity/ElectricityHistory" icon={History} label="History Logs" />
          
          <li style={styles.sectionTitle}>Content</li>
          <NavItem to="/admin/blog/ManageBlogs" icon={FileText} label="Manage Blogs" />
          <NavItem to="/admin/blog/BlogForm" icon={PlusCircle} label="Create New Post" />

          <li style={styles.sectionTitle}>Access</li>
          <NavItem to="/admin/user/User" icon={Users} label="User Directory" />
        </ul>
      </nav>
      
      <div style={{ marginTop: "auto", padding: "10px", textAlign: "center" }}>
          <p style={{ fontSize: "0.6rem", color: "#374151" }}>v1.0.4 Premium</p>
      </div>
    </div>
  );
}

export default Sidebar;