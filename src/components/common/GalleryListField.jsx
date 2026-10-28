import { Box, Typography, TextField } from "@mui/material";
import ImageUploadField from "./ImageUploadField";

/**
 * A page's photo gallery: its title and any number of photos, in order.
 * An empty slot at the end adds a photo; clearing a photo removes it.
 *
 * When `alts` is given, each photo also gets a description box (what Google and
 * screen readers read). `onChange(images, alts)` receives both lists, kept in step.
 */
export default function GalleryListField({
  heading = "Photo gallery",
  title,
  onTitleChange,
  value,
  onChange,
  alts,
  titlePlaceholder,
  allowUrl = true,
}) {
  const images = (value || []).filter(Boolean);
  const describe = Array.isArray(alts);
  const descriptions = images.map((_, index) => (describe && alts[index]) || "");

  const setImage = (index, nextValue) => {
    const nextImages = [...images];
    const nextAlts = [...descriptions];
    if (nextValue) {
      nextImages[index] = nextValue;
      // A new photo needs its own description.
      nextAlts[index] = "";
    } else {
      nextImages.splice(index, 1);
      nextAlts.splice(index, 1);
    }
    onChange(nextImages, nextAlts);
  };
  const setDescription = (index, text) => {
    const nextAlts = [...descriptions];
    nextAlts[index] = text;
    onChange(images, nextAlts);
  };

  return (
    <Box sx={{ pt: 1 }}>
      {heading && (
        <>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, mb: 0.5 }}>{heading}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Photos shown in the gallery section of this page, in this order ({images.length} photos).
            {describe && " Describe what each photo shows; Google reads these descriptions. Left empty, the page's name is used."}
          </Typography>
        </>
      )}
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
          <Box key={image || "add-gallery-image"} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <ImageUploadField
              label={image ? `Gallery photo ${index + 1}` : "Add gallery photo"}
              value={image}
              onChange={(nextValue) => setImage(index, nextValue)}
              allowUrl={allowUrl}
            />
            {describe && image && (
              <TextField
                fullWidth
                size="small"
                label={`Photo ${index + 1} description`}
                value={descriptions[index]}
                onChange={(event) => setDescription(index, event.target.value)}
                placeholder="e.g. Elephant herd crossing a riverbed in the Chilla zone"
                slotProps={{ htmlInput: { maxLength: 300 } }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
