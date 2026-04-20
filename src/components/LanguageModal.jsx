import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

const LanguageModal = () => {
  const { showModal, changeLanguage } = useContext(LanguageContext);

  if (!showModal) return null;

  return (
    <div style={overlayStyle}>
      <div className="bg-white p-4 p-md-5 rounded shadow-lg text-center mx-3" style={{ maxWidth: "500px" }}>
        <h3 className="fw-bold mb-2">Welcome to VillageSathi</h3>
        <p className="text-muted mb-4">Please select your preferred language<br/>कृपया अपनी पसंदीदा भाषा चुनें</p>
        
        <div className="d-flex gap-3 justify-content-center">
          <button className="btn btn-outline-primary btn-lg px-4" onClick={() => changeLanguage("en")}>
            English
          </button>
          <button className="btn btn-primary btn-lg px-4" onClick={() => changeLanguage("hi")}>
            हिंदी
          </button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  backgroundColor: "rgba(0,0,0,0.85)", display: "flex",
  justifyContent: "center", alignItems: "center", zIndex: 10000
};

export default LanguageModal;