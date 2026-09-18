import React, { useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { getMuiTheme } from "./theme/muiTheme";
import { ThemeProvider as AdminThemeProvider, useAdminTheme } from "./context/ThemeContext";
import Sidebar from "./components/common/Sidebar";
import BottomNav, { MobileTopBar } from "./components/common/BottomNav";
import Dashboard from "./pages/Dashboard";
import ContentManager from "./pages/ContentManager";
import BlogManager from "./pages/BlogManager";
import GalleryManager from "./pages/GalleryManager";
import InquiryManager from "./pages/InquiryManager";
import FeedbackManager from "./pages/FeedbackManager";
import BookingManager from "./pages/BookingManager";
import Settings from "./pages/Settings";
import LoginPage from "./pages/Login-Page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";

function AdminShell() {
  const { theme, themeConfig } = useAdminTheme();
  const muiTheme = useMemo(() => getMuiTheme(theme), [theme]);
  const location = useLocation();
  const hideNav = location.pathname === "/" || location.pathname === "/login";
  const getAuth = localStorage.getItem("isAuthenticated");

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className={`flex h-screen ${themeConfig.bgClass} overflow-hidden transition-colors duration-200`}>
        {/* Desktop Sidebar */}
        {!hideNav && getAuth && (
          <div className="hidden md:block h-full shrink-0">
            <Sidebar />
          </div>
        )}

        {/* Mobile Top Bar */}
        {!hideNav && getAuth && (
          <div className="md:hidden">
            <MobileTopBar />
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 overflow-auto relative z-10 ${!hideNav && getAuth ? "pt-14 md:pt-0 pb-[68px] md:pb-0" : ""}`}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/content" element={<ProtectedRoute><ContentManager /></ProtectedRoute>} />
            <Route path="/blog" element={<ProtectedRoute><BlogManager /></ProtectedRoute>} />
            <Route path="/gallery" element={<ProtectedRoute><GalleryManager /></ProtectedRoute>} />
            <Route path="/inquiries" element={<ProtectedRoute><InquiryManager /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><FeedbackManager /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><BookingManager /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </main>

        {/* Mobile Bottom Nav */}
        {!hideNav && getAuth && (
          <div className="md:hidden">
            <BottomNav />
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme === "light" ? "light" : "dark"}
        />
      </div>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <AdminThemeProvider>
      <AdminShell />
    </AdminThemeProvider>
  );
}

export default App;
