import React, { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Check karein ki pehle se language save hai ya nahi
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (!savedLang) {
      setShowModal(true); // Agar pehli baar hai toh modal dikhao
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    setShowModal(false);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, showModal, setShowModal }}>
      {children}
    </LanguageContext.Provider>
  );
};