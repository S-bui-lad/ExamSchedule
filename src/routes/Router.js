import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

// Layouts
import FullLayout from '../layouts/full/FullLayout';
import MobileLayout from '../layouts/MobileLayout';
import BlankLayout from '../layouts/blank/BlankLayout'; // Thêm dòng này

// Import your existing pages/components
import Dashboard from '../views/dashboard/Dashboard';
import ExcelImport from '../views/excel/ExcelImportPage';
import Excel2Import from '../views/excel2/ExcelImportPage';
import History from '../views/history/history';
import EditProfile from '../views/EditProfile';
import Login from '../views/authentication/Login';
import Error from '../views/authentication/Error';
import Teacher from '../views/teacher/Teacher';
import SamplePage from '../views/sample-page/SamplePage';

export default function Router() {
  // Check if the device is mobile
  const isMobile = useMediaQuery('(max-width:768px)');
  const Layout = isMobile ? MobileLayout : FullLayout;

  return (
    <Routes>
      <Route path="/" element={<FullLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/excel" element={<ExcelImport />} />
        <Route path="/excel2" element={<Excel2Import />} />
        <Route path="/history" element={<History />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/sample-page" element={<SamplePage />} />
        <Route path="*" element={<Error />} />
      </Route>
      <Route path="/auth" element={<BlankLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Error />} />
      </Route>
    </Routes>
  );
}
