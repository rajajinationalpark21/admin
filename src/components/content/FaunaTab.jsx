import React from "react";
import { Box } from "@mui/material";
import { SectionShell, Field, FieldGrid } from "./SectionShell";
import useSectionContent from "./useSectionContent";

export default function FaunaTab() {
  const { data, setData, loading, saving, save } = useSectionContent("fauna", {
    overview: "",
    primeAttractions: [],
    herbivores: [],
    carnivores: [],
    reptiles: [],
    aquaticLife: { rivers: "", fishes: [] },
  });

  if (loading) return null;

  const set = (key, val) => setData({ ...data, [key]: val });

  const addToList = (key, empty) => set(key, [...(data[key] || []), empty]);
  const removeFromList = (key, idx) => set(key, data[key].filter((_, j) => j !== idx));
  const updateListItem = (key, idx, field, val) => {
    const n = [...data[key]];
    n[idx] = { ...n[idx], [field]: val };
    set(key, n);
  };

  return (
    <SectionShell title="Fauna Section" subtitle="Mammal, reptile, and aquatic biodiversity of Rajaji National Park." saving={saving} onSave={save}>
      <Field label="Overview" value={data.overview} onChange={e => set("overview", e.target.value)} multiline rows={4} />

      {/* Prime Attractions */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Prime Attractions</Box>
          <Box component="button" onClick={() => addToList("primeAttractions", { name: "", count: "", details: "" })} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add</Box>
        </Box>
        {(data.primeAttractions || []).map((item, i) => (
          <Box key={i} sx={{ p: 2, mb: 1.5, border: "1px solid", borderColor: "divider", borderRadius: "8px" }}>
            <FieldGrid columns={3}>
              <Field label="Animal Name" value={item.name} onChange={e => updateListItem("primeAttractions", i, "name", e.target.value)} />
              <Field label="Count" value={item.count} onChange={e => updateListItem("primeAttractions", i, "count", e.target.value)} />
              <Field label="Details" value={item.details} onChange={e => updateListItem("primeAttractions", i, "details", e.target.value)} />
            </FieldGrid>
            <Box component="button" onClick={() => removeFromList("primeAttractions", i)} sx={{ mt: 1, fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer" }}>Remove</Box>
          </Box>
        ))}
      </Box>

      {/* Herbivores */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Herbivores</Box>
          <Box component="button" onClick={() => addToList("herbivores", { name: "", info: "" })} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add</Box>
        </Box>
        {(data.herbivores || []).map((item, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1, alignItems: "center" }}>
            <Field label="Name" value={item.name} onChange={e => updateListItem("herbivores", i, "name", e.target.value)} sx={{ flex: 1 }} />
            <Field label="Info" value={item.info} onChange={e => updateListItem("herbivores", i, "info", e.target.value)} sx={{ flex: 2 }} />
            <Box component="button" onClick={() => removeFromList("herbivores", i)} sx={{ fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>Remove</Box>
          </Box>
        ))}
      </Box>

      {/* Carnivores */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Carnivores</Box>
          <Box component="button" onClick={() => addToList("carnivores", { name: "", info: "" })} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add</Box>
        </Box>
        {(data.carnivores || []).map((item, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1, alignItems: "center" }}>
            <Field label="Name" value={item.name} onChange={e => updateListItem("carnivores", i, "name", e.target.value)} sx={{ flex: 1 }} />
            <Field label="Info" value={item.info} onChange={e => updateListItem("carnivores", i, "info", e.target.value)} sx={{ flex: 2 }} />
            <Box component="button" onClick={() => removeFromList("carnivores", i)} sx={{ fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>Remove</Box>
          </Box>
        ))}
      </Box>

      {/* Reptiles */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Reptiles</Box>
          <Box component="button" onClick={() => addToList("reptiles", { name: "", status: "" })} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add</Box>
        </Box>
        {(data.reptiles || []).map((item, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1, alignItems: "center" }}>
            <Field label="Name" value={item.name} onChange={e => updateListItem("reptiles", i, "name", e.target.value)} sx={{ flex: 1 }} />
            <Field label="Status" value={item.status} onChange={e => updateListItem("reptiles", i, "status", e.target.value)} sx={{ flex: 2 }} />
            <Box component="button" onClick={() => removeFromList("reptiles", i)} sx={{ fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>Remove</Box>
          </Box>
        ))}
      </Box>

      {/* Aquatic Life */}
      <Box>
        <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", mb: 1 }}>Aquatic Life</Box>
        <Field label="Rivers" value={data.aquaticLife?.rivers} onChange={e => set("aquaticLife", { ...data.aquaticLife, rivers: e.target.value })} multiline rows={2} />
        <TextField
          fullWidth size="small" label="Fish Species (comma-separated)"
          value={(data.aquaticLife?.fishes || []).join(", ")}
          onChange={e => set("aquaticLife", { ...data.aquaticLife, fishes: e.target.value.split(",").map(s => s.trim()) })}
          sx={{ mt: 1.5 }}
        />
      </Box>
    </SectionShell>
  );
}
