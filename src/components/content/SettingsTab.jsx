import { Box, CircularProgress } from "@mui/material";
import { SectionShell, Field, FieldGrid } from "./SectionShell";
import useSectionContent from "./useSectionContent";

export default function SettingsTab() {
  const { data, setData, loading, saving, save } = useSectionContent("settings", {
    siteName: "",
    contact: { name: "", phone: "", email: "", address: "", mapUrl: "" },
    social: { facebook: "", instagram: "", twitter: "", youtube: "", linkedin: "" },
    footer: { copyright: "", developedBy: "" },
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  const set = (key, val) => setData({ ...data, [key]: val });
  const setNested = (key, field, val) => set(key, { ...data[key], [field]: val });

  return (
    <SectionShell title="Website Details" subtitle="Site name, contact details, social links, and footer text shown across the public website." saving={saving} onSave={save}>
      <Field label="Site Name" value={data.siteName} onChange={e => set("siteName", e.target.value)} />

      <Box sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.secondary", mb: 1 }}>Contact Information</Box>
      <FieldGrid columns={2}>
        <Field label="Contact Name" value={data.contact?.name} onChange={e => setNested("contact", "name", e.target.value)} />
        <Field label="Phone" value={data.contact?.phone} onChange={e => setNested("contact", "phone", e.target.value)} />
      </FieldGrid>
      <FieldGrid columns={3}>
        <Field label="Second Phone" value={data.contact?.secondaryPhone} onChange={e => setNested("contact", "secondaryPhone", e.target.value)} />
        <Field label="Third Phone" value={data.contact?.tertiaryPhone} onChange={e => setNested("contact", "tertiaryPhone", e.target.value)} />
        <Field label="WhatsApp" value={data.contact?.whatsapp} onChange={e => setNested("contact", "whatsapp", e.target.value)} />
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
      <Field label="Footer Brand Title" value={data.footer?.brandTitle} onChange={e => setNested("footer", "brandTitle", e.target.value)} />
      <Field label="Footer Description" value={data.footer?.brandDesc} onChange={e => setNested("footer", "brandDesc", e.target.value)} multiline rows={2} />
      <FieldGrid columns={2}>
        <Field label="Footer Address" value={data.footer?.address} onChange={e => setNested("footer", "address", e.target.value)} />
        <Field label="Footer Phone" value={data.footer?.phone} onChange={e => setNested("footer", "phone", e.target.value)} />
      </FieldGrid>
      <FieldGrid columns={2}>
        <Field label="Copyright Text" value={data.footer?.copyright} onChange={e => setNested("footer", "copyright", e.target.value)} />
        <Field label="Developed By" value={data.footer?.developedBy} onChange={e => setNested("footer", "developedBy", e.target.value)} />
      </FieldGrid>
    </SectionShell>
  );
}
