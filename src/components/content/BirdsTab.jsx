import React from "react";
import { Box, TextField } from "@mui/material";
import { SectionShell, Field, FieldGrid } from "./SectionShell";
import useSectionContent from "./useSectionContent";

export default function BirdsTab() {
  const { data, setData, loading, saving, save } = useSectionContent("birds", {
    overview: "",
    stats: { totalSpecies: "", residentSpecies: "", winterMigrants: "", altitudinalMigrants: "", woodpeckers: "", barbets: "", hornbills: "" },
    families: [],
    restrictedRange: [],
  });

  if (loading) return null;

  const set = (key, val) => setData({ ...data, [key]: val });
  const setStat = (key, val) => set("stats", { ...data.stats, [key]: val });

  return (
    <SectionShell title="Birds Section" subtitle="Avian biodiversity overview, species families, and restricted-range birds." saving={saving} onSave={save}>
      <Field label="Overview" value={data.overview} onChange={e => set("overview", e.target.value)} multiline rows={4} />

      <Box>
        <FieldGrid columns={4}>
          <Field label="Total Species" value={data.stats?.totalSpecies} onChange={e => setStat("totalSpecies", e.target.value)} />
          <Field label="Resident Species" value={data.stats?.residentSpecies} onChange={e => setStat("residentSpecies", e.target.value)} />
          <Field label="Winter Migrants" value={data.stats?.winterMigrants} onChange={e => setStat("winterMigrants", e.target.value)} />
          <Field label="Altitudinal Migrants" value={data.stats?.altitudinalMigrants} onChange={e => setStat("altitudinalMigrants", e.target.value)} />
        </FieldGrid>
        <FieldGrid columns={3}>
          <Field label="Woodpeckers" value={data.stats?.woodpeckers} onChange={e => setStat("woodpeckers", e.target.value)} />
          <Field label="Barbets" value={data.stats?.barbets} onChange={e => setStat("barbets", e.target.value)} />
          <Field label="Hornbills" value={data.stats?.hornbills} onChange={e => setStat("hornbills", e.target.value)} />
        </FieldGrid>
      </Box>

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Bird Families</Box>
          <Box component="button" onClick={() => set("families", [...(data.families || []), { group: "", desc: "", species: [] }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add Family</Box>
        </Box>
        {(data.families || []).map((fam, i) => (
          <Box key={i} sx={{ p: 2, mb: 1.5, border: "1px solid", borderColor: "divider", borderRadius: "8px" }}>
            <FieldGrid columns={2}>
              <Field label="Family Group" value={fam.group} onChange={e => { const n = [...data.families]; n[i] = { ...n[i], group: e.target.value }; set("families", n); }} />
              <Field label="Description" value={fam.desc} onChange={e => { const n = [...data.families]; n[i] = { ...n[i], desc: e.target.value }; set("families", n); }} />
            </FieldGrid>
            <TextField
              fullWidth size="small" label="Species (comma-separated)"
              value={(fam.species || []).join(", ")}
              onChange={e => { const n = [...data.families]; n[i] = { ...n[i], species: e.target.value.split(",").map(s => s.trim()) }; set("families", n); }}
              sx={{ mt: 1.5 }}
            />
            <Box component="button" onClick={() => set("families", data.families.filter((_, j) => j !== i))} sx={{ mt: 1, fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer" }}>Remove</Box>
          </Box>
        ))}
      </Box>

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Restricted Range Birds</Box>
          <Box component="button" onClick={() => set("restrictedRange", [...(data.restrictedRange || []), { name: "", status: "" }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add Bird</Box>
        </Box>
        {(data.restrictedRange || []).map((bird, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1, alignItems: "center" }}>
            <Field label="Bird Name" value={bird.name} onChange={e => { const n = [...data.restrictedRange]; n[i] = { ...n[i], name: e.target.value }; set("restrictedRange", n); }} sx={{ flex: 2 }} />
            <Field label="Status" value={bird.status} onChange={e => { const n = [...data.restrictedRange]; n[i] = { ...n[i], status: e.target.value }; set("restrictedRange", n); }} sx={{ flex: 2 }} />
            <Box component="button" onClick={() => set("restrictedRange", data.restrictedRange.filter((_, j) => j !== i))} sx={{ fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>Remove</Box>
          </Box>
        ))}
      </Box>
    </SectionShell>
  );
}
