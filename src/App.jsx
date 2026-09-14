import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./pages/Dashboard";
import ContentManager from "./pages/ContentManager";
import BlogManager from "./pages/BlogManager";
import GalleryManager from "./pages/GalleryManager";
import InquiryManager from "./pages/InquiryManager";
import Settings from "./pages/Settings";
import LoginPage from "./pages/Login-Page";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/";
  const getAuth = localStorage.getItem("isAuthenticated");

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {/* Desktop Sidebar */}
      {!hideSidebar && getAuth && (
        <div className="hidden md:block">
          <Sidebar />
        </div>
      )}

      {/* Mobile Top Bar + Bottom Nav */}
      {!hideSidebar && getAuth && (
        <div className="md:hidden">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10 md:pt-0 pt-14 pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/content" element={<ProtectedRoute><ContentManager /></ProtectedRoute>} />
          <Route path="/blog" element={<ProtectedRoute><BlogManager /></ProtectedRoute>} />
          <Route path="/gallery" element={<ProtectedRoute><GalleryManager /></ProtectedRoute>} />
          <Route path="/inquiries" element={<ProtectedRoute><InquiryManager /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </main>

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
        theme="dark"
        toastStyle={{
          backgroundColor: "#1f2937",
          color: "#f9fafb",
          border: "1px solid #374151",
        }}
      />
    </div>
  );
}

export default App;
