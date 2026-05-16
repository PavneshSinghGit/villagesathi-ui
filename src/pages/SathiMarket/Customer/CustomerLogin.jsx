import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { Phone, Lock, ShieldCheck, CheckCircle, Eye, EyeOff, ArrowRight, ShoppingBag, Leaf, Star } from 'lucide-react';

const CustomerLogin = () => {
    const [creds, setCreds] = useState({ mobileNo: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [focused, setFocused] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axiosInstance.post('/Customer/Login', creds);
            const result = res.data;
            if (result.Success === 1 || result.success === true) {
                const userData = result;
                const roleId = Number(userData.RoleId);
                if (roleId === 3) {
                    const cleanUser = {
                        userId: userData.UserId,
                        name: userData.Name,
                        mobileNo: userData.MobileNo,
                        roleId: userData.RoleId,
                        roleName: userData.RoleName,
                        city: userData.City,
                        villageId: userData.VillageId
                    };
                    localStorage.setItem('customerUser', JSON.stringify(cleanUser));
                    toast.success(`Welcome back, ${userData.Name}! 👋`);
                    login(cleanUser);
                    navigate("/customer-dashboard", { replace: true });
                } else {
                    toast.error("Access Denied: Not a Customer account.");
                }
            } else {
                toast.error(result.Message || "Invalid credentials");
            }
        } catch (err) {
            toast.error("Login failed. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="vs-login-root">
            <Helmet>
                <title>Customer Login | VillageSathi Secure Access</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* LEFT PANEL - Decorative */}
            <aside className="vs-left-panel">
                <div className="vs-left-inner">
                    <div className="vs-brand-top">
                        <div className="vs-logo-mark">
                            <ShoppingBag size={26} />
                        </div>
                        <div>
                            <div className="vs-brand-name">SathiMarket</div>
                            <div className="vs-brand-sub">by VillageSathi</div>
                        </div>
                    </div>

                    <div className="vs-left-hero">
                        <div className="vs-hero-badge">
                            <Star size={12} fill="currentColor" /> DPIIT Recognized Startup
                        </div>
                        <h2 className="vs-hero-headline">
                            Your Village.<br />
                            <span className="vs-hero-accent">Your Market.</span>
                        </h2>
                        <p className="vs-hero-desc">
                            Fresh produce from 500+ Gram Panchayats. No middlemen, real prices, real farmers.
                        </p>
                    </div>

                    <div className="vs-features-list">
                        {[
                            { icon: <Leaf size={15} />, text: "Farm-fresh, direct from village" },
                            { icon: <ShieldCheck size={15} />, text: "Verified rural sellers only" },
                            { icon: <Star size={15} />, text: "Rated 4.8★ by rural buyers" },
                        ].map((f, i) => (
                            <div className="vs-feature-item" key={i} style={{ animationDelay: `${0.1 * i}s` }}>
                                <span className="vs-feature-icon">{f.icon}</span>
                                <span>{f.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Decorative floating elements */}
                    <div className="vs-deco-orb vs-orb-1" />
                    <div className="vs-deco-orb vs-orb-2" />
                    <div className="vs-deco-pattern" />
                </div>
            </aside>

            {/* RIGHT PANEL - Form */}
            <section className="vs-right-panel">
                <div className="vs-form-card">

                    {/* Mobile brand header (only on small screens) */}
                    <div className="vs-mobile-brand">
                        <div className="vs-logo-mark vs-logo-small">
                            <ShoppingBag size={18} />
                        </div>
                        <span className="vs-brand-name-sm">SathiMarket</span>
                    </div>

                    <div className="vs-form-top">
                        <div className="vs-avatar-ring">
                            <ShoppingBag size={24} className="vs-avatar-icon" />
                        </div>
                        <h1 className="vs-form-title">Welcome Back</h1>
                        <p className="vs-form-subtitle">Sign in to your shopping account</p>
                    </div>

                    <form onSubmit={handleLogin} className="vs-form-body" noValidate>
                        {/* Mobile Field */}
                        <div className={`vs-field-wrap ${focused === 'mobile' ? 'vs-field-active' : ''}`}>
                            <label className="vs-field-label">Mobile Number</label>
                            <div className="vs-input-shell">
                                <Phone size={16} className="vs-field-icon" />
                                <input
                                    type="tel"
                                    className="vs-input"
                                    placeholder="10-digit mobile number"
                                    value={creds.mobileNo}
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    onChange={(e) => setCreds({ ...creds, mobileNo: e.target.value })}
                                    onFocus={() => setFocused('mobile')}
                                    onBlur={() => setFocused('')}
                                    required
                                    disabled={loading}
                                />
                                {creds.mobileNo.length === 10 && (
                                    <CheckCircle size={16} className="vs-valid-tick" />
                                )}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className={`vs-field-wrap ${focused === 'pass' ? 'vs-field-active' : ''}`}>
                            <div className="vs-label-row">
                                <label className="vs-field-label">Password</label>
                                <a href="#forgot" className="vs-forgot-link">Forgot password?</a>
                            </div>
                            <div className="vs-input-shell">
                                <Lock size={16} className="vs-field-icon" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    className="vs-input"
                                    placeholder="Enter your password"
                                    value={creds.password}
                                    onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                                    onFocus={() => setFocused('pass')}
                                    onBlur={() => setFocused('')}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="vs-eye-btn"
                                    onClick={() => setShowPass(!showPass)}
                                    tabIndex={-1}
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="vs-submit-btn" disabled={loading}>
                            {loading ? (
                                <span className="vs-spinner" />
                            ) : (
                                <>
                                    <ShoppingBag size={18} />
                                    <span>Sign In to Shop</span>
                                    <ArrowRight size={18} className="vs-btn-arrow" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="vs-divider">
                        <span>New to SathiMarket?</span>
                    </div>

                    <Link to="/customer-register" className="vs-register-btn">
                        Create Free Account
                    </Link>

                    {/* Trust signals */}
                    <div className="vs-trust-row">
                        <span className="vs-trust-item"><CheckCircle size={12} /> SSL Secured</span>
                        <span className="vs-trust-dot">·</span>
                        <span className="vs-trust-item"><ShieldCheck size={12} /> Data Protected</span>
                        <span className="vs-trust-dot">·</span>
                        <span className="vs-trust-item"><Star size={12} /> DPIIT Verified</span>
                    </div>

                    <Link to="/sathi-market" className="vs-back-link">
                        ← Return to SathiMarket Portal
                    </Link>
                </div>
            </section>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .vs-login-root {
                    min-height: 100vh;
                    display: flex;
                    font-family: 'Nunito', sans-serif;
                    background: #f0f4f0;
                }

                /* ─── LEFT PANEL ─────────────────────────────── */
                .vs-left-panel {
                    display: none;
                    width: 45%;
                    background: linear-gradient(160deg, #1a3a1a 0%, #963d5c 40%, #1f4a1c 100%);
                    position: relative;
                    overflow: hidden;
                }
                @media (min-width: 900px) { .vs-left-panel { display: flex; } }

                .vs-left-inner {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 48px 44px;
                    width: 100%;
                    position: relative;
                    z-index: 2;
                }

                .vs-brand-top {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }
                .vs-logo-mark {
                    width: 50px;
                    height: 50px;
                    background: #ff9933;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                    box-shadow: 0 8px 20px rgba(255,153,51,0.35);
                }
                .vs-brand-name {
                    font-size: 1.25rem;
                    font-weight: 900;
                    color: white;
                    line-height: 1.1;
                }
                .vs-brand-sub {
                    font-size: 0.7rem;
                    color: rgba(255,255,255,0.55);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .vs-left-hero { margin: auto 0; }

                .vs-hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(255,153,51,0.18);
                    border: 1px solid rgba(255,153,51,0.4);
                    color: #ffb55a;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 0.68rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 20px;
                }

                .vs-hero-headline {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 3.5vw, 2.8rem);
                    font-weight: 800;
                    color: white;
                    line-height: 1.15;
                    margin-bottom: 16px;
                }
                .vs-hero-accent {
                    color: #ff9933;
                }
                .vs-hero-desc {
                    color: rgba(255,255,255,0.65);
                    font-size: 0.95rem;
                    line-height: 1.6;
                    max-width: 300px;
                }

                .vs-features-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .vs-feature-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: rgba(255,255,255,0.8);
                    font-size: 0.85rem;
                    font-weight: 600;
                    animation: slideUp 0.5s ease both;
                }
                .vs-feature-icon {
                    width: 32px;
                    height: 32px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ff9933;
                    flex-shrink: 0;
                }

                /* Decorative */
                .vs-deco-orb {
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                }
                .vs-orb-1 {
                    width: 280px; height: 280px;
                    background: radial-gradient(circle, rgba(255,153,51,0.12) 0%, transparent 70%);
                    top: -60px; right: -80px;
                }
                .vs-orb-2 {
                    width: 200px; height: 200px;
                    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
                    bottom: 60px; left: -50px;
                }
                .vs-deco-pattern {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
                    background-size: 28px 28px;
                    pointer-events: none;
                }

                /* ─── RIGHT PANEL ─────────────────────────────── */
                .vs-right-panel {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px 16px;
                    background: #f0f4f0;
                    min-height: 100vh;
                }

                .vs-form-card {
                    width: 100%;
                    max-width: 420px;
                    background: white;
                    border-radius: 28px;
                    padding: 40px 36px;
                    box-shadow:
                        0 1px 3px rgba(0,0,0,0.04),
                        0 20px 40px rgba(26,58,26,0.10),
                        0 0 0 1px rgba(26,58,26,0.06);
                    animation: fadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                @media (max-width: 480px) {
                    .vs-form-card { padding: 32px 24px; border-radius: 22px; }
                }

                /* Mobile brand (shown only on small screens) */
                .vs-mobile-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 28px;
                    justify-content: center;
                }
                @media (min-width: 900px) { .vs-mobile-brand { display: none; } }
                .vs-logo-small {
                    width: 38px; height: 38px;
                    border-radius: 10px;
                    font-size: 0.8rem;
                }
                .vs-brand-name-sm {
                    font-size: 1.1rem;
                    font-weight: 900;
                    color: #1a3a1a;
                }

                .vs-form-top {
                    text-align: center;
                    margin-bottom: 32px;
                }
                .vs-avatar-ring {
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, #963d5c, #ff9933);
                    border-radius: 18px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                    box-shadow: 0 8px 20px rgba(45,90,39,0.25);
                }
                .vs-avatar-icon { color: white; }

                .vs-form-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1a3a1a;
                    margin-bottom: 6px;
                }
                .vs-form-subtitle {
                    color: #6b7a6b;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                /* ─── FIELDS ─────────────────────────────── */
                .vs-form-body { display: flex; flex-direction: column; gap: 18px; }

                .vs-field-wrap {
                    display: flex;
                    flex-direction: column;
                    gap: 7px;
                }
                .vs-field-label {
                    font-size: 0.72rem;
                    font-weight: 800;
                    color: #3a5a3a;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                }
                .vs-label-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .vs-forgot-link {
                    font-size: 0.72rem;
                    font-weight: 700;
                    color: #ff9933;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .vs-forgot-link:hover { color: #e68a00; }

                .vs-input-shell {
                    display: flex;
                    align-items: center;
                    background: #f5f8f5;
                    border: 1.5px solid #dce8dc;
                    border-radius: 12px;
                    padding: 0 14px;
                    gap: 10px;
                    transition: all 0.25s ease;
                }
                .vs-field-active .vs-input-shell {
                    border-color: #963d5c;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(45,90,39,0.08);
                }
                .vs-field-icon { color: #8aab8a; flex-shrink: 0; }
                .vs-field-active .vs-field-icon { color: #963d5c; }

                .vs-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    outline: none;
                    padding: 13px 0;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #1a3a1a;
                    font-family: 'Nunito', sans-serif;
                    min-width: 0;
                }
                .vs-input::placeholder { color: #aab8aa; font-weight: 500; }
                .vs-input:disabled { opacity: 0.6; cursor: not-allowed; }

                .vs-valid-tick { color: #963d5c; flex-shrink: 0; }
                .vs-eye-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #8aab8a;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                    transition: color 0.2s;
                }
                .vs-eye-btn:hover { color: #963d5c; }

                /* ─── BUTTONS ─────────────────────────────── */
                .vs-submit-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    background: linear-gradient(135deg, #1a3a1a 0%, #963d5c 100%);
                    color: white;
                    border: none;
                    border-radius: 14px;
                    padding: 15px;
                    font-size: 0.95rem;
                    font-weight: 800;
                    font-family: 'Nunito', sans-serif;
                    cursor: pointer;
                    margin-top: 8px;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    position: relative;
                    overflow: hidden;
                    letter-spacing: 0.3px;
                    box-shadow: 0 6px 20px rgba(26,58,26,0.25);
                }
                .vs-submit-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, #963d5c, #ff9933);
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .vs-submit-btn:hover:not(:disabled)::before { opacity: 1; }
                .vs-submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 28px rgba(26,58,26,0.3);
                }
                .vs-submit-btn:active:not(:disabled) { transform: translateY(0); }
                .vs-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
                .vs-submit-btn > * { position: relative; z-index: 1; }

                .vs-btn-arrow { transition: transform 0.3s ease; }
                .vs-submit-btn:hover:not(:disabled) .vs-btn-arrow { transform: translateX(4px); }

                .vs-spinner {
                    display: inline-block;
                    width: 20px; height: 20px;
                    border: 2.5px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }

                .vs-divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 22px 0 14px;
                    color: #a0b0a0;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .vs-divider::before, .vs-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #e4ece4;
                }

                .vs-register-btn {
                    display: block;
                    text-align: center;
                    border: 1.5px solid #dce8dc;
                    border-radius: 14px;
                    padding: 13px;
                    color: #963d5c;
                    font-weight: 800;
                    font-size: 0.9rem;
                    text-decoration: none;
                    transition: all 0.25s ease;
                    background: #f5f8f5;
                }
                .vs-register-btn:hover {
                    background: #963d5c;
                    color: white;
                    border-color: #963d5c;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(45,90,39,0.2);
                }

                /* Trust signals */
                .vs-trust-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 22px;
                    flex-wrap: wrap;
                }
                .vs-trust-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: #7a907a;
                    font-size: 0.68rem;
                    font-weight: 700;
                }
                .vs-trust-dot { color: #c8d8c8; font-size: 0.8rem; }

                .vs-back-link {
                    display: block;
                    text-align: center;
                    color: #8aab8a;
                    font-size: 0.72rem;
                    font-weight: 700;
                    text-decoration: none;
                    margin-top: 18px;
                    transition: color 0.2s;
                }
                .vs-back-link:hover { color: #963d5c; }

                /* ─── ANIMATIONS ─────────────────────────────── */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateX(-12px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </main>
    );
};

export default CustomerLogin;