import { useEffect, useState, useRef } from "react";
import Header from "../components/common/Header";
import { Upload, Trash2, X, Image as ImageIcon, Check, AlertCircle, Plus } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  useTheme
} from "@mui/material";

const CATEGORIES = ["Wildlife", "Nature", "Vehicles", "Visitors"];

function getThumbnailUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    if (url.includes("/upload/c_") || url.includes("/upload/f_") || url.includes("/upload/w_") || url.includes("/upload/q_")) {
      return url;
    }
    return url.replace("/upload/", "/upload/f_auto,q_auto,w_400,h_400,c_fill,g_auto/");
  }
  return url;
}

export default function GalleryManager() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // Upload Dialog state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploadCategory, setUploadCategory] = useState("Wildlife");
  const [uploadTitle, setUploadTitle] = useState("");
  const fileInputRef = useRef(null);

  const isDemoToken = localStorage.getItem("adminToken")?.startsWith("demo-");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await api.get("gallery/get");
      const data = res.data?.images || res.data?.data || [];
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Could not refresh photo gallery from server");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate size (5MB max)
    const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
    if (oversized.length > 0) {
      toast.error(`"${oversized[0].name}" exceeds 5MB limit. Please select smaller files.`);
      return;
    }

    setSelectedFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setFilePreviews(previews);
    if (!uploadTitle && files.length === 1) {
      setUploadTitle(files[0].name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    }
  };

  const closeUploadDialog = () => {
    setIsUploadOpen(false);
    setSelectedFiles([]);
    filePreviews.forEach(url => URL.revokeObjectURL(url));
    setFilePreviews([]);
    setUploadTitle("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) {
      toast.warn("Please choose at least one image file");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));
      if (uploadTitle) formData.append("title", uploadTitle);
      if (uploadCategory) formData.append("category", uploadCategory);

      await api.post("gallery/upload", formData);

      toast.success(`${selectedFiles.length} photo(s) uploaded successfully!`);
      closeUploadDialog();
      fetchImages();
    } catch (error) {
      const msg = error.response?.data?.message || (error.response?.status === 401 ? "Unauthorized. Please re-login with admin credentials." : "Failed to upload images");
      toast.error(msg);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo from the gallery?")) return;
    try {
      await api.delete("gallery/delete", { data: { imageId: id } });
      toast.success("Photo deleted successfully!");
      fetchImages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete photo");
      console.error(error);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedImages.length} selected photos permanently?`)) return;
    try {
      for (const id of selectedImages) {
        await api.delete("gallery/delete", { data: { imageId: id } });
      }
      toast.success("Selected photos deleted successfully!");
      setSelectedImages([]);
      fetchImages();
    } catch (error) {
      toast.error("Failed to delete some photos");
      console.error(error);
    }
  };

  const toggleSelect = (id) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleReLogin = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAuthenticated");
    navigate("/?session=expired");
  };

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header
        title="Photo Gallery"
        subtitle="High-resolution wildlife and landscape captures from the safari trails"
      />

      <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3 }}>
        {/* Warning if on demo mock token */}
        {isDemoToken && (
          <Alert
            severity="warning"
            sx={{ mb: 3, borderRadius: "12px", display: "flex", alignItems: "center" }}
            action={
              <Button color="inherit" size="small" onClick={handleReLogin} sx={{ fontWeight: 600 }}>
                Sign In with Live Key
              </Button>
            }
          >
            You are currently operating in offline demo mode. To upload images directly to Cloudinary and MongoDB, reconnect with live credentials.
          </Alert>
        )}

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              variant="contained"
              onClick={() => setIsUploadOpen(true)}
              startIcon={<Plus size={16} />}
              sx={{
                borderRadius: "12px",
                backgroundColor: "text.primary",
                color: "background.paper",
                fontWeight: 600,
                fontSize: "0.8125rem",
                textTransform: "none",
                py: 0.9,
                px: 2,
                "&:hover": { backgroundColor: "text.primary", opacity: 0.9 },
              }}
            >
              Upload Photo
            </Button>

            {selectedImages.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleBulkDelete}
                startIcon={<Trash2 size={15} />}
                sx={{
                  borderRadius: "12px",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Delete Selected ({selectedImages.length})
              </Button>
            )}
          </Box>

          <Chip
            label={`${images.length} Captures`}
            size="small"
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.75rem",
              height: 32,
              px: 0.5,
              backgroundColor: "action.hover",
              color: "text.primary",
            }}
          />
        </Box>

        {/* Content */}
        {loading ? (
          <Box sx={{ py: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress size={28} sx={{ mb: 2 }} />
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Loading photo gallery...</Typography>
          </Box>
        ) : images.length === 0 ? (
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
            <ImageIcon size={36} style={{ margin: "0 auto 12px", color: theme.palette.text.secondary }} />
            <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "text.primary" }}>
              No photos in gallery
            </Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5 }}>
              Click "Upload Photo" above to add pictures to the wilderness gallery.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" },
              gap: 2,
            }}
          >
            {images.map((img, index) => {
              const imgId = img._id || img.imageId || index;
              const imgUrl = img.url || img.imageUrl || img.image;
              const isSelected = selectedImages.includes(imgId);
              const categoryLabel = img.category || "Wildlife";
              const titleLabel = img.title || `Wilderness Capture #${index + 1}`;

              return (
                <Box
                  key={imgId}
                  sx={{
                    position: "relative",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "2px solid",
                    borderColor: isSelected ? "primary.main" : "transparent",
                    aspectRatio: "1/1",
                    backgroundColor: "action.hover",
                    transition: "transform 0.15s ease, border-color 0.15s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      "& .gallery-overlay": { opacity: 1 },
                    },
                  }}
                >
                  <img
                    src={getThumbnailUrl(imgUrl)}
                    alt={titleLabel}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                    onClick={() => setPreviewImage(imgUrl)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80";
                    }}
                  />

                  {/* Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  >
                    <Chip
                      label={categoryLabel}
                      size="small"
                      sx={{
                        fontSize: "0.65rem",
                        height: 20,
                        backgroundColor: "rgba(0,0,0,0.65)",
                        color: "#FFFFFF",
                        backdropFilter: "blur(4px)",
                      }}
                    />
                  </Box>

                  {/* Hover Overlay */}
                  <Box
                    className="gallery-overlay"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0,0,0,0.55)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      opacity: isSelected ? 1 : 0,
                      transition: "opacity 0.2s ease",
                      p: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#FFFFFF",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        pointerEvents: "none",
                      }}
                    >
                      {titleLabel}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); toggleSelect(imgId); }}
                        sx={{
                          backgroundColor: isSelected ? "#10B981" : "rgba(255,255,255,0.25)",
                          color: "#FFFFFF",
                          "&:hover": { backgroundColor: isSelected ? "#059669" : "rgba(255,255,255,0.4)" },
                        }}
                      >
                        <Check size={14} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleDelete(imgId); }}
                        sx={{
                          backgroundColor: "rgba(239, 68, 68, 0.8)",
                          color: "#FFFFFF",
                          "&:hover": { backgroundColor: "#DC2626" },
                        }}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Upload Modal Dialog */}
        <Dialog
          open={isUploadOpen}
          onClose={!uploading ? closeUploadDialog : undefined}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              p: 1,
              backgroundColor: "background.paper",
              backgroundImage: "none",
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: "1.125rem", pb: 1 }}>
            Upload Wild Gallery Photo
          </DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "8px !important" }}>
            {/* File drop / picker area */}
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: "2px dashed",
                borderColor: selectedFiles.length > 0 ? "primary.main" : "divider",
                borderRadius: "12px",
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "action.hover",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif"
                multiple
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              <Upload size={32} style={{ margin: "0 auto 8px", color: theme.palette.text.secondary }} />
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : "Click to select photo(s)"}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.5 }}>
                Supports JPEG, PNG, WebP up to 5MB
              </Typography>
            </Box>

            {/* Thumbnail previews */}
            {filePreviews.length > 0 && (
              <Box sx={{ display: "flex", gap: 1, overflowX: "auto", py: 0.5 }}>
                {filePreviews.slice(0, 4).map((preview, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={preview}
                    alt="Preview"
                    sx={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                ))}
                {filePreviews.length > 4 && (
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "8px",
                      backgroundColor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    +{filePreviews.length - 4} more
                  </Box>
                )}
              </Box>
            )}

            {/* Category Dropdown */}
            <TextField
              select
              label="Gallery Category"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              fullWidth
              size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            {/* Title / Caption */}
            <TextField
              label="Photo Title / Caption"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g., Royal Bengal Tiger at Chilla Gate"
              fullWidth
              size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button
              onClick={closeUploadDialog}
              disabled={uploading}
              sx={{ textTransform: "none", borderRadius: "10px", color: "text.secondary" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUploadSubmit}
              disabled={uploading || selectedFiles.length === 0}
              startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <Upload size={16} />}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "text.primary",
                color: "background.paper",
                "&:hover": { backgroundColor: "text.primary", opacity: 0.9 },
              }}
            >
              {uploading ? "Uploading to Cloud..." : "Upload Photo"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Lightbox Modal */}
        {previewImage && (
          <Box
            onClick={() => setPreviewImage(null)}
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 1400,
              backgroundColor: "rgba(0,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
            }}
          >
            <IconButton
              onClick={() => setPreviewImage(null)}
              sx={{ position: "absolute", top: 20, right: 20, color: "#FFFFFF" }}
            >
              <X size={24} />
            </IconButton>
            <img
              src={previewImage}
              alt="Enlarged capture"
              style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 12 }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
