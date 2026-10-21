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
import ImageUploadField from "../../components/common/ImageUploadField";
import HeroImageListField from "../../components/common/HeroImageListField";
import useSectionContent from "../../components/content/useSectionContent";
import CtaBandFields from "../../components/content/CtaBandFields";
import StringListField from "../../components/content/StringListField";

// Shown when a column heading has never been saved, matching the site.
const DEFAULT_FRH_COLUMNS = ["Forest Rest House", "Suites Available", "Current Status", "Entry Gate Access", "Setting & Atmosphere"];

export default function StayEditor() {
  const { data, setData, loading, saving, save } = useSectionContent("stay", {
    title: "",
    subtitle: "",
    heroBanner: "",
    overview: "",
    wildBrook: { name: "", tagline: "", location: "", distance: "", phone: "", email: "", features: [], mainImage: "", leafImage: "", sunsetImage: "" },
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
  const setWildBrook = (key, val) => setField("wildBrook", { ...(data.wildBrook || {}), [key]: val });
  const setBooking = (key, val) => setField("frhBookingInfo", { ...(data.frhBookingInfo || {}), [key]: val });
  const frhColumns = DEFAULT_FRH_COLUMNS.map((fallback, index) => data.frhColumns?.[index] ?? fallback);
  const setColumn = (index, val) => setField("frhColumns", frhColumns.map((column, i) => (i === index ? val : column)));

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
        title="8. Stay in Rajaji"
        subtitle="Manage British-era Forest Rest Houses (FRHs), Wild Brook Retreat eco-cottages, and booking rules"
      />

      <Box sx={{ maxWidth: "1100px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3, display: "flex", flexDirection: "column", gap: 3.5 }}>
        
        {/* Page Header Card */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Stay in Rajaji Page Header</Typography>
            <Button
              variant="contained"
              size="small"
              disabled={saving}
              onClick={save}
              startIcon={saving ? <CircularProgress size={14} /> : <Save size={14} />}
              sx={{
                borderRadius: "8px",
                backgroundColor: "text.primary",
                color: "background.paper",
                fontWeight: 600,
                fontSize: "0.8rem",
                textTransform: "none",
                "&:hover": { backgroundColor: "text.primary", opacity: 0.9 },
              }}
            >
              {saving ? "Saving..." : "Save Header & Banner"}
            </Button>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 2 }}>
            <TextField
              size="small"
              label="Header Title"
              value={data.title || "Stay in Rajaji National Park"}
              onChange={e => setField("title", e.target.value)}
              placeholder="Stay in Rajaji National Park"
            />
            <TextField
              size="small"
              label="Header Subtitle"
              value={data.subtitle || data.overview || "Heritage British-era Forest Rest Houses and eco-resorts inside the reserve."}
              onChange={e => setField("subtitle", e.target.value)}
              placeholder="Heritage Forest Rest Houses & Eco Cottages"
            />
          </Box>
          <ImageUploadField
            label="Header Banner Image"
            value={data.heroBanner || ""}
            onChange={val => setField("heroBanner", val)}
            helperText="Displayed at the top of the /stay page."
          />
          <Box sx={{ mt: 3 }}>
            <HeroImageListField value={data.heroImages} onChange={val => setField("heroImages", val)} fallbackValue={data.heroBanner} />
          </Box>
        </Paper>

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

          <Box sx={{ mb: 2.5, p: 2.5, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "grid", gap: 2 }}>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>Section heading and table columns</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField size="small" label="Small label above the heading" value={data.frhEyebrow ?? ""} onChange={e => setField("frhEyebrow", e.target.value)} />
              <TextField size="small" label="Section heading" value={data.frhTitle ?? ""} onChange={e => setField("frhTitle", e.target.value)} />
            </Box>
            <TextField size="small" fullWidth multiline minRows={2} label="Text under the heading" value={data.frhIntro ?? ""} onChange={e => setField("frhIntro", e.target.value)} />
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(5, 1fr)" }, gap: 1.5 }}>
              {frhColumns.map((column, index) => (
                <TextField key={index} size="small" label={`Column ${index + 1}`} value={column} onChange={e => setColumn(index, e.target.value)} />
              ))}
            </Box>
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

          <Box sx={{ mt: 2.5, p: 2.5, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "grid", gap: 2 }}>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>How to book Forest Rest Houses (dark box)</Typography>
            <TextField size="small" fullWidth label="Box heading" value={data.frhBookingInfo?.title ?? ""} onChange={e => setBooking("title", e.target.value)} />
            <TextField size="small" fullWidth multiline minRows={2} label="Booking rule" value={data.frhBookingInfo?.bookingRule || ""} onChange={e => setBooking("bookingRule", e.target.value)} />
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <TextField size="small" label="Authority" value={data.frhBookingInfo?.authority || ""} onChange={e => setBooking("authority", e.target.value)} />
              <TextField size="small" label="Office phone" value={data.frhBookingInfo?.phone || ""} onChange={e => setBooking("phone", e.target.value)} />
            </Box>
            <TextField size="small" fullWidth label="Address" value={data.frhBookingInfo?.address || ""} onChange={e => setBooking("address", e.target.value)} />
            <TextField size="small" sx={{ minWidth: { sm: 320 } }} label="Button text" helperText="Leave empty to hide the button" value={data.frhBookingInfo?.buttonText ?? ""} onChange={e => setBooking("buttonText", e.target.value)} />
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
            <TextField size="small" label="Phone" value={data.wildBrook?.phone || ""} onChange={e => setWildBrook("phone", e.target.value)} />
            <TextField size="small" label="Email" value={data.wildBrook?.email || ""} onChange={e => setWildBrook("email", e.target.value)} />
            <TextField size="small" label="Button text" helperText="Leave empty to hide the button" value={data.wildBrook?.buttonText ?? ""} onChange={e => setWildBrook("buttonText", e.target.value)} />
          </Box>

          <Box sx={{ mb: 2.5 }}>
            <StringListField
              label="Features (tick list)"
              itemLabel="Feature"
              addLabel="Add feature"
              value={data.wildBrook?.features}
              onChange={val => setWildBrook("features", val)}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <ImageUploadField
              label="Lodge Main Photo"
              value={data.wildBrook?.mainImage || ""}
              onChange={val => setField("wildBrook", { ...(data.wildBrook || {}), mainImage: val })}
              helperText="Large hero photo of the resort shown on the Stay page."
            />
            <TextField size="small" fullWidth label="Main photo description (alt text)" value={data.wildBrook?.mainImageAlt ?? ""} onChange={e => setWildBrook("mainImageAlt", e.target.value)} />
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <ImageUploadField
                compact
                label="Valley Foliage Photo"
                value={data.wildBrook?.leafImage || ""}
                onChange={val => setField("wildBrook", { ...(data.wildBrook || {}), leafImage: val })}
                helperText="Small left thumbnail."
              />
              <ImageUploadField
                compact
                label="Sunset Photo"
                value={data.wildBrook?.sunsetImage || ""}
                onChange={val => setField("wildBrook", { ...(data.wildBrook || {}), sunsetImage: val })}
                helperText="Small right thumbnail."
              />
              <TextField size="small" label="Foliage photo description (alt text)" value={data.wildBrook?.leafImageAlt ?? ""} onChange={e => setWildBrook("leafImageAlt", e.target.value)} />
              <TextField size="small" label="Sunset photo description (alt text)" value={data.wildBrook?.sunsetImageAlt ?? ""} onChange={e => setWildBrook("sunsetImageAlt", e.target.value)} />
            </Box>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <CtaBandFields value={data.ctaBand} onChange={val => setField("ctaBand", val)} />
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
