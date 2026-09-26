import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  TextField, 
  CircularProgress, 
  IconButton 
} from "@mui/material";
import { Save, Plus, Trash2, Clock, DollarSign, Ticket } from "lucide-react";
import Header from "../../components/common/Header";
import useSectionContent from "../../components/content/useSectionContent";

export default function TicketsEditor() {
  const { data, setData, loading, saving, save } = useSectionContent("tickets", {
    timings: { summer: "", winter: "", openDates: "" },
    entranceFees: [],
    gypsyRates: [],
    guideFees: [],
    filmingFees: [],
    importantNotes: [],
    cancellationPolicy: [],
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const setField = (key, val) => setData(prev => ({ ...prev, [key]: val }));
  const setTiming = (key, val) => setData(prev => ({
    ...prev,
    timings: { ...(prev.timings || {}), [key]: val }
  }));

  // Entrance Fees Helpers
  const addFee = () => {
    const list = data.entranceFees || [];
    setField("entranceFees", [...list, { category: "New Entry Item", indian: "₹150", foreigner: "₹600", note: "Per person fee" }]);
  };

  const updateFee = (idx, field, val) => {
    const list = [...(data.entranceFees || [])];
    list[idx] = { ...list[idx], [field]: val };
    setField("entranceFees", list);
  };

  const removeFee = (idx) => {
    setField("entranceFees", (data.entranceFees || []).filter((_, i) => i !== idx));
  };

  // Gypsy Rates Helpers
  const addGypsy = () => {
    const list = data.gypsyRates || [];
    setField("gypsyRates", [...list, { zone: "Zone Name", rate: "₹3,500", capacity: "Up to 6 visitors + driver & guide" }]);
  };

  const updateGypsy = (idx, field, val) => {
    const list = [...(data.gypsyRates || [])];
    list[idx] = { ...list[idx], [field]: val };
    setField("gypsyRates", list);
  };

  const removeGypsy = (idx) => {
    setField("gypsyRates", (data.gypsyRates || []).filter((_, i) => i !== idx));
  };

  // Guide Fees Helpers
  const addGuide = () => {
    const list = data.guideFees || [];
    setField("guideFees", [...list, { type: "Guide Type", fee: "₹1,000 per shift", note: "Authorised nature guide" }]);
  };

  const updateGuide = (idx, field, val) => {
    const list = [...(data.guideFees || [])];
    list[idx] = { ...list[idx], [field]: val };
    setField("guideFees", list);
  };

  const removeGuide = (idx) => {
    setField("guideFees", (data.guideFees || []).filter((_, i) => i !== idx));
  };

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header
        title="Page 2: Tickets, Entry Fees & Safari Charges"
        subtitle="Manage official entrance tariffs, Gypsy rates (₹3,500), guide fees, filming fees, and seasonal shift timings"
      />

      <Box sx={{ maxWidth: "1100px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3, display: "flex", flexDirection: "column", gap: 3.5 }}>
        
        {/* Safari Shift Timings */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Clock size={18} className="text-blue-600" />
            <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Seasonal Shift Timings</Typography>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              label="Summer Timings"
              value={data.timings?.summer || ""}
              onChange={e => setTiming("summer", e.target.value)}
              placeholder="16 Apr – 15 Jun: Morning 5:30 AM | Afternoon 3:00 PM"
            />
            <TextField
              fullWidth
              size="small"
              label="Winter Timings"
              value={data.timings?.winter || ""}
              onChange={e => setTiming("winter", e.target.value)}
              placeholder="15 Nov – 15 Feb: Morning 6:30 AM | Afternoon 1:30 PM"
            />
            <TextField
              fullWidth
              size="small"
              label="Open Season Dates"
              value={data.timings?.openDates || ""}
              onChange={e => setTiming("openDates", e.target.value)}
              placeholder="15 November to 15 June"
            />
          </Box>
        </Paper>

        {/* Entrance Fees & Permits */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <DollarSign size={18} className="text-emerald-600" />
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Park Entry Fees & Vehicle Permits</Typography>
            </Box>
            <Button size="small" variant="outlined" onClick={addFee} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
              Add Fee Item
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {(data.entranceFees || []).map((fee, idx) => (
              <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr 2fr auto" }, gap: 1.5, alignItems: "center" }}>
                <TextField
                  size="small"
                  label="Category Name"
                  value={fee.category || ""}
                  onChange={e => updateFee(idx, "category", e.target.value)}
                />
                <TextField
                  size="small"
                  label="Indian (₹)"
                  value={fee.indian || ""}
                  onChange={e => updateFee(idx, "indian", e.target.value)}
                />
                <TextField
                  size="small"
                  label="Foreigner (₹)"
                  value={fee.foreigner || ""}
                  onChange={e => updateFee(idx, "foreigner", e.target.value)}
                />
                <TextField
                  size="small"
                  label="Note / Details"
                  value={fee.note || ""}
                  onChange={e => updateFee(idx, "note", e.target.value)}
                />
                <IconButton size="small" color="error" onClick={() => removeFee(idx)}>
                  <Trash2 size={16} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Gypsy Vehicle Rates */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Ticket size={18} className="text-amber-500" />
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Gypsy Safari Rates by Range</Typography>
            </Box>
            <Button size="small" variant="outlined" onClick={addGypsy} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
              Add Gypsy Rate
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {(data.gypsyRates || []).map((gypsy, idx) => (
              <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 2fr auto" }, gap: 1.5, alignItems: "center" }}>
                <TextField
                  size="small"
                  label="Zone / Range"
                  value={gypsy.zone || ""}
                  onChange={e => updateGypsy(idx, "zone", e.target.value)}
                />
                <TextField
                  size="small"
                  label="Gypsy Rate (₹)"
                  value={gypsy.rate || ""}
                  onChange={e => updateGypsy(idx, "rate", e.target.value)}
                />
                <TextField
                  size="small"
                  label="Seating Capacity"
                  value={gypsy.capacity || ""}
                  onChange={e => updateGypsy(idx, "capacity", e.target.value)}
                />
                <IconButton size="small" color="error" onClick={() => removeGypsy(idx)}>
                  <Trash2 size={16} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Nature Guide Fees */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Nature Guide Fees</Typography>
            <Button size="small" variant="outlined" onClick={addGuide} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
              Add Guide Fee
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {(data.guideFees || []).map((guide, idx) => (
              <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 1.5fr 2fr auto" }, gap: 1.5, alignItems: "center" }}>
                <TextField
                  size="small"
                  label="Guide Type"
                  value={guide.type || ""}
                  onChange={e => updateGuide(idx, "type", e.target.value)}
                />
                <TextField
                  size="small"
                  label="Fee (₹)"
                  value={guide.fee || ""}
                  onChange={e => updateGuide(idx, "fee", e.target.value)}
                />
                <TextField
                  size="small"
                  label="Note / Guidance"
                  value={guide.note || ""}
                  onChange={e => updateGuide(idx, "note", e.target.value)}
                />
                <IconButton size="small" color="error" onClick={() => removeGuide(idx)}>
                  <Trash2 size={16} />
                </IconButton>
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
            {saving ? "Saving Changes..." : "Save Tickets & Tariffs"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
