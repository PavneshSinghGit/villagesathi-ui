import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../../api/authApi';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { Phone, Lock, Briefcase, ArrowLeft, Loader2 } from 'lucide-react';

/* ─── Brand Tokens — keep in sync with Dashboard, ManageProfile, Register ── */
const BRAND = {
    heroStart:   '#3D0030',
    heroMid:     '#6B0F4A',
    heroEnd:     '#8C1560',
    gold:        '#D4A017',
    goldLight:   '#F5D76E',
    purple:      '#7C3AED',
    purpleLight: '#EDE9FF',
    purpleSoft:  '#F5F0FF',
};

const MerchantLogin = () => {
    const [credentials, setCredentials] = useState({ mobileNo: '', password: '' });
    const [loading, setLoading]         = useState(false);
    const navigate  = useNavigate();
    const location  = useLocation();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await loginUser(credentials);
            const result   = response.data;
            if (result.Success === 1 || result.success === true) {
                const shopData = result.Data || result.data;
                if (Number(shopData.RoleId || shopData.roleId) === 2) {
                    toast.success('Welcome Back, Merchant!');
                    login(shopData, result.token || result?.data?.token);
                    navigate(location.state?.from?.pathname || '/merchant/dashboard', { replace: true });
                } else {
                    toast.error('Access Denied: Merchant account only.');
                }
            } else {
                toast.error(result.Message || 'Invalid Credentials.');
            }
        } catch {
            toast.error('Login failed.');
        } finally {
            setLoading(false);
        }
    };

    /* ═════════════════════════════ RENDER ═══════════════════════════════ */
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: BRAND.purpleSoft,
            fontFamily: 'system-ui,sans-serif',
            padding: 'clamp(16px,4vw,32px) clamp(14px,4vw,20px)',
        }}>

            {/* ══ Global CSS ════════════════════════════════════════════ */}
            <style>{`
                @keyframes spin   { to { transform: rotate(360deg); } }
                @keyframes floatUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: none; }
                }

                /* Card */
                .ml-card {
                    width: 100%;
                    max-width: 380px;
                    background: #fff;
                    border-radius: 24px;
                    border: 1px solid ${BRAND.purpleLight};
                    box-shadow: 0 20px 48px rgba(124,58,237,.13);
                    overflow: hidden;
                    animation: floatUp .35s ease;
                }

                /* Input label */
                .ml-label {
                    display: block;
                    font-size: .6rem; font-weight: 800;
                    letter-spacing: .12em; text-transform: uppercase;
                    color: #94a3b8; margin-bottom: 5px;
                }

                /* Input wrapper */
                .ml-field {
                    position: relative;
                    margin-bottom: 14px;
                }
                .ml-field .ml-icon {
                    position: absolute; left: 13px; top: 50%;
                    transform: translateY(-50%);
                    color: ${BRAND.purple}; pointer-events: none;
                    display: flex; align-items: center;
                }

                /* Input */
                .ml-input {
                    width: 100%;
                    padding: 11px 14px 11px 40px;
                    background: ${BRAND.purpleSoft};
                    border: 1.5px solid #DDD6FE;
                    border-radius: 12px;
                    font-size: .87rem; font-weight: 600;
                    color: #1e1b4b; outline: none;
                    transition: border-color .2s, box-shadow .2s, background .2s;
                    box-sizing: border-box;
                }
                .ml-input::placeholder { color: #a78bfa; font-weight: 500; }
                .ml-input:focus {
                    border-color: ${BRAND.purple};
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(124,58,237,.08);
                }
                .ml-input:disabled { opacity: .6; cursor: not-allowed; }

                /* Submit button */
                .ml-submit {
                    background: linear-gradient(135deg,${BRAND.heroStart},${BRAND.heroEnd});
                    color: #fff; border: none;
                    border-radius: 13px;
                    padding: 13px 20px;
                    font-weight: 800; font-size: .82rem;
                    letter-spacing: .07em; text-transform: uppercase;
                    width: 100%; margin-top: 6px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    transition: transform .2s, filter .2s, box-shadow .2s;
                    box-shadow: 0 6px 20px rgba(61,0,48,.22);
                    position: relative; overflow: hidden;
                }
                .ml-submit::after {
                    content: ""; position: absolute;
                    bottom: 0; left: 0; right: 0; height: 3px;
                    background: ${BRAND.gold};
                }
                .ml-submit:hover:not(:disabled) {
                    transform: translateY(-2px); filter: brightness(1.1);
                    box-shadow: 0 10px 28px rgba(61,0,48,.28);
                }
                .ml-submit:disabled { opacity: .7; cursor: not-allowed; }

                /* Register link */
                .ml-reg-link {
                    display: inline-flex; align-items: center; gap: 5px;
                    font-size: .8rem; font-weight: 800;
                    color: ${BRAND.purple}; text-decoration: none;
                    transition: color .2s;
                }
                .ml-reg-link:hover { color: ${BRAND.gold}; }

                /* Portal link */
                .ml-portal-link {
                    display: inline-flex; align-items: center; gap: 4px;
                    font-size: .65rem; font-weight: 700;
                    color: #94a3b8; text-decoration: none;
                    transition: color .2s; margin-top: 10px;
                }
                .ml-portal-link:hover { color: ${BRAND.purple}; }
            `}</style>

            <div className="ml-card">

                {/* ── Hero Header ───────────────────────────────────── */}
                <div style={{
                    background: `linear-gradient(135deg,${BRAND.heroStart} 0%,${BRAND.heroMid} 55%,${BRAND.heroEnd} 100%)`,
                    padding: 'clamp(22px,5vw,32px) 24px',
                    textAlign: 'center',
                    borderBottom: `4px solid ${BRAND.gold}`,
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Decorative rings */}
                    {[160, 240].map((sz, i) => (
                        <div key={i} style={{
                            position: 'absolute', top: -sz * .38, right: -sz * .35,
                            width: sz, height: sz, borderRadius: '50%',
                            border: `1.5px solid rgba(212,160,23,${i === 0 ? .12 : .06})`,
                            pointerEvents: 'none',
                        }} />
                    ))}

                    {/* Icon */}
                    <div style={{
                        width: 58, height: 58, borderRadius: '50%',
                        background: 'rgba(212,160,23,.15)',
                        border: '2px solid rgba(212,160,23,.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 12px',
                    }}>
                        <Briefcase size={26} style={{ color: BRAND.gold }} />
                    </div>

                    <h5 style={{
                        color: '#fff', fontWeight: 900, margin: '0 0 4px',
                        fontSize: 'clamp(1rem,3vw,1.15rem)', letterSpacing: '.02em',
                    }}>
                        Merchant{' '}
                        <span style={{
                            background: `linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            Portal
                        </span>
                    </h5>
                    <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.75rem', margin: 0, fontWeight: 600 }}>
                        Sathi Market Business Access
                    </p>
                </div>

                {/* ── Form Body ─────────────────────────────────────── */}
                <div style={{ padding: 'clamp(18px,5vw,28px) clamp(18px,5vw,28px)' }}>
                    <form onSubmit={handleLogin}>

                        {/* Mobile */}
                        <label className="ml-label">Your Mobile</label>
                        <div className="ml-field">
                            <span className="ml-icon"><Phone size={15} /></span>
                            <input
                                type="text"
                                className="ml-input"
                                placeholder="Registered number"
                                value={credentials.mobileNo}
                                onChange={e => setCredentials({ ...credentials, mobileNo: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <label className="ml-label">Secret Password</label>
                        <div className="ml-field">
                            <span className="ml-icon"><Lock size={15} /></span>
                            <input
                                type="password"
                                className="ml-input"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Submit */}
                        <button className="ml-submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                    Checking…
                                </>
                            ) : 'Access Dashboard'}
                        </button>

                    </form>

                    {/* Footer links */}
                    <div style={{
                        marginTop: 20, paddingTop: 16,
                        borderTop: `1px solid ${BRAND.purpleLight}`,
                        textAlign: 'center',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                    }}>
                        <Link to="/merchant-register" className="ml-reg-link">
                            New Merchant? Register Shop
                        </Link>
                        <Link to="/sathi-market" className="ml-portal-link">
                            <ArrowLeft size={11} /> Return to SathiMarket Portal
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MerchantLogin;