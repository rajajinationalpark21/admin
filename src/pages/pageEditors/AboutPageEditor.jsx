import { Box, Button, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import { Save, Trees } from "lucide-react";
import Header from "../../components/common/Header";
import useSectionContent from "../../components/content/useSectionContent";

const defaults = {
  title: "About Rajaji National Park", subtitle: "", overviewTitle: "Rajaji at a glance", overviewIntro: "", overviewParagraphs: [], overviewStats: [],
};

const statPlaceholders = [
  { value: "820 km²", label: "National park area" }, { value: "1983", label: "Established" },
  { value: "48th", label: "Tiger Reserve" }, { value: "500+", label: "Elephants" },
  { value: "50+", label: "Bengal Tigers" }, { value: "300+", label: "Bird species" },
];

export default function AboutPageEditor() {
  const { data, setData, loading, saving, save } = useSectionContent("about", defaults);
  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", pt: 12 }}><CircularProgress /></Box>;
  const setField = (key, value) => setData((current) => ({ ...current, [key]: value }));
  const stats = statPlaceholders.map((fallback, index) => ({ ...fallback, ...(data.overviewStats?.[index] || {}) }));
  const setStat = (index, key, value) => {
    const next = [...stats];
    next[index] = { ...next[index], [key]: value };
    setField("overviewStats", next);
  };

  return <Box sx={{ minHeight: "100%", pb: 6 }}>
    <Header title="About Rajaji" subtitle="Manage the dedicated About page. Its header image always comes from the Home About section." />
    <Box sx={{ maxWidth: 1000, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3 }}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}><Trees size={18} /><Typography fontWeight={700}>Header and Overview</Typography></Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>The hero image is shared with Home → About Section Image. Change it there to update both places.</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
          <TextField fullWidth size="small" label="Page title" value={data.title || ""} onChange={(e) => setField("title", e.target.value)} />
          <TextField fullWidth size="small" label="Hero subtitle" value={data.subtitle || ""} onChange={(e) => setField("subtitle", e.target.value)} />
        </Box>
        <TextField fullWidth size="small" sx={{ mt: 2.5 }} label="Overview heading" value={data.overviewTitle || ""} onChange={(e) => setField("overviewTitle", e.target.value)} />
        <TextField fullWidth multiline rows={5} sx={{ mt: 2.5 }} label="Overview introduction" value={data.overviewIntro || ""} onChange={(e) => setField("overviewIntro", e.target.value)} />
        <TextField fullWidth multiline rows={10} sx={{ mt: 2.5 }} label="Overview paragraphs" value={(data.overviewParagraphs || []).join("\n\n")} onChange={(e) => setField("overviewParagraphs", e.target.value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean))} helperText="Separate paragraphs with one blank line." />
        <Typography sx={{ mt: 3, mb: 0.5, fontWeight: 700 }}>Key statistics</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Each statistic has its own value and label field. These update the figures on the public About page.</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
          {stats.map((stat, index) => <Box key={index} sx={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 1.5 }}>
            <TextField size="small" label={`Statistic ${index + 1} value`} value={stat.value || ""} placeholder={statPlaceholders[index].value} onChange={(e) => setStat(index, "value", e.target.value)} />
            <TextField size="small" label={`Statistic ${index + 1} label`} value={stat.label || ""} placeholder={statPlaceholders[index].label} onChange={(e) => setStat(index, "label", e.target.value)} />
          </Box>)}
        </Box>
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 3 }}><Button variant="contained" onClick={save} disabled={saving} startIcon={saving ? <CircularProgress size={16} /> : <Save size={16} />} sx={{ borderRadius: 3, textTransform: "none", px: 3 }}>{saving ? "Saving…" : "Save About Page"}</Button></Box>
    </Box>
  </Box>;
}
