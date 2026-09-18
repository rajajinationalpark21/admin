import React, { useEffect, useState, useCallback } from "react";
import api from "../api/apiClient";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Collapse,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  FlightTakeoff as ShiftIcon,
  Park as ZoneIcon,
  Undo as UndoIcon,
} from "@mui/icons-material";
import { BOOKINGS_GET, BOOKINGS_UPDATE, BOOKINGS_DELETE } from "../constants/endpoints";

const STATUS_OPTIONS = ["All", "new", "contacted", "confirmed", "cancelled"];

const STATUS_COLORS = {
  new: "info",
  contacted: "warning",
  confirmed: "success",
  cancelled: "error",
};

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "success" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, booking: null });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = statusFilter !== "All" ? { status: statusFilter } : {};
      const res = await api.get(BOOKINGS_GET, { params });
      setBookings(res.data?.bookings || []);
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (bookingId, newStatus) => {
    setProcessingId(bookingId);
    try {
      await api.patch(BOOKINGS_UPDATE, { bookingId, status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
      setSnackbar({ open: true, msg: "Status updated", severity: "success" });
    } catch {
      setSnackbar({ open: true, msg: "Failed to update", severity: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.booking) return;
    setProcessingId(deleteDialog.booking._id);
    try {
      await api.delete(BOOKINGS_DELETE, {
        data: { bookingId: deleteDialog.booking._id },
      });
      setBookings((prev) => prev.filter((b) => b._id !== deleteDialog.booking._id));
      setDeleteDialog({ open: false, booking: null });
      setSnackbar({ open: true, msg: "Booking deleted", severity: "success" });
    } catch {
      setSnackbar({ open: true, msg: "Failed to delete", severity: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
        <CircularProgress sx={{ color: "#47a447" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 1.5 : 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5" fontWeight={800} sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }}>
          Safari Bookings
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>{s === "All" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchBookings}
            sx={{ backgroundColor: "#47a447", "&:hover": { backgroundColor: "#3d8c3d" }, textTransform: "none", fontWeight: 600 }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {bookings.length === 0 ? (
        <Alert severity="info">No booking inquiries found.</Alert>
      ) : isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {bookings.map((booking) => (
            <Paper
              key={booking._id}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.3s ease",
                animation: "slideUp 0.3s ease",
                "@keyframes slideUp": {
                  from: { opacity: 0, transform: "translateY(10px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              {/* Header */}
              <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <PeopleIcon sx={{ color: "#47a447", fontSize: 20 }} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={700} fontSize="0.9rem" noWrap>{booking.name}</Typography>
                    <Typography fontSize="0.75rem" color="text.secondary" noWrap>{booking.refNumber}</Typography>
                  </Box>
                </Box>
                <Chip
                  label={booking.status}
                  color={STATUS_COLORS[booking.status] || "default"}
                  size="small"
                  sx={{ fontWeight: 600, fontSize: "0.7rem", flexShrink: 0 }}
                />
              </Box>

              {/* Quick info */}
              <Box sx={{ px: 2, pb: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                <Chip icon={<ZoneIcon sx={{ fontSize: 14 }} />} label={booking.zone} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
                <Chip icon={<CalendarIcon sx={{ fontSize: 14 }} />} label={formatDate(booking.date)} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
                <Chip icon={<ShiftIcon sx={{ fontSize: 14 }} />} label={booking.shift} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
                <Chip icon={<PeopleIcon sx={{ fontSize: 14 }} />} label={`${booking.guests} guests`} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
              </Box>

              {/* Expanded details */}
              <Collapse in={expandedId === booking._id} timeout={300}>
                <Box sx={{ px: 2, pb: 2, pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {booking.email && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <EmailIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography fontSize="0.8rem">{booking.email}</Typography>
                      </Box>
                    )}
                    {booking.phone && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography fontSize="0.8rem">{booking.phone}</Typography>
                      </Box>
                    )}
                    {booking.specialRequests && (
                      <Box sx={{ mt: 1 }}>
                        <Typography fontSize="0.75rem" fontWeight={600} color="text.secondary">Special Requests:</Typography>
                        <Typography fontSize="0.8rem">{booking.specialRequests}</Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Status actions */}
                  <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {booking.status === "new" && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<PhoneIcon />}
                        disabled={processingId === booking._id}
                        onClick={() => handleStatusChange(booking._id, "contacted")}
                        sx={{ textTransform: "none", fontWeight: 600, bgcolor: "#f59e0b", "&:hover": { bgcolor: "#d97706" } }}
                      >
                        Mark Contacted
                      </Button>
                    )}
                    {booking.status === "contacted" && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        disabled={processingId === booking._id}
                        onClick={() => handleStatusChange(booking._id, "confirmed")}
                        sx={{ textTransform: "none", fontWeight: 600, bgcolor: "#47a447", "&:hover": { bgcolor: "#3d8c3d" } }}
                      >
                        Mark Confirmed
                      </Button>
                    )}
                    {booking.status !== "new" && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<UndoIcon />}
                        disabled={processingId === booking._id}
                        onClick={() => handleStatusChange(booking._id, "new")}
                        sx={{ textTransform: "none", fontWeight: 600 }}
                      >
                        Reset to New
                      </Button>
                    )}
                    {booking.status !== "cancelled" && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={processingId === booking._id}
                        onClick={() => handleStatusChange(booking._id, "cancelled")}
                        sx={{ textTransform: "none", fontWeight: 600 }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Box>
              </Collapse>

              {/* Footer */}
              <Box sx={{ px: 2, py: 1, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid", borderColor: "divider" }}>
                <Typography fontSize="0.7rem" color="text.secondary">
                  {new Date(booking.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                  >
                    {expandedId === booking._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteDialog({ open: true, booking })}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Ref</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Zone</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Shift</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Guests</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <React.Fragment key={booking._id}>
                  <TableRow hover>
                    <TableCell>
                      <Typography fontWeight={600} fontSize="0.85rem">{booking.name}</Typography>
                      <Typography fontSize="0.75rem" color="text.secondary">{booking.email || "—"}</Typography>
                    </TableCell>
                    <TableCell><Typography fontSize="0.8rem" fontFamily="monospace">{booking.refNumber}</Typography></TableCell>
                    <TableCell><Typography fontSize="0.8rem">{booking.zone}</Typography></TableCell>
                    <TableCell><Typography fontSize="0.8rem">{booking.date}</Typography></TableCell>
                    <TableCell><Typography fontSize="0.8rem">{booking.shift}</Typography></TableCell>
                    <TableCell><Typography fontSize="0.8rem">{booking.guests}</Typography></TableCell>
                    <TableCell>
                      <Chip label={booking.status} color={STATUS_COLORS[booking.status] || "default"} size="small" sx={{ fontWeight: 600, fontSize: "0.7rem" }} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}>
                            {expandedId === booking._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Tooltip>
                        {booking.status === "new" && (
                          <Tooltip title="Mark contacted">
                            <IconButton size="small" disabled={processingId === booking._id} onClick={() => handleStatusChange(booking._id, "contacted")} sx={{ color: "#f59e0b" }}>
                              <PhoneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {booking.status === "contacted" && (
                          <Tooltip title="Mark confirmed">
                            <IconButton size="small" disabled={processingId === booking._id} onClick={() => handleStatusChange(booking._id, "confirmed")} sx={{ color: "#47a447" }}>
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, booking })}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} sx={{ p: 0, border: "none" }}>
                      <Collapse in={expandedId === booking._id} timeout={300}>
                        <Box sx={{ p: 2, bgcolor: "#f8f9fa", display: "flex", gap: 4, flexWrap: "wrap" }}>
                          <Box>
                            <Typography fontSize="0.75rem" fontWeight={600} color="text.secondary">Phone</Typography>
                            <Typography fontSize="0.85rem">{booking.phone || "—"}</Typography>
                          </Box>
                          <Box>
                            <Typography fontSize="0.75rem" fontWeight={600} color="text.secondary">Special Requests</Typography>
                            <Typography fontSize="0.85rem">{booking.specialRequests || "—"}</Typography>
                          </Box>
                          <Box>
                            <Typography fontSize="0.75rem" fontWeight={600} color="text.secondary">Submitted</Typography>
                            <Typography fontSize="0.85rem">{new Date(booking.createdAt).toLocaleString("en-IN")}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center", ml: "auto" }}>
                            {booking.status !== "cancelled" && (
                              <Button size="small" variant="outlined" color="error" disabled={processingId === booking._id} onClick={() => handleStatusChange(booking._id, "cancelled")} sx={{ textTransform: "none" }}>
                                Cancel Booking
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, booking: null })}>
        <DialogTitle>Delete Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the booking from <strong>{deleteDialog.booking?.name}</strong> ({deleteDialog.booking?.refNumber})?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, booking: null })}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={processingId === deleteDialog.booking?._id}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
