import React from "react";
import { Box, TextField } from "@mui/material";
import { SectionShell, Field, FieldGrid } from "./SectionShell";
import useSectionContent from "./useSectionContent";

export default function BirdingAreasTab() {
  const { data, setData, loading, saving, save } = useSectionContent("birdingAreas", {
    overview: "",
    areas: [],
  });

  if (loading) return null;

  const set = (key, val) => setData({ ...data, [key]: val });

  return (
    <SectionShell title="Birding Areas Section" subtitle="Top birding hotspots near Rajaji National Park with directions and fees." saving={saving} onSave={save}>
      <Field label="Overview" value={data.overview} onChange={e => set("overview", e.target.value)} multiline rows={4} />

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Birding Areas</Box>
          <Box component="button" onClick={() => set("areas", [...(data.areas || []), { name: "", badge: "", distance: "", season: "", fee: "", description: "", highlights: [] }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add Area</Box>
        </Box>
        {(data.areas || []).map((item, i) => (
          <Box key={i} sx={{ p: 2, mb: 1.5, border: "1px solid", borderColor: "divider", borderRadius: "8px" }}>
            <FieldGrid columns={3}>
              <Field label="Area Name" value={item.name} onChange={e => { const n = [...data.areas]; n[i] = { ...n[i], name: e.target.value }; set("areas", n); }} />
              <Field label="Badge" value={item.badge} onChange={e => { const n = [...data.areas]; n[i] = { ...n[i], badge: e.target.value }; set("areas", n); }} />
              <Field label="Distance" value={item.distance} onChange={e => { const n = [...data.areas]; n[i] = { ...n[i], distance: e.target.value }; set("areas", n); }} />
            </FieldGrid>
            <FieldGrid columns={3}>
              <Field label="Season" value={item.season} onChange={e => { const n = [...data.areas]; n[i] = { ...n[i], season: e.target.value }; set("areas", n); }} />
              <Field label="Fee" value={item.fee} onChange={e => { const n = [...data.areas]; n[i] = { ...n[i], fee: e.target.value }; set("areas", n); }} />
              <Field label="Description" value={item.description} onChange={e => { const n = [...data.areas]; n[i] = { ...n[i], description: e.target.value }; set("areas", n); }} multiline rows={2} />
            </FieldGrid>
            <TextField
              fullWidth size="small" label="Highlights (comma-separated)"
              value={(item.highlights || []).join(", ")}
              onChange={e => { const n = [...data.areas]; n[i] = { ...n[i], highlights: e.target.value.split(",").map(s => s.trim()) }; set("areas", n); }}
              sx={{ mt: 1.5 }}
            />
            <Box component="button" onClick={() => set("areas", data.areas.filter((_, j) => j !== i))} sx={{ mt: 1, fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer" }}>Remove</Box>
          </Box>
        ))}
      </Box>
    </SectionShell>
  );
}
