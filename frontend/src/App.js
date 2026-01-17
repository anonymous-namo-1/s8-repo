import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import TemplateDetailPage from './pages/TemplateDetailPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import RefundPage from './pages/RefundPage';
import LoginPage from './pages/LoginPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import WhatsAppPaymentSuccessPage from './pages/WhatsAppPaymentSuccessPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/template/:slug" element={<TemplateDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/order/success/x7k9m2p4q8r1t5v3w6y0z-a3b7c1d9e5f2g8h4j6" element={<PaymentSuccessPage />} />
        <Route path="/order/success/w4h8a2t5s9p3p7m1n6b0k-q2r8e7y4u1i3o5p9a6s" element={<WhatsAppPaymentSuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
