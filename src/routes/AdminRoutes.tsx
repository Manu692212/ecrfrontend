import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import CoursesPage from '@/pages/admin/courses';
import AcademicCouncilPage from '@/pages/admin/academic-council';
import ManagementPage from '@/pages/admin/management';
import ContentStudioPage from '@/pages/admin/content';
import AdminHomePage from '@/pages/admin/home';
import AdminAboutPage from '@/pages/admin/about';
import AdminAdmissionPage from '@/pages/admin/admission';
import AdminCareersPage from '@/pages/admin/careers';
import AdminContactPage from '@/pages/admin/contact';
import AdminApplicationsPage from '@/pages/admin/applications';
import AdminSettingsPage from '@/pages/admin/settings';
import AdminUsersPage from '@/pages/admin/settings/users';

function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="home" element={<AdminHomePage />} />
        <Route path="about" element={<AdminAboutPage />} />
        <Route path="admission" element={<AdminAdmissionPage />} />
        <Route path="careers" element={<AdminCareersPage />} />
        <Route path="contact" element={<AdminContactPage />} />
        <Route path="content" element={<ContentStudioPage />} />
        
        {/* Courses Routes */}
        <Route path="courses/*" element={<CoursesPage />} />
        
        {/* Academic Council Routes */}
        <Route path="academic-council/*" element={<AcademicCouncilPage />} />

        {/* Management Routes */}
        <Route path="management/*" element={<ManagementPage />} />
        <Route path="applications" element={<AdminApplicationsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="settings/users" element={<AdminUsersPage />} />
        
        {/* Add more protected routes here */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
}

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
