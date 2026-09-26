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
import useSectionContent from "../../components/content/useSectionContent";

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
    stats: {},
  });

  const { data: fauna, setData: setFauna, loading: l3, saving: s3, save: saveFauna } = useSectionContent("fauna", {
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
      species: [...list, { name: "Species Name", scientific: "Scientific Name", status: "Protected", habitat: "Habitat type", description: "Species description..." }]
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

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header
        title="Page 6: Wildlife & Biodiversity"
        subtitle="Manage the 5 biodiversity realms: Reptiles, Birds, Mammals, Flora, and Butterflies"
      />

      <Box sx={{ maxWidth: "1100px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3, display: "flex", flexDirection: "column", gap: 3.5 }}>
        
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
                </Box>
              ))}
            </Box>
          </Paper>
        )}

        {/* Tab 1: Birds */}
        {activeTab === 1 && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Birds of Rajaji (Avian Diversity)</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Birds Overview & Habitat Description"
              value={birds.overview || ""}
              onChange={e => setBirds(prev => ({ ...prev, overview: e.target.value }))}
            />
            <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
              Total recorded bird species: 400+ across Sal forest, riverbeds, and Shivalik ravines.
            </Typography>
          </Paper>
        )}

        {/* Tab 2: Mammals / Fauna */}
        {activeTab === 2 && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Mammals & Fauna</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Fauna Overview Narrative"
              value={fauna.overview || ""}
              onChange={e => setFauna(prev => ({ ...prev, overview: e.target.value }))}
            />
          </Paper>
        )}

        {/* Tab 3: Flora */}
        {activeTab === 3 && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Flora & Sal Forest Canopies</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Flora Overview"
              value={flora.overview || ""}
              onChange={e => setFlora(prev => ({ ...prev, overview: e.target.value }))}
            />
          </Paper>
        )}

        {/* Tab 4: Butterflies */}
        {activeTab === 4 && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: "16px", border: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Butterflies & Lepidoptera</Typography>
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
