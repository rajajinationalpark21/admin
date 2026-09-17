import React from "react";
import { Box, TextField } from "@mui/material";
import { SectionShell, Field, FieldGrid } from "./SectionShell";
import useSectionContent from "./useSectionContent";

export default function TicketsTab() {
  const { data, setData, loading, saving, save } = useSectionContent("tickets", {
    timings: { summer: "", winter: "", openDates: "" },
    entranceFees: [],
    gypsyRates: [],
    guideFees: [],
    importantNotes: [],
  });

  if (loading) return null;

  const set = (key, val) => setData({ ...data, [key]: val });
  const setTimings = (key, val) => set("timings", { ...data.timings, [key]: val });

  return (
    <SectionShell title="Tickets & Tariff Section" subtitle="Safari timings, entrance fees, gypsy rates, and guide fees." saving={saving} onSave={save}>
      <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", mb: 1 }}>Safari Timings</Box>
      <FieldGrid columns={3}>
        <Field label="Summer Timing" value={data.timings?.summer} onChange={e => setTimings("summer", e.target.value)} />
        <Field label="Winter Timing" value={data.timings?.winter} onChange={e => setTimings("winter", e.target.value)} />
        <Field label="Open Dates" value={data.timings?.openDates} onChange={e => setTimings("openDates", e.target.value)} />
      </FieldGrid>

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Entrance Fees</Box>
          <Box component="button" onClick={() => set("entranceFees", [...(data.entranceFees || []), { category: "", indian: "", foreigner: "", note: "" }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add</Box>
        </Box>
        {(data.entranceFees || []).map((item, i) => (
          <Box key={i} sx={{ p: 2, mb: 1.5, border: "1px solid", borderColor: "divider", borderRadius: "8px" }}>
            <FieldGrid columns={4}>
              <Field label="Category" value={item.category} onChange={e => { const n = [...data.entranceFees]; n[i] = { ...n[i], category: e.target.value }; set("entranceFees", n); }} />
              <Field label="Indian" value={item.indian} onChange={e => { const n = [...data.entranceFees]; n[i] = { ...n[i], indian: e.target.value }; set("entranceFees", n); }} />
              <Field label="Foreigner" value={item.foreigner} onChange={e => { const n = [...data.entranceFees]; n[i] = { ...n[i], foreigner: e.target.value }; set("entranceFees", n); }} />
              <Field label="Note" value={item.note} onChange={e => { const n = [...data.entranceFees]; n[i] = { ...n[i], note: e.target.value }; set("entranceFees", n); }} />
            </FieldGrid>
            <Box component="button" onClick={() => set("entranceFees", data.entranceFees.filter((_, j) => j !== i))} sx={{ mt: 1, fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer" }}>Remove</Box>
          </Box>
        ))}
      </Box>

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Gypsy Rates</Box>
          <Box component="button" onClick={() => set("gypsyRates", [...(data.gypsyRates || []), { zone: "", rate: "", capacity: "" }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add</Box>
        </Box>
        {(data.gypsyRates || []).map((item, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1, alignItems: "center" }}>
            <Field label="Zone" value={item.zone} onChange={e => { const n = [...data.gypsyRates]; n[i] = { ...n[i], zone: e.target.value }; set("gypsyRates", n); }} sx={{ flex: 2 }} />
            <Field label="Rate" value={item.rate} onChange={e => { const n = [...data.gypsyRates]; n[i] = { ...n[i], rate: e.target.value }; set("gypsyRates", n); }} sx={{ flex: 1 }} />
            <Field label="Capacity" value={item.capacity} onChange={e => { const n = [...data.gypsyRates]; n[i] = { ...n[i], capacity: e.target.value }; set("gypsyRates", n); }} sx={{ flex: 2 }} />
            <Box component="button" onClick={() => set("gypsyRates", data.gypsyRates.filter((_, j) => j !== i))} sx={{ fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>Remove</Box>
          </Box>
        ))}
      </Box>

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary" }}>Guide Fees</Box>
          <Box component="button" onClick={() => set("guideFees", [...(data.guideFees || []), { type: "", fee: "", note: "" }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add</Box>
        </Box>
        {(data.guideFees || []).map((item, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1, alignItems: "center" }}>
            <Field label="Type" value={item.type} onChange={e => { const n = [...data.guideFees]; n[i] = { ...n[i], type: e.target.value }; set("guideFees", n); }} sx={{ flex: 2 }} />
            <Field label="Fee" value={item.fee} onChange={e => { const n = [...data.guideFees]; n[i] = { ...n[i], fee: e.target.value }; set("guideFees", n); }} sx={{ flex: 1 }} />
            <Field label="Note" value={item.note} onChange={e => { const n = [...data.guideFees]; n[i] = { ...n[i], note: e.target.value }; set("guideFees", n); }} sx={{ flex: 2 }} />
            <Box component="button" onClick={() => set("guideFees", data.guideFees.filter((_, j) => j !== i))} sx={{ fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>Remove</Box>
          </Box>
        ))}
      </Box>

      <Box>
        <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", mb: 1 }}>Important Notes</Box>
        <TextField
          fullWidth multiline rows={4} size="small"
          label="Important notes (one per line)"
          value={(data.importantNotes || []).join("\n")}
          onChange={e => set("importantNotes", e.target.value.split("\n"))}
        />
      </Box>
    </SectionShell>
  );
}
