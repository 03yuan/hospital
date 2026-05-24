import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { RoleGuard } from '../components/common/RoleGuard';
import { PatientLayout } from '../components/layout/PatientLayout';
import { DoctorLayout } from '../components/layout/DoctorLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DepartmentListPage from '../pages/patient/DepartmentListPage';
import DoctorListPage from '../pages/patient/DoctorListPage';
import BookingPage from '../pages/patient/BookingPage';
import BookingConfirmPage from '../pages/patient/BookingConfirmPage';
import MyAppointmentsPage from '../pages/patient/MyAppointmentsPage';
import PatientProfilePage from '../pages/patient/ProfilePage';
import DashboardPage from '../pages/doctor/DashboardPage';
import DoctorAppointmentListPage from '../pages/doctor/AppointmentListPage';
import DoctorProfilePage from '../pages/doctor/ProfilePage';
import PatientHistoryPage from '../pages/doctor/PatientHistoryPage';
import AdminDepartmentManagePage from '../pages/admin/DepartmentManagePage';
import AdminDoctorManagePage from '../pages/admin/DoctorManagePage';
import AdminScheduleManagePage from '../pages/admin/ScheduleManagePage';
import AdminStatisticsPage from '../pages/admin/StatisticsPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  {
    path: '/patient',
    element: <ProtectedRoute><PatientLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="departments" replace /> },
      { path: 'departments', element: <RoleGuard roles={['PATIENT']}><DepartmentListPage /></RoleGuard> },
      { path: 'departments/:id', element: <RoleGuard roles={['PATIENT']}><DoctorListPage /></RoleGuard> },
      { path: 'doctors/:id/book', element: <RoleGuard roles={['PATIENT']}><BookingPage /></RoleGuard> },
      { path: 'book/confirm', element: <RoleGuard roles={['PATIENT']}><BookingConfirmPage /></RoleGuard> },
      { path: 'appointments', element: <RoleGuard roles={['PATIENT']}><MyAppointmentsPage /></RoleGuard> },
      { path: 'profile', element: <RoleGuard roles={['PATIENT']}><PatientProfilePage /></RoleGuard> },
    ],
  },

  {
    path: '/doctor',
    element: <ProtectedRoute><DoctorLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <RoleGuard roles={['DOCTOR']}><DashboardPage /></RoleGuard> },
      { path: 'appointments', element: <RoleGuard roles={['DOCTOR']}><DoctorAppointmentListPage /></RoleGuard> },
      { path: 'profile', element: <RoleGuard roles={['DOCTOR']}><DoctorProfilePage /></RoleGuard> },
      { path: 'patients/:id/history', element: <RoleGuard roles={['DOCTOR']}><PatientHistoryPage /></RoleGuard> },
    ],
  },

  {
    path: '/admin',
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="departments" replace /> },
      { path: 'departments', element: <RoleGuard roles={['ADMIN']}><AdminDepartmentManagePage /></RoleGuard> },
      { path: 'doctors', element: <RoleGuard roles={['ADMIN']}><AdminDoctorManagePage /></RoleGuard> },
      { path: 'schedules', element: <RoleGuard roles={['ADMIN']}><AdminScheduleManagePage /></RoleGuard> },
      { path: 'statistics', element: <RoleGuard roles={['ADMIN']}><AdminStatisticsPage /></RoleGuard> },
    ],
  },

  { path: '*', element: <Navigate to="/login" replace /> },
]);
