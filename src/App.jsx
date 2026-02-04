import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import ScheduleManager from './pages/dashboard/ScheduleManager';
import PollManager from './pages/dashboard/PollManager';
import Settings from './pages/dashboard/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter } from 'react-router-dom'; // Re-added BrowserRouter to maintain syntactical correctness
import CustomCursor from './components/CustomCursor';


function App() {
  return (
    <BrowserRouter>
      {/* Custom GIF Cursor */}
      <CustomCursor />

      {/* Navbar stays here so it shows on all pages */}
      {/* <Navbar /> */}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="schedule" element={<ScheduleManager />} />
            <Route path="polls" element={<PollManager />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
