import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import {
    Rocket, User, Phone, Lock, ShieldCheck,
    Store, ListTree, MapPin, ChevronLeft, Loader2,
} from 'lucide-react';

/* ─── Brand Tokens — keep in sync with Dashboard & ManageProfile ─────── */
const BRAND = {
    heroStart:   '#3D0030',
    heroMid:     '#6B0F4A',
    heroEnd:     '#8C1560',
    gold:        '#D4A017',
    goldLight:   '#F5D76E',
    purple:      '#7C3AED',
    purpleLight: '#EDE9FF',
    purpleSoft:  '#F5F0FF',
    success:     '#16A34A',
    danger:      '#DC2626',
};

const MerchantRegister = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [roles, setRoles]           = useState([]);
    const [loading, setLoading]       = useState(false);

    const [formData, setFormData] = useState({
        name:        '',
        mobileNo:    '',
        password:    '',
        villageId:   1,
        roleId:      '',
        shopName:    '',
        categoryId:  '',
        shopAddress: '',
    });

    useEffect(() => {
        (async () => {
            try {
                const [roleRes, catRes] = await Promise.all([
                    axiosInstance.get('/Auth/get-roles'),
                    axiosInstance.get('/Categories/GetAll'),
                ]);
                setRoles(roleRes.data);
                const cats = catRes.data?.Data || catRes.data || [];
                setCategories(cats);
                if (cats.length > 0)
                    setFormData(p => ({ ...p, categoryId: cats[0].categoryID }));
            } catch (err) {
                console.error('Error fetching initial data', err);
            }
        })();
    }, []);

    const handleChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axiosInstance.post('/Auth/register', formData);
            if (res.data.success || res.data.Success) {
                toast.success('Registration Successful! Welcome Merchant.');
                navigate('/merchant-login');
            } else {
                toast.error(res.data.message || 'Registration failed.');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const isBusiness = Number(formData.roleId) === 2;

    /* ═══════════════════════════ RENDER ════════════════════════════════ */
    return (
        <div style={{ background: BRAND.purpleSoft, minHeight: '100vh', fontFamily: 'system-ui,sans-serif' }}>

            {/* ══ Global CSS ══════════════════════════════════════════════ */}
            <style>{`
                @keyframes spin    { to { transform: rotate(360deg); } }
                @keyframes fadeIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }

                /* Back button */
                .mr-back {
                    background: transparent;
                    border: 2px solid rgba(212,160,23,.4);
                    color: ${BRAND.purple};
                    border-radius: 50px;
                    padding: 6px 15px;
                    font-size: .72rem; font-weight: 800;
                    letter-spacing: .06em; text-transform: uppercase;
                    cursor: pointer;
                    display: inline-flex; align-items: center; gap: 5px;
                    transition: all .2s; margin-bottom: 18px;
                    text-decoration: none;
                }
                .mr-back:hover {
                    background: ${BRAND.gold}; color: #1a0011;
                    border-color: ${BRAND.gold};
                }

                /* Card */
                .mr-card {
                    background: #fff;
                    border-radius: 22px;
                    border: 1px solid ${BRAND.purpleLight};
                    box-shadow: 0 20px 40px rgba(124,58,237,.10);
                    overflow: hidden;
                }

                /* Section label */
                .mr-section {
                    font-size: .62rem; font-weight: 800;
                    letter-spacing: .13em; text-transform: uppercase;
                    color: ${BRAND.purple};
                    display: flex; align-items: center; gap: 10px;
                    margin-bottom: 16px;
                }
                .mr-section::after {
                    content: ""; height: 1px; flex-grow: 1;
                    background: ${BRAND.purpleLight};
                }

                /* Input label */
                .mr-label {
                    font-size: .62rem; font-weight: 800;
                    letter-spacing: .1em; text-transform: uppercase;
                    color: #64748b; margin-bottom: 5px;
                }

                /* Input wrapper */
                .mr-field-wrap {
                    position: relative; margin-bottom: 14px;
                }
                .mr-field-wrap .mr-icon {
                    position: absolute; left: 13px; top: 50%;
                    transform: translateY(-50%);
                    color: ${BRAND.purple}; pointer-events: none;
                    display: flex; align-items: center;
                }
                /* For textarea, icon sits at top */
                .mr-field-wrap.textarea-wrap .mr-icon {
                    top: 14px; transform: none;
                }

                /* Input / Select / Textarea */
                .mr-input {
                    width: 100%;
                    padding: 10px 14px 10px 40px;
                    background: ${BRAND.purpleSoft};
                    border: 1.5px solid #DDD6FE;
                    border-radius: 12px;
                    font-size: .87rem; font-weight: 600;
                    color: #1e1b4b;
                    outline: none;
                    transition: border-color .2s, box-shadow .2s, background .2s;
                    box-sizing: border-box;
                    appearance: auto;
                    -webkit-appearance: auto;
                }
                .mr-input::placeholder { color: #a78bfa; font-weight: 500; }
                .mr-input:focus {
                    border-color: ${BRAND.purple};
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(124,58,237,.08);
                }

                textarea.mr-input {
                    padding-top: 12px;
                    resize: vertical;
                    min-height: 80px;
                }

                /* Shop info box */
                .mr-shop-box {
                    background: linear-gradient(135deg,${BRAND.purpleSoft},#FDF4DC22);
                    border: 1.5px solid ${BRAND.purpleLight};
                    border-left: 4px solid ${BRAND.gold};
                    border-radius: 16px;
                    padding: 20px;
                    margin-top: 20px;
                    animation: fadeIn .3s ease;
                }
                .mr-shop-section {
                    font-size: .62rem; font-weight: 800;
                    letter-spacing: .13em; text-transform: uppercase;
                    color: ${BRAND.gold};
                    display: flex; align-items: center; gap: 10px;
                    margin-bottom: 16px;
                }
                .mr-shop-section::after {
                    content:""; height:1px; flex-grow:1;
                    background: rgba(212,160,23,.25);
                }

                /* Submit button */
                .mr-submit {
                    background: linear-gradient(135deg,${BRAND.heroStart},${BRAND.heroEnd});
                    color: #fff;
                    border: none; border-radius: 14px;
                    padding: 14px 20px;
                    font-weight: 800; font-size: .85rem;
                    letter-spacing: .07em; text-transform: uppercase;
                    width: 100%; margin-top: 22px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 9px;
                    transition: transform .2s, filter .2s, box-shadow .2s;
                    box-shadow: 0 6px 20px rgba(61,0,48,.25);
                    position: relative; overflow: hidden;
                }
                .mr-submit::after {
                    content:"";
                    position:absolute; bottom:0; left:0; right:0; height:3px;
                    background: ${BRAND.gold};
                }
                .mr-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    filter: brightness(1.1);
                    box-shadow: 0 10px 28px rgba(61,0,48,.3);
                }
                .mr-submit:disabled { opacity:.7; cursor:not-allowed; }

                /* Fields grid */
                .mr-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 0 16px;
                }

                /* ── Responsive ── */
                @media (min-width: 540px) {
                    .mr-grid { grid-template-columns: 1fr 1fr; }
                    .mr-col-full { grid-column: 1 / -1; }
                }
            `}</style>

            <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(16px,4vw,32px) clamp(14px,4vw,24px)' }}>

                {/* Back button */}
                <button className="mr-back" onClick={() => navigate('/merchant-login')}>
                    <ChevronLeft size={14} /> Back to Login
                </button>

                <div className="mr-card">

                    {/* ── Hero Header ─────────────────────────────────── */}
                    <div style={{
                        background: `linear-gradient(135deg,${BRAND.heroStart} 0%,${BRAND.heroMid} 55%,${BRAND.heroEnd} 100%)`,
                        padding: 'clamp(24px,5vw,36px) 24px',
                        textAlign: 'center',
                        borderBottom: `4px solid ${BRAND.gold}`,
                        position: 'relative', overflow: 'hidden',
                    }}>
                        {/* Decorative rings */}
                        {[180, 270].map((sz, i) => (
                            <div key={i} style={{
                                position:'absolute', top:-sz*.4, right:-sz*.35,
                                width:sz, height:sz, borderRadius:'50%',
                                border:`1.5px solid rgba(212,160,23,${i===0?.12:.06})`,
                                pointerEvents:'none',
                            }}/>
                        ))}

                        {/* Rocket icon circle */}
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%',
                            background: 'rgba(212,160,23,.15)',
                            border: `2px solid rgba(212,160,23,.3)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 14px',
                        }}>
                            <Rocket size={30} style={{ color: BRAND.gold }} />
                        </div>

                        <h4 style={{ color: '#fff', fontWeight: 900, margin: '0 0 6px',
                                     fontSize: 'clamp(1.1rem,3vw,1.35rem)', letterSpacing: '.02em' }}>
                            Merchant{' '}
                            <span style={{
                                background: `linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                Registration
                            </span>
                        </h4>
                        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.8rem',
                                    fontWeight: 600, margin: 0 }}>
                            Scale your village store with Sathi Market
                        </p>
                    </div>

                    {/* ── Form Body ───────────────────────────────────── */}
                    <div style={{ padding: 'clamp(20px,5vw,36px) clamp(18px,5vw,36px)' }}>
                        <form onSubmit={handleRegister}>

                            {/* ── Section: Account Credentials ── */}
                            <div className="mr-section">Account Credentials</div>

                            <div className="mr-grid">

                                {/* Owner Name */}
                                <div>
                                    <div className="mr-label">Owner Name</div>
                                    <div className="mr-field-wrap">
                                        <span className="mr-icon"><User size={16}/></span>
                                        <input
                                            type="text" name="name" className="mr-input"
                                            placeholder="Full name" required
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Mobile */}
                                <div>
                                    <div className="mr-label">Mobile Number</div>
                                    <div className="mr-field-wrap">
                                        <span className="mr-icon"><Phone size={16}/></span>
                                        <input
                                            type="text" name="mobileNo" className="mr-input"
                                            placeholder="10-digit number" maxLength="10" required
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="mr-label">Password</div>
                                    <div className="mr-field-wrap">
                                        <span className="mr-icon"><Lock size={16}/></span>
                                        <input
                                            type="password" name="password" className="mr-input"
                                            placeholder="Secure password" required
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Role */}
                                <div>
                                    <div className="mr-label">Account Type</div>
                                    <div className="mr-field-wrap">
                                        <span className="mr-icon"><ShieldCheck size={16}/></span>
                                        <select
                                            name="roleId" className="mr-input" required
                                            onChange={handleChange}
                                        >
                                            <option value="">Choose Role</option>
                                            {roles.map(role => (
                                                <option key={role.id} value={role.id}>{role.roleName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                            </div>{/* /mr-grid */}

                            {/* ── Shop Info (conditional) ── */}
                            {isBusiness && (
                                <div className="mr-shop-box">
                                    <div className="mr-shop-section">Shop Information</div>

                                    <div className="mr-grid">

                                        {/* Shop Name */}
                                        <div>
                                            <div className="mr-label">Shop Name</div>
                                            <div className="mr-field-wrap">
                                                <span className="mr-icon"><Store size={16}/></span>
                                                <input
                                                    type="text" name="shopName" className="mr-input"
                                                    placeholder="e.g. Sathi Grocery Store" required
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <div className="mr-label">Category</div>
                                            <div className="mr-field-wrap">
                                                <span className="mr-icon"><ListTree size={16}/></span>
                                                <select
                                                    name="categoryId" className="mr-input" required
                                                    onChange={handleChange} value={formData.categoryId}
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.categoryID} value={cat.categoryID}>
                                                            {cat.categoryName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Address — full width */}
                                        <div className="mr-col-full">
                                            <div className="mr-label">Physical Address</div>
                                            <div className="mr-field-wrap textarea-wrap">
                                                <span className="mr-icon"><MapPin size={16}/></span>
                                                <textarea
                                                    name="shopAddress" className="mr-input"
                                                    placeholder="Full shop location…" required
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* Submit */}
                            <button className="mr-submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 size={18} style={{ animation:'spin 1s linear infinite' }}/>
                                        Processing…
                                    </>
                                ) : (
                                    <>
                                        <Rocket size={17}/>
                                        Register Merchant Account
                                    </>
                                )}
                            </button>

                        </form>

                        {/* Footer link */}
                        <div style={{
                            textAlign: 'center', marginTop: 22,
                            paddingTop: 18, borderTop: `1px solid ${BRAND.purpleLight}`,
                        }}>
                            <p style={{ color: '#94a3b8', fontSize: '.82rem', margin: 0 }}>
                                Already registered?{' '}
                                <Link to="/merchant-login" style={{
                                    fontWeight: 800, color: BRAND.purple,
                                    textDecoration: 'none',
                                }}>
                                    Login Now
                                </Link>
                            </p>
                        </div>
                    </div>

                </div>{/* /mr-card */}
            </div>
        </div>
    );
};

export default MerchantRegister;