import React from "react";
import { Box, TextField } from "@mui/material";
import { SectionShell, Field, FieldGrid } from "./SectionShell";
import useSectionContent from "./useSectionContent";

export default function HowToReachTab() {
  const { data, setData, loading, saving, save } = useSectionContent("howToReach", {
    overview: "",
    air: { airport: "", distance: "", flightTime: "", details: "" },
    rail: { nearestRailhead: "", stations: [], popularTrains: [] },
    road: { delhiDistance: "", routeSteps: [], distances: [] },
    coordinates: { latitude: "", longitude: "", altitude: "" },
  });

  if (loading) return null;

  const set = (key, val) => setData({ ...data, [key]: val });
  const setNested = (key, field, val) => set(key, { ...data[key], [field]: val });

  return (
    <SectionShell title="How To Reach Section" subtitle="Air, rail, and road connectivity details with distances and schedules." saving={saving} onSave={save}>
      <Field label="Overview" value={data.overview} onChange={e => set("overview", e.target.value)} multiline rows={3} />

      <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", mb: 1 }}>Air Connectivity</Box>
      <FieldGrid columns={2}>
        <Field label="Airport Name" value={data.air?.airport} onChange={e => setNested("air", "airport", e.target.value)} />
        <Field label="Distance" value={data.air?.distance} onChange={e => setNested("air", "distance", e.target.value)} />
      </FieldGrid>
      <FieldGrid columns={2}>
        <Field label="Flight Time" value={data.air?.flightTime} onChange={e => setNested("air", "flightTime", e.target.value)} />
        <Field label="Details" value={data.air?.details} onChange={e => setNested("air", "details", e.target.value)} multiline rows={2} />
      </FieldGrid>

      <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", mb: 1 }}>Rail Connectivity</Box>
      <Field label="Nearest Railhead" value={data.rail?.nearestRailhead} onChange={e => setNested("rail", "nearestRailhead", e.target.value)} />

      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.75rem", fontWeight: 600, color: "text.secondary" }}>Stations</Box>
          <Box component="button" onClick={() => setNested("rail", "stations", [...(data.rail?.stations || []), { name: "", distance: "", note: "" }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add</Box>
        </Box>
        {(data.rail?.stations || []).map((item, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1, alignItems: "center" }}>
            <Field label="Station" value={item.name} onChange={e => { const n = [...data.rail.stations]; n[i] = { ...n[i], name: e.target.value }; setNested("rail", "stations", n); }} sx={{ flex: 2 }} />
            <Field label="Distance" value={item.distance} onChange={e => { const n = [...data.rail.stations]; n[i] = { ...n[i], distance: e.target.value }; setNested("rail", "stations", n); }} sx={{ flex: 1 }} />
            <Field label="Note" value={item.note} onChange={e => { const n = [...data.rail.stations]; n[i] = { ...n[i], note: e.target.value }; setNested("rail", "stations", n); }} sx={{ flex: 2 }} />
            <Box component="button" onClick={() => setNested("rail", "stations", data.rail.stations.filter((_, j) => j !== i))} sx={{ fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>Remove</Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.75rem", fontWeight: 600, color: "text.secondary" }}>Popular Trains</Box>
          <Box component="button" onClick={() => setNested("rail", "popularTrains", [...(data.rail?.popularTrains || []), { name: "", number: "", frequency: "" }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add</Box>
        </Box>
        {(data.rail?.popularTrains || []).map((item, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1, alignItems: "center" }}>
            <Field label="Train Name" value={item.name} onChange={e => { const n = [...data.rail.popularTrains]; n[i] = { ...n[i], name: e.target.value }; setNested("rail", "popularTrains", n); }} sx={{ flex: 2 }} />
            <Field label="Number" value={item.number} onChange={e => { const n = [...data.rail.popularTrains]; n[i] = { ...n[i], number: e.target.value }; setNested("rail", "popularTrains", n); }} sx={{ flex: 1 }} />
            <Field label="Frequency" value={item.frequency} onChange={e => { const n = [...data.rail.popularTrains]; n[i] = { ...n[i], frequency: e.target.value }; setNested("rail", "popularTrains", n); }} sx={{ flex: 1 }} />
            <Box component="button" onClick={() => setNested("rail", "popularTrains", data.rail.popularTrains.filter((_, j) => j !== i))} sx={{ fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>Remove</Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", mb: 1, mt: 2 }}>Road Connectivity</Box>
      <Field label="Delhi Distance" value={data.road?.delhiDistance} onChange={e => setNested("road", "delhiDistance", e.target.value)} />
      <TextField
        fullWidth multiline rows={2} size="small" sx={{ mt: 1.5 }}
        label="Route Steps (one per line)"
        value={(data.road?.routeSteps || []).join("\n")}
        onChange={e => setNested("road", "routeSteps", e.target.value.split("\n"))}
      />

      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ fontSize: "0.75rem", fontWeight: 600, color: "text.secondary" }}>Distances from Cities</Box>
          <Box component="button" onClick={() => setNested("road", "distances", [...(data.road?.distances || []), { from: "", distance: "" }])} sx={{ fontSize: "0.75rem", color: "primary.main", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add</Box>
        </Box>
        {(data.road?.distances || []).map((item, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 1, alignItems: "center" }}>
            <Field label="From City" value={item.from} onChange={e => { const n = [...data.road.distances]; n[i] = { ...n[i], from: e.target.value }; setNested("road", "distances", n); }} sx={{ flex: 1 }} />
            <Field label="Distance" value={item.distance} onChange={e => { const n = [...data.road.distances]; n[i] = { ...n[i], distance: e.target.value }; setNested("road", "distances", n); }} sx={{ flex: 1 }} />
            <Box component="button" onClick={() => setNested("road", "distances", data.road.distances.filter((_, j) => j !== i))} sx={{ fontSize: "0.75rem", color: "error.main", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>Remove</Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", mb: 1, mt: 2 }}>GPS Coordinates</Box>
      <FieldGrid columns={3}>
        <Field label="Latitude" value={data.coordinates?.latitude} onChange={e => setNested("coordinates", "latitude", e.target.value)} />
        <Field label="Longitude" value={data.coordinates?.longitude} onChange={e => setNested("coordinates", "longitude", e.target.value)} />
        <Field label="Altitude" value={data.coordinates?.altitude} onChange={e => setNested("coordinates", "altitude", e.target.value)} />
      </FieldGrid>
    </SectionShell>
  );
}
