import React from "react";
import { Box, TextField } from "@mui/material";
import { SectionShell, Field, FieldGrid } from "./SectionShell";
import useSectionContent from "./useSectionContent";

export default function ButterfliesTab() {
  const { data, setData, loading, saving, save } = useSectionContent("butterflies", {
    overview: "",
    mudPuddling: "",
    species: [],
  });

  if (loading) return null;

  const set = (key, val) => setData({ ...data, [key]: val });

  return (
    <SectionShell title="Butterflies Section" subtitle="Butterfly diversity, mud-puddling behavior, and notable species." saving={saving} onSave={save}>
      <Field label="Overview" value={data.overview} onChange={e => set("overview", e.target.value)} multiline rows={4} />
      <Field label="Mud Puddling Info" value={data.mudPuddling} onChange={e => set("mudPuddling", e.target.value)} multiline rows={4} />

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Species</Box>
          <Box component="button" onClick={() => set("species", [...(data.species || []), { name: "", family: "", habitat: "" }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add Species</Box>
        </Box>
        {(data.species || []).map((item, i) => (
          <Box key={i} sx={{ p: 2, mb: 1.5, border: "1px solid", borderColor: "divider", borderRadius: "8px" }}>
            <FieldGrid columns={3}>
              <Field label="Name" value={item.name} onChange={e => { const n = [...data.species]; n[i] = { ...n[i], name: e.target.value }; set("species", n); }} />
              <Field label="Family" value={item.family} onChange={e => { const n = [...data.species]; n[i] = { ...n[i], family: e.target.value }; set("species", n); }} />
              <Field label="Habitat" value={item.habitat} onChange={e => { const n = [...data.species]; n[i] = { ...n[i], habitat: e.target.value }; set("species", n); }} />
            </FieldGrid>
            <Box component="button" onClick={() => set("species", data.species.filter((_, j) => j !== i))} sx={{ mt: 1, fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer" }}>Remove</Box>
          </Box>
        ))}
      </Box>
    </SectionShell>
  );
}
