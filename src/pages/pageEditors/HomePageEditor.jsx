import { Box, Typography, Button, Paper, TextField, CircularProgress } from "@mui/material";
import { Save, Layers, Sparkles } from "lucide-react";
import Header from "../../components/common/Header";
import useSectionContent from "../../components/content/useSectionContent";

export default function HomePageEditor() {
  const { data, setData, loading, saving, save } = useSectionContent("home", {
    tagline: "",
    heroTitle: "",
    heroSubtitle: "",
    heroBanner: "",
    timings: "",
    zones: "",
    rules: "",
    aboutTitle: "",
    aboutDescription: "",
    stats: { tigers: "50+", sqKm: "820+", acres: "120k" },
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const setField = (key, val) => setData(prev => ({ ...prev, [key]: val }));
  const setStat = (key, val) => setData(prev => ({ ...prev, stats: { ...(prev.stats || {}), [key]: val } }));

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header
        title="Page 1: Home & About Rajaji"
        subtitle="Manage hero banner, tagline, timings, sanctuary legacy, and homepage statistics"
      />

      <Box sx={{ maxWidth: "1100px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3, display: "flex", flexDirection: "column", gap: 3.5 }}>
        
        {/* Hero Section Card */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Layers size={18} className="text-emerald-600" />
            <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Hero Banner & Headings</Typography>
          </Box>
          <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mb: 2.5 }}>
            Main banner and high-impact introductory text that greets visitors at the top of the homepage.
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              label="Hero Main Title"
              value={data.heroTitle || ""}
              onChange={e => setField("heroTitle", e.target.value)}
              placeholder="e.g. Experience the Heart of the Jungle"
            />
            <TextField
              fullWidth
              size="small"
              label="Tagline / Badge"
              value={data.tagline || ""}
              onChange={e => setField("tagline", e.target.value)}
              placeholder="e.g. Unleash Your Wild Side"
            />
          </Box>

          <Box sx={{ mt: 2.5 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              label="Hero Subtitle Narrative"
              value={data.heroSubtitle || ""}
              onChange={e => setField("heroSubtitle", e.target.value)}
              placeholder="Track royal Bengal tigers across open meadows, listen to the forest wake at dawn..."
            />
          </Box>

          <Box sx={{ mt: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              label="Hero Banner Image URL"
              value={data.heroBanner || ""}
              onChange={e => setField("heroBanner", e.target.value)}
              placeholder="https://images.unsplash.com/..."
              helperText="Paste direct image URL or Cloudinary asset link"
            />
          </Box>
        </Paper>

        {/* 3 Quick Info Cards */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ fontSize: "1.05rem", fontWeight: 700, mb: 1 }}>3 Floating Cards (Timings, Zones, Rules)</Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mb: 2.5 }}>
            Quick informational pills displayed directly under the hero banner.
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              label="Timings Overview"
              value={data.timings || ""}
              onChange={e => setField("timings", e.target.value)}
              placeholder="06:00 AM - 06:00 PM"
            />
            <TextField
              fullWidth
              size="small"
              label="Zones Overview"
              value={data.zones || ""}
              onChange={e => setField("zones", e.target.value)}
              placeholder="Chilla, Motichur & Ranipur"
            />
            <TextField
              fullWidth
              size="small"
              label="Rules Overview"
              value={data.rules || ""}
              onChange={e => setField("rules", e.target.value)}
              placeholder="Do's & Don'ts Guide"
            />
          </Box>
        </Paper>

        {/* Sanctuary Legacy (About Rajaji Section) */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Sparkles size={18} className="text-amber-500" />
            <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>About Rajaji – Sanctuary Legacy</Typography>
          </Box>
          <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mb: 2.5 }}>
            The official heritage and conservation narrative for Rajaji Tiger Reserve displayed on the Home page.
          </Typography>

          <Box sx={{ mb: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              label="About Section Heading"
              value={data.aboutTitle || ""}
              onChange={e => setField("aboutTitle", e.target.value)}
              placeholder="The Sanctuary Legacy"
            />
          </Box>

          <Box sx={{ mb: 2.5 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              size="small"
              label="Sanctuary Story & Conservation Narrative"
              value={data.aboutDescription || ""}
              onChange={e => setField("aboutDescription", e.target.value)}
              placeholder="Dedicated to conservation and protecting our wildlife for generations to come..."
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              label="Tigers Protected Stat"
              value={data.stats?.tigers || ""}
              onChange={e => setStat("tigers", e.target.value)}
              placeholder="50+"
            />
            <TextField
              fullWidth
              size="small"
              label="Forest Area (Sq Km) Stat"
              value={data.stats?.sqKm || ""}
              onChange={e => setStat("sqKm", e.target.value)}
              placeholder="820+"
            />
          </Box>
        </Paper>

        {/* Sticky Action Footer */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2, pb: 4 }}>
          <Button
            variant="contained"
            disabled={saving}
            onClick={save}
            startIcon={saving ? <CircularProgress size={16} /> : <Save size={16} />}
            sx={{
              borderRadius: "12px",
              backgroundColor: "text.primary",
              color: "background.paper",
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              py: 1.2,
              px: 3.5,
              "&:hover": { backgroundColor: "text.primary", opacity: 0.9 },
            }}
          >
            {saving ? "Saving Changes..." : "Save Home Page Content"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
