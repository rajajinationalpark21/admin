import { Box, Button, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import { CalendarCheck, Save } from "lucide-react";
import Header from "../../components/common/Header";
import ImageUploadField from "../../components/common/ImageUploadField";
import HeroImageListField from "../../components/common/HeroImageListField";
import useSectionContent from "../../components/content/useSectionContent";

// Mirrors the public Booking page fallbacks so editors start from the live copy.
const defaults = {
  heroTitle: "Book Your Rajaji Jeep Safari",
  heroSubtitle: "Share your preferred date, zone and visitor details. Our team will help you check availability, permit requirements and booking options.",
  heroBanner: "",
  heroImages: [],
};

export default function BookingPageEditor() {
  const { data, setData, loading, saving, save } = useSectionContent("booking", defaults);
  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", pt: 12 }}><CircularProgress /></Box>;
  const setField = (key, value) => setData((current) => ({ ...current, [key]: value }));

  return <Box sx={{ minHeight: "100%", pb: 6 }}>
    <Header title="Booking Page" subtitle="Manage the header shown at the top of the public /booking page." />
    <Box sx={{ maxWidth: 1000, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3 }}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}><CalendarCheck size={18} /><Typography fontWeight={700}>Booking Page Header</Typography></Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Leave the banner empty to use the default Chilla riverbed photo.</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5, mb: 2.5 }}>
          <TextField fullWidth size="small" label="Header title" value={data.heroTitle || ""} onChange={(e) => setField("heroTitle", e.target.value)} />
          <TextField fullWidth size="small" multiline minRows={2} label="Header subtitle" value={data.heroSubtitle || ""} onChange={(e) => setField("heroSubtitle", e.target.value)} />
        </Box>
        <ImageUploadField label="Fallback header image" value={data.heroBanner || ""} onChange={(value) => setField("heroBanner", value)} helperText="Used when no rotating header images are added." />
        <Box sx={{ mt: 3 }}><HeroImageListField value={data.heroImages} onChange={(value) => setField("heroImages", value)} fallbackValue={data.heroBanner} /></Box>
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 3 }}><Button variant="contained" onClick={save} disabled={saving} startIcon={saving ? <CircularProgress size={16} /> : <Save size={16} />} sx={{ borderRadius: 3, textTransform: "none", px: 3 }}>{saving ? "Saving…" : "Save Booking Page"}</Button></Box>
    </Box>
  </Box>;
}
