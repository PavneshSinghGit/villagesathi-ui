import React, { useState } from "react";
import axios from "axios";
import { 
  Mail, Phone, MapPin, Send, 
  Clock, HelpCircle, AlertCircle 
} from "lucide-react"; 
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import Swal from 'sweetalert2';
import "../styles/userStyles.css";

const SUBJECT_OPTIONS = [
  { value: "General Inquiry", label: "General Inquiry" },
  { value: "Scheme Help", label: "Government Scheme Assistance" },
  { value: "Electricity Issue", label: "Electricity Complaint" },
  { value: "Feedback", label: "Feedback & Suggestions" }
];

function Contact() {
  const API_URL = `${import.meta.env.VITE_API_URL}/Contact/AddMessage`;

  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    subject: "General Inquiry", 
    message: "" 
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Backend ki exact demand (Schema) ke hisaab se data taiyar karein
  const payload = {
    Name: form.name,
    Email: form.email,
    Subject: form.subject,
    Message: form.message,
    IPAddress: "127.0.0.1", // Aap isse empty string "" bhi bhej sakte ho agar null allowed hai
    UserAgent: navigator.userAgent
  };

  try {
    const response = await axios.post(API_URL, payload);

    if (response.status === 200 || response.status === 201) {
      Swal.fire({
        title: 'Message Sent!',
        text: 'Thank you for reaching out. The VillageSathi team will contact you shortly.',
        icon: 'success',
        confirmButtonColor: '#198754',
        timer: 4000
      });

      setForm({ name: "", email: "", subject: "General Inquiry", message: "" });
    }
  } catch (err) {
    // Console mein dekho ki backend exact kya error de raha hai
    console.error("Submission Error Details:", err.response?.data);
    
    Swal.fire({
      title: 'Submission Failed',
      text: err.response?.data?.title || 'Something went wrong. Please check your details.',
      icon: 'error',
      confirmButtonColor: '#d33'
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="contact-page container py-5">
      <Helmet>
        <title>Contact Us | VillageSathi - Your Rural Companion</title>
        <meta name="description" content="Have questions about government schemes or rural development? Contact the VillageSathi team for assistance." />
      </Helmet>

      {/* --- HEADER --- */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-success display-5">Get In Touch</h2>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Have questions about government schemes or rural development? 
          The VillageSathi team is here to help you.
        </p>
      </div>

      <div className="row g-4">
        {/* --- LEFT SIDE: INFO --- */}
        <div className="col-lg-5">
          <div className="p-4 p-md-5 rounded-4 shadow bg-success text-white h-100 d-flex flex-column justify-content-between">
            <div>
              <h4 className="mb-4 fw-bold border-bottom border-white border-opacity-25 pb-3">Contact Information</h4>
              
              <div className="d-flex align-items-center mb-4">
                <div className="bg-white text-success p-3 rounded-circle me-3 shadow-sm"><Phone size={20} /></div>
                <div>
                  <p className="mb-0 small text-white-50">Phone Number</p>
                  <h6 className="mb-0 fw-bold">+91 9305492516</h6>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <div className="bg-white text-success p-3 rounded-circle me-3 shadow-sm"><Mail size={20} /></div>
                <div>
                  <p className="mb-0 small text-white-50">Email Address</p>
                  <h6 className="mb-0 fw-bold">pavneshsinghlmp@gmail.com</h6>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <div className="bg-white text-success p-3 rounded-circle me-3 shadow-sm"><MapPin size={20} /></div>
                <div>
                  <p className="mb-0 small text-white-50">Main Office</p>
                  <h6 className="mb-0 fw-bold">Main Market, Kakaraha, Mitauli, Kheri (U.P.)</h6>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <div className="bg-white text-success p-3 rounded-circle me-3 shadow-sm"><Clock size={20} /></div>
                <div>
                  <p className="mb-0 small text-white-50">Office Hours</p>
                  <h6 className="mb-0 fw-bold">Mon - Sat: 10:00 AM - 06:00 PM</h6>
                </div>
              </div>
            </div>
            
            <div className="mt-5 pt-4 border-top border-white border-opacity-25 d-flex gap-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="text-white bg-white bg-opacity-10 p-2 rounded-3 hover-lift transition-all">
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="col-lg-7">
          <div className="card p-4 p-md-5 shadow-lg border-0 rounded-4 h-100">
            <h4 className="fw-bold mb-4">Send us a Message</h4>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label small fw-bold text-secondary">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control form-control-lg bg-light border-0 focus-ring-success"
                    placeholder="Pavnesh Singh"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label small fw-bold text-secondary">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control form-control-lg bg-light border-0 focus-ring-success"
                    placeholder="pavneshsinghlmp@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="mt-3">
                <label htmlFor="subject" className="form-label small fw-bold text-secondary">Inquiry Subject</label>
                <select 
                  id="subject"
                  name="subject" 
                  value={form.subject} 
                  onChange={handleChange}
                  className="form-select form-select-lg bg-light border-0 focus-ring-success"
                >
                  {SUBJECT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="mt-3 mb-4">
                <label htmlFor="message" className="form-label small fw-bold text-secondary">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="form-control bg-light border-0 focus-ring-success"
                  rows="5"
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-success btn-lg w-100 py-3 fw-bold rounded-pill shadow-sm transition-all hover-grow" 
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  <><Send size={18} className="me-2 mb-1"/> Submit Inquiry</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- FAQ SECTION --- */}
      <div className="mt-5 text-center p-5 bg-white rounded-4 shadow-sm border-0 position-relative overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-1 border-top border-success border-3"></div>
        <HelpCircle size={40} className="text-success mb-3" />
        <h4 className="fw-bold">Need Immediate Help?</h4>
        <p className="text-muted">Browse our community-driven guides and frequently asked questions.</p>
        <button className="btn btn-outline-success rounded-pill px-5 fw-bold mt-2">Visit Help Center</button>
      </div>

      <style>{`
        .hover-lift { transition: transform 0.2s; }
        .hover-lift:hover { transform: translateY(-3px); }
        .hover-grow:hover { transform: scale(1.02); }
        .focus-ring-success:focus {
          box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.1);
          background-color: #fff !important;
          border: 1px solid #198754 !important;
        }
        .contact-page .form-control, .contact-page .form-select {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default Contact;