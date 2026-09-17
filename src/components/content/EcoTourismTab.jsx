import React from "react";
import { Box } from "@mui/material";
import { SectionShell, Field, FieldGrid } from "./SectionShell";
import useSectionContent from "./useSectionContent";

export default function EcoTourismTab() {
  const { data, setData, loading, saving, save } = useSectionContent("ecoTourism", {
    philosophy: "",
    pillars: [],
  });

  if (loading) return null;

  const set = (key, val) => setData({ ...data, [key]: val });

  return (
    <SectionShell title="Eco-Tourism Section" subtitle="Conservation philosophy, sustainability pillars, and eco-tourism initiatives." saving={saving} onSave={save}>
      <Field label="Philosophy" value={data.philosophy} onChange={e => set("philosophy", e.target.value)} multiline rows={5} />

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Sustainability Pillars</Box>
          <Box component="button" onClick={() => set("pillars", [...(data.pillars || []), { title: "", desc: "" }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add Pillar</Box>
        </Box>
        {(data.pillars || []).map((item, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1, alignItems: "center" }}>
            <Field label="Pillar Title" value={item.title} onChange={e => { const n = [...data.pillars]; n[i] = { ...n[i], title: e.target.value }; set("pillars", n); }} sx={{ flex: 1 }} />
            <Field label="Description" value={item.desc} onChange={e => { const n = [...data.pillars]; n[i] = { ...n[i], desc: e.target.value }; set("pillars", n); }} sx={{ flex: 2 }} />
            <Box component="button" onClick={() => set("pillars", data.pillars.filter((_, j) => j !== i))} sx={{ fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>Remove</Box>
          </Box>
        ))}
      </Box>
    </SectionShell>
  );
}
