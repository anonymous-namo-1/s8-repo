import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import TemplateDetailPage from './pages/TemplateDetailPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import RefundPage from './pages/RefundPage';
import LoginPage from './pages/LoginPage';
import MyAssetsPage from './pages/MyAssetsPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import WhatsAppPaymentSuccessPage from './pages/WhatsAppPaymentSuccessPage';
import ComingSoonPage from './pages/ComingSoonPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workflows" element={<ProductsPage />} />
        <Route path="/products" element={<Navigate to="/workflows" replace />} />
        <Route path="/template/:slug" element={<TemplateDetailPage />} />
        <Route path="/3d-websites" element={<ComingSoonPage />} />
        <Route path="/notion" element={<ComingSoonPage />} />
        <Route path="/coming-soon/:category" element={<ComingSoonPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/my-assets" element={<MyAssetsPage />} />
        <Route path="/order/success/x7k9m2p4q8r1t5v3w6y0z-a3b7c1d9e5f2g8h4j6" element={<PaymentSuccessPage />} />
        <Route path="/order/success/w4h8a2t5s9p3p7m1n6b0k-q2r8e7y4u1i3o5p9a6s" element={<WhatsAppPaymentSuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
