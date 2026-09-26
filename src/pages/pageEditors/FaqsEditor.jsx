import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  TextField, 
  CircularProgress, 
  IconButton 
} from "@mui/material";
import { Save, Plus, Trash2, HelpCircle } from "lucide-react";
import Header from "../../components/common/Header";
import useSectionContent from "../../components/content/useSectionContent";

export default function FaqsEditor() {
  const { data, setData, loading, saving, save } = useSectionContent("faqs", {
    overview: "",
    items: [],
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const setField = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  const addFaq = () => {
    const list = data.items || [];
    setField("items", [
      ...list,
      { q: "New Question Title?", a: "Detailed answer explaining the policy or procedure...", category: "General" }
    ]);
  };

  const updateFaq = (idx, field, val) => {
    const list = [...(data.items || [])];
    list[idx] = { ...list[idx], [field]: val };
    setField("items", list);
  };

  const removeFaq = (idx) => {
    setField("items", (data.items || []).filter((_, i) => i !== idx));
  };

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header
        title="Page 8: Frequently Asked Questions (FAQ)"
        subtitle="Manage the 10 official visitor questions & answers, categories, and guidance blurbs"
      />

      <Box sx={{ maxWidth: "1100px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3, display: "flex", flexDirection: "column", gap: 3.5 }}>
        
        {/* Header & Overview Card */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <HelpCircle size={18} className="text-amber-500" />
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>FAQ Overview & Introduction</Typography>
            </Box>
            <Button size="small" variant="outlined" onClick={addFaq} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
              Add FAQ Question
            </Button>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={2}
            size="small"
            label="Section Overview"
            value={data.overview || ""}
            onChange={e => setField("overview", e.target.value)}
            placeholder="Find answers to frequently asked questions regarding Rajaji National Park Jeep Safari..."
          />
        </Paper>

        {/* FAQs List */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, mb: 2 }}>Questions & Answers List ({(data.items || []).length} Active)</Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {(data.items || []).map((faq, idx) => (
              <Box key={idx} sx={{ p: 2.5, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "text.primary" }}>
                    Q{idx + 1}. {faq.q || "Untitled Question"}
                  </Typography>
                  <IconButton size="small" color="error" onClick={() => removeFaq(idx)}>
                    <Trash2 size={16} />
                  </IconButton>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "3fr 1fr" }, gap: 2 }}>
                  <TextField
                    size="small"
                    label="Question Title"
                    value={faq.q || ""}
                    onChange={e => updateFaq(idx, "q", e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Category Tag"
                    value={faq.category || ""}
                    onChange={e => updateFaq(idx, "category", e.target.value)}
                    placeholder="e.g. Pricing, Bookings, Timings"
                  />
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  label="Official Answer"
                  value={faq.a || ""}
                  onChange={e => updateFaq(idx, "a", e.target.value)}
                />
              </Box>
            ))}
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
            {saving ? "Saving Changes..." : "Save FAQs Content"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
