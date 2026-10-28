import { useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  TextField, 
  CircularProgress, 
  IconButton,
  Tabs,
  Tab
} from "@mui/material";
import { Save, Plus, Trash2 } from "lucide-react";
import Header from "../../components/common/Header";
import ImageUploadField from "../../components/common/ImageUploadField";
import HeroImageListField from "../../components/common/HeroImageListField";
import GalleryListField from "../../components/common/GalleryListField";
import useSectionContent from "../../components/content/useSectionContent";

function RealmHeaderControls({ label, hint, data, setData, onSave, saving }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>{label}</Typography>
          <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }}>{hint}</Typography>
        </Box>
        <Button
          size="small"
          variant="contained"
          disabled={saving}
          onClick={onSave}
          startIcon={saving ? <CircularProgress size={14} /> : <Save size={14} />}
          sx={{
            borderRadius: "8px",
            backgroundColor: "text.primary",
            color: "background.paper",
            fontWeight: 600,
            fontSize: "0.78rem",
            textTransform: "none",
            whiteSpace: "nowrap",
            "&:hover": { backgroundColor: "text.primary", opacity: 0.9 },
          }}
        >
          {saving ? "Saving..." : "Save Header & Banner"}
        </Button>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="Header Main Title"
          value={data.title || ""}
          onChange={e => setData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Page title shown in the hero"
        />
        <TextField
          fullWidth
          size="small"
          label="Header Subtitle Narrative"
          value={data.subtitle || ""}
          onChange={e => setData(prev => ({ ...prev, subtitle: e.target.value }))}
          placeholder="Short description shown under the title"
        />
      </Box>

      <ImageUploadField
        label="Header Banner Image"
        value={data.heroBanner || ""}
        onChange={val => setData(prev => ({ ...prev, heroBanner: val }))}
        placeholder="https://res.cloudinary.com/... or upload image"
        helperText="Hero photo shown behind the title on this page (auto-compressed to WebP)"
      />
      <Box sx={{ mt: 3 }}>
        <HeroImageListField value={data.heroImages} onChange={val => setData(prev => ({ ...prev, heroImages: val }))} fallbackValue={data.heroBanner} />
      </Box>
    </Box>
  );
}

