import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// 1. Third-party CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. Base/Global CSS
import './index.css';
import './styles/global.css';

// 3. Component Styles
import "./styles/navbar.css";
import "./styles/userStyles.css";
import "./styles/blogStyles.css";
import "./styles/marketplace.css";
import "./styles/marketBusiness.css";

// 4. Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);