import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Mail, Globe, Map, Pin, Home, 
  Warehouse, Zap, History, FileText, PlusCircle, 
  Users, Briefcase, ChevronRight, ShieldCheck
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const styles = {
    container: {
      width: "270px",
      background: "#090f1e", // Ultra Deep Slate
      color: "#f8fafc",
      height: "100vh",
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid #1e293b",
      position: "sticky",
      top: 0,
      zIndex: 1000
    },
    brand: {
      padding: "0 12px 24px",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      marginBottom: "20px",
    },
    navArea: {
      flexGrow: 1,
      overflowY: "auto",
      paddingRight: "4px",
      scrollbarWidth: "none", // Hide scrollbar for Firefox
    },
    sectionTitle: {
      color: "#475569", // Muted Slate
      fontSize: "0.65rem",
      textTransform: "uppercase",
      fontWeight: "800",
      marginTop: "24px",
      marginBottom: "10px",
      paddingLeft: "12px",
      letterSpacing: "1.2px",
    }
  };

  const getNavLinkStyle = (path) => {
    const isActive = location.pathname === path;
    const isHovered = hoveredItem === path;

    return {
      color: isActive ? "#fff" : isHovered ? "#fff" : "#94a3b8",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      padding: "11px 14px",
      borderRadius: "10px",
      marginBottom: "4px",
      fontSize: "0.85rem",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      background: isActive ? "#ea580c" : isHovered ? "rgba(255,255,255,0.05)" : "transparent",
      fontWeight: isActive ? "700" : "500",
      boxShadow: isActive ? "0 4px 12px rgba(234, 88, 12, 0.25)" : "none",
      borderLeft: isActive ? "3px solid #fff" : "3px solid transparent"
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
        <Icon size={18} style={{ marginRight: "12px", opacity: location.pathname === to ? 1 : 0.7 }} />
        <span style={{ flexGrow: 1 }}>{label}</span>
        {location.pathname === to && <ChevronRight size={14} className="animate-pulse" />}
      </Link>
    </li>
  );

  return (
    <div style={styles.container}>
      {/* Brand Header */}
      <div style={styles.brand}>
        <div className="d-flex align-items-center gap-2 mb-1">
          <ShieldCheck size={24} style={{ color: '#ea580c' }} />
          <h2 style={{ fontSize: "1.25rem", margin: 0, color: "#fff", fontWeight: "900", letterSpacing: "-0.5px" }}>
            Village<span style={{ color: "#ea580c" }}>Sathi</span>
          </h2>
        </div>
        <p style={{ fontSize: "0.6rem", color: "#475569", margin: "0", fontWeight: "800", letterSpacing: "1px" }}>CORE SYSTEM ADMIN</p>
      </div>

      {/* Navigation */}
      <nav style={styles.navArea}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={{ ...styles.sectionTitle, marginTop: 0 }}>Main Console</li>
          <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="System Overview" />
          <NavItem to="/admin/contactmessages" icon={Mail} label="Inquiry Inbox" />
          
          <li style={styles.sectionTitle}>Social & Welfare</li>
          <NavItem to="/admin/manageschemes" icon={Briefcase} label="Govt. Schemes" />

          <li style={styles.sectionTitle}>Regional Master</li>
          <NavItem to="/admin/master/country" icon={Globe} label="Countries" />
          <NavItem to="/admin/master/state" icon={Map} label="States Registry" />
          <NavItem to="/admin/master/district" icon={Pin} label="Districts" />
          <NavItem to="/admin/master/village" icon={Home} label="Village Units" />
          <NavItem to="/admin/master/supplycenter" icon={Warehouse} label="Supply Hubs" />

          <li style={styles.sectionTitle}>Utilities Control</li>
          <NavItem to="/admin/electricity/updateElectricityStatus" icon={Zap} label="Grid Update" />
          <NavItem to="/admin/electricity/electricityHistory" icon={History} label="Supply Logs" />
          
          <li style={styles.sectionTitle}>Content Management</li>
          <NavItem to="/admin/blog/manageblogs" icon={FileText} label="Article Index" />

          <li style={styles.sectionTitle}>Security & Access</li>
          <NavItem to="/admin/user/manage" icon={Users} label="User Registry" />
        </ul>
      </nav>
      
      {/* Footer Versioning */}
      <div style={{ marginTop: "auto", padding: "15px 12px 0", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
          <div className="d-flex align-items-center justify-content-between">
            <span style={{ fontSize: "0.6rem", color: "#334155", fontWeight: "700" }}>v2.0.1 PREMIUM</span>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }}></div>
          </div>
      </div>
    </div>
  );
}

export default Sidebar;