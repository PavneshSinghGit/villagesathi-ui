import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 1. Third-party CSS (Bootstrap sabse pehle taaki hamari CSS ise override kar sake)
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. Base/Global CSS
import './index.css';
import './styles/global.css';

// 3. Component Specific Styles
import "./styles/navbar.css";
import "./styles/userStyles.css";
import "./styles/blogStyles.css";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)