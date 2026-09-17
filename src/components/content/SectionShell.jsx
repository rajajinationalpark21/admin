import React from "react";
import { Box, Typography, Button, CircularProgress, TextField } from "@mui/material";
import { Save } from "lucide-react";

export function SectionShell({ title, subtitle, saving, onSave, children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography sx={{ fontSize: "1.125rem", fontWeight: 700, color: "text.primary" }}>{title}</Typography>
        <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5 }}>{subtitle}</Typography>
      </Box>
      {children}
      <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
        <Button
          variant="contained"
          disabled={saving}
          onClick={onSave}
          startIcon={saving ? <CircularProgress size={16} /> : <Save size={16} />}
          sx={{
            borderRadius: "12px", backgroundColor: "text.primary", color: "background.paper",
            fontWeight: 600, fontSize: "0.8125rem", textTransform: "none", py: 1, px: 2.5,
            "&:hover": { backgroundColor: "text.primary", opacity: 0.9 },
          }}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
}

export function Field({ label, value, onChange, multiline, rows = 2, size = "small", sx }) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value ?? ""}
      onChange={onChange}
      multiline={multiline}
      rows={rows}
      size={size}
      sx={sx}
    />
  );
}

export function FieldGrid({ children, columns = 2 }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: `repeat(${columns}, 1fr)` }, gap: 2.5 }}>
      {children}
    </Box>
  );
}
