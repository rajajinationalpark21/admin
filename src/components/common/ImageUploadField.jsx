import { useState, useRef } from "react";
import { Box, Typography, Button, TextField, CircularProgress, IconButton } from "@mui/material";
import { Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api/apiClient";

export default function ImageUploadField({ label, value, onChange, helperText, placeholder, allowUrl = true, compact = false }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Image file size exceeds 50MB limit");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      // Backend route is mounted at /uploads/image
      const res = await api.post("uploads/image", formData);
      const url = res.data?.image?.url || res.data?.url;
      if (url) {
        onChange(url);
        toast.success("Image compressed and uploaded successfully!");
      } else {
        toast.error("Upload did not return a valid URL");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {label && (
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
          {label}
        </Typography>
      )}

      {value && !compact && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxHeight: 200,
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={value}
            alt={label || "Uploaded preview"}
            style={{ width: "100%", height: "180px", objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <IconButton
            size="small"
            onClick={() => onChange("")}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
            }}
            title="Remove Image"
          >
            <X size={16} />
          </IconButton>
        </Box>
      )}

      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        {compact && value && (
          <Box
            sx={{
              position: "relative",
              width: 56,
              height: 56,
              flexShrink: 0,
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <img
              src={value}
              alt={label || "Uploaded preview"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <IconButton
              size="small"
              onClick={() => onChange("")}
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                padding: "2px",
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
              }}
              title="Remove Image"
            >
              <X size={12} />
            </IconButton>
          </Box>
        )}
        {allowUrl && (
          <TextField
            fullWidth
            size="small"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "https://res.cloudinary.com/... or paste URL"}
            helperText={helperText || "Upload a local image or paste a direct image URL"}
          />
        )}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <Button
          variant="outlined"
          size="small"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          startIcon={uploading ? <CircularProgress size={16} /> : <Upload size={16} />}
          sx={{
            whiteSpace: "nowrap",
            minWidth: compact ? 110 : allowUrl ? 140 : 160,
            height: 40,
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "0.8125rem",
          }}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </Button>
      </Box>
      {!allowUrl && helperText && (
        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: -0.5 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
