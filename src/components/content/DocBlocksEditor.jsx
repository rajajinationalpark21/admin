import { useState } from "react";
import {
  Box, Typography, Paper, TextField, IconButton, Button, MenuItem, Select, Tooltip, Chip,
} from "@mui/material";
import { ArrowUp, ArrowDown, Copy, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { updateAt, removeAt, insertAt, moveItem, linesToText, textToLines } from "./listHelpers";

/**
 * Editor for a page document: the ordered blocks the website renders with
 * DocContent. Each block can be edited, moved, duplicated or deleted, and new
 * blocks can be added anywhere.
 */
const BLOCK_TYPES = [
  { t: "h2", label: "Section heading (starts a new card)" },
  { t: "h3", label: "Sub-heading" },
  { t: "p", label: "Paragraph" },
  { t: "ul", label: "Bullet list" },
  { t: "ol", label: "Numbered list" },
  { t: "table", label: "Table" },
  { t: "note", label: "Highlighted note" },
  { t: "fact", label: "Label + fact" },
  { t: "chips", label: "Tags" },
  { t: "links", label: "Page links" },
  { t: "cta", label: "Buttons (book / call / WhatsApp)" },
  { t: "contact", label: "Phone numbers / email" },
  { t: "gallery", label: "Photo gallery position" },
];
const TYPE_LABEL = Object.fromEntries(BLOCK_TYPES.map(({ t, label }) => [t, label]));

function emptyBlock(t) {
  switch (t) {
    case "ul": case "ol": case "chips": return { t, items: [] };
    case "table": return { t, rows: [["", ""], ["", ""]] };
    case "note": case "fact": return { t, label: "", text: "" };
    case "links": return { t, items: [{ label: "", to: "/", desc: "" }] };
    case "cta": return { t, items: [{ kind: "booking", label: "Check Safari Availability" }] };
    case "contact": return { t, phones: [], email: "" };
    case "gallery": return { t };
    default: return { t, text: "" };
  }
}

/** One-line summary shown while a block is collapsed. */
function summary(block) {
  const clip = (text) => (text.length > 110 ? `${text.slice(0, 107)}…` : text);
  switch (block.t) {
    case "ul": case "ol": case "chips": return clip(`${(block.items || []).length} items: ${(block.items || []).join(" · ")}`);
    case "table": return `${(block.rows || []).length} rows × ${(block.rows?.[0] || []).length} columns`;
    case "links": case "cta": return clip((block.items || []).map((item) => item.label).join(" · "));
    case "contact": return clip([...(block.phones || []), block.email].filter(Boolean).join(" · "));
    case "gallery": return block.title || "Photos of this page appear here";
    case "note": case "fact": return clip(`${block.label}: ${block.text}`);
    default: return clip(block.text || "");
  }
}

const small = { size: "small", fullWidth: true };

function ItemRows({ items, columns, onChange, addLabel, empty }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {items.map((item, index) => (
        <Box key={index} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: `${columns.map((c) => c.width || "1fr").join(" ")} auto` }, gap: 1 }}>
          {columns.map((column) =>
            column.options ? (
              <Select key={column.key} size="small" value={item[column.key] || column.options[0]} onChange={(e) => onChange(updateAt(items, index, { ...item, [column.key]: e.target.value }))}>
                {column.options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
              </Select>
            ) : (
              <TextField key={column.key} {...small} label={column.label} value={item[column.key] || ""} onChange={(e) => onChange(updateAt(items, index, { ...item, [column.key]: e.target.value }))} />
            )
          )}
          <IconButton size="small" onClick={() => onChange(removeAt(items, index))} aria-label="Remove row"><Trash2 size={15} /></IconButton>
        </Box>
      ))}
      <Button size="small" startIcon={<Plus size={14} />} onClick={() => onChange([...items, empty])} sx={{ alignSelf: "flex-start", textTransform: "none" }}>
        {addLabel}
      </Button>
    </Box>
  );
}

