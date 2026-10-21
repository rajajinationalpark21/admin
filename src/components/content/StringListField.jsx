import { Box, Typography, TextField, IconButton, Button } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { updateAt, removeAt } from "./listHelpers";

/** An editable list of single lines (features, rules, ...), shown on the site in this order. */
export default function StringListField({ label, value, onChange, itemLabel = "Line", addLabel = "Add line", multiline = false }) {
  const items = Array.isArray(value) ? value : [];

  return (
    <Box sx={{ display: "grid", gap: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>{label}</Typography>
        <Button size="small" variant="outlined" startIcon={<Plus size={14} />} onClick={() => onChange([...items, ""])}
          sx={{ borderRadius: "8px", textTransform: "none", fontSize: "0.75rem" }}>
          {addLabel}
        </Button>
      </Box>
      {items.length === 0 && (
        <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>Nothing yet. This part is hidden on the site while the list is empty.</Typography>
      )}
      {items.map((item, index) => (
        <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
          <TextField size="small" fullWidth multiline={multiline} label={`${itemLabel} ${index + 1}`} value={item}
            onChange={(e) => onChange(updateAt(items, index, e.target.value))} />
          <IconButton size="small" color="error" aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`} onClick={() => onChange(removeAt(items, index))} sx={{ mt: 0.5 }}>
            <Trash2 size={16} />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}
