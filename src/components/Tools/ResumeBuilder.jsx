import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Download, GripVertical, CheckSquare, Square,
  User, Image as ImageIcon, Mail, Phone, Briefcase, Settings, Plus, Trash2,Link2,Link
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const INITIAL_SECTIONS = [
  { id: 'sec-1', name: 'Objective', visible: true, isOpen: false, type: 'text', content: 'I am a .NET Developer with 3+ years experience.' },
  { id: 'sec-2', name: 'Education', visible: true, isOpen: false, type: 'list', items: [{ id: 'ed-1', title: 'High School', sub: '2014-2015', desc: 'School Name' }] },
  { id: 'sec-3', name: 'Work experience', visible: true, isOpen: false, type: 'list', items: [{ id: 'ex-1', title: 'Software Engineer', sub: '2023-2025', desc: 'Backend development' }] },
  { id: 'sec-4', name: 'Activities', visible: true, isOpen: false, type: 'text', content: 'Coding competitions' },
  { id: 'sec-5', name: 'Skills', visible: true, isOpen: false, type: 'text', content: 'C#, .NET, SQL' },
  { id: 'sec-6', name: 'References', visible: true, isOpen: false, type: 'text', content: 'Available on request' },
  { id: 'sec-7', name: 'Additional information', visible: false, isOpen: false, type: 'text', content: '' },
  { id: 'sec-8', name: 'Interests', visible: true, isOpen: false, type: 'text', content: 'Reading, Coding' },
  { id: 'sec-9', name: 'Certifications', visible: false, isOpen: false, type: 'list', items: [] },
  { id: 'sec-10', name: 'Honors & Awards', visible: false, isOpen: false, type: 'list', items: [] },
];

