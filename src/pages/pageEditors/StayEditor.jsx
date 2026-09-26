import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  TextField, 
  CircularProgress, 
  IconButton 
} from "@mui/material";
import { Save, Plus, Trash2, Building2, Home } from "lucide-react";
import Header from "../../components/common/Header";
import useSectionContent from "../../components/content/useSectionContent";

export default function StayEditor() {
  const { data, setData, loading, saving, save } = useSectionContent("stay", {
    overview: "",
    wildBrook: { name: "", tagline: "", location: "", distance: "", phone: "", email: "", features: [] },
    forestRestHouses: [],
    frhBookingInfo: { authority: "", address: "", phone: "", bookingRule: "" },
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const setField = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  // FRH helpers
  const addFRH = () => {
    const list = data.forestRestHouses || [];
    setField("forestRestHouses", [
      ...list,
      { name: "New Forest Rest House", suites: "2 Suites", status: "Heritage", gate: "Range Gate", setting: "Forest location setting..." }
    ]);
  };

  const updateFRH = (idx, field, val) => {
    const list = [...(data.forestRestHouses || [])];
    list[idx] = { ...list[idx], [field]: val };
    setField("forestRestHouses", list);
  };

  const removeFRH = (idx) => {
    setField("forestRestHouses", (data.forestRestHouses || []).filter((_, i) => i !== idx));
  };

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header
        title="Page 7: Stay in Rajaji"
        subtitle="Manage British-era Forest Rest Houses (FRHs), Wild Brook Retreat eco-cottages, and booking rules"
      />

      <Box sx={{ maxWidth: "1100px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3, display: "flex", flexDirection: "column", gap: 3.5 }}>
        
        {/* Overview Card */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ fontSize: "1.05rem", fontWeight: 700, mb: 1.5 }}>Stay Overview Narrative</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            label="Overview"
            value={data.overview || ""}
            onChange={e => setField("overview", e.target.value)}
          />
        </Paper>

        {/* Forest Rest Houses Card */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Building2 size={18} className="text-emerald-600" />
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Forest Rest Houses (FRHs)</Typography>
            </Box>
            <Button size="small" variant="outlined" onClick={addFRH} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
              Add FRH
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {(data.forestRestHouses || []).map((frh, idx) => (
              <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>#{idx + 1} {frh.name}</Typography>
                  <IconButton size="small" color="error" onClick={() => removeFRH(idx)}>
                    <Trash2 size={16} />
                  </IconButton>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr 2fr" }, gap: 1.5 }}>
                  <TextField
                    size="small"
                    label="FRH Name"
                    value={frh.name || ""}
                    onChange={e => updateFRH(idx, "name", e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Suites"
                    value={frh.suites || ""}
                    onChange={e => updateFRH(idx, "suites", e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Heritage / Status"
                    value={frh.status || ""}
                    onChange={e => updateFRH(idx, "status", e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Gate Location"
                    value={frh.gate || ""}
                    onChange={e => updateFRH(idx, "gate", e.target.value)}
                  />
                </Box>

                <TextField
                  fullWidth
                  size="small"
                  label="Forest Setting & View"
                  value={frh.setting || ""}
                  onChange={e => updateFRH(idx, "setting", e.target.value)}
                />
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Wild Brook Retreat Card */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Home size={18} className="text-amber-500" />
            <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Wild Brook Retreat (Eco-Cottages)</Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 2 }}>
            <TextField
              size="small"
              label="Resort Name"
              value={data.wildBrook?.name || ""}
              onChange={e => setField("wildBrook", { ...(data.wildBrook || {}), name: e.target.value })}
            />
            <TextField
              size="small"
              label="Tagline"
              value={data.wildBrook?.tagline || ""}
              onChange={e => setField("wildBrook", { ...(data.wildBrook || {}), tagline: e.target.value })}
            />
            <TextField
              size="small"
              label="Location"
              value={data.wildBrook?.location || ""}
              onChange={e => setField("wildBrook", { ...(data.wildBrook || {}), location: e.target.value })}
            />
            <TextField
              size="small"
              label="Distance from City"
              value={data.wildBrook?.distance || ""}
              onChange={e => setField("wildBrook", { ...(data.wildBrook || {}), distance: e.target.value })}
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
            {saving ? "Saving Changes..." : "Save Stay in Rajaji"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
