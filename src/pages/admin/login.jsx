import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import "../../styles/loginStyles.css";
import { Helmet } from "react-helmet-async";
function Login() {
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  // Agar user pehle se logged in hai toh seedha dashboard bhej do
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user?.roleId === 1) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await loginUser({ mobileNo, password });
      // Aapke API structure ke mutabiq: res.success aur res.data
      if (res && res.success === true) {
        const userData = res.data;

        // Yahan 'token' nikal rahe hain. Agar API 'res.token' mein de rahi hai 
        // ya 'res.data.token' mein, uske hisaab se adjust karein.
        const token = res.token || userData.token || "manual-auth-token";

        // Role Validation: res.data.roleId === 1
        if (userData && Number(userData.roleId) === 1) {

          // 1. Data Store Karein
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userData));

          setSuccessMsg("Login Successful! Redirecting...");

          // 2. Redirect karein
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 1000);

        } else {
          setErrorMsg("Access Denied: You are not authorized as an admin.");
        }
      } else {
        setErrorMsg(res.message || "Invalid mobile number or password.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      const backendMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      setErrorMsg(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Helmet>
        <title>Admin Login | VillageSathi</title>
        <meta name="description" content="Login to your VillageSathi admin panel to manage and oversee the platform's operations." />
      </Helmet>
      <div className="login-card">
        <div className="login-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Admin Logo"
          />
          <h2>VillageSathi Admin</h2>
          <p>Please enter your credentials</p>
        </div>

        {/* Message UI */}
        {errorMsg && <div className="msg-box error">{errorMsg}</div>}
        {successMsg && <div className="msg-box success">{successMsg}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Mobile Number</label>
            <input
              type="text"
              placeholder="e.g. 9876543210"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;