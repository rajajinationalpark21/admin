import { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { Save, Upload, Plus, Trash2, Layers, Info, Compass, CheckCircle2, Image as ImageIcon, FileText } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/apiClient";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
  IconButton,
  Divider,
  useTheme,
  Checkbox,
  FormGroup,
  FormControlLabel
} from "@mui/material";

import BirdsTab from "../components/content/BirdsTab";
import FaunaTab from "../components/content/FaunaTab";
import FloraTab from "../components/content/FloraTab";
import ButterfliesTab from "../components/content/ButterfliesTab";
import ParkRulesTab from "../components/content/ParkRulesTab";
import TicketsTab from "../components/content/TicketsTab";
import HowToReachTab from "../components/content/HowToReachTab";
import StayTab from "../components/content/StayTab";
import BirdingAreasTab from "../components/content/BirdingAreasTab";
import EcoTourismTab from "../components/content/EcoTourismTab";
export default function ContentManager() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [homeContent, setHomeContent] = useState({
    tagline: "",
    heroTitle: "",
    heroSubtitle: "",
    heroBanner: null,
    heroBannerPreview: "",
    timings: "",
    zones: "",
    rules: "",
    aboutTitle: "",
    aboutDescription: "",
    stats: { tigers: "", acres: "" },
    featuredBlogs: [],
    featuredGallery: [],
  });

  const [allBlogs, setAllBlogs] = useState([]);
  const [allGallery, setAllGallery] = useState([]);

  const [aboutContent, setAboutContent] = useState({
    title: "",
    subtitle: "",
    missionTitle: "",
    missionText: "",
    stats: { tigers: "", birds: "", sqKm: "", visitors: "" },
    journey: [{ year: "", title: "", description: "" }],
    activities: [{ name: "", image: null, imagePreview: "" }],
  });

  const [safariContent, setSafariContent] = useState({
    title: "",
    subtitle: "",
    zones: [{ name: "", description: "", timings: "" }],
    animals: [""],
    rules: [""],
    vehicles: [{ name: "", description: "" }],
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get("content/get");
        const data = res.data?.data || res.data || {};
        if (data.home) setHomeContent((prev) => ({ ...prev, ...data.home }));
        if (data.about) setAboutContent((prev) => ({ ...prev, ...data.about }));
        if (data.safari) setSafariContent((prev) => ({ ...prev, ...data.safari }));
      } catch (error) {
        console.log("No existing content, starting fresh");
      } finally {
        setLoading(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const res = await api.get("blogs/get");
        const blogs = res.data?.data?.blogs || res.data?.blogs || [];
        setAllBlogs(Array.isArray(blogs) ? blogs : []);
      } catch { setAllBlogs([]); }
    };

    const fetchGallery = async () => {
      try {
        const res = await api.get("gallery/get");
        const images = res.data?.data?.images || res.data?.images || [];
        setAllGallery(Array.isArray(images) ? images : []);
      } catch { setAllGallery([]); }
    };

    fetchContent();
    fetchBlogs();
    fetchGallery();
  }, []);

  const handleSave = async (section) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("section", section);

      if (section === "home") {
        const payload = { ...homeContent };
        if (payload.heroBanner instanceof File) {
          formData.append("heroBanner", payload.heroBanner);
          payload.heroBanner = "";
        }
        formData.append("content", JSON.stringify(payload));
      } else if (section === "about") {
        formData.append("content", JSON.stringify(aboutContent));
      } else if (section === "safari") {
        formData.append("content", JSON.stringify(safariContent));
      }

      await api.post("content/update", formData);
      toast.success(`${section.toUpperCase()} content saved successfully!`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save content");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "home", label: "Home", icon: Layers },
    { id: "about", label: "About", icon: Info },
    { id: "safari", label: "Safari", icon: Compass },
    { id: "birds", label: "Birds" },
    { id: "fauna", label: "Fauna" },
    { id: "flora", label: "Flora" },
    { id: "butterflies", label: "Butterflies" },
    { id: "parkRules", label: "Park Rules" },
    { id: "tickets", label: "Tickets" },
    { id: "howToReach", label: "How To Reach" },
    { id: "stay", label: "Stay" },
    { id: "birdingAreas", label: "Birding Areas" },
    { id: "ecoTourism", label: "Eco-Tourism" },
  ];

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header
        title="Park Content Manager"
        subtitle="Manage all park website content from the database"
      />

      <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3 }}>
        {/* Tab Bar */}
        <Box
          className="hide-scrollbar"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            p: 0.5,
            borderRadius: "10px",
            backgroundColor: "action.hover",
            border: "1px solid",
            borderColor: "divider",
            mb: { xs: 1.5, sm: 3 },
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            flexWrap: { xs: "nowrap", md: "wrap" },
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Box
                component="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: { xs: 1.5, sm: 2 },
                  py: 1,
                  borderRadius: "8px",
                  fontSize: "0.8125rem",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: isActive ? "background.paper" : "transparent",
                  color: isActive ? "text.primary" : "text.secondary",
                  boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                  scrollSnapAlign: "start",
                  minHeight: 40,
                  flexShrink: 0,
                  WebkitTapHighlightColor: "transparent",
                  "&:hover": { color: "text.primary" },
                }}
              >
                {Icon && <Icon size={15} />}
                <span>{tab.label}</span>
              </Box>
            );
          })}
        </Box>

        {loading ? (
          <Box sx={{ py: 12, textAlign: "center" }}>
            <CircularProgress size={28} sx={{ mb: 2 }} />
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Loading park content...</Typography>
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              backgroundColor: "background.paper",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              p: { xs: 2.5, sm: 4 },
            }}
          >
            {/* Home Tab */}
            {activeTab === "home" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography sx={{ fontSize: "1.125rem", fontWeight: 700, color: "text.primary" }}>Home Page Content</Typography>
                  <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5 }}>Configure the main website welcome message and hero visuals.</Typography>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                  <TextField fullWidth label="Hero Tagline" value={homeContent.tagline} onChange={(e) => setHomeContent({ ...homeContent, tagline: e.target.value })} size="small" />
                  <TextField fullWidth label="Hero Main Title" value={homeContent.heroTitle} onChange={(e) => setHomeContent({ ...homeContent, heroTitle: e.target.value })} size="small" />
                </Box>

                <TextField fullWidth multiline rows={3} label="Hero Subtitle" value={homeContent.heroSubtitle} onChange={(e) => setHomeContent({ ...homeContent, heroSubtitle: e.target.value })} />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  <Button variant="outlined" component="label" startIcon={<Upload size={16} />} sx={{ borderRadius: "12px", borderColor: "divider", color: "text.primary", textTransform: "none", fontWeight: 600, fontSize: "0.8125rem" }}>
                    Upload Hero Banner
                    <input type="file" accept="image/*" hidden onChange={(e) => { const file = e.target.files[0]; if (file) setHomeContent({ ...homeContent, heroBanner: file, heroBannerPreview: URL.createObjectURL(file) }); }} />
                  </Button>
                  {homeContent.heroBannerPreview && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={homeContent.heroBannerPreview} alt="Hero Banner Preview" style={{ width: 80, height: 48, objectFit: "cover", borderRadius: 8, border: `1px solid ${theme.palette.divider}` }} />
                      <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>Banner image loaded</Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                  <TextField fullWidth label="Safari Timings" value={homeContent.timings} onChange={(e) => setHomeContent({ ...homeContent, timings: e.target.value })} size="small" />
                  <TextField fullWidth label="Available Ranges & Zones" value={homeContent.zones} onChange={(e) => setHomeContent({ ...homeContent, zones: e.target.value })} size="small" />
                </Box>

                {/* Featured Blogs Selection */}
                <Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    <FileText size={16} color={theme.palette.text.secondary} />
                    <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Featured Blogs on Homepage</Typography>
                  </Box>
                  <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 1.5 }}>
                    Select up to 3 blog posts to display on the homepage. If none selected, latest 3 are shown.
                  </Typography>
                  {allBlogs.length === 0 ? (
                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", fontStyle: "italic" }}>No blogs found. Create blogs first.</Typography>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, maxHeight: 200, overflowY: "auto", border: "1px solid", borderColor: "divider", borderRadius: "8px", p: 1 }}>
                      {allBlogs.map((blog) => {
                        const blogId = blog._id || blog.id;
                        const isSelected = (homeContent.featuredBlogs || []).includes(blogId);
                        return (
                          <FormControlLabel
                            key={blogId}
                            control={
                              <Checkbox
                                size="small"
                                checked={isSelected}
                                onChange={(e) => {
                                  const current = homeContent.featuredBlogs || [];
                                  const next = e.target.checked
                                    ? [...current, blogId]
                                    : current.filter((id) => id !== blogId);
                                  setHomeContent({ ...homeContent, featuredBlogs: next.slice(0, 3) });
                                }}
                                disabled={!isSelected && (homeContent.featuredBlogs || []).length >= 3}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "0.8125rem", color: "text.primary" }}>
                                {blog.title || "Untitled"}
                                {blog.category && <span style={{ fontSize: "0.6875rem", color: theme.palette.text.secondary, marginLeft: 6 }}>({blog.category})</span>}
                              </Typography>
                            }
                          />
                        );
                      })}
                    </Box>
                  )}
                  {(homeContent.featuredBlogs || []).length > 0 && (
                    <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary", mt: 0.5 }}>
                      {(homeContent.featuredBlogs || []).length}/3 selected
                    </Typography>
                  )}
                </Box>

                {/* Featured Gallery Selection */}
                <Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    <ImageIcon size={16} color={theme.palette.text.secondary} />
                    <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Featured Gallery on Homepage</Typography>
                  </Box>
                  <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 1.5 }}>
                    Select up to 5 gallery images for the homepage mosaic. If none selected, default images are shown.
                  </Typography>
                  {allGallery.length === 0 ? (
                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", fontStyle: "italic" }}>No gallery images found. Upload images first.</Typography>
                  ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 1, maxHeight: 260, overflowY: "auto", border: "1px solid", borderColor: "divider", borderRadius: "8px", p: 1 }}>
                      {allGallery.map((img) => {
                        const imgId = img._id || img.id;
                        const imgSrc = img.url || img.src;
                        const isSelected = (homeContent.featuredGallery || []).includes(imgId);
                        return (
                          <Box
                            key={imgId}
                            onClick={() => {
                              const current = homeContent.featuredGallery || [];
                              const next = isSelected
                                ? current.filter((id) => id !== imgId)
                                : [...current, imgId];
                              setHomeContent({ ...homeContent, featuredGallery: next.slice(0, 5) });
                            }}
                            sx={{
                              position: "relative",
                              aspectRatio: "1",
                              borderRadius: "8px",
                              overflow: "hidden",
                              cursor: "pointer",
                              border: isSelected ? "2px solid" : "2px solid",
                              borderColor: isSelected ? "primary.main" : "divider",
                              opacity: !isSelected && (homeContent.featuredGallery || []).length >= 5 ? 0.5 : 1,
                              "&:hover": { opacity: 1 },
                            }}
                          >
                            <img src={imgSrc} alt={img.title || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            {isSelected && (
                              <Box sx={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", backgroundColor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <CheckCircle2 size={14} color="white" />
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                  {(homeContent.featuredGallery || []).length > 0 && (
                    <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary", mt: 0.5 }}>
                      {(homeContent.featuredGallery || []).length}/5 selected
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
                  <Button variant="contained" disabled={saving} onClick={() => handleSave("home")} startIcon={saving ? <CircularProgress size={16} /> : <Save size={16} />} sx={{ borderRadius: "12px", backgroundColor: "text.primary", color: "background.paper", fontWeight: 600, fontSize: "0.8125rem", textTransform: "none", py: 1, px: 2.5, "&:hover": { backgroundColor: "text.primary", opacity: 0.9 } }}>
                    {saving ? "Saving..." : "Save Home Content"}
                  </Button>
                </Box>
              </Box>
            )}

            {/* About Tab */}
            {activeTab === "about" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography sx={{ fontSize: "1.125rem", fontWeight: 700, color: "text.primary" }}>About Park Details</Typography>
                  <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5 }}>Information on conservation history, biodiversity, and reserve statistics.</Typography>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                  <TextField fullWidth label="Page Title" value={aboutContent.title} onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })} size="small" />
                  <TextField fullWidth label="Mission Title" value={aboutContent.missionTitle} onChange={(e) => setAboutContent({ ...aboutContent, missionTitle: e.target.value })} size="small" />
                </Box>

                <TextField fullWidth multiline rows={3} label="Mission Statement & Conservation Story" value={aboutContent.missionText} onChange={(e) => setAboutContent({ ...aboutContent, missionText: e.target.value })} />

                <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
                  <Button variant="contained" disabled={saving} onClick={() => handleSave("about")} startIcon={saving ? <CircularProgress size={16} /> : <Save size={16} />} sx={{ borderRadius: "12px", backgroundColor: "text.primary", color: "background.paper", fontWeight: 600, fontSize: "0.8125rem", textTransform: "none", py: 1, px: 2.5, "&:hover": { backgroundColor: "text.primary", opacity: 0.9 } }}>
                    {saving ? "Saving..." : "Save About Content"}
                  </Button>
                </Box>
              </Box>
            )}

            {/* Safari Tab */}
            {activeTab === "safari" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography sx={{ fontSize: "1.125rem", fontWeight: 700, color: "text.primary" }}>Safari Zones & Regulations</Typography>
                  <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5 }}>Safari trail parameters, gate permits, and visitor safety regulations.</Typography>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                  <TextField fullWidth label="Safari Section Title" value={safariContent.title} onChange={(e) => setSafariContent({ ...safariContent, title: e.target.value })} size="small" />
                  <TextField fullWidth label="Safari Section Subtitle" value={safariContent.subtitle} onChange={(e) => setSafariContent({ ...safariContent, subtitle: e.target.value })} size="small" />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
                  <Button variant="contained" disabled={saving} onClick={() => handleSave("safari")} startIcon={saving ? <CircularProgress size={16} /> : <Save size={16} />} sx={{ borderRadius: "12px", backgroundColor: "text.primary", color: "background.paper", fontWeight: 600, fontSize: "0.8125rem", textTransform: "none", py: 1, px: 2.5, "&:hover": { backgroundColor: "text.primary", opacity: 0.9 } }}>
                    {saving ? "Saving..." : "Save Safari Content"}
                  </Button>
                </Box>
              </Box>
            )}

            {/* New Section Tabs */}
            {activeTab === "birds" && <BirdsTab />}
            {activeTab === "fauna" && <FaunaTab />}
            {activeTab === "flora" && <FloraTab />}
            {activeTab === "butterflies" && <ButterfliesTab />}
            {activeTab === "parkRules" && <ParkRulesTab />}
            {activeTab === "tickets" && <TicketsTab />}
            {activeTab === "howToReach" && <HowToReachTab />}
            {activeTab === "stay" && <StayTab />}
            {activeTab === "birdingAreas" && <BirdingAreasTab />}
            {activeTab === "ecoTourism" && <EcoTourismTab />}
          </Paper>
        )}
      </Box>
    </Box>
  );
}
