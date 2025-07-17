import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/users/home/home'
import About from './pages/users/about/about'
import Services from './pages/users/services/services'
import News from './pages/users/news/news'
import Laws from './pages/users/laws/laws'
import Data from './pages/users/data/data'
import Monthly from './pages/users/data/monthlyReport/monthly'
import MonthlyYear from './pages/users/data/monthlyReport/monthlyYear'
import MonthlyReportViewerPage from './pages/users/data/monthlyReport/monthlyReportViewer'
import Yearly from './pages/users/data/yearlyReport/yearly'
import Contact from './pages/users/contact/contact'
import Team from './pages/users/about/TeamSection'
import Location from './pages/users/about/Components/LocationMap'

// Admin imports
import AdminLogin from './pages/admin/login/login'
import AdminDashboard from './pages/admin/dashboard/dashboard'
import NewsManagement from './pages/admin/newsManagement/newsManagement'
import ReportManagement from './pages/admin/reportManagement/reportManagement'
import CreateReport from './pages/admin/reportManagement/createReport'
import EditReport from './pages/admin/reportManagement/editReport'
import AdminMonthlyYearsListPage from './pages/admin/reportManagement/adminMonthlyYearsList'
import AdminMonthlyYearManagement from './pages/admin/reportManagement/adminMonthlyYearManagement'
import ProtectedRoute from './pages/admin/components/ProtectedRoute'

function App() {
  const [activeNav, setActiveNav] = useState('home')

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Home />
          </Layout>
        } />
        <Route path="/home" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Home />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <About />
          </Layout>
        } />
        <Route path="/about/team" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Team />
          </Layout>
        } />
        <Route path="/about/location" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Location />
          </Layout>
        } />
        <Route path="/services" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Services />
          </Layout>
        } />
        <Route path="/services/water-supply" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Services />
          </Layout>
        } />
        <Route path="/services/water-treatment" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Services />
          </Layout>
        } />
        <Route path="/services/maintenance" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Services />
          </Layout>
        } />
        <Route path="/services/billing" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Services />
          </Layout>
        } />
        <Route path="/services/customer-service" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Services />
          </Layout>
        } />
        <Route path="/news" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <News />
          </Layout>
        } />
        <Route path="/laws" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Laws />
          </Layout>
        } />
        <Route path="/data" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Data />
          </Layout>
        } />
        <Route path="/data/monthly" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Monthly />
          </Layout>
        } />
        <Route path="/data/monthly/:year" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <MonthlyYear />
          </Layout>
        } />
        <Route path="/data/monthly/:year/report/:reportId" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <MonthlyReportViewerPage />
          </Layout>
        } />
        <Route path="/data/yearly" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Yearly />
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout activeNav={activeNav} setActiveNav={setActiveNav}>
            <Contact />
          </Layout>
        } />

        {/* Admin routes */}
        <Route path="/admin-login-secret/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/news" element={
          <ProtectedRoute>
            <NewsManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute>
            <ReportManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports/monthly" element={
          <ProtectedRoute>
            <AdminMonthlyYearsListPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports/monthly/:year" element={
          <ProtectedRoute>
            <AdminMonthlyYearManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports/create" element={
          <ProtectedRoute>
            <CreateReport />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports/edit/:type/:id" element={
          <ProtectedRoute>
            <EditReport />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
