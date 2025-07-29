import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingFallback from './components/LoadingPage'; 
// import { ProtectRouter } from './ProtectRouter'; // Assuming you have a ProtectRouter or similar

// -------------------------------------------------------------------------
// LAZY LOADED PUBLIC ROUTES
// -------------------------------------------------------------------------
const Home = React.lazy(() => import('./pages/users/home/home'));
const About = React.lazy(() => import('./pages/users/about/about'));
const Services = React.lazy(() => import('./pages/users/services/services'));
const News = React.lazy(() => import('./pages/users/news/news'));
const Laws = React.lazy(() => import('./pages/users/laws/laws'));
const Data = React.lazy(() => import('./pages/users/data/data'));
const Monthly = React.lazy(() => import('./pages/users/data/monthlyReport/monthly'));
const MonthlyYear = React.lazy(() => import('./pages/users/data/monthlyReport/monthlyYear'));
const MonthlyReportViewerPage = React.lazy(() => import('./pages/users/data/monthlyReport/monthlyReportViewer'));
const Yearly = React.lazy(() => import('./pages/users/data/yearlyReport/yearly'));
const Contact = React.lazy(() => import('./pages/users/contact/contact'));
const Team = React.lazy(() => import('./pages/users/about/TeamSection'));
const Location = React.lazy(() => import('./pages/users/about/Components/LocationMap'));
const NewsDetailsPage = React.lazy(() => import('./pages/users/news/newsDetailsPage'));
const NotFound = React.lazy(() => import('./pages/notFound/notFound'));

// -------------------------------------------------------------------------
// LAZY LOADED ADMIN ROUTES
// -------------------------------------------------------------------------
const AdminLogin = React.lazy(() => import('./pages/admin/login/login'));
const AdminDashboard = React.lazy(() => import('./pages/admin/dashboard/dashboard'));
const NewsManagement = React.lazy(() => import('./pages/admin/newsManagement/newsManagement'));
const ReportsManagement = React.lazy(() => import('./pages/admin/reportManagement/reportpage')); // Corrected typo here
const AdminMonthlyYearsListPage = React.lazy(() => import('./pages/admin/reportManagement/adminMonthlyYearsList'));
const AdminMonthlyYearManagement = React.lazy(() => import('./pages/admin/reportManagement/adminMonthlyYearManagement'));
const ReportForm = React.lazy(() => import('./pages/admin/reportManagement/Components/ReportForm'));

// Your ProtectedRoute component
import ProtectedRoute from './pages/admin/components/ProtectedRoute'; // This is a regular import as it's a wrapper, not a view component



function App() {
  const [activeNav, setActiveNav] = useState('home');

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}> {/* A single Suspense for all lazy-loaded routes */}
        <Routes>
          {/* Public routes */}
          {/* The "*" path for NotFound should ideally be the last one if it's a catch-all */}
          <Route
            path="*"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <NotFound />
              </Layout>
            }
          />
          <Route
            path="/"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/home"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <About />
              </Layout>
            }
          />
          <Route
            path="/about/team"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Team />
              </Layout>
            }
          />
          <Route
            path="/about/location"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Location />
              </Layout>
            }
          />
          <Route
            path="/services"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Services />
              </Layout>
            }
          />
          {/* Grouping services routes if they all render the same Services component */}
          <Route
            path="/services/water-supply"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Services />
              </Layout>
            }
          />
          <Route
            path="/services/water-treatment"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Services />
              </Layout>
            }
          />
          <Route
            path="/services/maintenance"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Services />
              </Layout>
            }
          />
          <Route
            path="/services/billing"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Services />
              </Layout>
            }
          />
          <Route
            path="/services/customer-service"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Services />
              </Layout>
            }
          />
          <Route
            path="/news"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <News />
              </Layout>
            }
          />
          <Route
            path="/news/:id"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <NewsDetailsPage />
              </Layout>
            }
          />
          <Route
            path="/laws"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Laws />
              </Layout>
            }
          />
          <Route
            path="/data"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Data />
              </Layout>
            }
          />
          <Route
            path="/data/monthly"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Monthly />
              </Layout>
            }
          />
          <Route
            path="/data/monthly/:year"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <MonthlyYear />
              </Layout>
            }
          />
          <Route
            path="/data/monthly/:year/report/:reportId"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <MonthlyReportViewerPage />
              </Layout>
            }
          />
          <Route
            path="/data/yearly"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Yearly />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Contact />
              </Layout>
            }
          />

          {/* Admin routes */}
          <Route path="/admin-login-secret/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/news"
            element={
              <ProtectedRoute>
                <NewsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                <ReportsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/monthly"
            element={
              <ProtectedRoute>
                <AdminMonthlyYearsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/monthly/:year"
            element={
              <ProtectedRoute>
                <AdminMonthlyYearManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/edit/:type/:id"
            element={
              <ProtectedRoute>
                <ReportForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/create"
            element={
              <ProtectedRoute>
                <ReportForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;