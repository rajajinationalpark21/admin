import React from "react";
import { Box } from "@mui/material";
import { SectionShell, Field, FieldGrid } from "./SectionShell";
import useSectionContent from "./useSectionContent";

export default function ParkRulesTab() {
  const { data, setData, loading, saving, save } = useSectionContent("parkRules", {
    overview: "",
    dos: [],
    donts: [],
  });

  if (loading) return null;

  const set = (key, val) => setData({ ...data, [key]: val });

  const renderRules = (key, label) => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>{label}</Box>
        <Box component="button" onClick={() => set(key, [...(data[key] || []), { title: "", desc: "" }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add Rule</Box>
      </Box>
      {(data[key] || []).map((item, i) => (
        <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1, alignItems: "center" }}>
          <Field label="Title" value={item.title} onChange={e => { const n = [...data[key]]; n[i] = { ...n[i], title: e.target.value }; set(key, n); }} sx={{ flex: 1 }} />
          <Field label="Description" value={item.desc} onChange={e => { const n = [...data[key]]; n[i] = { ...n[i], desc: e.target.value }; set(key, n); }} sx={{ flex: 2 }} />
          <Box component="button" onClick={() => set(key, data[key].filter((_, j) => j !== i))} sx={{ fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>Remove</Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <SectionShell title="Park Rules Section" subtitle="Visitor dos and donts, safety regulations, and wildlife guidelines." saving={saving} onSave={save}>
      <Field label="Overview" value={data.overview} onChange={e => set("overview", e.target.value)} multiline rows={4} />
      {renderRules("dos", "Do's")}
      {renderRules("donts", "Don'ts")}
    </SectionShell>
  );
}