export default function ResumeBuilder() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [profileImg, setProfileImg] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    name: 'PAVNESH SINGH',
    role: 'Dot Net Developer',
    email: 'pavnesh@gmail.com',
    phone: '9999999999',
    link: 'linkedin.com/in/pavnesh',
    link2: 'github.com/pavnesh',
  });

  const resumeRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImg(URL.createObjectURL(file));
  };

  const addNewItem = (sectionId) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        const newItem = { id: `item-${Date.now()}`, title: 'New Entry', sub: 'Date/Year', desc: 'Details here' };
        return { ...sec, items: [...(sec.items || []), newItem], isOpen: true };
      }
      return sec;
    }));
  };

  const removeItem = (sectionId, itemId) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, items: (sec.items || []).filter(item => item.id !== itemId) };
      }
      return sec;
    }));
  };

  const updateItem = (sectionId, itemId, field, value) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          items: sec.items.map(item => item.id === itemId ? { ...item, [field]: value } : item)
        };
      }
      return sec;
    }));
  };

  const toggleVisibility = (id) => {
    setSections(sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const toggleAccordion = (id) => {
    setSections(sections.map(s => s.id === id ? { ...s, isOpen: !s.isOpen } : { ...s, isOpen: false }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setSections(items);
  };

  const generatePDF = async () => {
    const canvas = await html2canvas(resumeRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`${personalInfo.name}_Resume.pdf`);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 p-0 overflow-hidden">
      {/* NAVBAR */}
      <nav className="navbar navbar-dark bg-dark shadow px-4 py-2 sticky-top">
        <span className="navbar-brand fw-bold d-flex align-items-center gap-2 m-0">
          <Briefcase size={22} className="text-primary"/> Resume Builder
        </span>
        <button onClick={generatePDF} className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3 shadow">
          <Download size={16} /> DOWNLOAD PDF
        </button>
      </nav>

      <div className="row g-0">
        {/* LEFT PANEL: CONTROLS (WITH DRAG & DROP) */}
        <div className="col-md-4 col-lg-3 border-end bg-white" style={{ height: 'calc(100vh - 52px)', overflowY: 'auto' }}>
          <div className="p-3">
            <h6 className="text-primary fw-bold mb-3 d-flex align-items-center gap-2 small uppercase">
              <Settings size={14} /> Sections Manager
            </h6>

            {/* Static Personal Info Card */}
            <div className="card border-0 bg-light mb-4 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="bg-secondary rounded shadow-sm d-flex align-items-center justify-content-center overflow-hidden" style={{ width: '50px', height: '50px' }}>
                    {profileImg ? <img src={profileImg} className="w-100 h-100 object-fit-cover" alt="p" /> : <ImageIcon size={18} className="text-white" />}
                  </div>
                  <input type="file" onChange={handleImageChange} className="form-control form-control-sm" />
                </div>
                <input className="form-control form-control-sm mb-2" placeholder="Name" value={personalInfo.name} onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })} />
                <input className="form-control form-control-sm mb-2" placeholder="Role" value={personalInfo.role} onChange={(e) => setPersonalInfo({ ...personalInfo, role: e.target.value })} />
                <div className="row g-2">
                    <div className="col-6"><input className="form-control form-control-sm" placeholder="Email" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} /></div>
                    <div className="col-6"><input className="form-control form-control-sm" placeholder="Phone" value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} /></div>
                    <div className="col-6"><input className="form-control form-control-sm" placeholder="LinkedIn" value={personalInfo.link} onChange={(e) => setPersonalInfo({ ...personalInfo, link: e.target.value })} /><button className="btn btn-danger btn-sm" onClick={() => setPersonalInfo({ ...personalInfo, link: '' })}>Delete</button></div>
                    <div className="col-6"><input className="form-control form-control-sm" placeholder="Github" value={personalInfo.link2} onChange={(e) => setPersonalInfo({ ...personalInfo, link2: e.target.value })} /><button className="btn btn-danger btn-sm" onClick={() => setPersonalInfo({ ...personalInfo, link2: '' })}>Delete</button></div>
                </div>
              </div>
            </div>

            {/* Draggable Sections List */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections-list">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="d-flex flex-column gap-2">
                    {sections.map((sec, index) => (
                      <Draggable key={sec.id} draggableId={sec.id} index={index}>
                        {(dragProvided) => (
                          <div 
                            ref={dragProvided.innerRef} 
                            {...dragProvided.draggableProps} 
                            className="card border shadow-sm"
                          >
                            <div className={`card-header d-flex align-items-center justify-content-between py-2 px-3 border-0 ${sec.visible ? 'bg-white' : 'bg-light'}`}>
                              <div className="d-flex align-items-center gap-2">
                                {/* Grip Handle for Reordering */}
                                <div {...dragProvided.dragHandleProps} className="text-muted cursor-move">
                                  <GripVertical size={16} />
                                </div>
                                <div onClick={() => toggleVisibility(sec.id)} className="cursor-pointer">
                                  {sec.visible ? <CheckSquare size={18} className="text-success" /> : <Square size={18} className="text-muted" />}
                                </div>
                                <span className={`small fw-bold ${sec.visible ? 'text-dark' : 'text-muted'}`}>{sec.name}</span>
                              </div>
                              <button onClick={() => toggleAccordion(sec.id)} className="btn btn-sm btn-link text-primary text-decoration-none p-0 fw-bold" style={{fontSize: '11px'}}>
                                {sec.isOpen ? 'CLOSE' : 'EDIT'}
                              </button>
                            </div>

                            {sec.isOpen && (
                              <div className="card-body bg-light border-top p-3">
                                {sec.type === 'text' ? (
                                  <textarea className="form-control form-control-sm" rows="3" value={sec.content} onChange={(e) => {
                                    const ns = [...sections]; ns[index].content = e.target.value; setSections(ns);
                                  }} />
                                ) : (
                                  <div className="d-flex flex-column gap-2">
                                    {(sec.items || []).map((item) => (
                                      <div key={item.id} className="bg-white p-2 border rounded shadow-sm position-relative">
                                        <button onClick={() => removeItem(sec.id, item.id)} className="btn btn-link text-danger p-0 position-absolute end-0 top-0 mt-1 me-2">
                                          <Trash2 size={14} />
                                        </button>
                                        <input className="form-control form-control-sm mb-1 fw-bold border-0 border-bottom rounded-0 px-0" placeholder="Title" value={item.title} onChange={(e) => updateItem(sec.id, item.id, 'title', e.target.value)} />
                                        <input className="form-control form-control-sm mb-1 text-muted border-0 border-bottom rounded-0 px-0" placeholder="Year/Date" value={item.sub} onChange={(e) => updateItem(sec.id, item.id, 'sub', e.target.value)} />
                                        <textarea className="form-control form-control-sm border-0 px-0" placeholder="Details" rows="2" value={item.desc} onChange={(e) => updateItem(sec.id, item.id, 'desc', e.target.value)} />
                                      </div>
                                    ))}
                                    <button onClick={() => addNewItem(sec.id)} className="btn btn-sm btn-outline-primary border-dashed w-100 d-flex align-items-center justify-content-center gap-1">
                                      <Plus size={14} /> Add {sec.name}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        {/* RIGHT PANEL: PREVIEW */}
        <div className="col-md-8 col-lg-9 bg-secondary bg-opacity-10 d-flex justify-content-center p-4 overflow-auto" style={{ height: 'calc(100vh - 52px)' }}>
          <div ref={resumeRef} className="bg-white shadow-lg p-5" style={{ width: '210mm', minHeight: '297mm', height: 'fit-content' }}>
            
            <div className="d-flex justify-content-between align-items-center border-bottom border-primary border-4 pb-4 mb-4">
              <div>
                <h1 className="fw-bold text-dark m-0" style={{fontSize: '36px'}}>{personalInfo.name}</h1>
                <h5 className="text-primary fw-bold text-uppercase mt-1">{personalInfo.role}</h5>
                <div className="d-flex gap-3 text-muted mt-2 small">
                  <span><Mail size={12} className="text-primary"/> {personalInfo.email}</span>
                  <span><Phone size={12} className="text-primary"/> {personalInfo.phone}</span>
                  <span><Link size={12} className="text-primary"/> {personalInfo.link}</span>
                  <span><Link2 size={12} className="text-primary"/> {personalInfo.link2}</span>
                </div>
              </div>
              {profileImg && <img src={profileImg} className="rounded border border-3 border-white shadow" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />}
            </div>

            {sections.filter(s => s.visible).map(sec => (
              <div key={sec.id} className="mb-4">
                <h6 className="fw-bold text-uppercase border-bottom pb-1 mb-2 text-primary">{sec.name}</h6>
                {sec.type === 'text' ? (
                  <p className="m-0 text-dark" style={{ whiteSpace: 'pre-line', fontSize: '14px' }}>{sec.content}</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {(sec.items || []).map((item) => (
                      <div key={item.id}>
                        <div className="d-flex justify-content-between align-items-baseline">
                          <strong className="text-dark" style={{fontSize: '15px'}}>{item.title}</strong>
                          <span className="text-muted fw-bold" style={{fontSize: '12px'}}>{item.sub}</span>
                        </div>
                        <p className="text-dark m-0 mt-1" style={{ fontSize: '13px' }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}