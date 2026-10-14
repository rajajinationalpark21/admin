import { Box, Typography } from "@mui/material";
import ImageUploadField from "./ImageUploadField";

// A single image remains static; two or more rotate automatically on the public header.
export default function HeroImageListField({ value = [], onChange, fallbackValue = "", label = "Header images" }) {
  const images = (value || []).filter(Boolean);
  const update = (index, nextValue) => {
    const next = [...images];
    if (nextValue) next[index] = nextValue;
    else next.splice(index, 1);
    onChange(next);
  };
  return <Box>
    <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, mb: 0.5 }}>{label}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>One image stays fixed. Add two or more images to automatically rotate through them in the public header.</Typography>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
      {[...images, ""].map((image, index) => <ImageUploadField key={image || "add-header-image"} label={image ? `Header image ${index + 1}` : "Add header image"} value={image} onChange={(nextValue) => update(index, nextValue)} helperText={index === 0 && !image && fallbackValue ? "Leave empty to use the current fallback image." : ""} />)}
    </Box>
  </Box>;
}
