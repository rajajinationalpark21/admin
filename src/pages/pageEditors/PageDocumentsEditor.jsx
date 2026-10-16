import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box, Typography, Paper, TextField, Button, CircularProgress, MenuItem, Select, ListSubheader, Tabs, Tab,
} from "@mui/material";
import { Save, ExternalLink } from "lucide-react";
import Header from "../../components/common/Header";
import ImageUploadField from "../../components/common/ImageUploadField";
import HeroImageListField from "../../components/common/HeroImageListField";
import GalleryListField from "../../components/common/GalleryListField";
import DocBlocksEditor from "../../components/content/DocBlocksEditor";
import SeoFields from "../../components/content/SeoFields";
import useSectionContent from "../../components/content/useSectionContent";
import api from "../../api/apiClient";
import { PAGE_DOCUMENTS, fieldKeys, zonePages } from "../../constants/pageDocuments";

const SITE_URL = (import.meta.env.VITE_SITE_URL || "").replace(/\/+$/, "");
const card = { p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" };

function PageEditor({ page }) {
  const { data, setData, loading, saving, save } = useSectionContent(page.section, {});
  const [tab, setTab] = useState(0);
  const keys = fieldKeys(page);

  if (loading || !data) {
    return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress size={28} /></Box>;
  }

  // Zone pages edit one entry of `safari.zones`; every other page edits its section.
  const isZone = page.zoneIndex !== undefined;
  const target = isZone ? data.zones?.[page.zoneIndex] || {} : data;
  const setTarget = (next) => {
    if (!isZone) return setData(next);
    const zones = [...(data.zones || [])];
    zones[page.zoneIndex] = next;
    return setData({ ...data, zones });
  };
  const value = (name) => (keys[name] ? target[keys[name]] : undefined);
  const set = (name, next) => setTarget({ ...target, [keys[name]]: next });

  const slug = value("slug");
  const livePath = page.path || (slug ? `/${slug}` : null);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Paper elevation={0} sx={{ p: 1, borderRadius: "14px", border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
        <Tabs value={tab} onChange={(_, next) => setTab(next)} sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.85rem", minHeight: 42 } }}>
          <Tab label="Page header" />
          {keys.docBlocks && <Tab label="Page document" />}
          <Tab label="Photo gallery" />
          <Tab label="URL & SEO" />
        </Tabs>
        <Box sx={{ display: "flex", gap: 1, pr: 1 }}>
          {livePath && SITE_URL && (
            <Button size="small" href={`${SITE_URL}${livePath}`} target="_blank" rel="noreferrer" startIcon={<ExternalLink size={14} />} sx={{ textTransform: "none" }}>
              View page
            </Button>
          )}
          <Button size="small" variant="contained" disabled={saving} onClick={save}
            startIcon={saving ? <CircularProgress size={14} /> : <Save size={14} />}
            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}>
            {saving ? "Saving..." : "Save page"}
          </Button>
        </Box>
      </Paper>

      {tab === 0 && (
        <Paper elevation={0} sx={{ ...card, display: "grid", gap: 2.5 }}>
          {keys.title && <TextField size="small" fullWidth label="Page heading (H1)" value={value("title") || ""} onChange={(e) => set("title", e.target.value)} />}
          {keys.subtitle && <TextField size="small" fullWidth multiline minRows={2} label="Text under the heading" value={value("subtitle") || ""} onChange={(e) => set("subtitle", e.target.value)} />}
          {keys.heroImages && (
            <HeroImageListField label="Header photos (they rotate)" value={value("heroImages") || []} fallbackValue={value("heroBanner")} onChange={(next) => set("heroImages", next)} />
          )}
          {keys.heroBanner && (
            <ImageUploadField label="Main header photo (shared previews and fallback)" value={value("heroBanner") || ""} onChange={(next) => set("heroBanner", next)} />
          )}
        </Paper>
      )}

      {keys.docBlocks && tab === 1 && (
        <Paper elevation={0} sx={{ ...card, display: "grid", gap: 2.5 }}>
          {keys.docTitle && (
            <TextField size="small" fullWidth label="Document title" value={value("docTitle") || ""} onChange={(e) => set("docTitle", e.target.value)}
              helperText="The H1 of the client's document; shown as the page heading where the page has no separate heading." />
          )}
          <DocBlocksEditor value={value("docBlocks") || []} onChange={(next) => set("docBlocks", next)} />
        </Paper>
      )}

      {tab === (keys.docBlocks ? 2 : 1) && (
        <Paper elevation={0} sx={card}>
          {keys.galleryImages ? (
            <GalleryListField
              title={keys.galleryTitle ? value("galleryTitle") : undefined}
              onTitleChange={keys.galleryTitle ? (next) => set("galleryTitle", next) : undefined}
              value={value("galleryImages") || []}
              onChange={(next) => set("galleryImages", next)}
            />
          ) : (
            <Typography color="text.secondary">This page has no photo gallery.</Typography>
          )}
        </Paper>
      )}

      {tab === (keys.docBlocks ? 3 : 2) && (
        <Paper elevation={0} sx={card}>
          <SeoFields data={target} keys={keys} onChange={setTarget} />
        </Paper>
      )}
    </Box>
  );
}

export default function PageDocumentsEditor() {
  const [params, setParams] = useSearchParams();
  const [zones, setZones] = useState([]);

  useEffect(() => {
    api.get("content/get").then((res) => setZones(res.data?.data?.safari?.zones || [])).catch(() => {});
  }, []);

  const pages = useMemo(() => {
    const list = [...PAGE_DOCUMENTS];
    const at = list.findIndex((page) => page.id === "zones") + 1;
    list.splice(at, 0, ...zonePages(zones));
    return list;
  }, [zones]);

  const pageId = params.get("page") || "home";
  const page = pages.find((entry) => entry.id === pageId);
  const groups = [...new Set(pages.map((entry) => entry.group))];

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header title="Page Documents" subtitle="Each page's heading, client document, photo gallery, URL and SEO settings" />
      <Box sx={{ maxWidth: "1100px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        <Paper elevation={0} sx={{ ...card, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Typography sx={{ fontWeight: 700 }}>Page</Typography>
          <Select size="small" value={page ? pageId : ""} onChange={(e) => setParams({ page: e.target.value })} sx={{ minWidth: 320 }} displayEmpty>
            {groups.flatMap((group) => [
              <ListSubheader key={`group-${group}`}>{group}</ListSubheader>,
              ...pages.filter((entry) => entry.group === group).map((entry) => (
                <MenuItem key={entry.id} value={entry.id}>{entry.label}</MenuItem>
              )),
            ])}
          </Select>
        </Paper>
        {page ? <PageEditor key={page.id} page={page} /> : <CircularProgress size={24} />}
      </Box>
    </Box>
  );
}
