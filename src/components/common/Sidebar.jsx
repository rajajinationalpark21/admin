import { LayoutDashboard, FileText, Image, MessageSquare, Settings, TreePine, LogOut, Menu, X, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, color: "#10B981", href: "/dashboard" },
  { name: "Content", icon: FileText, color: "#6366f1", href: "/content" },
  { name: "Blog", icon: FileText, color: "#F97316", href: "/blog" },
  { name: "Gallery", icon: Image, color: "#8B5CF6", href: "/gallery" },
  { name: "Inquiries", icon: MessageSquare, color: "#EC4899", href: "/inquiries" },
  { name: "Settings", icon: Settings, color: "#64748b", href: "/settings" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Mobile Bottom Navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-gray-900 border-b border-gray-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Rajaji Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-white font-bold text-sm tracking-tight">Rajaji National Park</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-gray-800 px-2 py-2 safe-area-inset">
          <div className="flex justify-around items-center">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={handleNavClick}
                  className="flex flex-col items-center py-1 px-2 rounded-lg transition-colors"
                >
                  <div
                    className={`p-2 rounded-xl transition-all ${
                      isActive
                        ? "bg-green-600/20 scale-110"
                        : "bg-transparent"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={isActive ? "text-green-400" : "text-gray-500"}
                    />
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-medium ${
                      isActive ? "text-green-400" : "text-gray-500"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"}`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
            <img src="/logo.png" alt="Rajaji Logo" className="w-full h-full object-contain" />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                className="text-base font-bold text-white whitespace-nowrap overflow-hidden tracking-tight"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                Rajaji National Park
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit mb-4"
        >
          {isSidebarOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
        </motion.button>

        <nav className="flex-grow">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <motion.div
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors mb-1 ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                  }`}
                >
                  <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-4 text-sm font-medium text-red-400 rounded-lg hover:bg-red-900/30 transition-colors"
        >
          <LogOut size={20} />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                className="whitespace-nowrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