export default function WildlifeEditor() {
  const { data: reptiles, setData: setReptiles, loading: l1, saving: s1, save: saveReptiles } = useSectionContent("reptiles", {
    overview: "",
    species: [],
    seoTitle: "",
    metaDescription: "",
  });

  const { data: birds, setData: setBirds, loading: l2, saving: s2, save: saveBirds } = useSectionContent("birds", {
    overview: "",
    families: [],
    restrictedRange: [],
    stats: {},
  });

  const { data: fauna, setData: setFauna, loading: l3, saving: s3, save: saveFauna } = useSectionContent("fauna", {
    title: "Wildlife & Biodiversity of Rajaji Tiger Reserve",
    subtitle: "Extending across 820 sq km of the Shivalik hills, alluvial floodplains, and Ganges riverbeds in Uttarakhand, Rajaji represents one of Northern India's most biodiverse wildlife landscapes.",
    heroBanner: "",
    overview: "",
    primeAttractions: [],
    herbivores: [],
    carnivores: [],
  });

  const { data: flora, setData: setFlora, loading: l4, saving: s4, save: saveFlora } = useSectionContent("flora", {
    overview: "",
    altitudinalBands: [],
    dominantTrees: [],
  });

  const { data: butterflies, setData: setButterflies, loading: l5, saving: s5, save: saveButterflies } = useSectionContent("butterflies", {
    overview: "",
    mudPuddling: "",
    species: [],
  });

  const [activeTab, setActiveTab] = useState(0);

  if (l1 || l2 || l3 || l4 || l5) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const isSaving = s1 || s2 || s3 || s4 || s5;

  const handleSaveAll = async () => {
    await Promise.all([
      saveReptiles(),
      saveBirds(),
      saveFauna(),
      saveFlora(),
      saveButterflies(),
    ]);
  };

  // Reptiles helpers
  const addReptile = () => {
    const list = reptiles.species || [];
    setReptiles(prev => ({
      ...prev,
      species: [...list, { name: "Species Name", scientific: "Scientific Name", status: "Protected", habitat: "Habitat type", description: "Species description...", image: "" }]
    }));
  };

  const updateReptile = (idx, field, val) => {
    const list = [...(reptiles.species || [])];
    list[idx] = { ...list[idx], [field]: val };
    setReptiles(prev => ({ ...prev, species: list }));
  };

  const removeReptile = (idx) => {
    setReptiles(prev => ({
      ...prev,
      species: (prev.species || []).filter((_, i) => i !== idx)
    }));
  };

  // Generic list helpers keyed by section setter
  const listHelpers = (setter) => ({
    add: (key, empty) => setter(prev => ({ ...prev, [key]: [...(prev[key] || []), empty] })),
    remove: (key, idx) => setter(prev => ({ ...prev, [key]: (prev[key] || []).filter((_, i) => i !== idx) })),
    update: (key, idx, field, val) => setter(prev => {
      const list = [...(prev[key] || [])];
      list[idx] = { ...list[idx], [field]: val };
      return { ...prev, [key]: list };
    }),
  });

  const birdsL = listHelpers(setBirds);
  const faunaL = listHelpers(setFauna);
  const floraL = listHelpers(setFlora);
  const butterfliesL = listHelpers(setButterflies);

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header
        title="7. Wildlife & Biodiversity"
        subtitle="Manage the 5 biodiversity realms: Reptiles, Birds, Mammals, Flora, and Butterflies"
      />

      <Box sx={{ maxWidth: "1100px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3, display: "flex", flexDirection: "column", gap: 3.5 }}>
        
        {/* Wildlife Main Overview Header & Banner Image */}
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Wildlife Hub &amp; Mammals Page Header</Typography>
            <Button
              variant="contained"
              size="small"
              disabled={s3 || isSaving}
              onClick={saveFauna}
              startIcon={s3 ? <CircularProgress size={14} /> : <Save size={14} />}
              sx={{
                borderRadius: "8px",
                backgroundColor: "text.primary",
                color: "background.paper",
                fontWeight: 600,
                fontSize: "0.8rem",
                textTransform: "none",
                "&:hover": { backgroundColor: "text.primary", opacity: 0.9 },
              }}
            >
              {s3 ? "Saving..." : "Save Header & Banner"}
            </Button>
          </Box>
          <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mb: 2.5 }}>
            Header title, subtitle description, and hero banner photo displayed at the top of the /wildlife hub and the Mammals of Rajaji page.
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5, mb: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              label="Header Main Title"
              value={fauna.title || ""}
              onChange={e => setFauna(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Wildlife & Biodiversity of Rajaji Tiger Reserve"
            />
            <TextField
              fullWidth
              size="small"
              label="Header Subtitle Narrative"
              value={fauna.subtitle || ""}
              onChange={e => setFauna(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Extending across 820 sq km of the Shivalik hills, alluvial floodplains..."
            />
          </Box>

          <ImageUploadField
            label="Wildlife & Biodiversity Main Page Header Image"
            value={fauna.hubHeroBanner || ""}
            onChange={val => setFauna(prev => ({ ...prev, hubHeroBanner: val }))}
            placeholder="https://res.cloudinary.com/... or upload image"
            helperText="Header for the /wildlife main page. Leave empty to reuse the Mammals header below."
          />
          <Box sx={{ mt: 3 }} />
          <ImageUploadField
            label="Mammals Page Header Banner Image"
            value={fauna.heroBanner || ""}
            onChange={val => setFauna(prev => ({ ...prev, heroBanner: val }))}
            placeholder="https://res.cloudinary.com/... or upload image"
            helperText="Upload local photo (auto-compressed to WebP) or paste image URL for the Mammals page hero banner"
          />
          <Box sx={{ mt: 3 }}>
            <HeroImageListField value={fauna.heroImages} onChange={val => setFauna(prev => ({ ...prev, heroImages: val }))} fallbackValue={fauna.heroBanner} />
          </Box>
        </Paper>

        {/* Realm Navigation Tabs */}
        <Paper elevation={0} sx={{ p: 1, borderRadius: "14px", border: "1px solid", borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.85rem", minHeight: 42 }
            }}
          >
            <Tab label="1. Reptiles of Rajaji (8 Species)" />
            <Tab label="2. Birds of Rajaji (400+ Species)" />
            <Tab label="3. Mammals & Fauna" />
            <Tab label="4. Flora & Sal Forests" />
            <Tab label="5. Butterflies & Insects" />
          </Tabs>
        </Paper>

        {/* Tab 0: Reptiles */}
        {activeTab === 0 && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Reptiles of Rajaji Tiger Reserve</Typography>
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
                  King Cobras, Indian Rock Pythons, Monitor Lizards, and Chelonians.
                </Typography>
              </Box>
              <Button size="small" variant="outlined" onClick={addReptile} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
                Add Reptile
              </Button>
            </Box>

            <RealmHeaderControls
              label="Reptiles Page Header"
              hint="Title, subtitle, and banner photo shown at the top of the Reptiles page"
              data={reptiles}
              setData={setReptiles}
              onSave={saveReptiles}
              saving={s1}
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              label="Reptiles Realm Overview"
              value={reptiles.overview || ""}
              onChange={e => setReptiles(prev => ({ ...prev, overview: e.target.value }))}
            />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(reptiles.species || []).map((rep, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>#{idx + 1} {rep.name}</Typography>
                    <IconButton size="small" color="error" onClick={() => removeReptile(idx)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.5fr 1.5fr 1fr 1.5fr" }, gap: 1.5 }}>
                    <TextField
                      size="small"
                      label="Common Name"
                      value={rep.name || ""}
                      onChange={e => updateReptile(idx, "name", e.target.value)}
                    />
                    <TextField
                      size="small"
                      label="Scientific Name"
                      value={rep.scientific || ""}
                      onChange={e => updateReptile(idx, "scientific", e.target.value)}
                    />
                    <TextField
                      size="small"
                      label="Status"
                      value={rep.status || ""}
                      onChange={e => updateReptile(idx, "status", e.target.value)}
                    />
                    <TextField
                      size="small"
                      label="Habitat"
                      value={rep.habitat || ""}
                      onChange={e => updateReptile(idx, "habitat", e.target.value)}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    label="Description"
                    value={rep.description || ""}
                    onChange={e => updateReptile(idx, "description", e.target.value)}
                  />

                  <ImageUploadField
                    label="Species Photo"
                    value={rep.image || ""}
                    onChange={val => updateReptile(idx, "image", val)}
                    placeholder="https://res.cloudinary.com/... or paste URL"
                    helperText="Upload a photo of this reptile species, or paste a direct image URL"
                  />
                </Box>
              ))}
            </Box>

            <GalleryListField
              title={reptiles.galleryTitle}
              onTitleChange={(val) => setReptiles(prev => ({ ...prev, galleryTitle: val }))}
              titlePlaceholder="Reptiles of Rajaji – Photo Gallery"
              value={reptiles.galleryImages}
              alts={reptiles.galleryAlts || []}
              onChange={(images, alts) => setReptiles(prev => ({ ...prev, galleryImages: images, galleryAlts: alts }))}
            />
          </Paper>
        )}

        {/* Tab 1: Birds */}
        {activeTab === 1 && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Birds of Rajaji (Avian Diversity)</Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button size="small" variant="outlined" onClick={() => birdsL.add("families", { group: "", desc: "", species: [], image: "" })} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
                  Add Family
                </Button>
                <Button size="small" variant="outlined" onClick={() => birdsL.add("restrictedRange", { name: "", status: "", image: "" })} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
                  Add Restricted Bird
                </Button>
              </Box>
            </Box>

            <RealmHeaderControls
              label="Birds Page Header"
              hint="Title, subtitle, and banner photo shown at the top of the Birds page"
              data={birds}
              setData={setBirds}
              onSave={saveBirds}
              saving={s2}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Birds Overview & Habitat Description"
              value={birds.overview || ""}
              onChange={e => setBirds(prev => ({ ...prev, overview: e.target.value }))}
            />

            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "text.secondary", pt: 1 }}>Bird Family Cards</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(birds.families || []).map((fam, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>#{idx + 1} {fam.group || "Family"}</Typography>
                    <IconButton size="small" color="error" onClick={() => birdsL.remove("families", idx)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 2fr" }, gap: 1.5 }}>
                    <TextField size="small" label="Family Group" value={fam.group || ""} onChange={e => birdsL.update("families", idx, "group", e.target.value)} />
                    <TextField size="small" label="Description" value={fam.desc || ""} onChange={e => birdsL.update("families", idx, "desc", e.target.value)} />
                  </Box>
                  <TextField
                    fullWidth size="small" label="Species (comma-separated)"
                    value={(fam.species || []).join(", ")}
                    onChange={e => birdsL.update("families", idx, "species", e.target.value.split(",").map(s => s.trim()))}
                  />
                  <ImageUploadField
                    label="Family Card Photo"
                    value={fam.image || ""}
                    onChange={val => birdsL.update("families", idx, "image", val)}
                    helperText="Representative photo for this bird family card"
                  />
                </Box>
              ))}
            </Box>

            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "text.secondary", pt: 1 }}>Restricted Range Birds</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(birds.restrictedRange || []).map((bird, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>#{idx + 1} {bird.name || "Bird"}</Typography>
                    <IconButton size="small" color="error" onClick={() => birdsL.remove("restrictedRange", idx)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.5fr 1.5fr" }, gap: 1.5 }}>
                    <TextField size="small" label="Bird Name" value={bird.name || ""} onChange={e => birdsL.update("restrictedRange", idx, "name", e.target.value)} />
                    <TextField size="small" label="Status" value={bird.status || ""} onChange={e => birdsL.update("restrictedRange", idx, "status", e.target.value)} />
                  </Box>
                  <ImageUploadField
                    label="Bird Photo"
                    value={bird.image || ""}
                    onChange={val => birdsL.update("restrictedRange", idx, "image", val)}
                    helperText="Optional photo for this restricted-range bird"
                  />
                </Box>
              ))}
            </Box>

            <GalleryListField
              value={birds.galleryImages}
              alts={birds.galleryAlts || []}
              onChange={(images, alts) => setBirds(prev => ({ ...prev, galleryImages: images, galleryAlts: alts }))}
            />
          </Paper>
        )}

        {/* Tab 2: Mammals / Fauna */}
        {activeTab === 2 && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Mammals & Fauna</Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button size="small" variant="outlined" onClick={() => faunaL.add("primeAttractions", { name: "", count: "", details: "", image: "" })} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
                  Add Attraction
                </Button>
                <Button size="small" variant="outlined" onClick={() => faunaL.add("herbivores", { name: "", info: "", image: "" })} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
                  Add Herbivore
                </Button>
                <Button size="small" variant="outlined" onClick={() => faunaL.add("carnivores", { name: "", info: "", image: "" })} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
                  Add Carnivore
                </Button>
              </Box>
            </Box>

            <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
              The header title, subtitle, and banner image for this page are edited in the “Wildlife Hub &amp; Mammals Page Header” card at the top of this screen.
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Fauna Overview Narrative"
              value={fauna.overview || ""}
              onChange={e => setFauna(prev => ({ ...prev, overview: e.target.value }))}
            />

            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "text.secondary", pt: 1 }}>Prime Attractions</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(fauna.primeAttractions || []).map((item, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>#{idx + 1} {item.name || "Attraction"}</Typography>
                    <IconButton size="small" color="error" onClick={() => faunaL.remove("primeAttractions", idx)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.5fr 0.8fr 2fr" }, gap: 1.5 }}>
                    <TextField size="small" label="Animal Name" value={item.name || ""} onChange={e => faunaL.update("primeAttractions", idx, "name", e.target.value)} />
                    <TextField size="small" label="Count" value={item.count || ""} onChange={e => faunaL.update("primeAttractions", idx, "count", e.target.value)} />
                    <TextField size="small" label="Details" value={item.details || ""} onChange={e => faunaL.update("primeAttractions", idx, "details", e.target.value)} />
                  </Box>
                  <ImageUploadField
                    label="Animal Photo"
                    value={item.image || ""}
                    onChange={val => faunaL.update("primeAttractions", idx, "image", val)}
                    helperText="Photo of this prime attraction animal"
                  />
                </Box>
              ))}
            </Box>

            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "text.secondary", pt: 1 }}>Herbivores</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(fauna.herbivores || []).map((item, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>#{idx + 1} {item.name || "Herbivore"}</Typography>
                    <IconButton size="small" color="error" onClick={() => faunaL.remove("herbivores", idx)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.5fr 2fr" }, gap: 1.5 }}>
                    <TextField size="small" label="Name" value={item.name || ""} onChange={e => faunaL.update("herbivores", idx, "name", e.target.value)} />
                    <TextField size="small" label="Info" value={item.info || ""} onChange={e => faunaL.update("herbivores", idx, "info", e.target.value)} />
                  </Box>
                  <ImageUploadField
                    label="Animal Photo"
                    value={item.image || ""}
                    onChange={val => faunaL.update("herbivores", idx, "image", val)}
                    helperText="Optional photo for this herbivore"
                  />
                </Box>
              ))}
            </Box>

            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "text.secondary", pt: 1 }}>Carnivores</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(fauna.carnivores || []).map((item, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>#{idx + 1} {item.name || "Carnivore"}</Typography>
                    <IconButton size="small" color="error" onClick={() => faunaL.remove("carnivores", idx)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.5fr 2fr" }, gap: 1.5 }}>
                    <TextField size="small" label="Name" value={item.name || ""} onChange={e => faunaL.update("carnivores", idx, "name", e.target.value)} />
                    <TextField size="small" label="Info" value={item.info || ""} onChange={e => faunaL.update("carnivores", idx, "info", e.target.value)} />
                  </Box>
                  <ImageUploadField
                    label="Animal Photo"
                    value={item.image || ""}
                    onChange={val => faunaL.update("carnivores", idx, "image", val)}
                    helperText="Optional photo for this carnivore"
                  />
                </Box>
              ))}
            </Box>

            <GalleryListField
              title={fauna.galleryTitle}
              onTitleChange={(val) => setFauna(prev => ({ ...prev, galleryTitle: val }))}
              titlePlaceholder="Mammals of Rajaji – Photo Gallery"
              value={fauna.galleryImages}
              alts={fauna.galleryAlts || []}
              onChange={(images, alts) => setFauna(prev => ({ ...prev, galleryImages: images, galleryAlts: alts }))}
            />
          </Paper>
        )}

        {/* Tab 3: Flora */}
        {activeTab === 3 && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Flora & Sal Forest Canopies</Typography>
              <Button size="small" variant="outlined" onClick={() => floraL.add("dominantTrees", { common: "", scientific: "", family: "", desc: "", image: "" })} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
                Add Tree
              </Button>
            </Box>

            <RealmHeaderControls
              label="Flora Page Header"
              hint="Title, subtitle, and banner photo shown at the top of the Flora page"
              data={flora}
              setData={setFlora}
              onSave={saveFlora}
              saving={s4}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Flora Overview"
              value={flora.overview || ""}
              onChange={e => setFlora(prev => ({ ...prev, overview: e.target.value }))}
            />

            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "text.secondary", pt: 1 }}>Dominant Tree Species</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(flora.dominantTrees || []).map((tree, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>#{idx + 1} {tree.common || "Tree"}</Typography>
                    <IconButton size="small" color="error" onClick={() => floraL.remove("dominantTrees", idx)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1.5fr 1fr" }, gap: 1.5 }}>
                    <TextField size="small" label="Common Name" value={tree.common || ""} onChange={e => floraL.update("dominantTrees", idx, "common", e.target.value)} />
                    <TextField size="small" label="Scientific Name" value={tree.scientific || ""} onChange={e => floraL.update("dominantTrees", idx, "scientific", e.target.value)} />
                    <TextField size="small" label="Family" value={tree.family || ""} onChange={e => floraL.update("dominantTrees", idx, "family", e.target.value)} />
                  </Box>
                  <TextField fullWidth multiline rows={2} size="small" label="Ecological Significance" value={tree.desc || ""} onChange={e => floraL.update("dominantTrees", idx, "desc", e.target.value)} />
                  <ImageUploadField
                    label="Tree Photo"
                    value={tree.image || ""}
                    onChange={val => floraL.update("dominantTrees", idx, "image", val)}
                    helperText="Photo of this tree species"
                  />
                </Box>
              ))}
            </Box>

            <GalleryListField
              title={flora.galleryTitle}
              onTitleChange={(val) => setFlora(prev => ({ ...prev, galleryTitle: val }))}
              titlePlaceholder="Flora of Rajaji – Photo Gallery"
              value={flora.galleryImages}
              alts={flora.galleryAlts || []}
              onChange={(images, alts) => setFlora(prev => ({ ...prev, galleryImages: images, galleryAlts: alts }))}
            />
          </Paper>
        )}

        {/* Tab 4: Butterflies */}
        {activeTab === 4 && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Butterflies & Lepidoptera</Typography>
              <Button size="small" variant="outlined" onClick={() => butterfliesL.add("species", { name: "", family: "", habitat: "", image: "" })} startIcon={<Plus size={14} />} sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
                Add Species
              </Button>
            </Box>

            <RealmHeaderControls
              label="Butterflies Page Header"
              hint="Title, subtitle, and banner photo shown at the top of the Butterflies page"
              data={butterflies}
              setData={setButterflies}
              onSave={saveButterflies}
              saving={s5}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Butterflies Overview"
              value={butterflies.overview || ""}
              onChange={e => setButterflies(prev => ({ ...prev, overview: e.target.value }))}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              label="Mud-Puddling Phenomenon"
              value={butterflies.mudPuddling || ""}
              onChange={e => setButterflies(prev => ({ ...prev, mudPuddling: e.target.value }))}
            />

            <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "text.secondary", pt: 1 }}>Butterfly Species Cards</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(butterflies.species || []).map((item, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: "12px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>#{idx + 1} {item.name || "Species"}</Typography>
                    <IconButton size="small" color="error" onClick={() => butterfliesL.remove("species", idx)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.5fr 1fr 1.5fr" }, gap: 1.5 }}>
                    <TextField size="small" label="Species Name" value={item.name || ""} onChange={e => butterfliesL.update("species", idx, "name", e.target.value)} />
                    <TextField size="small" label="Family" value={item.family || ""} onChange={e => butterfliesL.update("species", idx, "family", e.target.value)} />
                    <TextField size="small" label="Habitat" value={item.habitat || ""} onChange={e => butterfliesL.update("species", idx, "habitat", e.target.value)} />
                  </Box>
                  <ImageUploadField
                    label="Species Photo"
                    value={item.image || ""}
                    onChange={val => butterfliesL.update("species", idx, "image", val)}
                    helperText="Photo of this butterfly species"
                  />
                </Box>
              ))}
            </Box>

            <GalleryListField
              title={butterflies.galleryTitle}
              onTitleChange={(val) => setButterflies(prev => ({ ...prev, galleryTitle: val }))}
              titlePlaceholder="Butterflies of Rajaji – Photo Gallery"
              value={butterflies.galleryImages}
              alts={butterflies.galleryAlts || []}
              onChange={(images, alts) => setButterflies(prev => ({ ...prev, galleryImages: images, galleryAlts: alts }))}
            />
          </Paper>
        )}

        {/* Sticky Action Footer */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2, pb: 4 }}>
          <Button
            variant="contained"
            disabled={isSaving}
            onClick={handleSaveAll}
            startIcon={isSaving ? <CircularProgress size={16} /> : <Save size={16} />}
            sx={{
              borderRadius: "12px",
              backgroundColor: "text.primary",
              color: "background.paper",
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              py: 1.2,
              px: 3.5,
              "&:hover": { backgroundColor: "text.primary", opacity: 0.9 },
            }}
          >
            {isSaving ? "Saving Changes..." : "Save Wildlife & Biodiversity"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
