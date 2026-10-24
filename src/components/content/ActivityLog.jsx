import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from "@mui/material";
import { RefreshCw } from "lucide-react";
import api from "../../api/apiClient";

const ACTION_LABELS = {
  "content.update": "Edited page",
  "blog.create": "Added blog post",
  "blog.update": "Edited blog post",
  "blog.delete": "Deleted blog post",
  "booking.update": "Changed booking status",
  "booking.delete": "Deleted booking",
  "inquiry.delete": "Deleted inquiry",
  "feedback.update": "Edited review",
  "feedback.delete": "Deleted review",
  "image.upload": "Uploaded image",
  "admin.create": "Added admin",
  "admin.delete": "Removed admin",
  "admin.transfer-ownership": "Transferred ownership",
  "admin.profile": "Updated profile",
  "admin.password": "Changed password",
  "admin.login": "Signed in",
  "admin.login-failed": "Failed sign-in",
};

const KINDS = [
  { id: "", label: "Everything" },
  { id: "changes", label: "Changes" },
  { id: "signins", label: "Sign-ins" },
];

/** "Chrome on Windows", "Safari on iPhone", ... from a browser's user-agent text. */
function deviceName(userAgent = "") {
  if (!userAgent) return "";
  const browser = /Edg\//.test(userAgent) ? "Edge" : /Chrome\//.test(userAgent) ? "Chrome" : /Firefox\//.test(userAgent) ? "Firefox" : /Safari\//.test(userAgent) ? "Safari" : "Browser";
  const system = /iPhone|iPad/.test(userAgent) ? "iPhone/iPad" : /Android/.test(userAgent) ? "Android" : /Windows/.test(userAgent) ? "Windows" : /Mac OS X/.test(userAgent) ? "Mac" : /Linux/.test(userAgent) ? "Linux" : "";
  return system ? `${browser} on ${system}` : browser;
}

const head = { fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" };

/** Who changed what in the admin panel (visible to the panel owner). */
export default function ActivityLog() {
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState("");

  const load = async (nextKind) => {
    setStatus("loading");
    try {
      const res = await api.get("admin/audit", { params: { limit: 200, kind: nextKind || undefined } });
      setEntries(res.data?.entries || []);
      setStatus("ready");
    } catch (err) {
      setMessage(err.response?.status === 403
        ? "Only the panel owner can see the activity log."
        : err.response?.data?.message || "The activity log could not be loaded.");
      setStatus("error");
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: "1.125rem", fontWeight: 700 }}>Activity Log</Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5 }}>
            Every change made in this panel and every sign-in attempt: who, what and when. Kept for one year.
          </Typography>
        </Box>
        <Button size="small" startIcon={<RefreshCw size={14} />} onClick={() => load(kind)} sx={{ textTransform: "none" }}>Refresh</Button>
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {KINDS.map((option) => (
          <Chip
            key={option.id || "all"}
            label={option.label}
            color={kind === option.id ? "primary" : "default"}
            variant={kind === option.id ? "filled" : "outlined"}
            onClick={() => { setKind(option.id); load(option.id); }}
            sx={{ fontSize: "0.75rem" }}
          />
        ))}
      </Box>

      {status === "loading" && <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}><CircularProgress size={28} /></Box>}
      {status === "error" && <Typography sx={{ color: "text.secondary", py: 4, textAlign: "center" }}>{message}</Typography>}
      {status === "ready" && entries.length === 0 && (
        <Typography sx={{ color: "text.secondary", py: 4, textAlign: "center" }}>Nothing recorded yet.</Typography>
      )}
      {status === "ready" && entries.length > 0 && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell sx={head}>WHEN</TableCell>
                <TableCell sx={head}>WHO</TableCell>
                <TableCell sx={head}>WHAT</TableCell>
                <TableCell sx={head}>ON</TableCell>
                <TableCell sx={head}>FROM</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry._id} hover>
                  <TableCell sx={{ fontSize: "0.75rem", color: "text.secondary", whiteSpace: "nowrap" }}>
                    {new Date(entry.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8125rem" }}>{entry.actorEmail || "—"}</TableCell>
                  <TableCell>
                    <Chip size="small" label={ACTION_LABELS[entry.action] || entry.action} color={entry.action === "admin.login-failed" ? "error" : "default"} sx={{ fontSize: "0.6875rem", height: 22 }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8125rem" }}>
                    {entry.target}
                    {Array.isArray(entry.detail?.fields) && entry.detail.fields.length > 0 && (
                      <Typography component="span" sx={{ fontSize: "0.75rem", color: "text.secondary", ml: 1 }}>
                        ({entry.detail.fields.join(", ")})
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", color: "text.secondary", whiteSpace: "nowrap" }}>
                    {[deviceName(entry.userAgent), entry.ip].filter(Boolean).join(" · ") || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
