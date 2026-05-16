import React, { useState, useEffect } from "react";
import { User, Calendar, Eye, Trash2, MessageSquare, Search, Mail, Loader2, Inbox } from "lucide-react";
import Swal from 'sweetalert2';

function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const API_URL = `${import.meta.env.VITE_API_URL}/Contact/GetMessages`;

  const fetchMessages = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to sync inquiries ledger.',
        icon: 'error',
        confirmButtonColor: '#0f172a'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const viewMessage = (msg) => {
    Swal.fire({
      title: `<span style="color: #0f172a">${msg.subject}</span>`,
      html: `
        <div style="text-align: left; font-family: sans-serif;">
          <p style="font-size: 0.9rem; margin-bottom: 5px;"><strong>From:</strong> ${msg.name}</p>
          <p style="font-size: 0.85rem; color: #64748b;"><strong>Email:</strong> ${msg.email}</p>
          <p style="font-size: 0.85rem; color: #64748b;"><strong>Received:</strong> ${new Date(msg.createdDate).toLocaleString()}</p>
          <hr style="border-top: 1px solid #e2e8f0; margin: 15px 0;" />
          <p style="font-weight: 700; margin-bottom: 8px;">Message Detail:</p>
          <div style="padding: 15px; background: #f8fafc; border-radius: 10px; font-size: 0.95rem; line-height: 1.6; color: #334155;">
            ${msg.message}
          </div>
        </div>
      `,
      confirmButtonText: 'MARK AS READ',
      confirmButtonColor: '#0f172a',
      showCloseButton: true,
    });
  };

  // Search Logic
  const filteredMessages = messages.filter(msg => 
    msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <Loader2 className="animate-spin text-orange mb-2" size={40} style={{color: '#ea580c'}} />
        <span className="small fw-bold text-muted uppercase tracking-wider">Syncing Inquiries...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-md-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .msg-hero {
          background: #0f172a;
          border-radius: 20px;
          padding: 25px 30px;
          border-bottom: 4px solid #ea580c;
          margin-bottom: 30px;
        }
        .search-container-msg {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 8px 15px;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 350px;
          transition: 0.3s;
        }
        .search-container-msg:focus-within {
          background: white;
          border-color: #ea580c;
        }
        .search-container-msg input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 0.85rem;
          width: 100%;
          padding-left: 10px;
        }
        .search-container-msg:focus-within input { color: #0f172a; }
        
        .table-premium-msg thead th {
          background: #f8fafc;
          font-size: 0.65rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 1px;
          text-transform: uppercase;
          border: none;
          padding: 15px;
        }
        .table-premium-msg tbody td {
          padding: 12px 15px;
          font-size: 0.85rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .status-badge-soft {
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 800;
        }
        .action-btn-mini {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          transition: 0.2s;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
        }
        .action-btn-mini:hover {
          background: #0f172a;
          color: white;
          border-color: #0f172a;
          transform: translateY(-2px);
        }
        .btn-view-msg:hover { background: #ea580c !important; border-color: #ea580c !important; color: white !important;}
        .btn-delete-msg:hover { background: #f43f5e !important; border-color: #f43f5e !important; color: white !important;}
      `}</style>

      {/* Header Area */}
      <div className="msg-hero shadow-lg">
        <div className="row align-items-center g-3">
          <div className="col-md-7">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 rounded-4" style={{background: 'rgba(234, 88, 12, 0.1)'}}>
                <MessageSquare className="text-orange" size={28} style={{color: '#ea580c'}} />
              </div>
              <div>
                <h3 className="text-white fw-bold mb-0">User Inquiries</h3>
                <p className="text-white-50 small mb-0 fw-bold">Manage support tickets and contact requests</p>
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="d-flex justify-content-md-end">
              <div className="search-container-msg shadow-sm">
                <Search size={16} className={searchTerm ? "text-dark" : "text-white-50"} />
                <input 
                  type="text" 
                  placeholder="Search by sender or subject..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-premium-msg align-middle m-0">
            <thead>
              <tr>
                <th className="ps-4">SENDER INFO</th>
                <th>SUBJECT</th>
                <th>DATE RECEIVED</th>
                <th>STATUS</th>
                <th className="text-end pe-4">MANAGEMENT</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <tr key={msg.id} className={msg.status === 0 ? "bg-light bg-opacity-25" : ""}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <div className="bg-slate-100 p-2 rounded-3 me-3" style={{background: '#f1f5f9'}}>
                          <User size={18} className="text-dark" />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{msg.name}</div>
                          <div className="text-muted" style={{fontSize: '0.75rem'}}>{msg.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark text-truncate" style={{maxWidth: '200px'}}>{msg.subject}</div>
                    </td>
                    <td>
                      <div className="text-muted small fw-bold uppercase">
                        <Calendar size={12} className="me-1" />
                        {new Date(msg.createdDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td>
                      {msg.status === 0 ? (
                        <span className="status-badge-soft bg-warning-subtle text-warning">● New</span>
                      ) : (
                        <span className="status-badge-soft bg-success-subtle text-success">● Read</span>
                      )}
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <button 
                          className="action-btn-mini btn-view-msg shadow-sm"
                          onClick={() => viewMessage(msg)}
                          title="View Message"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="action-btn-mini btn-delete-msg shadow-sm" title="Delete Permanent">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="opacity-25 mb-3">
                        <Inbox size={60} className="mx-auto" />
                    </div>
                    <h6 className="text-muted fw-bold uppercase">No records found matching your search.</h6>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Compact Footer Stats */}
        <div className="p-3 bg-light border-top d-flex justify-content-between align-items-center px-4">
            <div className="small fw-bold text-muted uppercase tracking-widest">
                Showing {filteredMessages.length} of {messages.length} messages
            </div>
            <div className="d-flex gap-2">
                <span className="badge bg-warning-subtle text-warning rounded-pill px-3">
                    {messages.filter(m => m.status === 0).length} Unread
                </span>
            </div>
        </div>
      </div>
    </div>
  );
}

export default ContactMessages;