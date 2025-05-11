import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ExcelImportPage from '../views/excel/ExcelImportPage';
import ExcelImportPage2 from '../views/excel2/ExcelImportPage';
/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')))
const Icons = Loadable(lazy(() => import('../views/icons/Icons')))
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')))
const Shadow = Loadable(lazy(() => import('../views/utilities/Shadow')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
//const ExcelImportPage = Loadable(lazy(() => import('../views/excel/ExcelImportPage')));
//const ExcelImportPage2 = Loadable(lazy(() => import('../views/excel2/ExcelImportPage')));
const Teacher = Loadable(lazy(() => import('../views/teacher/Teacher')));
const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      //{ path: '/icons', exact: true, element: <Icons /> },
      //{ path: '/ui/typography', exact: true, element: <TypographyPage /> },
      //{ path: '/ui/shadow', exact: true, element: <Shadow /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
      { path: '/excel', exact: true, element: <ExcelImportPage /> },
      { path: '/excel2', exact: true, element: <ExcelImportPage2 /> },
      { path: '/teacher', exact: true, element: <Teacher /> }    
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      //{ path: '/auth/register', element: <Register /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
