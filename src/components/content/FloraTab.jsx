import React from "react";
import { Box, TextField } from "@mui/material";
import { SectionShell, Field, FieldGrid } from "./SectionShell";
import useSectionContent from "./useSectionContent";

export default function FloraTab() {
  const { data, setData, loading, saving, save } = useSectionContent("flora", {
    overview: "",
    altitudinalBands: [],
    dominantTrees: [],
  });

  if (loading) return null;

  const set = (key, val) => setData({ ...data, [key]: val });

  return (
    <SectionShell title="Flora Section" subtitle="Vegetation zones, altitudinal bands, and dominant tree species." saving={saving} onSave={save}>
      <Field label="Overview" value={data.overview} onChange={e => set("overview", e.target.value)} multiline rows={4} />

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Altitudinal Bands</Box>
          <Box component="button" onClick={() => set("altitudinalBands", [...(data.altitudinalBands || []), { band: "", trees: "" }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add Band</Box>
        </Box>
        {(data.altitudinalBands || []).map((item, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1, alignItems: "center" }}>
            <Field label="Band (e.g. 300-600m)" value={item.band} onChange={e => { const n = [...data.altitudinalBands]; n[i] = { ...n[i], band: e.target.value }; set("altitudinalBands", n); }} sx={{ flex: 1 }} />
            <Field label="Trees" value={item.trees} onChange={e => { const n = [...data.altitudinalBands]; n[i] = { ...n[i], trees: e.target.value }; set("altitudinalBands", n); }} sx={{ flex: 2 }} />
            <Box component="button" onClick={() => set("altitudinalBands", data.altitudinalBands.filter((_, j) => j !== i))} sx={{ fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>Remove</Box>
          </Box>
        ))}
      </Box>

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Dominant Trees</Box>
          <Box component="button" onClick={() => set("dominantTrees", [...(data.dominantTrees || []), { common: "", scientific: "", family: "", desc: "" }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add Tree</Box>
        </Box>
        {(data.dominantTrees || []).map((item, i) => (
          <Box key={i} sx={{ p: 2, mb: 1.5, border: "1px solid", borderColor: "divider", borderRadius: "8px" }}>
            <FieldGrid columns={2}>
              <Field label="Common Name" value={item.common} onChange={e => { const n = [...data.dominantTrees]; n[i] = { ...n[i], common: e.target.value }; set("dominantTrees", n); }} />
              <Field label="Scientific Name" value={item.scientific} onChange={e => { const n = [...data.dominantTrees]; n[i] = { ...n[i], scientific: e.target.value }; set("dominantTrees", n); }} />
              <Field label="Family" value={item.family} onChange={e => { const n = [...data.dominantTrees]; n[i] = { ...n[i], family: e.target.value }; set("dominantTrees", n); }} />
              <Field label="Description" value={item.desc} onChange={e => { const n = [...data.dominantTrees]; n[i] = { ...n[i], desc: e.target.value }; set("dominantTrees", n); }} />
            </FieldGrid>
            <Box component="button" onClick={() => set("dominantTrees", data.dominantTrees.filter((_, j) => j !== i))} sx={{ mt: 1, fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer" }}>Remove</Box>
          </Box>
        ))}
      </Box>
    </SectionShell>
  );
}
