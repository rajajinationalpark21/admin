import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/common/Header";
import { Plus, Edit, Trash2, Search, X, Upload, FileText } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/apiClient";

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    summary: "",
    content: "",
    image: null,
    imagePreview: "",
  });

  const categories = ["Big Cats", "Bird Watching", "Conservation", "Photography", "Travel Tips", "Adventure", "Guides"];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("blogs/get");
      const data = res.data?.blogs || res.data?.data || [];
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.[0]) {
      const file = files[0];
      setFormData({ ...formData, image: file, imagePreview: URL.createObjectURL(file) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("summary", formData.summary);
      data.append("content", formData.content);
      if (formData.image) data.append("image", formData.image);

      if (editId) {
        data.append("blogId", editId);
        await api.patch("blogs/update", data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Blog updated successfully!");
      } else {
        await api.post("blogs/add", data, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Blog created successfully!");
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to save blog");
      console.error("Blog save error:", error);
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title || "",
      category: blog.category || "",
      summary: blog.summary || "",
      content: blog.content || "",
      image: null,
      imagePreview: blog.image || blog.imageUrl || "",
    });
    setEditId(blog._id || blog.blogId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete("blogs/delete", { data: { blogId: id } });
      toast.success("Blog deleted successfully!");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  const resetForm = () => {
    setFormData({ title: "", category: "", summary: "", content: "", image: null, imagePreview: "" });
    setEditId(null);
    setShowForm(false);
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Blog Manager" />
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition text-sm sm:text-base"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Cancel" : "Add Blog"}
          </button>
          {blogs.length > 0 && (
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search blogs..."
                className="w-full sm:w-auto bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          )}
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mb-6 sm:mb-8 bg-gray-800 bg-opacity-60 backdrop-blur-md text-white rounded-xl p-4 sm:p-6 border border-gray-700 space-y-3 sm:space-y-4"
            >
              <h3 className="text-base sm:text-lg font-semibold">{editId ? "Edit Blog Post" : "New Blog Post"}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Blog Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-gray-700 border border-gray-600 px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  required
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-gray-700 border border-gray-600 px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                name="summary"
                placeholder="Short Summary"
                value={formData.summary}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />

              <textarea
                name="content"
                placeholder="Full blog content..."
                value={formData.content}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />

              <div>
                <label className="block text-xs sm:text-sm text-gray-400 mb-1">Featured Image</label>
                <div className="flex items-center gap-3 sm:gap-4">
                  <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                    <Upload size={16} className="text-green-400" />
                    <span className="text-xs sm:text-sm text-gray-300">Choose Image</span>
                    <input type="file" name="image" accept="image/*" className="hidden" onChange={handleChange} />
                  </label>
                  {formData.imagePreview && (
                    <img src={formData.imagePreview} alt="Preview" className="h-12 w-16 sm:h-16 sm:w-24 object-cover rounded-lg" />
                  )}
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button type="submit" className="px-4 sm:px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">
                  {editId ? "Update" : "Publish"}
                </button>
                <button type="button" onClick={resetForm} className="px-4 sm:px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition text-sm">
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Content */}
        {loading ? (
          <div className="text-center text-gray-400 mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Loading blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center text-gray-400 mt-8 py-8 sm:py-12">
            <FileText size={40} className="mx-auto mb-4 text-gray-600 sm:w-12 sm:h-12" />
            <p className="text-base sm:text-lg">No blog posts yet</p>
            <p className="text-xs sm:text-sm mt-1">Click "Add Blog" to create your first article</p>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredBlogs.map((blog, index) => (
                      <motion.tr
                        key={blog._id || blog.blogId || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="px-6 py-4">
                          <img
                            src={blog.image || blog.imageUrl || "/placeholder.jpg"}
                            alt={blog.title}
                            className="w-14 h-10 object-cover rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-100 font-medium max-w-xs truncate">{blog.title}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-xs">{blog.category}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button onClick={() => handleEdit(blog)} className="text-indigo-400 hover:text-indigo-300 mr-3">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(blog._id || blog.blogId)} className="text-red-400 hover:text-red-300">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id || blog.blogId || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-4 border border-gray-700"
                >
                  <div className="flex gap-3">
                    <img
                      src={blog.image || blog.imageUrl || "/placeholder.jpg"}
                      alt={blog.title}
                      className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{blog.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{blog.category}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-700">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/30"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id || blog.blogId)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BlogManager;
