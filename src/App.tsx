import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CategoriesPage from './pages/CategoriesPage';
import DealsPage from './pages/DealsPage';
import SupportPage from './pages/SupportPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentErrorPage from './pages/PaymentErrorPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminModels from './pages/admin/AdminModels';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSearchAnalytics from './pages/admin/AdminSearchAnalytics';
import AdminChangelog from './pages/admin/AdminChangelog';
import ModelsPage from './pages/models/ModelsPage';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AdminProvider>
          <Router>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route index element={
                        <ProtectedRoute requiredPermission="analytics.read">
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="products" element={
                        <ProtectedRoute requiredPermission="products.read">
                          <AdminProducts />
                        </ProtectedRoute>
                      } />
                      <Route path="users" element={
                        <ProtectedRoute requiredPermission="users.read">
                          <AdminUsers />
                        </ProtectedRoute>
                      } />
                      <Route path="orders" element={
                        <ProtectedRoute requiredPermission="orders.read">
                          <AdminOrders />
                        </ProtectedRoute>
                      } />
                      <Route path="analytics" element={
                        <ProtectedRoute requiredPermission="analytics.read">
                          <AdminAnalytics />
                        </ProtectedRoute>
                      } />
                      <Route path="search-analytics" element={
                        <ProtectedRoute requiredPermission="analytics.read">
                          <AdminSearchAnalytics />
                        </ProtectedRoute>
                      } />
                      <Route path="changelog" element={
                        <ProtectedRoute requiredPermission="settings.read">
                          <AdminChangelog />
                        </ProtectedRoute>
                      } />
                      <Route path="models" element={
                        <ProtectedRoute requiredPermission="products.read">
                          <AdminModels />
                        </ProtectedRoute>
                      } />
                      <Route path="settings" element={
                        <ProtectedRoute requiredPermission="settings.read">
                          <div className="p-8 text-center text-gray-500">Settings page coming soon...</div>
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } />
              
              {/* Payment Routes */}
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/payment/error" element={<PaymentErrorPage />} />
              
              {/* Public Routes */}
              <Route path="/*" element={
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/products/:id" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/categories/:slug" element={<ProductsPage />} />
                      <Route path="/deals" element={<DealsPage />} />
                      <Route path="/models" element={<ModelsPage />} />
                      <Route path="/support" element={<SupportPage />} />
                      <Route path="/search" element={<ProductsPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
          </Router>
        </AdminProvider>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;