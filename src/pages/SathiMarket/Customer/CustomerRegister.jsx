import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import {
    UserPlus, User, Phone, Lock, MapPin, Home, Building2,
    ShieldCheck, Eye, EyeOff, CheckCircle, Leaf, Star,
    ShoppingBag, ArrowRight, Package
} from 'lucide-react';

const STEPS = ['Identity', 'Address', 'Review'];

const CustomerRegister = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [showPass, setShowPass] = useState(false);
    const [focused, setFocused] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        mobileNo: '',
        password: '',
        villageId: 0,
        fullAddress: '',
        landmark: '',
        city: '',
        state: 'Uttar Pradesh',
        pincode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'villageId' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData, villageId: Number(formData.villageId) };
            const res = await axiosInstance.post('/Customer/Register', payload);
            if (res.data?.Success === 1 || res.data?.success === true) {
                toast.success(res.data?.Message || "Account created successfully!");
                navigate('/customer-login', { replace: true });
            } else {
                toast.error(res.data?.Message || "Registration failed");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.Message || err.response?.data?.title || "Server error occurred";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 2));
    const prevStep = () => setStep(s => Math.max(s - 1, 0));

    const step1Valid = formData.name && formData.mobileNo.length === 10 && formData.password.length >= 6;
    const step2Valid = formData.fullAddress && formData.city && formData.pincode.length === 6;

    return (
        <main className="vsr-root">
            <Helmet>
                <title>Create Account | SathiMarket - VillageSathi</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* LEFT PANEL */}
            <aside className="vsr-left">
                <div className="vsr-left-inner">
                    <div className="vsr-brand">
                        <div className="vsr-logo"><ShoppingBag size={24} /></div>
                        <div>
                            <div className="vsr-brand-name">SathiMarket</div>
                            <div className="vsr-brand-sub">by VillageSathi</div>
                        </div>
                    </div>

                    <div className="vsr-hero">
                        <div className="vsr-hero-badge"><Star size={11} fill="currentColor" /> DPIIT Recognized</div>
                        <h2 className="vsr-headline">Join the <span className="vsr-accent">Rural Revolution</span></h2>
                        <p className="vsr-desc">Register once. Shop fresh produce from 500+ Gram Panchayats across Uttar Pradesh — delivered to your doorstep.</p>
                    </div>

                    <div className="vsr-perks">
                        {[
                            { icon: <Leaf size={14} />, title: "Farm Direct", sub: "No middlemen, real prices" },
                            { icon: <Package size={14} />, title: "Village Delivery", sub: "Even to remote panchayats" },
                            { icon: <ShieldCheck size={14} />, title: "Safe & Verified", sub: "All sellers KYC verified" },
                        ].map((p, i) => (
                            <div className="vsr-perk" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
                                <div className="vsr-perk-icon">{p.icon}</div>
                                <div>
                                    <div className="vsr-perk-title">{p.title}</div>
                                    <div className="vsr-perk-sub">{p.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="vsr-orb vsr-orb-a" />
                    <div className="vsr-orb vsr-orb-b" />
                    <div className="vsr-grid-bg" />
                </div>
            </aside>

            {/* RIGHT PANEL */}
            <section className="vsr-right">
                <div className="vsr-card">

                    {/* Mobile brand */}
                    <div className="vsr-mobile-brand">
                        <div className="vsr-logo vsr-logo-sm"><ShoppingBag size={16} /></div>
                        <span className="vsr-brand-name-sm">SathiMarket</span>
                    </div>

                    {/* Top */}
                    <div className="vsr-card-top">
                        <div className="vsr-card-icon">
                            <UserPlus size={22} />
                        </div>
                        <h1 className="vsr-card-title">Create Account</h1>
                        <p className="vsr-card-sub">Join thousands of rural shoppers today</p>
                    </div>

                    {/* Step indicator */}
                    <div className="vsr-steps">
                        {STEPS.map((s, i) => (
                            <React.Fragment key={i}>
                                <div className={`vsr-step ${i === step ? 'vsr-step-active' : ''} ${i < step ? 'vsr-step-done' : ''}`}>
                                    <div className="vsr-step-dot">
                                        {i < step ? <CheckCircle size={14} /> : <span>{i + 1}</span>}
                                    </div>
                                    <span className="vsr-step-label">{s}</span>
                                </div>
                                {i < 2 && <div className={`vsr-step-line ${i < step ? 'vsr-step-line-done' : ''}`} />}
                            </React.Fragment>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* ── STEP 0: Identity ── */}
                        {step === 0 && (
                            <div className="vsr-step-body">
                                <div className="vsr-section-label">
                                    <User size={13} /> Personal Details
                                </div>

                                <div className="vsr-field-row">
                                    <VsrField
                                        label="Full Name"
                                        icon={<User size={15} />}
                                        name="name"
                                        type="text"
                                        placeholder="Aman Singh"
                                        value={formData.name}
                                        onChange={handleChange}
                                        focused={focused}
                                        setFocused={setFocused}
                                        required
                                    />
                                    <VsrField
                                        label="Mobile Number"
                                        icon={<Phone size={15} />}
                                        name="mobileNo"
                                        type="tel"
                                        placeholder="10-digit number"
                                        value={formData.mobileNo}
                                        onChange={handleChange}
                                        focused={focused}
                                        setFocused={setFocused}
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        tick={formData.mobileNo.length === 10}
                                        required
                                    />
                                </div>

                                <div className="vsr-section-label" style={{ marginTop: 8 }}>
                                    <Lock size={13} /> Security
                                </div>

                                <div className={`vsr-field ${focused === 'password' ? 'vsr-field-active' : ''}`}>
                                    <label className="vsr-label">Password</label>
                                    <div className="vsr-input-shell">
                                        <Lock size={15} className="vsr-icon" />
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            name="password"
                                            className="vsr-input"
                                            placeholder="Min. 6 characters"
                                            value={formData.password}
                                            minLength={6}
                                            onChange={handleChange}
                                            onFocus={() => setFocused('password')}
                                            onBlur={() => setFocused('')}
                                            required
                                        />
                                        <button type="button" className="vsr-eye" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                    {formData.password.length >= 6 && (
                                        <div className="vsr-strength">
                                            <div className="vsr-strength-bar vsr-strength-ok" />
                                            <span>Strong enough ✓</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="vsr-next-btn"
                                    onClick={nextStep}
                                    disabled={!step1Valid}
                                >
                                    Continue to Address <ArrowRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* ── STEP 1: Address ── */}
                        {step === 1 && (
                            <div className="vsr-step-body">
                                <div className="vsr-section-label">
                                    <Home size={13} /> Delivery Address
                                </div>

                                <div className="vsr-field">
                                    <label className="vsr-label">House / Street / Village</label>
                                    <div className={`vsr-input-shell ${focused === 'fullAddress' ? 'vsr-shell-active' : ''}`}>
                                        <Home size={15} className="vsr-icon" />
                                        <input type="text" name="fullAddress" className="vsr-input" placeholder="House no, street, locality"
                                            value={formData.fullAddress} onChange={handleChange}
                                            onFocus={() => setFocused('fullAddress')} onBlur={() => setFocused('')} required />
                                    </div>
                                </div>

                                <div className="vsr-field-row">
                                    <div className="vsr-field">
                                        <label className="vsr-label">Landmark <span className="vsr-optional">(optional)</span></label>
                                        <div className={`vsr-input-shell ${focused === 'landmark' ? 'vsr-shell-active' : ''}`}>
                                            <MapPin size={15} className="vsr-icon" />
                                            <input type="text" name="landmark" className="vsr-input" placeholder="Near school / mandir"
                                                value={formData.landmark} onChange={handleChange}
                                                onFocus={() => setFocused('landmark')} onBlur={() => setFocused('')} />
                                        </div>
                                    </div>
                                    <div className="vsr-field">
                                        <label className="vsr-label">City / Town</label>
                                        <div className={`vsr-input-shell ${focused === 'city' ? 'vsr-shell-active' : ''}`}>
                                            <Building2 size={15} className="vsr-icon" />
                                            <input type="text" name="city" className="vsr-input" placeholder="e.g. Lakhimpur"
                                                value={formData.city} onChange={handleChange}
                                                onFocus={() => setFocused('city')} onBlur={() => setFocused('')} required />
                                        </div>
                                    </div>
                                </div>

                                <div className="vsr-field-row">
                                    <div className="vsr-field">
                                        <label className="vsr-label">State</label>
                                        <div className={`vsr-input-shell ${focused === 'state' ? 'vsr-shell-active' : ''}`}>
                                            <MapPin size={15} className="vsr-icon" />
                                            <input type="text" name="state" className="vsr-input"
                                                value={formData.state} onChange={handleChange}
                                                onFocus={() => setFocused('state')} onBlur={() => setFocused('')} />
                                        </div>
                                    </div>
                                    <div className="vsr-field">
                                        <label className="vsr-label">Pincode</label>
                                        <div className={`vsr-input-shell ${focused === 'pincode' ? 'vsr-shell-active' : ''}`}>
                                            <MapPin size={15} className="vsr-icon" />
                                            <input type="text" name="pincode" className="vsr-input" placeholder="6-digit code"
                                                pattern="[0-9]{6}" maxLength={6}
                                                value={formData.pincode} onChange={handleChange}
                                                onFocus={() => setFocused('pincode')} onBlur={() => setFocused('')} required />
                                            {formData.pincode.length === 6 && <CheckCircle size={14} className="vsr-tick" />}
                                        </div>
                                    </div>
                                </div>

                                <div className="vsr-btn-row">
                                    <button type="button" className="vsr-back-btn" onClick={prevStep}>← Back</button>
                                    <button type="button" className="vsr-next-btn vsr-next-flex" onClick={nextStep} disabled={!step2Valid}>
                                        Review Details <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 2: Review ── */}
                        {step === 2 && (
                            <div className="vsr-step-body">
                                <div className="vsr-review-card">
                                    <div className="vsr-review-header">
                                        <User size={14} /> Personal
                                    </div>
                                    <div className="vsr-review-grid">
                                        <ReviewRow label="Name" value={formData.name} />
                                        <ReviewRow label="Mobile" value={formData.mobileNo} />
                                        <ReviewRow label="Password" value="••••••••" />
                                    </div>
                                </div>

                                <div className="vsr-review-card">
                                    <div className="vsr-review-header">
                                        <Home size={14} /> Address
                                    </div>
                                    <div className="vsr-review-grid">
                                        <ReviewRow label="Address" value={formData.fullAddress} />
                                        {formData.landmark && <ReviewRow label="Landmark" value={formData.landmark} />}
                                        <ReviewRow label="City" value={formData.city} />
                                        <ReviewRow label="State" value={formData.state} />
                                        <ReviewRow label="Pincode" value={formData.pincode} />
                                    </div>
                                </div>

                                <div className="vsr-consent">
                                    <ShieldCheck size={13} />
                                    <span>By registering, you agree to VillageSathi's Terms & Privacy Policy.</span>
                                </div>

                                <div className="vsr-btn-row">
                                    <button type="button" className="vsr-back-btn" onClick={prevStep}>← Edit</button>
                                    <button type="submit" className="vsr-submit-btn" disabled={loading}>
                                        {loading ? (
                                            <span className="vsr-spinner" />
                                        ) : (
                                            <><ShoppingBag size={16} /> Create My Account</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    <div className="vsr-foot-divider">Already registered?</div>
                    <Link to="/customer-login" className="vsr-login-link">Sign In to Shop →</Link>

                    <div className="vsr-trust">
                        <span className="vsr-trust-item"><CheckCircle size={11} /> 256-bit SSL</span>
                        <span className="vsr-trust-dot">·</span>
                        <span className="vsr-trust-item"><ShieldCheck size={11} /> DPIIT Verified</span>
                        <span className="vsr-trust-dot">·</span>
                        <span className="vsr-trust-item"><Leaf size={11} /> Rural Focused</span>
                    </div>
                </div>
            </section>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .vsr-root {
                    min-height: 100vh;
                    display: flex;
                    font-family: 'Nunito', sans-serif;
                    background: #f0f4f0;
                }

                /* ── LEFT ── */
                .vsr-left {
                    display: none;
                    width: 42%;
                    background: linear-gradient(160deg, #9c8f94 0%, #963d5c 45%, #1f4a1c 100%);
                    position: relative;
                    overflow: hidden;
                }
                @media (min-width: 960px) { .vsr-left { display: flex; } }

                .vsr-left-inner {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 44px 40px;
                    width: 100%;
                    position: relative;
                    z-index: 2;
                }
                .vsr-brand { display: flex; align-items: center; gap: 13px; }
                .vsr-logo {
                    width: 46px; height: 46px;
                    background: #ff9933;
                    border-radius: 13px;
                    display: flex; align-items: center; justify-content: center;
                    color: white; flex-shrink: 0;
                    box-shadow: 0 8px 20px rgba(255,153,51,0.35);
                }
                .vsr-brand-name { font-size: 1.2rem; font-weight: 900; color: white; }
                .vsr-brand-sub { font-size: 0.65rem; color: rgba(255,255,255,0.5); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

                .vsr-hero { margin: auto 0; }
                .vsr-hero-badge {
                    display: inline-flex; align-items: center; gap: 5px;
                    background: rgba(255,153,51,0.18); border: 1px solid rgba(255,153,51,0.4);
                    color: #ffb55a; padding: 5px 12px; border-radius: 20px;
                    font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
                    margin-bottom: 18px;
                }
                .vsr-headline {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(1.8rem, 3vw, 2.5rem);
                    font-weight: 800; color: white; line-height: 1.2; margin-bottom: 14px;
                }
                .vsr-accent { color: #ff9933; }
                .vsr-desc { color: rgba(255,255,255,0.62); font-size: 0.9rem; line-height: 1.65; max-width: 280px; }

                .vsr-perks { display: flex; flex-direction: column; gap: 12px; }
                .vsr-perk {
                    display: flex; align-items: center; gap: 12px;
                    animation: slideIn 0.45s ease both;
                }
                .vsr-perk-icon {
                    width: 36px; height: 36px; background: rgba(255,255,255,0.1);
                    border-radius: 9px; display: flex; align-items: center; justify-content: center;
                    color: #ff9933; flex-shrink: 0;
                }
                .vsr-perk-title { font-size: 0.82rem; font-weight: 800; color: white; }
                .vsr-perk-sub { font-size: 0.68rem; color: rgba(255,255,255,0.5); font-weight: 600; }

                .vsr-orb { position: absolute; border-radius: 50%; pointer-events: none; }
                .vsr-orb-a { width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,153,51,0.12) 0%, transparent 70%); top: -70px; right: -90px; }
                .vsr-orb-b { width: 220px; height: 220px; background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%); bottom: 40px; left: -60px; }
                .vsr-grid-bg { position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 26px 26px; pointer-events: none; }

                /* ── RIGHT ── */
                .vsr-right {
                    flex: 1;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding: 28px 16px;
                    background: #f0f4f0;
                    min-height: 100vh;
                    overflow-y: auto;
                }

                .vsr-card {
                    width: 100%; max-width: 550px;
                    background: white;
                    border-radius: 28px;
                    padding: 38px 34px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 20px 40px rgba(26,58,26,0.10), 0 0 0 1px rgba(26,58,26,0.06);
                    animation: fadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
                    margin: auto;
                }
                @media (max-width: 550px) { .vsr-card { padding: 28px 20px; border-radius: 20px; } }

                .vsr-mobile-brand { display: flex; align-items: center; gap: 9px; margin-bottom: 24px; justify-content: center; }
                @media (min-width: 960px) { .vsr-mobile-brand { display: none; } }
                .vsr-logo-sm { width: 34px; height: 34px; border-radius: 9px; }
                .vsr-brand-name-sm { font-size: 1rem; font-weight: 900; color: #9c8f94; }

                .vsr-card-top { text-align: center; margin-bottom: 24px; }
                .vsr-card-icon {
                    width: 58px; height: 58px;
                    background: linear-gradient(135deg, #963d5c, #ff9933);
                    border-radius: 16px;
                    display: inline-flex; align-items: center; justify-content: center;
                    color: white; margin-bottom: 14px;
                    box-shadow: 0 8px 20px rgba(45,90,39,0.25);
                }
                .vsr-card-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; color: #9c8f94; margin-bottom: 5px; }
                .vsr-card-sub { color: #6b7a6b; font-size: 0.85rem; font-weight: 600; }

                /* STEPS */
                .vsr-steps {
                    display: flex; align-items: center; gap: 0;
                    margin-bottom: 28px;
                    padding: 0 4px;
                }
                .vsr-step { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; }
                .vsr-step-dot {
                    width: 30px; height: 30px; border-radius: 50%;
                    border: 2px solid #dce8dc;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.75rem; font-weight: 800; color: #8aab8a;
                    background: white; transition: all 0.3s ease;
                }
                .vsr-step-active .vsr-step-dot { border-color: #963d5c; background: #963d5c; color: white; box-shadow: 0 0 0 4px rgba(45,90,39,0.15); }
                .vsr-step-done .vsr-step-dot { border-color: #963d5c; background: #f0f7ef; color: #963d5c; }
                .vsr-step-label { font-size: 0.62rem; font-weight: 800; color: #8aab8a; text-transform: uppercase; letter-spacing: 0.5px; }
                .vsr-step-active .vsr-step-label { color: #963d5c; }
                .vsr-step-done .vsr-step-label { color: #5a8a5a; }
                .vsr-step-line { flex: 1; height: 2px; background: #dce8dc; margin: 0 6px; margin-bottom: 18px; transition: background 0.3s; }
                .vsr-step-line-done { background: #963d5c; }

                /* FIELDS */
                .vsr-step-body { display: flex; flex-direction: column; gap: 14px; }
                .vsr-section-label {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 0.65rem; font-weight: 800; color: #ff9933;
                    text-transform: uppercase; letter-spacing: 0.8px;
                    padding-bottom: 8px; border-bottom: 1px solid #f0f4f0;
                }
                .vsr-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                @media (max-width: 440px) { .vsr-field-row { grid-template-columns: 1fr; } }

                .vsr-field { display: flex; flex-direction: column; gap: 6px; }
                .vsr-label { font-size: 0.68rem; font-weight: 800; color: #3a5a3a; text-transform: uppercase; letter-spacing: 0.5px; }
                .vsr-optional { font-weight: 600; color: #a0b0a0; text-transform: none; font-size: 0.65rem; }

                .vsr-input-shell {
                    display: flex; align-items: center;
                    background: #f5f8f5; border: 1.5px solid #dce8dc;
                    border-radius: 11px; padding: 0 12px; gap: 9px;
                    transition: all 0.25s ease;
                }
                .vsr-field-active .vsr-input-shell,
                .vsr-shell-active {
                    border-color: #963d5c !important;
                    background: white !important;
                    box-shadow: 0 0 0 4px rgba(45,90,39,0.08) !important;
                }
                .vsr-icon { color: #8aab8a; flex-shrink: 0; }
                .vsr-field-active .vsr-icon { color: #963d5c; }
                .vsr-input {
                    flex: 1; background: transparent; border: none; outline: none;
                    padding: 11px 0; font-size: 0.88rem; font-weight: 600;
                    color: #9c8f94; font-family: 'Nunito', sans-serif; min-width: 0;
                }
                .vsr-input::placeholder { color: #aab8aa; font-weight: 500; }
                .vsr-tick { color: #963d5c; flex-shrink: 0; }
                .vsr-eye { background: none; border: none; cursor: pointer; color: #8aab8a; padding: 0; display: flex; align-items: center; transition: color 0.2s; }
                .vsr-eye:hover { color: #963d5c; }

                .vsr-strength { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
                .vsr-strength-bar { height: 3px; width: 60px; border-radius: 2px; }
                .vsr-strength-ok { background: #963d5c; }
                .vsr-strength span { font-size: 0.65rem; font-weight: 700; color: #963d5c; }

                /* BUTTONS */
                .vsr-next-btn {
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    background: linear-gradient(135deg, #9c8f94 0%, #963d5c 100%);
                    color: white; border: none; border-radius: 12px;
                    padding: 14px; font-size: 0.9rem; font-weight: 800;
                    font-family: 'Nunito', sans-serif; cursor: pointer;
                    margin-top: 6px; width: 100%;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 0 6px 18px rgba(26,58,26,0.22);
                }
                .vsr-next-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(26,58,26,0.28); }
                .vsr-next-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
                .vsr-next-flex { flex: 1; }

                .vsr-btn-row { display: flex; gap: 10px; margin-top: 6px; }
                .vsr-back-btn {
                    background: #f5f8f5; color: #3a5a3a; border: 1.5px solid #dce8dc;
                    border-radius: 12px; padding: 14px 18px;
                    font-size: 0.82rem; font-weight: 800; cursor: pointer;
                    font-family: 'Nunito', sans-serif;
                    transition: all 0.2s; flex-shrink: 0;
                }
                .vsr-back-btn:hover { background: #e8f0e8; border-color: #aac8aa; }

                .vsr-submit-btn {
                    display: flex; align-items: center; justify-content: center; gap: 9px;
                    flex: 1;
                    background: linear-gradient(135deg, #963d5c, #ff9933);
                    color: white; border: none; border-radius: 12px;
                    padding: 14px; font-size: 0.9rem; font-weight: 800;
                    font-family: 'Nunito', sans-serif; cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 6px 18px rgba(255,153,51,0.25);
                }
                .vsr-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(255,153,51,0.3); }
                .vsr-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .vsr-spinner {
                    display: inline-block; width: 18px; height: 18px;
                    border: 2.5px solid rgba(255,255,255,0.3);
                    border-top-color: white; border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }

                /* REVIEW */
                .vsr-review-card {
                    background: #f5f8f5; border-radius: 14px;
                    padding: 16px; border: 1px solid #e4ece4;
                }
                .vsr-review-header {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 0.65rem; font-weight: 800; color: #3a5a3a;
                    text-transform: uppercase; letter-spacing: 0.5px;
                    margin-bottom: 10px;
                }
                .vsr-review-grid { display: flex; flex-direction: column; gap: 6px; }
                .vsr-review-row { display: flex; justify-content: space-between; align-items: baseline; }
                .vsr-review-lbl { font-size: 0.7rem; color: #7a907a; font-weight: 600; }
                .vsr-review-val { font-size: 0.82rem; color: #9c8f94; font-weight: 700; text-align: right; }

                .vsr-consent {
                    display: flex; align-items: flex-start; gap: 8px;
                    background: #fffbf0; border: 1px solid #ffe4a0; border-radius: 10px;
                    padding: 10px 12px; font-size: 0.72rem; color: #7a6030; font-weight: 600; line-height: 1.5;
                }

                /* FOOTER */
                .vsr-foot-divider {
                    display: flex; align-items: center; gap: 10px;
                    margin: 22px 0 12px; color: #a0b0a0; font-size: 0.72rem; font-weight: 600;
                }
                .vsr-foot-divider::before, .vsr-foot-divider::after { content: ''; flex: 1; height: 1px; background: #e4ece4; }

                .vsr-login-link {
                    display: block; text-align: center;
                    border: 1.5px solid #dce8dc; border-radius: 12px;
                    padding: 12px; color: #963d5c; font-weight: 800; font-size: 0.88rem;
                    text-decoration: none; background: #f5f8f5;
                    transition: all 0.25s ease;
                }
                .vsr-login-link:hover { background: #963d5c; color: white; border-color: #963d5c; transform: translateY(-1px); box-shadow: 0 6px 14px rgba(45,90,39,0.18); }

                .vsr-trust { display: flex; align-items: center; justify-content: center; gap: 7px; margin-top: 18px; flex-wrap: wrap; }
                .vsr-trust-item { display: flex; align-items: center; gap: 4px; color: #7a907a; font-size: 0.65rem; font-weight: 700; }
                .vsr-trust-dot { color: #c8d8c8; }

                /* ANIMATIONS */
                @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </main>
    );
};

const VsrField = ({ label, icon, name, type, placeholder, value, onChange, focused, setFocused, tick, ...rest }) => (
    <div className={`vsr-field ${focused === name ? 'vsr-field-active' : ''}`}>
        <label className="vsr-label">{label}</label>
        <div className="vsr-input-shell">
            <span className="vsr-icon">{icon}</span>
            <input
                type={type} name={name} className="vsr-input"
                placeholder={placeholder} value={value} onChange={onChange}
                onFocus={() => setFocused(name)} onBlur={() => setFocused('')}
                {...rest}
            />
            {tick && <CheckCircle size={14} className="vsr-tick" />}
        </div>
    </div>
);

const ReviewRow = ({ label, value }) => (
    <div className="vsr-review-row">
        <span className="vsr-review-lbl">{label}</span>
        <span className="vsr-review-val">{value}</span>
    </div>
);

export default CustomerRegister;