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
import useSectionContent from "../../components/content/useSectionContent";

export default function TermsRulesEditor() {
  const { data: rulesData, setData: setRulesData, loading: rulesLoading, saving: rulesSaving, save: saveRules } = useSectionContent("parkRules", {
    overview: "",
    dos: [],
    donts: [],
  });

  const { data: ticketsData, setData: setTicketsData, loading: ticketsLoading, saving: ticketsSaving, save: saveTickets } = useSectionContent("tickets", {
    cancellationPolicy: [],
  });

  const [activeTab, setActiveTab] = useState(0);

  if (rulesLoading || ticketsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const isSaving = rulesSaving || ticketsSaving;

  const handleSaveAll = async () => {
    await saveRules();
    await saveTickets();
  };

  // Policy Helpers
  const addPolicy = () => {
    const list = ticketsData.cancellationPolicy || [];
    setTicketsData(prev => ({
      ...prev,
      cancellationPolicy: [...list, `${list.length + 1}. New Policy: Policy description details...`]
    }));
  };

  const updatePolicy = (idx, val) => {
    const list = [...(ticketsData.cancellationPolicy || [])];
    list[idx] = val;
    setTicketsData(prev => ({ ...prev, cancellationPolicy: list }));
  };

  const removePolicy = (idx) => {
    setTicketsData(prev => ({
      ...prev,
      cancellationPolicy: (prev.cancellationPolicy || []).filter((_, i) => i !== idx)
    }));
  };

  // Do's Helpers
  const addDo = () => {
    const list = rulesData.dos || [];
    setRulesData(prev => ({
      ...prev,
      dos: [...list, { title: "New Rule", desc: "Detailed guideline description..." }]
    }));
  };

  const updateDo = (idx, field, val) => {
    const list = [...(rulesData.dos || [])];
    list[idx] = { ...list[idx], [field]: val };
    setRulesData(prev => ({ ...prev, dos: list }));
  };

  const removeDo = (idx) => {
    setRulesData(prev => ({
      ...prev,
      dos: (prev.dos || []).filter((_, i) => i !== idx)
    }));
  };

  // Don'ts Helpers
  const addDont = () => {
    const list = rulesData.donts || [];
    setRulesData(prev => ({
      ...prev,
      donts: [...list, { title: "Prohibited Action", desc: "Why this action is prohibited..." }]
    }));
  };

  const updateDont = (idx, field, val) => {
    const list = [...(rulesData.donts || [])];
    list[idx] = { ...list[idx], [field]: val };
    setRulesData(prev => ({ ...prev, donts: list }));
  };

  const removeDont = (idx) => {
    setRulesData(prev => ({
      ...prev,
      donts: (prev.donts || []).filter((_, i) => i !== idx)
    }));
  };

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header
        title="Page 3: Terms & Conditions, Cancellation & Safari Rules"
        subtitle="Manage the 8-point official cancellation/refund policy and 18 Do's & Don'ts for visitors"
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
            <Tab label="1. Official Cancellation & Refund Policy" />
            <Tab label="2. Visitor Do's (8 Rules)" />
            <Tab label="3. Visitor Don'ts (10 Rules)" />
          </Tabs>
        </Paper>

        {/* Tab 0: Cancellation Policy */}
        {activeTab === 0 && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box>
                <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>8-Point Official Cancellation & Refund Terms</Typography>
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                  Governs entry deadlines, student concessions, permit non-transferability, and weather force majeure.
                </Typography>
              </Box>
              <Button size="small" variant="outlined" onClick={addPolicy} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
                Add Policy Clause
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(ticketsData.cancellationPolicy || []).map((policy, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, minWidth: 24, pt: 1, color: "text.secondary" }}>
                    #{idx + 1}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    value={policy}
                    onChange={e => updatePolicy(idx, e.target.value)}
                  />
                  <IconButton size="small" color="error" onClick={() => removePolicy(idx)} sx={{ mt: 0.5 }}>
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Paper>
        )}

        {/* Tab 1: Do's */}
        {activeTab === 1 && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box>
                <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Visitor Guidelines (Do's)</Typography>
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                  Safe forest practices, nature guides, speed limits, and attire recommendations.
                </Typography>
              </Box>
              <Button size="small" variant="outlined" onClick={addDo} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
                Add Do Item
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(rulesData.dos || []).map((item, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.5fr 3fr auto" }, gap: 1.5, alignItems: "center" }}>
                  <TextField
                    size="small"
                    label="Rule Title"
                    value={item.title || ""}
                    onChange={e => updateDo(idx, "title", e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Detailed Explanation"
                    value={item.desc || ""}
                    onChange={e => updateDo(idx, "desc", e.target.value)}
                  />
                  <IconButton size="small" color="error" onClick={() => removeDo(idx)}>
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Paper>
        )}

        {/* Tab 2: Don'ts */}
        {activeTab === 2 && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box>
                <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Prohibited Actions (Don'ts)</Typography>
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                  Zero-litter rule, firearms prohibition, anti-poaching and forest wildlife protections.
                </Typography>
              </Box>
              <Button size="small" variant="outlined" onClick={addDont} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
                Add Don't Item
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(rulesData.donts || []).map((item, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.5fr 3fr auto" }, gap: 1.5, alignItems: "center" }}>
                  <TextField
                    size="small"
                    label="Prohibition Title"
                    value={item.title || ""}
                    onChange={e => updateDont(idx, "title", e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Explanation"
                    value={item.desc || ""}
                    onChange={e => updateDont(idx, "desc", e.target.value)}
                  />
                  <IconButton size="small" color="error" onClick={() => removeDont(idx)}>
                    <Trash2 size={16} />
                  </IconButton>
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
            {isSaving ? "Saving Changes..." : "Save Terms & Rules"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
