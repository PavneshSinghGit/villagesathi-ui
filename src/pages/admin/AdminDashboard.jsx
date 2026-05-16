import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../context/AuthContext";
import { 
  Users, 
  MapPin, 
  Store, 
  Package, 
  Globe, 
  Settings, 
  LogOut, 
  Search, 
  LayoutDashboard,
  Loader2
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, logout } = useAuth();
  const [actionSearch, setActionSearch] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!isAdmin) {
      navigate("/admin/login", { replace: true });
    }
  }, [loading, isAdmin, navigate]);

  const handleLogout = () => {
    if (window.confirm("Confirm secure system logout?")) {
      logout();
      navigate("/admin/login", { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <Loader2 className="animate-spin text-orange mb-2" size={40} style={{color: '#ea580c'}} />
        <span className="small fw-bold text-muted uppercase tracking-wider">Syncing Admin Console...</span>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color }) => (
    <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: '#fff' }}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted small fw-bold uppercase tracking-wider mb-1">{title}</h6>
            <h2 className="fw-bold text-dark mb-0">{value}</h2>
          </div>
          <div className="p-3 rounded-4" style={{ backgroundColor: `${color}15`, color: color }}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Helmet>
        <title>Admin Dashboard | VillageSathi</title>
      </Helmet>

      <style>{`
        .admin-hero {
          background: #0f172a;
          padding: 40px 0 60px 0;
          border-bottom: 5px solid #ea580c;
          margin-bottom: -40px;
        }
        .action-card-premium {
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          padding: 25px;
        }
        .admin-btn-action {
          width: 100%;
          padding: 12px 18px;
          margin-bottom: 12px;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          background: #f8fafc;
          color: #0f172a;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
          text-align: left;
        }
        .admin-btn-action:hover {
          background: #0f172a;
          color: white;
          transform: translateX(5px);
        }
        .search-action-box {
          background: #f1f5f9;
          border-radius: 10px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .search-action-box input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 0.85rem;
          padding-left: 10px;
        }
        .btn-system-logout {
          background: #fef2f2;
          color: #ef4444;
          border: 1px solid #fee2e2;
        }
        .btn-system-logout:hover {
          background: #ef4444 !important;
          color: white !important;
        }
      `}</style>

      {/* Admin Header */}
      <div className="admin-hero shadow-lg">
        <div className="container px-md-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center gap-3">
                <LayoutDashboard size={32} style={{color: '#ea580c'}} />
                <div>
                  <h2 className="text-white fw-bold mb-0">System Control</h2>
                  <p className="text-white-50 small mb-0 fw-bold">Welcome, {user?.name || "System Admin"}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <div className="bg-white bg-opacity-10 px-3 py-2 rounded-pill border border-white border-opacity-10 d-inline-block">
                    <span className="text-white small fw-bold">Session: ACTIVE</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-md-5" style={{ position: 'relative', zIndex: 5 }}>
        {/* Statistics Grid */}
        <div className="row g-3 mb-5">
          <div className="col-6 col-lg-3">
            <StatCard title="Total Villages" value="142" icon={<MapPin size={24}/>} color="#3b82f6" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard title="Active Users" value="1,250" icon={<Users size={24}/>} color="#10b981" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard title="Partner Shops" value="85" icon={<Store size={24}/>} color="#8b5cf6" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard title="Open Orders" value="12" icon={<Package size={24}/>} color="#f59e0b" />
          </div>
        </div>

        {/* Console Actions */}
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="action-card-premium shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0 text-dark">System Command Menu</h5>
                <Settings size={20} className="text-muted" />
              </div>

              {/* Action Search */}
              <div className="search-action-box shadow-sm border">
                <Search size={16} className="text-muted" />
                <input 
                  type="text" 
                  placeholder="Quick find a command..." 
                  value={actionSearch}
                  onChange={(e) => setActionSearch(e.target.value)}
                />
              </div>

              <div className="action-grid">
                <button className="admin-btn-action" onClick={() => navigate("/")}>
                  <Globe size={18} className="text-primary" /> System Public Website
                </button>

                <button className="admin-btn-action" onClick={() => navigate("/admin/master/village")}>
                  <MapPin size={18} className="text-info" /> Village Master Directory
                </button>

                <button className="admin-btn-action" onClick={() => navigate("/admin/user/manage")}>
                  <Users size={18} className="text-success" /> Global User Registry
                </button>

                <button 
                  className="admin-btn-action btn-system-logout mt-4" 
                  onClick={handleLogout}
                >
                  <LogOut size={18} /> Terminate System Session
                </button>
              </div>
              
              <p className="text-center text-muted small mt-4 mb-0 fw-bold opacity-50 uppercase tracking-widest">
                VillageSathi Internal Core • v2.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;