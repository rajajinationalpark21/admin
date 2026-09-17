import React from "react";
import { Box, TextField } from "@mui/material";
import { SectionShell, Field, FieldGrid } from "./SectionShell";
import useSectionContent from "./useSectionContent";

export default function StayTab() {
  const { data, setData, loading, saving, save } = useSectionContent("stay", {
    overview: "",
    wildBrook: { name: "", tagline: "", location: "", distance: "", phone: "", email: "", features: [] },
    forestRestHouses: [],
    frhBookingInfo: { authority: "", address: "", phone: "", fax: "", bookingRule: "" },
  });

  if (loading) return null;

  const set = (key, val) => setData({ ...data, [key]: val });
  const setWildBrook = (key, val) => set("wildBrook", { ...data.wildBrook, [key]: val });
  const setFrhBooking = (key, val) => set("frhBookingInfo", { ...data.frhBookingInfo, [key]: val });

  return (
    <SectionShell title="Stay Section" subtitle="Accommodation options, forest rest houses, and booking information." saving={saving} onSave={save}>
      <Field label="Overview" value={data.overview} onChange={e => set("overview", e.target.value)} multiline rows={3} />

      <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", mb: 1 }}>Wild Brook Resort</Box>
      <FieldGrid columns={2}>
        <Field label="Resort Name" value={data.wildBrook?.name} onChange={e => setWildBrook("name", e.target.value)} />
        <Field label="Tagline" value={data.wildBrook?.tagline} onChange={e => setWildBrook("tagline", e.target.value)} />
      </FieldGrid>
      <FieldGrid columns={2}>
        <Field label="Location" value={data.wildBrook?.location} onChange={e => setWildBrook("location", e.target.value)} multiline rows={2} />
        <Field label="Distance" value={data.wildBrook?.distance} onChange={e => setWildBrook("distance", e.target.value)} />
      </FieldGrid>
      <FieldGrid columns={2}>
        <Field label="Phone" value={data.wildBrook?.phone} onChange={e => setWildBrook("phone", e.target.value)} />
        <Field label="Email" value={data.wildBrook?.email} onChange={e => setWildBrook("email", e.target.value)} />
      </FieldGrid>
      <TextField
        fullWidth multiline rows={3} size="small"
        label="Features (one per line)"
        value={(data.wildBrook?.features || []).join("\n")}
        onChange={e => setWildBrook("features", e.target.value.split("\n"))}
      />

      <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", mb: 1, mt: 2 }}>Forest Rest Houses</Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Box component="button" onClick={() => set("forestRestHouses", [...(data.forestRestHouses || []), { name: "", suites: "", status: "", gate: "", setting: "" }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add Rest House</Box>
      </Box>
      {(data.forestRestHouses || []).map((item, i) => (
        <Box key={i} sx={{ p: 2, mb: 1.5, border: "1px solid", borderColor: "divider", borderRadius: "8px" }}>
          <FieldGrid columns={3}>
            <Field label="Name" value={item.name} onChange={e => { const n = [...data.forestRestHouses]; n[i] = { ...n[i], name: e.target.value }; set("forestRestHouses", n); }} />
            <Field label="Suites" value={item.suites} onChange={e => { const n = [...data.forestRestHouses]; n[i] = { ...n[i], suites: e.target.value }; set("forestRestHouses", n); }} />
            <Field label="Status" value={item.status} onChange={e => { const n = [...data.forestRestHouses]; n[i] = { ...n[i], status: e.target.value }; set("forestRestHouses", n); }} />
          </FieldGrid>
          <FieldGrid columns={2}>
            <Field label="Gate" value={item.gate} onChange={e => { const n = [...data.forestRestHouses]; n[i] = { ...n[i], gate: e.target.value }; set("forestRestHouses", n); }} />
            <Field label="Setting" value={item.setting} onChange={e => { const n = [...data.forestRestHouses]; n[i] = { ...n[i], setting: e.target.value }; set("forestRestHouses", n); }} />
          </FieldGrid>
          <Box component="button" onClick={() => set("forestRestHouses", data.forestRestHouses.filter((_, j) => j !== i))} sx={{ mt: 1, fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer" }}>Remove</Box>
        </Box>
      ))}

      <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", mb: 1, mt: 2 }}>FRH Booking Info</Box>
      <FieldGrid columns={2}>
        <Field label="Authority" value={data.frhBookingInfo?.authority} onChange={e => setFrhBooking("authority", e.target.value)} />
        <Field label="Address" value={data.frhBookingInfo?.address} onChange={e => setFrhBooking("address", e.target.value)} multiline rows={2} />
      </FieldGrid>
      <FieldGrid columns={2}>
        <Field label="Phone" value={data.frhBookingInfo?.phone} onChange={e => setFrhBooking("phone", e.target.value)} />
        <Field label="Fax" value={data.frhBookingInfo?.fax} onChange={e => setFrhBooking("fax", e.target.value)} />
      </FieldGrid>
      <Field label="Booking Rule" value={data.frhBookingInfo?.bookingRule} onChange={e => setFrhBooking("bookingRule", e.target.value)} multiline rows={2} />
    </SectionShell>
  );
}
