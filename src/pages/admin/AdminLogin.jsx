import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck, Phone, Lock, ArrowLeft, Loader2 } from "lucide-react";

function AdminLogin() {
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    const storedUser = user || JSON.parse(localStorage.getItem("user"));
    if (storedUser && Number(storedUser.roleId || storedUser.RoleId) === 1) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!mobileNo || !password) {
      setErrorMsg("Please enter mobile number and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await loginUser({ mobileNo, password });
      const result = res?.data;

      if (result?.success) {
        const userData = result.data;
        const token = result.token || "manual-auth-token";

        if (userData && Number(userData.roleId || userData.RoleId) === 1) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userData));
          login(userData, token);
          setSuccessMsg("Login Successful! Redirecting...");
          setTimeout(() => {
            navigate("/admin/dashboard", { replace: true });
          }, 800);
        } else {
          setErrorMsg("Access Denied: Not an admin account.");
        }
      } else {
        setErrorMsg(result?.message || "Invalid mobile number or password.");
      }
    } catch (error) {
      const backendMessage = error?.response?.data?.message || error?.message || "Something went wrong.";
      setErrorMsg(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 px-3" style={{ backgroundColor: '#f1f5f9' }}>
      <Helmet>
        <title>Admin Access | VillageSathi</title>
      </Helmet>

      <style>{`
        .admin-login-card {
          width: 100%;
          max-width: 360px;
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .admin-header {
          background: #0f172a;
          padding: 25px;
          text-align: center;
          border-bottom: 3px solid #ea580c;
        }
        .admin-body {
          padding: 25px;
        }
        .input-label-admin {
          font-size: 0.65rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
          display: block;
        }
        .admin-input-group {
          position: relative;
          margin-bottom: 12px;
        }
        .admin-input-group svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .admin-input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          outline: none;
          transition: 0.2s;
        }
        .admin-input:focus {
          border-color: #ea580c;
          background: white;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
        }
        .btn-admin-submit {
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 10px;
          padding: 12px;
          font-weight: 700;
          width: 100%;
          margin-top: 5px;
          font-size: 0.85rem;
          transition: 0.2s;
        }
        .btn-admin-submit:hover:not(:disabled) {
          background: #ea580c;
        }
        .alert-mini {
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 15px;
          text-align: center;
        }
        .alert-error { background: #fef2f2; color: #ef4444; border: 1px solid #fee2e2; }
        .alert-success { background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7; }
      `}</style>

      <div className="admin-login-card">
        <div className="admin-header">
          <ShieldCheck size={36} className="mb-2" style={{ color: '#ea580c' }} />
          <h5 className="text-white fw-bold mb-0">System <span style={{ color: '#ea580c' }}>Administrator</span></h5>
          <p className="text-white-50 small mb-0 uppercase tracking-wider" style={{ fontSize: '0.6rem' }}>VillageSathi Internal Portal</p>
        </div>

        <div className="admin-body">
          {errorMsg && <div className="alert-mini alert-error">{errorMsg}</div>}
          {successMsg && <div className="alert-mini alert-success">{successMsg}</div>}

          <form onSubmit={handleLogin}>
            <span className="input-label-admin">Admin ID / Mobile</span>
            <div className="admin-input-group">
              <Phone size={16} />
              <input
                type="text"
                className="admin-input"
                placeholder="Enter registered mobile"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <span className="input-label-admin">Secret Password</span>
            <div className="admin-input-group">
              <Lock size={16} />
              <input
                type="password"
                className="admin-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button className="btn-admin-submit shadow-sm" disabled={loading}>
              {loading ? (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> VERIFYING...
                </span>
              ) : "AUTHORIZE & LOGIN"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/home" className="text-muted text-decoration-none d-flex align-items-center justify-content-center fw-bold" style={{ fontSize: '0.65rem' }}>
              <ArrowLeft size={12} className="me-1" /> RETURN TO PUBLIC SITE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;