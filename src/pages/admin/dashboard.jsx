import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
function Dashboard() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    let user = null;
    try {
      user = userString ? JSON.parse(userString) : null;
    } catch (e) {
      user = null;
    }

    // Role check (Admin = 1)
    if (!token || !user || Number(user.roleId) !== 1) {
      localStorage.clear();
      navigate("/admin/login", { replace: true });
    } else {
      setAdminName(user.name || "Admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div style={{
      background: "#fff",
      padding: "24px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      display: "flex",
      alignItems: "center",
      flex: "1",
      minWidth: "200px",
      borderLeft: `5px solid ${color}`
    }}>
      <div style={{ fontSize: "2rem", marginRight: "20px" }}>{icon}</div>
      <div>
        <h6 style={{ margin: 0, color: "#64748b", fontSize: "0.9rem", textTransform: "uppercase" }}>{title}</h6>
        <h2 style={{ margin: 0, color: "#1e293b", fontWeight: "bold" }}>{value}</h2>
      </div>
    </div>
  );

  if (!localStorage.getItem("token")) return null;

  return (
    <div style={{ animation: "fadeIn 0.5s ease-in", padding: "20px" }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, color: "#1e293b" }}>Good Morning, {adminName}! 👋</h2>
          <p style={{ color: "#64748b", marginTop: "5px" }}>Yahan aapke VillageSathi platform ka real-time overview hai.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
        <StatCard title="Total Villages" value="142" icon="🏡" color="#3b82f6" />
        <StatCard title="Active Users" value="1,250" icon="👥" color="#10b981" />
        <StatCard title="Power Alerts" value="12" icon="⚡" color="#f59e0b" />
        <StatCard title="Pending Tasks" value="05" icon="⏳" color="#ef4444" />
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Recent Activity */}
        <div style={{
          flex: 2,
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          minWidth: "300px"
        }}>
          <h4 style={{ marginBottom: "20px", color: "#1e293b" }}>Recent Activity</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              "Bijli status updated for Village Pipra",
              "New user registered from State UP",
              "New Govt Scheme added: PM Kisan 2026",
              "System backup completed successfully"
            ].map((item, i) => (
              <li key={i} style={{
                padding: "12px 0",
                borderBottom: i === 3 ? "none" : "1px solid #f1f5f9",
                color: "#475569",
                fontSize: "0.95rem"
              }}>
                • {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div style={{
          flex: 1,
          background: "#1e293b",
          color: "#fff",
          padding: "24px",
          borderRadius: "12px",
          minWidth: "250px"
        }}>
          <h4 style={{ marginBottom: "20px" }}>Quick Actions</h4>

          {/* REDIRECTION BUTTON TO HOME */}
          <button
            onClick={() => navigate("/")} // Assuming "/" is your Home route
            style={{ ...actionBtnStyle, background: "#f59e0b", borderColor: "#f59e0b", fontWeight: "bold" }}
          >
            🌐 Go to Website Home
          </button>

          <button style={actionBtnStyle}>➕ Add New Village</button>
          <button style={actionBtnStyle}>📢 Post News Update</button>
          <button style={actionBtnStyle}>📊 Download Reports</button>
        </div>
      </div>
    </div>
  );
}

const actionBtnStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#334155",
  color: "#fff",
  textAlign: "left",
  cursor: "pointer",
  transition: "0.3s",
  display: "block"
};

export default Dashboard;