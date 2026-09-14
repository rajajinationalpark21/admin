import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { Eye, FileText, Image, MessageSquare, TrendingUp, Users } from "lucide-react";
import api from "../api/apiClient";

const Dashboard = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    gallery: 0,
    inquiries: 0,
    views: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogRes, galleryRes, inquiryRes] = await Promise.allSettled([
          api.get("blogs/get"),
          api.get("gallery/get"),
          api.get("contact/get"),
        ]);

        const blogs = blogRes.status === "fulfilled" ? (blogRes.value.data?.blogs || blogRes.value.data?.data || []) : [];
        const gallery = galleryRes.status === "fulfilled" ? (galleryRes.value.data?.images || galleryRes.value.data?.data || []) : [];
        const inquiries = inquiryRes.status === "fulfilled" ? (inquiryRes.value.data?.inquiries || inquiryRes.value.data?.data || []) : [];

        setStats({
          blogs: Array.isArray(blogs) ? blogs.length : 0,
          gallery: Array.isArray(gallery) ? gallery.length : 0,
          inquiries: Array.isArray(inquiries) ? inquiries.length : 0,
          views: 0,
        });

        if (Array.isArray(inquiries)) {
          setRecentInquiries(inquiries.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "Blogs", value: stats.blogs, icon: FileText, color: "from-orange-500 to-red-500" },
    { label: "Photos", value: stats.gallery, icon: Image, color: "from-purple-500 to-indigo-500" },
    { label: "Inquiries", value: stats.inquiries, icon: MessageSquare, color: "from-pink-500 to-rose-500" },
    { label: "Views", value: stats.views, icon: Eye, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Dashboard" subtitle="Welcome back to Rajaji National Park Admin" />

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center text-gray-400 mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <motion.div
              className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 lg:grid-cols-4 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {statCards.map((card, index) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm">{card.label}</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">{card.value}</p>
                    </div>
                    <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${card.color}`}>
                      <card.icon size={18} className="text-white sm:w-6 sm:h-6" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Quick Actions */}
              <motion.div
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-500 sm:w-5 sm:h-5" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <a href="/blog" className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                    <FileText size={16} className="text-orange-400 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm text-gray-200">Write blog post</span>
                  </a>
                  <a href="/gallery" className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                    <Image size={16} className="text-purple-400 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm text-gray-200">Upload photos</span>
                  </a>
                  <a href="/content" className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                    <FileText size={16} className="text-blue-400 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm text-gray-200">Update content</span>
                  </a>
                  <a href="/inquiries" className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                    <MessageSquare size={16} className="text-pink-400 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm text-gray-200">View inquiries</span>
                  </a>
                </div>
              </motion.div>

              {/* Recent Inquiries */}
              <motion.div
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-gray-700"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Users size={18} className="text-pink-500 sm:w-5 sm:h-5" />
                  Recent Inquiries
                </h3>
                {recentInquiries.length === 0 ? (
                  <p className="text-gray-400 text-center py-4 text-sm">No inquiries yet</p>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {recentInquiries.map((inquiry, index) => (
                      <div key={inquiry._id || index} className="p-2 sm:p-3 rounded-lg bg-gray-700 border border-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {(inquiry.name || inquiry.firstName || "U").charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-white font-medium truncate">
                              {inquiry.name || `${inquiry.firstName || ""} ${inquiry.lastName || ""}`}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{inquiry.email || inquiry.message || "No message"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
