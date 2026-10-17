import { useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  TextField, 
  CircularProgress, 
  IconButton,
  Tabs,
  Tab
} from "@mui/material";
import { Save, Plus, Trash2 } from "lucide-react";
import Header from "../../components/common/Header";
import ImageUploadField from "../../components/common/ImageUploadField";
import HeroImageListField from "../../components/common/HeroImageListField";
import useSectionContent from "../../components/content/useSectionContent";

export default function ActivitiesEditor() {
  const { data: actData, setData: setActData, loading: actLoading, saving: actSaving, save: saveAct } = useSectionContent("activities", {
    title: "",
    subtitle: "",
    heroBanner: "",
    items: [],
  });

  const { data: raftData, setData: setRaftData, loading: raftLoading, saving: raftSaving, save: saveRaft } = useSectionContent("rafting", {
    title: "",
    subtitle: "",
    heroBanner: "",
    heroImages: [],
    overview: "",
    stretches: [],
    safetyGuidelines: [],
  });

  const [activeTab, setActiveTab] = useState(0);

  if (actLoading || raftLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const isSaving = actSaving || raftSaving;

  const handleSaveAll = async () => {
    await saveAct();
    await saveRaft();
  };

  // Activity Helpers
  const addActivity = () => {
    const list = actData.items || [];
    setActData(prev => ({
      ...prev,
      items: [...list, { title: "New Activity", tagline: "Adventure Tag", slug: "/zones", desc: "Description of experience...", image: "", cta: "Explore More" }]
    }));
  };

  const updateActivity = (idx, field, val) => {
    const list = [...(actData.items || [])];
    list[idx] = { ...list[idx], [field]: val };
    setActData(prev => ({ ...prev, items: list }));
  };

  const removeActivity = (idx) => {
    setActData(prev => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== idx)
    }));
  };

  // Rafting Helpers
  const addStretch = () => {
    const list = raftData.stretches || [];
    setRaftData(prev => ({
      ...prev,
      stretches: [...list, { name: "New River Run", distance: "16 km Stretch", duration: "Approx. 3 Hours", rapids: "Grade II & III", level: "Moderate", price: "₹1,000 per person", desc: "Stretch description...", image: "" }]
    }));
  };

  const updateStretch = (idx, field, val) => {
    const list = [...(raftData.stretches || [])];
    list[idx] = { ...list[idx], [field]: val };
    setRaftData(prev => ({ ...prev, stretches: list }));
  };

  const removeStretch = (idx) => {
    setRaftData(prev => ({
      ...prev,
      stretches: (prev.stretches || []).filter((_, i) => i !== idx)
    }));
  };

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header
        title="6. Activities at Rajaji & River Rafting"
        subtitle="Manage the 4 primary park activities, preview cards, and Ganges river rafting expedition stretches"
      />

      <Box sx={{ maxWidth: "1100px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3, display: "flex", flexDirection: "column", gap: 3.5 }}>
        
        {/* Navigation Tabs */}
        <Paper elevation={0} sx={{ p: 1, borderRadius: "14px", border: "1px solid", borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.85rem", minHeight: 42 }
            }}
          >
            <Tab label="1. Activities Overview (4 Activities)" />
            <Tab label="2. Ganges River Rafting Stretches" />
          </Tabs>
        </Paper>

        {/* Tab 0: Activities Hub */}
        {activeTab === 0 && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box>
                <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>3 Official Park Activities</Typography>
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                  Jeep Safari, Stay in Rajaji and River Rafting.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button 
                  size="small" 
                  variant="contained" 
                  disabled={isSaving} 
                  onClick={handleSaveAll} 
                  startIcon={isSaving ? <CircularProgress size={14} /> : <Save size={14} />} 
                  sx={{ 
                    borderRadius: "8px", 
                    textTransform: "none", 
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    backgroundColor: "text.primary",
                    color: "background.paper",
                    "&:hover": { backgroundColor: "text.primary", opacity: 0.9 },
                  }}
                >
                  {isSaving ? "Saving..." : "Save Page & Header"}
                </Button>
                <Button size="small" variant="outlined" onClick={addActivity} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
                  Add Activity
                </Button>
              </Box>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5, mb: 2.5 }}>
              <TextField
                fullWidth
                size="small"
                label="Page Main Heading"
                value={actData.title || ""}
                onChange={e => setActData(prev => ({ ...prev, title: e.target.value }))}
              />
              <TextField
                fullWidth
                size="small"
                label="Page Subtitle"
                value={actData.subtitle || ""}
                onChange={e => setActData(prev => ({ ...prev, subtitle: e.target.value }))}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <ImageUploadField
                label="Activities Page Header Banner Image"
                value={actData.heroBanner || ""}
                onChange={val => setActData(prev => ({ ...prev, heroBanner: val }))}
                placeholder="https://res.cloudinary.com/... or upload image"
                helperText="Upload local photo (auto-compressed to WebP) or paste image URL for the /activities hero banner"
              />
              <Box sx={{ mt: 3 }}>
                <HeroImageListField value={actData.heroImages} onChange={val => setActData(prev => ({ ...prev, heroImages: val }))} fallbackValue={actData.heroBanner} />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {(actData.items || []).map((item, idx) => (
                <Box key={idx} sx={{ p: 2.5, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>#{idx + 1} {item.title}</Typography>
                    <IconButton size="small" color="error" onClick={() => removeActivity(idx)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 2fr 1fr 1fr" }, gap: 2 }}>
                    <TextField
                      size="small"
                      label="Title"
                      value={item.title || ""}
                      onChange={e => updateActivity(idx, "title", e.target.value)}
                    />
                    <TextField
                      size="small"
                      label="Tagline"
                      value={item.tagline || ""}
                      onChange={e => updateActivity(idx, "tagline", e.target.value)}
                    />
                    <TextField
                      size="small"
                      label="Link Slug"
                      value={item.slug || ""}
                      onChange={e => updateActivity(idx, "slug", e.target.value)}
                    />
                    <TextField
                      size="small"
                      label="CTA Button Text"
                      value={item.cta || ""}
                      onChange={e => updateActivity(idx, "cta", e.target.value)}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    label="Description Blurb"
                    value={item.desc || ""}
                    onChange={e => updateActivity(idx, "desc", e.target.value)}
                  />

                  <ImageUploadField
                    label="Activity Card Image"
                    value={item.image || ""}
                    onChange={(val) => updateActivity(idx, "image", val)}
                    placeholder="https://images.unsplash.com/..."
                    helperText="Upload a photo for this activity card, or paste a direct image URL"
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        )}

        {/* Tab 1: River Rafting */}
        {activeTab === 1 && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box>
                <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Ganges River Rafting Expeditions</Typography>
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                  Shivpuri, Marine Drive, and Brahmpuri river runs adjoining Rajaji boundary.
                </Typography>
              </Box>
              <Button size="small" variant="outlined" onClick={addStretch} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
                Add Rafting Stretch
              </Button>
            </Box>

            <Box sx={{ mb: 3, p: 2.5, borderRadius: "12px", border: "1px solid", borderColor: "divider" }}>
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, mb: 2 }}>Rafting Page Header</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Page Title"
                  value={raftData.title || ""}
                  onChange={e => setRaftData(prev => ({ ...prev, title: e.target.value }))}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Page Subtitle"
                  value={raftData.subtitle || ""}
                  onChange={e => setRaftData(prev => ({ ...prev, subtitle: e.target.value }))}
                />
              </Box>
              <ImageUploadField
                label="Rafting Page Header Banner Image"
                value={raftData.heroBanner || ""}
                onChange={val => setRaftData(prev => ({ ...prev, heroBanner: val }))}
                placeholder="https://res.cloudinary.com/... or upload image"
                helperText="Upload local photo (auto-compressed to WebP) or paste image URL for the /rafting hero banner"
              />
              <Box sx={{ mt: 3 }}>
                <HeroImageListField value={raftData.heroImages} onChange={val => setRaftData(prev => ({ ...prev, heroImages: val }))} fallbackValue={raftData.heroBanner} />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {(raftData.stretches || []).map((run, idx) => (
                <Box key={idx} sx={{ p: 2.5, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>#{idx + 1} {run.name}</Typography>
                    <IconButton size="small" color="error" onClick={() => removeStretch(idx)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr 1fr 1.5fr" }, gap: 2 }}>
                    <TextField
                      size="small"
                      label="Stretch Name"
                      value={run.name || ""}
                      onChange={e => updateStretch(idx, "name", e.target.value)}
                    />
                    <TextField
                      size="small"
                      label="Distance"
                      value={run.distance || ""}
                      onChange={e => updateStretch(idx, "distance", e.target.value)}
                    />
                    <TextField
                      size="small"
                      label="Duration"
                      value={run.duration || ""}
                      onChange={e => updateStretch(idx, "duration", e.target.value)}
                    />
                    <TextField
                      size="small"
                      label="Level"
                      value={run.level || ""}
                      onChange={e => updateStretch(idx, "level", e.target.value)}
                    />
                    <TextField
                      size="small"
                      label="Price Estimate"
                      value={run.price || ""}
                      onChange={e => updateStretch(idx, "price", e.target.value)}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    label="Description & Rapids Info"
                    value={run.desc || ""}
                    onChange={e => updateStretch(idx, "desc", e.target.value)}
                  />

                  <ImageUploadField
                    label="Stretch Photo"
                    value={run.image || ""}
                    onChange={(val) => updateStretch(idx, "image", val)}
                    placeholder="https://res.cloudinary.com/... or paste URL"
                    helperText="Upload a photo for this rafting stretch card, or paste a direct image URL"
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        )}

        {/* Sticky Action Footer */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2, pb: 4 }}>
          <Button
            variant="contained"
            disabled={isSaving}
            onClick={handleSaveAll}
            startIcon={isSaving ? <CircularProgress size={16} /> : <Save size={16} />}
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
            {isSaving ? "Saving Changes..." : "Save Activities & Rafting"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
