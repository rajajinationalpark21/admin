import React from "react";
import { Box } from "@mui/material";
import { SectionShell, Field, FieldGrid } from "./SectionShell";
import useSectionContent from "./useSectionContent";

export default function SettingsTab() {
  const { data, setData, loading, saving, save } = useSectionContent("settings", {
    siteName: "",
    contact: { name: "", phone: "", email: "", address: "", mapUrl: "" },
    social: { facebook: "", instagram: "", twitter: "", youtube: "", linkedin: "" },
    footer: { copyright: "", developedBy: "" },
  });

  if (loading) return null;

  const set = (key, val) => setData({ ...data, [key]: val });
  const setNested = (key, field, val) => set(key, { ...data[key], [field]: val });

  return (
    <SectionShell title="System Settings" subtitle="Site name, contact details, social links, and footer configuration." saving={saving} onSave={save}>
      <Field label="Site Name" value={data.siteName} onChange={e => set("siteName", e.target.value)} />

      <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", mb: 1 }}>Contact Information</Box>
      <FieldGrid columns={2}>
        <Field label="Contact Name" value={data.contact?.name} onChange={e => setNested("contact", "name", e.target.value)} />
        <Field label="Phone" value={data.contact?.phone} onChange={e => setNested("contact", "phone", e.target.value)} />
      </FieldGrid>
      <FieldGrid columns={2}>
        <Field label="Email" value={data.contact?.email} onChange={e => setNested("contact", "email", e.target.value)} />
        <Field label="Map URL" value={data.contact?.mapUrl} onChange={e => setNested("contact", "mapUrl", e.target.value)} />
      </FieldGrid>
      <Field label="Address" value={data.contact?.address} onChange={e => setNested("contact", "address", e.target.value)} multiline rows={2} />

      <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", mb: 1, mt: 2 }}>Social Media Links</Box>
      <FieldGrid columns={2}>
        <Field label="Facebook" value={data.social?.facebook} onChange={e => setNested("social", "facebook", e.target.value)} />
        <Field label="Instagram" value={data.social?.instagram} onChange={e => setNested("social", "instagram", e.target.value)} />
      </FieldGrid>
      <FieldGrid columns={3}>
        <Field label="Twitter" value={data.social?.twitter} onChange={e => setNested("social", "twitter", e.target.value)} />
        <Field label="YouTube" value={data.social?.youtube} onChange={e => setNested("social", "youtube", e.target.value)} />
        <Field label="LinkedIn" value={data.social?.linkedin} onChange={e => setNested("social", "linkedin", e.target.value)} />
      </FieldGrid>

      <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", mb: 1, mt: 2 }}>Footer</Box>
      <FieldGrid columns={2}>
        <Field label="Copyright Text" value={data.footer?.copyright} onChange={e => setNested("footer", "copyright", e.target.value)} />
        <Field label="Developed By" value={data.footer?.developedBy} onChange={e => setNested("footer", "developedBy", e.target.value)} />
      </FieldGrid>
    </SectionShell>
  );
}
