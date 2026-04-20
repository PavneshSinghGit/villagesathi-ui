import { useState } from "react";
import { 
  Mail, Phone, MapPin, Send, 
  Clock, HelpCircle, CheckCircle, AlertCircle 
} from "lucide-react"; 
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "../styles/userStyles.css";

function Contact() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    subject: "General Inquiry", 
    message: "" 
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      setTimeout(() => {
        setStatus({ 
          type: "success", 
          message: "✅ Dhanyawad! Hum jald hi sampark karenge." 
        });
        setForm({ name: "", email: "", subject: "General Inquiry", message: "" });
        setLoading(false);
      }, 1500);
    } catch (err) {
      setStatus({ 
        type: "error", 
        message: "❌ Error! Dobara koshish karein." 
      });
      setLoading(false);
    }
  };

  return (
    <div className="contact-page container py-4">
      <title>Contact Us  | VillageSathi</title>
      {/* --- HEADER SECTION (Compact) --- */}
      <div className="text-center mb-4 animate-fade-in">
        <h2 className="fw-bold text-success">Contact Us</h2>
        <p className="text-muted mb-0">VillageSathi team aapki madad ke liye hamesha taiyar hai.</p>
      </div>

      <div className="row g-4 align-items-stretch">
        {/* --- LEFT SIDE: CONTACT INFO (col-lg-5) --- */}
        <div className="col-lg-5">
          <div className="contact-info-card p-4 rounded-4 shadow-sm bg-success text-white h-100 d-flex flex-column justify-content-between">
            <div>
              <h4 className="mb-4 fw-bold">Contact Details</h4>
              
              <div className="info-item d-flex align-items-center mb-3">
                <div className="icon-box-white me-3"><Phone size={20} /></div>
                <div>
                  <p className="mb-0 small text-white-50">Call Us</p>
                  <h6 className="mb-0">+91 1800-888-0000</h6>
                </div>
              </div>

              <div className="info-item d-flex align-items-center mb-3">
                <div className="icon-box-white me-3"><Mail size={20} /></div>
                <div>
                  <p className="mb-0 small text-white-50">Email</p>
                  <h6 className="mb-0">help@villagesathi.com</h6>
                </div>
              </div>

              <div className="info-item d-flex align-items-center mb-3">
                <div className="icon-box-white me-3"><MapPin size={20} /></div>
                <div>
                  <p className="mb-0 small text-white-50">Office</p>
                  <h6 className="mb-0">Gomti Nagar, Lucknow, UP</h6>
                </div>
              </div>

              <div className="info-item d-flex align-items-center mb-3">
                <div className="icon-box-white me-3"><Clock size={20} /></div>
                <div>
                  <p className="mb-0 small text-white-50">Working Hours</p>
                  <h6 className="mb-0">Mon - Sat: 10 AM - 6 PM</h6>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-top border-white border-opacity-25">
              <div className="d-flex gap-3">
                <a href="#" className="text-white"><FaFacebook size={20} /></a>
                <a href="#" className="text-white"><FaTwitter size={20} /></a>
                <a href="#" className="text-white"><FaInstagram size={20} /></a>
                <a href="#" className="text-white"><FaLinkedin size={20} /></a>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM (col-lg-7) --- */}
        <div className="col-lg-7">
          <div className="contact-form-card card p-4 shadow-sm border-0 rounded-4 h-100">
            {status.message && (
              <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} py-2 mb-3 small`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6 mb-2">
                  <label className="form-label small fw-bold">Pura Naam</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control bg-light border-0"
                    placeholder="Rahul Kumar"
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label small fw-bold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control bg-light border-0"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Vishay (Subject)</label>
                <select 
                  name="subject" 
                  value={form.subject} 
                  onChange={handleChange}
                  className="form-select bg-light border-0"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Scheme Help">Sarkari Yojana Help</option>
                  <option value="Electricity Issue">Bijli Shikayat</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="form-control bg-light border-0"
                  rows="3"
                  placeholder="Humein batayein..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-success w-100 py-2 fw-bold rounded-pill" 
                disabled={loading}
              >
                {loading ? 'Sending...' : <><Send size={18} className="me-2"/> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
        {/* --- EXTRA SECTION: FAQ LINK --- */}
      <div className="mt-5 text-center p-5 bg-light rounded-4 border">
        <HelpCircle size={40} className="text-success mb-3" />
        <h4 className="fw-bold">Turant Madad Chahiye?</h4>
        <p className="text-muted">Hamare Frequently Asked Questions (FAQ) section ko check karein.</p>
        <button className="btn btn-outline-success rounded-pill px-4">Visit FAQ Center</button>
      </div>   
    </div>    
  );
}

export default Contact;