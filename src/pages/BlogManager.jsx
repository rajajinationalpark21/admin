import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/common/Header";
import { Plus, Edit, Trash2, Search, X, Upload, FileText } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/apiClient";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  useTheme
} from "@mui/material";

const BlogManager = () => {
  const theme = useTheme();
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
    quote: "",
    quoteAuthor: "",
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
      if (formData.quote) data.append("quote", formData.quote);
      if (formData.quoteAuthor) data.append("quoteAuthor", formData.quoteAuthor);
      if (formData.image) data.append("image", formData.image);

      if (editId) {
        await api.put(`blogs/update/${editId}`, data);
        toast.success("Blog updated successfully!");
      } else {
        await api.post("blogs/create", data);
        toast.success("Blog created successfully!");
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      toast.error(editId ? "Failed to update blog" : "Failed to create blog");
      console.error(error);
    }
  };

  const handleEdit = (blog) => {
    setEditId(blog._id || blog.blogId);
    setFormData({
      title: blog.title || "",
      category: blog.category || "",
      summary: blog.summary || "",
      content: blog.content || "",
      quote: blog.quote || "",
      quoteAuthor: blog.quoteAuthor || "",
      image: null,
      imagePreview: blog.image || blog.imageUrl || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`blogs/delete/${id}`);
      toast.success("Blog deleted successfully!");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete blog");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      summary: "",
      content: "",
      quote: "",
      quoteAuthor: "",
      image: null,
      imagePreview: "",
    });
    setEditId(null);
    setShowForm(false);
  };

  const filteredBlogs = blogs.filter((blog) =>
    (blog.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header title="Wilderness Blog" subtitle="Create, edit, and publish wilderness articles and guides" />

      <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3 }}>
        {/* Top Control Bar */}
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "divider",
            p: { xs: 2, sm: 2.25 },
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              if (showForm) resetForm();
              else setShowForm(true);
            }}
            startIcon={showForm ? <X size={16} /> : <Plus size={16} />}
            sx={{
              borderRadius: "12px",
              backgroundColor: "text.primary",
              color: "background.paper",
              fontWeight: 600,
              fontSize: "0.8125rem",
              textTransform: "none",
              py: 0.9,
              px: 2,
              "&:hover": {
                backgroundColor: "text.primary",
                opacity: 0.9,
              },
            }}
          >
            {showForm ? "Cancel" : "Add Article"}
          </Button>

          {/* Search Pill */}
          <Box sx={{ flex: 1, maxWidth: { xs: "100%", sm: "360px" } }}>
            <TextField
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blogs..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} style={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <X size={14} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                sx: {
                  borderRadius: "24px",
                  fontSize: "0.8125rem",
                  height: 38,
                  backgroundColor: "action.hover",
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "divider" },
                },
              }}
            />
          </Box>
        </Box>

        {/* Create / Edit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "divider",
                  p: { xs: 2.5, sm: 3.5 },
                  mb: 3.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                }}
              >
                <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700, color: "text.primary" }}>
                  {editId ? "Edit Blog Article" : "Create New Blog Article"}
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Blog Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    size="small"
                  />

                  <TextField
                    fullWidth
                    select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    size="small"
                    SelectProps={{ native: true }}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </TextField>
                </Box>

                <TextField
                  fullWidth
                  label="Short Summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  required
                  size="small"
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Full Article Content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                />

                {/* Optional Pull Quote */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "10px",
                    backgroundColor: "action.hover",
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.primary" }}>
                    Featured Pull Quote (Optional)
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="E.g. 'Tracking tigers in the misty dawn of Chilla is an experience like no other.'"
                    name="quote"
                    value={formData.quote}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Quote Author (e.g. Lead Naturalist R. Sharma)"
                    name="quoteAuthor"
                    value={formData.quoteAuthor}
                    onChange={handleChange}
                  />
                </Box>

                {/* Image Upload */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Upload size={16} />}
                    sx={{
                      borderRadius: "12px",
                      borderColor: "divider",
                      color: "text.primary",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                    }}
                  >
                    Upload Cover Image
                    <input type="file" name="image" accept="image/*" hidden onChange={handleChange} />
                  </Button>

                  {formData.imagePreview && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", border: `1px solid ${theme.palette.divider}` }}
                      />
                      <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                        Cover ready
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Submit Row */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, pt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={resetForm}
                    sx={{
                      borderRadius: "12px",
                      borderColor: "divider",
                      color: "text.primary",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: "text.primary",
                      color: "background.paper",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": { backgroundColor: "text.primary", opacity: 0.9 },
                    }}
                  >
                    {editId ? "Update Article" : "Publish Article"}
                  </Button>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Section: Table */}
        {loading ? (
          <Box sx={{ py: 12, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Loading articles...</Typography>
          </Box>
        ) : filteredBlogs.length === 0 ? (
          <Box
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: "12px",
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <FileText size={36} style={{ margin: "0 auto 12px", color: theme.palette.text.secondary }} />
            <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "text.primary" }}>
              No articles found
            </Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5 }}>
              Click "Add Article" above to create a blog post.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "12px", border: "1px solid", borderColor: "divider" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "action.hover" }}>
                  <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>IMAGE</TableCell>
                  <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>ARTICLE TITLE</TableCell>
                  <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>CATEGORY</TableCell>
                  <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>PUBLISHED</TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBlogs.map((blog, index) => (
                  <TableRow key={blog._id || blog.blogId || index} hover>
                    <TableCell sx={{ py: 1.5 }}>
                      <img
                        src={blog.image || blog.imageUrl || "/placeholder.jpg"}
                        alt={blog.title}
                        style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 6 }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.5, maxWidth: 320 }}>
                      <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.primary" }}>
                        {blog.title}
                      </Typography>
                      <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary", maxWidth: 280, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {blog.summary}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip
                        label={blog.category}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          borderRadius: "6px",
                          backgroundColor: "action.selected",
                          color: "text.primary",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontSize: "0.75rem", color: "text.secondary" }}>
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Recent"}
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.5 }}>
                      <IconButton size="small" onClick={() => handleEdit(blog)} sx={{ mr: 1, color: "text.secondary", "&:hover": { color: "text.primary" } }}>
                        <Edit size={16} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(blog._id || blog.blogId)} sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default BlogManager;
