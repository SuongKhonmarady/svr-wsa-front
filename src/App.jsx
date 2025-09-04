import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingFallback from './components/LoadingPage'; 
import { ToastProvider } from './components/ToastContainer';
// import { ProtectRouter } from './ProtectRouter'; // Assuming you have a ProtectRouter or similar

// -------------------------------------------------------------------------
// LAZY LOADED PUBLIC ROUTES
// -------------------------------------------------------------------------
const Home = React.lazy(() => import('./pages/users/home/home'));
const About = React.lazy(() => import('./pages/users/about/about'));
const Services = React.lazy(() => import('./pages/users/services/services'));
const WaterSupplyRequest = React.lazy(() => import('./pages/users/services/WaterSupplyRequest'));
const News = React.lazy(() => import('./pages/users/news/news'));
const Laws = React.lazy(() => import('./pages/users/laws/laws'));
const Data = React.lazy(() => import('./pages/users/data/data'));
const Monthly = React.lazy(() => import('./pages/users/data/monthlyReport/monthly'));
const MonthlyYear = React.lazy(() => import('./pages/users/data/monthlyReport/monthlyYear'));
const MonthlyReportViewerPage = React.lazy(() => import('./pages/users/data/monthlyReport/monthlyReportViewer'));
const Yearly = React.lazy(() => import('./pages/users/data/yearlyReport/yearly'));
const FinancialReports = React.lazy(() => import('./pages/users/data/financialReports'));
const Contact = React.lazy(() => import('./pages/users/contact/contact'));
const Team = React.lazy(() => import('./pages/users/about/TeamSection'));
const Location = React.lazy(() => import('./pages/users/about/Components/LocationMap'));
const NewsDetailsPage = React.lazy(() => import('./pages/users/news/newsDetailsPage'));
const NewsCategoryPage = React.lazy(() => import('./pages/users/news/NewsCategoryPage'));
const SearchResultsPage = React.lazy(() => import('./pages/users/search/SearchResultsPage'));
const NotFound = React.lazy(() => import('./components/notFound'));
const Privacy = React.lazy(() => import('./pages/users/privacy/privacy'));
const RepairService = React.lazy(() => import('./pages/users/services/RepairService'));


// -------------------------------------------------------------------------
// LAZY LOADED ADMIN ROUTES
// -------------------------------------------------------------------------
const AdminLogin = React.lazy(() => import('./pages/admin/login/login'));
const AdminDashboard = React.lazy(() => import('./pages/admin/dashboard/dashboard'));
const NewsManagement = React.lazy(() => import('./pages/admin/newsManagement/newsManagement'));
const ServiceRequestsManagement = React.lazy(() => import('./pages/admin/serviceRequests/ServiceRequestsManagement'));
const CustomerDetailPage = React.lazy(() => import('./pages/admin/serviceRequests/CustomerDetailPage'));
const ReportsManagement = React.lazy(() => import('./pages/admin/reportManagement/reportpage')); // Corrected typo here
const ReportForm = React.lazy(() => import('./pages/admin/reportManagement/Components/ReportForm'));

// Your ProtectedRoute component
import ProtectedRoute from './pages/admin/components/ProtectedRoute'; // This is a regular import as it's a wrapper, not a view component
import YearlyReportViewer from './pages/users/data/Components/yearly/yearlyReportViewer';



function App() {
  const [activeNav, setActiveNav] = useState('home');

  return (
    <ToastProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}> {/* A single Suspense for all lazy-loaded routes */}
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/privacy"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <Privacy />
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
            path="/services/service-request"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <WaterSupplyRequest />
              </Layout>
            }
          />
          
          <Route
            path="/services/repair-service"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <RepairService />
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
            path="/news/category/:categorySlug"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <NewsCategoryPage />
              </Layout>
            }
          />
          <Route
            path="/news/:slug"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <NewsDetailsPage />
              </Layout>
            }
          />
          <Route
            path="/search"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <SearchResultsPage />
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
            path="/data/yearly/:year/report/:reportId"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <YearlyReportViewer />
              </Layout>
            }
          />
          <Route
            path="/data/financial-reports"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <FinancialReports />
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
          <Route path="/svrwu-admin-login/login" element={<AdminLogin />} />
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
            path="/admin/service-requests"
            element={
              <ProtectedRoute>
                <ServiceRequestsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/service-requests/:requestId"
            element={
              <ProtectedRoute>
                <CustomerDetailPage />
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
          
          {/* Catch-all route for 404 - This should be the last route */}
          <Route
            path="*"
            element={
              <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </Router>
    </ToastProvider>
  );
}

export default App;