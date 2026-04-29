import React, { useState, useEffect } from "react";
import { Mail, User, Calendar, Eye, Trash2, MessageSquare } from "lucide-react";
import Swal from 'sweetalert2';

function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = `${import.meta.env.VITE_API_URL}/Contact/GetMessages`;

  // 1. Data Fetch karna
  const fetchMessages = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Messages load nahi ho paye!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 2. Message Detail Show karna (SweetAlert Popup)
  const viewMessage = (msg) => {
    Swal.fire({
      title: `<span class="text-success">${msg.subject}</span>`,
      html: `
        <div class="text-start">
          <p><strong>From:</strong> ${msg.name} (${msg.email})</p>
          <p><strong>Date:</strong> ${new Date(msg.createdDate).toLocaleString()}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <div class="p-3 bg-light rounded">${msg.message}</div>
        </div>
      `,
      confirmButtonText: 'Close',
      confirmButtonColor: '#198754'
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="admin-messages-page container-fluid py-4">
      <div className="d-flex align-items-center mb-4">
        <MessageSquare className="text-success me-2" size={32} />
        <h2 className="fw-bold mb-0">User Inquiry Messages</h2>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Sender</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <tr key={msg.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          <div className="bg-success-subtle text-success p-2 rounded-circle me-3">
                            <User size={18} />
                          </div>
                          <div>
                            <div className="fw-bold">{msg.name}</div>
                            <div className="small text-muted">{msg.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-info-subtle text-info rounded-pill px-3">
                          {msg.subject}
                        </span>
                      </td>
                      <td>
                        <div className="small">
                          <Calendar size={14} className="me-1" />
                          {new Date(msg.createdDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        {msg.status === 0 ? (
                          <span className="badge bg-warning text-dark">New</span>
                        ) : (
                          <span className="badge bg-success">Read</span>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <button 
                          className="btn btn-sm btn-outline-success me-2 rounded-pill"
                          onClick={() => viewMessage(msg)}
                        >
                          <Eye size={16} className="me-1" /> View
                        </button>
                        <button className="btn btn-sm btn-outline-danger rounded-pill">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactMessages;