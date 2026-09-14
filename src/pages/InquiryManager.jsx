import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { Search, Trash2, ChevronDown, ChevronUp, MessageSquare, Mail, Phone, User } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/apiClient";

const InquiryManager = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await api.get("contact/get");
      const data = res.data?.inquiries || res.data?.data || res.data?.contacts || [];
      setInquiries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await api.delete("contact/delete", { data: { contactId: id } });
      toast.success("Inquiry deleted successfully!");
      setInquiries((prev) => prev.filter((inq) => (inq._id || inq.id) !== id));
    } catch (error) {
      toast.error("Failed to delete inquiry");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredInquiries = inquiries.filter(
    (inq) =>
      `${inq.name || inq.firstName || ""} ${inq.lastName || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.phone || inq.mobile || "").includes(searchTerm) ||
      (inq.message || inq.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const currentItems = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Contact Inquiries" />
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base sm:text-xl font-semibold text-gray-100">Inquiries ({filteredInquiries.length})</h2>
            {filteredInquiries.length > 0 && (
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredInquiries.length)} of {filteredInquiries.length}
              </p>
            )}
          </div>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="w-full sm:w-auto bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-gray-400 mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Loading inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center text-gray-400 mt-8 sm:mt-12 py-8 sm:py-16">
            <MessageSquare size={48} className="mx-auto mb-4 text-gray-600 sm:w-16 sm:h-16" />
            <p className="text-base sm:text-lg">No inquiries yet</p>
            <p className="text-xs sm:text-sm mt-1">Contact form submissions will appear here</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <motion.div
              className="hidden md:block bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {currentItems.map((inq, index) => {
                      const id = inq._id || inq.id || `inq-${index}`;
                      const isExpanded = expandedId === id;

                      return (
                        <motion.tr
                          key={id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="hover:bg-gray-700/50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold">
                                {(inq.name || inq.firstName || "U").charAt(0)}
                              </div>
                              <span className="text-sm text-white font-medium">
                                {inq.name || `${inq.firstName || ""} ${inq.lastName || ""}`}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{inq.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{inq.phone || inq.mobile || "—"}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleExpand(id)}
                              className="flex items-center text-green-400 hover:text-green-300 text-sm"
                            >
                              {isExpanded ? "Hide" : "View"}{" "}
                              {isExpanded ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDelete(id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {currentItems.map((inq, index) => {
                const id = inq._id || inq.id || `inq-${index}`;
                const isExpanded = expandedId === id;

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 border border-gray-700"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {(inq.name || inq.firstName || "U").charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {inq.name || `${inq.firstName || ""} ${inq.lastName || ""}`}
                          </p>
                          <p className="text-xs text-gray-400">{inq.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-3 space-y-1">
                      {inq.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Phone size={12} /> {inq.phone}
                        </div>
                      )}
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => toggleExpand(id)}
                      className="mt-3 flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
                    >
                      {isExpanded ? "Hide message" : "View message"}
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 pt-3 border-t border-gray-700"
                      >
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">
                          {inq.message || inq.description || "No message"}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 sm:mt-6 flex justify-center gap-1 sm:gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
                      currentPage === page
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default InquiryManager;
