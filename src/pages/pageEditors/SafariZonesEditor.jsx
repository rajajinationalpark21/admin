import { useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  TextField, 
  CircularProgress, 
  Chip, 
  IconButton,
  Tabs,
  Tab,
  Divider
} from "@mui/material";
import { Save, Plus, Trash2 } from "lucide-react";
import Header from "../../components/common/Header";
import useSectionContent from "../../components/content/useSectionContent";

export default function SafariZonesEditor() {
  const { data, setData, loading, saving, save } = useSectionContent("safari", {
    zones: [],
    vehicles: [],
  });

  const [activeZoneIdx, setActiveZoneIdx] = useState(0);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const zones = data.zones || [];
  const currentZone = zones[activeZoneIdx] || {};

  const updateCurrentZone = (field, value) => {
    const updated = [...zones];
    updated[activeZoneIdx] = {
      ...updated[activeZoneIdx],
      [field]: value,
    };
    setData(prev => ({ ...prev, zones: updated }));
  };

  const handleAddZone = () => {
    const newZone = {
      name: "New Safari Range",
      slug: `safari-zone-${Date.now()}`,
      tag: "Buffer / Core Zone",
      entryGate: "Main Gate",
      gypsyCost: "₹3,500 per Gypsy (Up to 6 persons)",
      duration: "Approx. 2.5 to 3 Hours",
      routeKm: "Approx. 25 km Circuit",
      openSeason: "15 November to 15 June",
      timings: "Morning: 6:00 AM – 8:00 AM | Afternoon: 1:30 PM – 4:30 PM",
      description: "Description of the safari range and forest habitats...",
      landscape: "Shivalik hills, Sal forests, and stream beds.",
      highlights: ["Watchtower viewpoint", "Riverbed birding"],
      wildlife: ["Asian Elephant", "Spotted Deer", "Peafowl"],
      seoTitle: "Safari Range | Rajaji National Park",
      metaDescription: "Book jeep safari in Rajaji Tiger Reserve.",
    };
    const updated = [...zones, newZone];
    setData(prev => ({ ...prev, zones: updated }));
    setActiveZoneIdx(updated.length - 1);
  };

  const handleDeleteZone = (idx) => {
    if (window.confirm(`Are you sure you want to delete "${zones[idx]?.name}"?`)) {
      const updated = zones.filter((_, i) => i !== idx);
      setData(prev => ({ ...prev, zones: updated }));
      setActiveZoneIdx(Math.max(0, idx - 1));
    }
  };

  // Highlights helpers
  const addHighlight = () => {
    const list = currentZone.highlights || [];
    updateCurrentZone("highlights", [...list, "New Highlight Point"]);
  };

  const updateHighlight = (i, val) => {
    const list = [...(currentZone.highlights || [])];
    list[i] = val;
    updateCurrentZone("highlights", list);
  };

  const removeHighlight = (i) => {
    const list = (currentZone.highlights || []).filter((_, idx) => idx !== i);
    updateCurrentZone("highlights", list);
  };

  // Wildlife helpers
  const addWildlifeTag = () => {
    const list = currentZone.wildlife || [];
    updateCurrentZone("wildlife", [...list, "Wildlife Species"]);
  };

  const removeWildlifeTag = (i) => {
    const list = (currentZone.wildlife || []).filter((_, idx) => idx !== i);
    updateCurrentZone("wildlife", list);
  };

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header
        title="Page 4: Jungle Safari & 7 Zones"
        subtitle="Manage the 7 official safari zones, entry gates, ₹3,500 Gypsy rates, routes, timings, and SEO tags"
      />

      <Box sx={{ maxWidth: "1150px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        
        {/* Top Zone Selection Tabs */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>Select Zone to Edit ({zones.length} Zones Active)</Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={handleAddZone}
              startIcon={<Plus size={14} />}
              sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem", fontWeight: 600 }}
            >
              Add Zone
            </Button>
          </Box>

          <Tabs
            value={activeZoneIdx}
            onChange={(_, val) => setActiveZoneIdx(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.8125rem",
                borderRadius: "8px",
                minHeight: 38,
                py: 0.5,
                mr: 1,
              }
            }}
          >
            {zones.map((z, idx) => (
              <Tab key={idx} label={z.name || `Zone ${idx + 1}`} />
            ))}
          </Tabs>
        </Paper>

        {/* Selected Zone Editor Form */}
        {currentZone && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 3 }}>
            
            {/* Header info */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography sx={{ fontSize: "1.2rem", fontWeight: 800 }}>{currentZone.name || "Untitled Zone"}</Typography>
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                  URL Path: /{currentZone.slug || ""}
                </Typography>
              </Box>
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => handleDeleteZone(activeZoneIdx)}
                startIcon={<Trash2 size={14} />}
                sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}
              >
                Delete Zone
              </Button>
            </Box>

            <Divider />

            {/* Core Identification */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5 }}>
              <TextField
                fullWidth
                size="small"
                label="Zone Display Name"
                value={currentZone.name || ""}
                onChange={e => updateCurrentZone("name", e.target.value)}
              />
              <TextField
                fullWidth
                size="small"
                label="SEO Slug (URL)"
                value={currentZone.slug || ""}
                onChange={e => updateCurrentZone("slug", e.target.value)}
                helperText="e.g. chilla-jeep-safari"
              />
              <TextField
                fullWidth
                size="small"
                label="Tagline / Badge"
                value={currentZone.tag || ""}
                onChange={e => updateCurrentZone("tag", e.target.value)}
              />
            </Box>

            {/* Gate, Price & Specs */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5 }}>
              <TextField
                fullWidth
                size="small"
                label="Entry Gate Location"
                value={currentZone.entryGate || ""}
                onChange={e => updateCurrentZone("entryGate", e.target.value)}
                placeholder="Chilla Gate (Near Haridwar & Rishikesh)"
              />
              <TextField
                fullWidth
                size="small"
                label="Gypsy Safari Cost"
                value={currentZone.gypsyCost || ""}
                onChange={e => updateCurrentZone("gypsyCost", e.target.value)}
                placeholder="₹3,500 per Gypsy (Up to 6 persons)"
              />
              <TextField
                fullWidth
                size="small"
                label="Open Season Dates"
                value={currentZone.openSeason || ""}
                onChange={e => updateCurrentZone("openSeason", e.target.value)}
                placeholder="15 November to 15 June"
              />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5 }}>
              <TextField
                fullWidth
                size="small"
                label="Safari Duration"
                value={currentZone.duration || ""}
                onChange={e => updateCurrentZone("duration", e.target.value)}
                placeholder="Approx. 2.5 to 3 Hours"
              />
              <TextField
                fullWidth
                size="small"
                label="Safari Route (km)"
                value={currentZone.routeKm || ""}
                onChange={e => updateCurrentZone("routeKm", e.target.value)}
                placeholder="Approx. 36 km Circuit"
              />
              <TextField
                fullWidth
                size="small"
                label="Shift Timings"
                value={currentZone.timings || ""}
                onChange={e => updateCurrentZone("timings", e.target.value)}
                placeholder="Morning: 6:00 AM | Afternoon: 1:30 PM"
              />
            </Box>

            {/* Descriptions */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                label="Main Zone Description"
                value={currentZone.description || ""}
                onChange={e => updateCurrentZone("description", e.target.value)}
              />
              <TextField
                fullWidth
                size="small"
                label="Landscape & Topography"
                value={currentZone.landscape || ""}
                onChange={e => updateCurrentZone("landscape", e.target.value)}
                placeholder="Riverine plains, dense Sal forest canopies, open grasslands..."
              />
            </Box>

            {/* Highlights List */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>Key Zone Highlights</Typography>
                <Button size="small" onClick={addHighlight} sx={{ fontSize: "0.75rem", textTransform: "none" }}>+ Add Highlight</Button>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {(currentZone.highlights || []).map((h, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={h}
                      onChange={e => updateHighlight(i, e.target.value)}
                    />
                    <IconButton size="small" color="error" onClick={() => removeHighlight(i)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Wildlife Tags */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 700 }}>Wildlife Commonly Sighted</Typography>
                <Button size="small" onClick={addWildlifeTag} sx={{ fontSize: "0.75rem", textTransform: "none" }}>+ Add Animal</Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {(currentZone.wildlife || []).map((w, i) => (
                  <Chip
                    key={i}
                    label={w}
                    onDelete={() => removeWildlifeTag(i)}
                    sx={{ borderRadius: "8px" }}
                  />
                ))}
              </Box>
            </Box>

            {/* SEO Tags */}
            <Box sx={{ p: 2, borderRadius: "12px", backgroundColor: "action.hover", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="SEO Meta Title"
                value={currentZone.seoTitle || ""}
                onChange={e => updateCurrentZone("seoTitle", e.target.value)}
              />
              <TextField
                fullWidth
                size="small"
                label="SEO Meta Description"
                value={currentZone.metaDescription || ""}
                onChange={e => updateCurrentZone("metaDescription", e.target.value)}
              />
            </Box>
          </Paper>
        )}

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
            {saving ? "Saving Changes..." : "Save All Safari Zones"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
