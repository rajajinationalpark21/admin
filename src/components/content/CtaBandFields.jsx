import { Box, Typography, TextField } from "@mui/material";
import ImageUploadField from "../common/ImageUploadField";

/** The booking band at the bottom of a page: wording, second button's link and background photo. */
export default function CtaBandFields({ value, onChange, title = "Booking band at the bottom of the page" }) {
  const band = value || {};
  const set = (key) => (e) => onChange({ ...band, [key]: e.target.value });

  return (
    <Box sx={{ p: 2.5, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "grid", gap: 2 }}>
      <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>{title}</Typography>
      <TextField size="small" fullWidth label="Heading" value={band.title || ""} onChange={set("title")} />
      <TextField size="small" fullWidth multiline minRows={2} label="Text" value={band.subtitle || ""} onChange={set("subtitle")} />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
        <TextField size="small" label="Main button text (opens booking)" value={band.primaryText || ""} onChange={set("primaryText")} />
        <TextField size="small" label="Second button text" value={band.secondaryText || ""} onChange={set("secondaryText")} />
        <TextField size="small" label="Second button link" placeholder="/zones" value={band.secondaryLink || ""} onChange={set("secondaryLink")} />
      </Box>
      <ImageUploadField
        label="Background photo"
        value={band.bgImage || ""}
        onChange={(next) => onChange({ ...band, bgImage: next })}
        helperText="Leave empty to keep the default jungle photo"
      />
    </Box>
  );
}
