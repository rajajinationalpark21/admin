import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/common/Header";
import { Upload, Trash2, X, Image as ImageIcon, Check } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/apiClient";

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      await api.post("gallery/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`${files.length} image(s) uploaded successfully!`);
      fetchImages();
    } catch (error) {
      toast.error("Failed to upload images");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await api.delete("gallery/delete", { data: { imageId: id } });
      toast.success("Image deleted successfully!");
      fetchImages();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    if (!window.confirm(`Delete ${selectedImages.length} selected image(s)?`)) return;

    try {
      await Promise.all(
        selectedImages.map((id) => api.delete("gallery/delete", { data: { imageId: id } }))
      );
      toast.success(`${selectedImages.length} image(s) deleted!`);
      setSelectedImages([]);
      fetchImages();
    } catch (error) {
      toast.error("Failed to delete some images");
    }
  };

  const toggleSelect = (id) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Gallery Manager" />
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 text-sm"
            >
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload"}
            </motion.button>
            {selectedImages.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-sm"
              >
                <Trash2 size={14} />
                Delete ({selectedImages.length})
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-400">{images.length} photos</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-gray-400 mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Loading gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center text-gray-400 mt-8 sm:mt-12 py-8 sm:py-16">
            <ImageIcon size={48} className="mx-auto mb-4 text-gray-600 sm:w-16 sm:h-16" />
            <p className="text-base sm:text-lg">No photos in gallery</p>
            <p className="text-xs sm:text-sm mt-1">Click "Upload" to add images</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4"
          >
            {images.map((img, index) => {
              const imgId = img._id || img.imageId || index;
              const imgUrl = img.url || img.imageUrl || img.image;
              const isSelected = selectedImages.includes(imgId);

              return (
                <motion.div
                  key={imgId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className={`relative group rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                    isSelected ? "border-green-500 ring-2 ring-green-500/50" : "border-transparent hover:border-gray-600"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={img.title || `Gallery ${index + 1}`}
                    className="w-full aspect-square object-cover cursor-pointer"
                    onClick={() => setPreviewImage(imgUrl)}
                  />

                  {/* Desktop overlay */}
                  <div className="hidden sm:flex absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSelect(imgId); }}
                      className={`p-2 rounded-full mr-2 ${
                        isSelected ? "bg-green-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {isSelected ? <Check size={14} /> : ""}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(imgId); }}
                      className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Mobile action buttons */}
                  <div className="sm:hidden absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSelect(imgId); }}
                      className={`p-1.5 rounded-full text-xs ${
                        isSelected ? "bg-green-500 text-white" : "bg-black/50 text-white"
                      }`}
                    >
                      <Check size={12} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(imgId); }}
                      className="p-1.5 rounded-full bg-red-500/80 text-white"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {img.category && (
                    <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 px-1.5 sm:px-2 py-0.5 bg-black/60 rounded text-[10px] sm:text-xs text-white">
                      {img.category}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Preview Modal */}
        <AnimatePresence>
          {previewImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setPreviewImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute -top-10 right-0 sm:top-0 sm:-right-10 text-white hover:text-gray-300 p-2"
                >
                  <X size={28} />
                </button>
                <img src={previewImage} alt="Preview" className="max-w-full max-h-[85vh] rounded-lg object-contain" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default GalleryManager;