function TableEditor({ rows, onChange }) {
  const width = Math.max(1, ...rows.map((row) => row.length));
  const grid = rows.map((row) => [...row, ...Array(width - row.length).fill("")]);
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">The first row is the table header.</Typography>
      <Box sx={{ overflowX: "auto", mt: 1 }}>
        {grid.map((row, r) => (
          <Box key={r} sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
            {row.map((cell, c) => (
              <TextField key={c} size="small" multiline value={cell} sx={{ minWidth: 160, flex: 1, "& input, & textarea": { fontWeight: r === 0 ? 700 : 400 } }}
                onChange={(e) => onChange(updateAt(grid, r, updateAt(row, c, e.target.value)))} />
            ))}
            <IconButton size="small" onClick={() => onChange(removeAt(grid, r))} aria-label="Remove row"><Trash2 size={15} /></IconButton>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button size="small" startIcon={<Plus size={14} />} sx={{ textTransform: "none" }} onClick={() => onChange([...grid, Array(width).fill("")])}>Add row</Button>
        <Button size="small" startIcon={<Plus size={14} />} sx={{ textTransform: "none" }} onClick={() => onChange(grid.map((row) => [...row, ""]))}>Add column</Button>
        {width > 1 && (
          <Button size="small" color="inherit" sx={{ textTransform: "none" }} onClick={() => onChange(grid.map((row) => row.slice(0, -1)))}>Remove last column</Button>
        )}
      </Box>
    </Box>
  );
}

function BlockFields({ block, onChange }) {
  const set = (key, value) => onChange({ ...block, [key]: value });
  switch (block.t) {
    case "h2": case "h3":
      return <TextField {...small} label="Heading" value={block.text || ""} onChange={(e) => set("text", e.target.value)} />;
    case "p":
      return <TextField {...small} multiline minRows={3} label="Text" value={block.text || ""} onChange={(e) => set("text", e.target.value)}
        helperText="**bold**, [link text](/page-url), new line = line break" />;
    case "note": case "fact":
      return (
        <Box sx={{ display: "grid", gap: 1 }}>
          <TextField {...small} label="Label" value={block.label || ""} onChange={(e) => set("label", e.target.value)} />
          <TextField {...small} multiline minRows={2} label="Text" value={block.text || ""} onChange={(e) => set("text", e.target.value)} />
        </Box>
      );
    case "ul": case "ol": case "chips":
      return <TextField {...small} multiline minRows={3} label="One item per line" value={linesToText(block.items)}
        onChange={(e) => set("items", e.target.value.split("\n"))} onBlur={(e) => set("items", textToLines(e.target.value))}
        helperText="**bold** and [link text](/page-url) work inside items" />;
    case "table":
      return <TableEditor rows={block.rows || [[""]]} onChange={(rows) => set("rows", rows)} />;
    case "links":
      return <ItemRows items={block.items || []} onChange={(items) => set("items", items)} addLabel="Add link"
        empty={{ label: "", to: "/", desc: "" }}
        columns={[{ key: "label", label: "Link text" }, { key: "to", label: "Page URL (e.g. /birds-of-rajaji-national-park)" }, { key: "desc", label: "Short description (optional)" }]} />;
    case "cta":
      return <ItemRows items={block.items || []} onChange={(items) => set("items", items)} addLabel="Add button"
        empty={{ kind: "booking", label: "" }}
        columns={[{ key: "kind", options: ["booking", "call", "whatsapp"], width: "150px" }, { key: "label", label: "Button text" }]} />;
    case "contact":
      return (
        <Box sx={{ display: "grid", gap: 1 }}>
          <TextField {...small} multiline minRows={2} label="Phone numbers, one per line" value={linesToText(block.phones)}
            onChange={(e) => set("phones", e.target.value.split("\n"))} onBlur={(e) => set("phones", textToLines(e.target.value))} />
          <TextField {...small} label="Email (optional)" value={block.email || ""} onChange={(e) => set("email", e.target.value)} />
        </Box>
      );
    case "gallery":
      return <TextField {...small} label="Gallery title (optional)" value={block.title || ""} onChange={(e) => set("title", e.target.value)}
        helperText="Marks where the page's photo gallery sits in the document." />;
    default:
      return null;
  }
}

function AddBlock({ onAdd, label = "Add block" }) {
  const [type, setType] = useState("p");
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Select size="small" value={type} onChange={(e) => setType(e.target.value)} sx={{ minWidth: 220 }}>
        {BLOCK_TYPES.map(({ t, label: typeLabel }) => <MenuItem key={t} value={t}>{typeLabel}</MenuItem>)}
      </Select>
      <Button size="small" variant="outlined" startIcon={<Plus size={14} />} onClick={() => onAdd(emptyBlock(type))} sx={{ textTransform: "none", borderRadius: "8px" }}>
        {label}
      </Button>
    </Box>
  );
}

export default function DocBlocksEditor({ value, onChange }) {
  const blocks = value || [];
  const [open, setOpen] = useState(() => new Set());
  const toggle = (index) => setOpen((prev) => {
    const next = new Set(prev);
    if (next.has(index)) next.delete(index); else next.add(index);
    return next;
  });
  const expandAll = () => setOpen(new Set(blocks.map((_, index) => index)));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {blocks.length} blocks, shown on the page in this order. Click a block to edit it.
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small" sx={{ textTransform: "none" }} onClick={expandAll}>Expand all</Button>
          <Button size="small" sx={{ textTransform: "none" }} onClick={() => setOpen(new Set())}>Collapse all</Button>
        </Box>
      </Box>

      {blocks.map((block, index) => {
        const isOpen = open.has(index);
        const isHeading = block.t === "h2";
        return (
          <Paper key={index} elevation={0} sx={{ border: "1px solid", borderColor: isHeading ? "primary.main" : "divider", borderRadius: "12px", overflow: "hidden", ml: block.t === "h2" ? 0 : { xs: 0, sm: 2 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 1, cursor: "pointer", bgcolor: isHeading ? "action.hover" : "transparent" }} onClick={() => toggle(index)}>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Chip size="small" label={TYPE_LABEL[block.t] || block.t} sx={{ fontSize: "0.7rem", height: 22 }} />
              <Typography sx={{ fontSize: "0.82rem", fontWeight: isHeading ? 700 : 400, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {summary(block)}
              </Typography>
              <Box onClick={(e) => e.stopPropagation()} sx={{ display: "flex" }}>
                <Tooltip title="Move up"><span><IconButton size="small" disabled={index === 0} onClick={() => onChange(moveItem(blocks, index, -1))}><ArrowUp size={15} /></IconButton></span></Tooltip>
                <Tooltip title="Move down"><span><IconButton size="small" disabled={index === blocks.length - 1} onClick={() => onChange(moveItem(blocks, index, 1))}><ArrowDown size={15} /></IconButton></span></Tooltip>
                <Tooltip title="Duplicate"><IconButton size="small" onClick={() => onChange(insertAt(blocks, index + 1, structuredClone(block)))}><Copy size={15} /></IconButton></Tooltip>
                <Tooltip title="Delete block"><IconButton size="small" onClick={() => window.confirm("Delete this block?") && onChange(removeAt(blocks, index))}><Trash2 size={15} /></IconButton></Tooltip>
              </Box>
            </Box>
            {isOpen && (
              <Box sx={{ p: 1.5, pt: 0.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Select size="small" value={block.t} sx={{ maxWidth: 280 }}
                  onChange={(e) => onChange(updateAt(blocks, index, { ...emptyBlock(e.target.value), ...(["text", "label"].reduce((kept, key) => (block[key] ? { ...kept, [key]: block[key] } : kept), {})) }))}>
                  {BLOCK_TYPES.map(({ t, label }) => <MenuItem key={t} value={t}>{label}</MenuItem>)}
                </Select>
                <BlockFields block={block} onChange={(next) => onChange(updateAt(blocks, index, next))} />
                <AddBlock label="Add block below" onAdd={(newBlock) => {
                  onChange(insertAt(blocks, index + 1, newBlock));
                  setOpen((prev) => new Set([...prev, index + 1]));
                }} />
              </Box>
            )}
          </Paper>
        );
      })}

      <Box sx={{ pt: 1 }}>
        <AddBlock onAdd={(newBlock) => {
          onChange([...blocks, newBlock]);
          setOpen((prev) => new Set([...prev, blocks.length]));
        }} />
      </Box>
    </Box>
  );
}
