import { Box, Paper, TextField, IconButton, Button, Typography, Tooltip } from "@mui/material";
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import { updateAt, removeAt, moveItem } from "./listHelpers";

/**
 * The website menu: top-level entries and their drop-down sub-pages,
 * in the order of the client's "Website structure" document.
 */
function Row({ item, onChange, onMoveUp, onMoveDown, onRemove, withDesc }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: withDesc ? "1fr 1.2fr 1.2fr auto" : "1fr 1.4fr auto" }, gap: 1, alignItems: "center" }}>
      <TextField size="small" label="Label" value={item.label || ""} onChange={(e) => onChange({ ...item, label: e.target.value })} />
      <TextField size="small" label="Page URL" value={item.path || ""} onChange={(e) => onChange({ ...item, path: e.target.value })} />
      {withDesc && <TextField size="small" label="Short description" value={item.desc || ""} onChange={(e) => onChange({ ...item, desc: e.target.value })} />}
      <Box sx={{ display: "flex" }}>
        <Tooltip title="Move up"><IconButton size="small" onClick={onMoveUp}><ArrowUp size={15} /></IconButton></Tooltip>
        <Tooltip title="Move down"><IconButton size="small" onClick={onMoveDown}><ArrowDown size={15} /></IconButton></Tooltip>
        <Tooltip title="Remove"><IconButton size="small" onClick={onRemove}><Trash2 size={15} /></IconButton></Tooltip>
      </Box>
    </Box>
  );
}

export default function NavigationEditor({ value, onChange }) {
  const menu = value || [];
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {menu.map((entry, index) => {
        const children = entry.children || [];
        const setEntry = (next) => onChange(updateAt(menu, index, next));
        return (
          <Paper key={index} elevation={0} sx={{ p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: "12px", display: "grid", gap: 1 }}>
            <Row item={entry} onChange={setEntry}
              onMoveUp={() => onChange(moveItem(menu, index, -1))} onMoveDown={() => onChange(moveItem(menu, index, 1))}
              onRemove={() => window.confirm(`Remove "${entry.label}" from the menu?`) && onChange(removeAt(menu, index))} />
            {children.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: { md: 3 } }}>Drop-down pages</Typography>
            )}
            {children.map((child, childIndex) => (
              <Box key={childIndex} sx={{ ml: { md: 3 } }}>
                <Row item={child} withDesc
                  onChange={(next) => setEntry({ ...entry, children: updateAt(children, childIndex, next) })}
                  onMoveUp={() => setEntry({ ...entry, children: moveItem(children, childIndex, -1) })}
                  onMoveDown={() => setEntry({ ...entry, children: moveItem(children, childIndex, 1) })}
                  onRemove={() => setEntry({ ...entry, children: removeAt(children, childIndex) })} />
              </Box>
            ))}
            <Button size="small" startIcon={<Plus size={14} />} sx={{ justifySelf: "start", textTransform: "none", ml: { md: 3 } }}
              onClick={() => setEntry({ ...entry, children: [...children, { label: "", path: "/", desc: "" }] })}>
              Add drop-down page
            </Button>
          </Paper>
        );
      })}
      <Button size="small" variant="outlined" startIcon={<Plus size={14} />} sx={{ alignSelf: "flex-start", textTransform: "none", borderRadius: "8px" }}
        onClick={() => onChange([...menu, { label: "", path: "/", children: [] }])}>
        Add menu entry
      </Button>
    </Box>
  );
}
