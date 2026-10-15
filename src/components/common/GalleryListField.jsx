import { Box, Typography, TextField } from "@mui/material";
import ImageUploadField from "./ImageUploadField";

/**
 * A page's photo gallery: its title and any number of photos, in order.
 * An empty slot at the end adds a photo; clearing a photo removes it.
 */
export default function GalleryListField({ heading = "Photo gallery", title, onTitleChange, value, onChange, titlePlaceholder }) {
  const images = (value || []).filter(Boolean);

  return (
    <Box sx={{ pt: 1 }}>
      <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, mb: 0.5 }}>{heading}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Photos shown in the gallery section of this page, in this order ({images.length} photos).
      </Typography>
      {onTitleChange && (
        <TextField
          fullWidth
          size="small"
          label="Gallery Title"
          value={title || ""}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={titlePlaceholder}
          sx={{ mb: 2 }}
        />
      )}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
        {[...images, ""].map((image, index) => (
          <ImageUploadField
            key={image || "add-gallery-image"}
            label={image ? `Gallery photo ${index + 1}` : "Add gallery photo"}
            value={image}
            onChange={(nextValue) => {
              const next = [...images];
              if (nextValue) next[index] = nextValue;
              else next.splice(index, 1);
              onChange(next);
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
