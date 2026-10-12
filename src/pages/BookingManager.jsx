import { useEffect, useState, useCallback, useMemo } from "react";
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
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  TextField,
  InputAdornment,
  TablePagination,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  FlightTakeoff as ShiftIcon,
  Park as ZoneIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Notes as NotesIcon,
  Tag as TagIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { BOOKINGS_GET, BOOKINGS_UPDATE, BOOKINGS_DELETE } from "../constants/endpoints";

const STATUS_FILTER_OPTIONS = [
  { value: "All", label: "All Inquiries" },
  { value: "not_viewed", label: "Not Viewed" },
  { value: "viewed", label: "Viewed" },
];

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Full Details Modal Dialog
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Delete Dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, booking: null });
  
  // Notification Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "success" });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(BOOKINGS_GET);
      setBookings(res.data?.bookings || []);
    } catch {
      setError("Failed to load booking inquiries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Toggle Viewed / Not Viewed
  const handleToggleStatus = async (booking) => {
    const isCurrentlyViewed = booking.status === "viewed";
    const nextStatus = isCurrentlyViewed ? "not_viewed" : "viewed";
    setProcessingId(booking._id);
    try {
      await api.patch(BOOKINGS_UPDATE, { bookingId: booking._id, status: nextStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? { ...b, status: nextStatus } : b))
      );
      if (selectedBooking && selectedBooking._id === booking._id) {
        setSelectedBooking((prev) => ({ ...prev, status: nextStatus }));
      }
      setSnackbar({
        open: true,
        msg: `Marked as ${nextStatus === "viewed" ? "Viewed" : "Not Viewed"}`,
        severity: "success",
      });
    } catch {
      setSnackbar({ open: true, msg: "Failed to update status", severity: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  // Open Full Details modal and automatically mark as viewed if not already
  const handleViewFullDetails = async (booking) => {
    setSelectedBooking(booking);
    if (booking.status !== "viewed") {
      try {
        await api.patch(BOOKINGS_UPDATE, { bookingId: booking._id, status: "viewed" });
        setBookings((prev) =>
          prev.map((b) => (b._id === booking._id ? { ...b, status: "viewed" } : b))
        );
        setSelectedBooking((prev) => (prev ? { ...prev, status: "viewed" } : prev));
      } catch {
        // silent fail for auto-view
      }
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
      if (selectedBooking && selectedBooking._id === deleteDialog.booking._id) {
        setSelectedBooking(null);
      }
      setDeleteDialog({ open: false, booking: null });
      setSnackbar({ open: true, msg: "Booking inquiry deleted", severity: "success" });
    } catch {
      setSnackbar({ open: true, msg: "Failed to delete inquiry", severity: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
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

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Filter inquiries by search and viewed/not_viewed
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Filter status
      const isViewed = b.status === "viewed";
      if (statusFilter === "viewed" && !isViewed) return false;
      if (statusFilter === "not_viewed" && isViewed) return false;

      // Filter search query
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      const name = (b.name || "").toLowerCase();
      const email = (b.email || "").toLowerCase();
      const phone = (b.phone || "").toLowerCase();
      const ref = (b.refNumber || "").toLowerCase();
      const zone = (b.zone || "").toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        ref.includes(q) ||
        zone.includes(q)
      );
    });
  }, [bookings, statusFilter, searchTerm]);

  const paginatedBookings = useMemo(() => {
    return filteredBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredBookings, page, rowsPerPage]);

  const notViewedCount = useMemo(() => {
    return bookings.filter((b) => b.status !== "viewed").length;
  }, [bookings]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
        <CircularProgress sx={{ color: "#47a447" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 1.5 : 3 }}>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ fontSize: isMobile ? "1.25rem" : "1.5rem", display: "flex", alignItems: "center", gap: 1.5 }}
          >
            Safari Inquiries
            {notViewedCount > 0 && (
              <Chip
                label={`${notViewedCount} Not Viewed`}
                color="warning"
                size="small"
                sx={{ fontWeight: 700, fontSize: "0.75rem" }}
              />
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Read-only visitor permit inquiries with full details view and status tracking.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Search Box */}
          <TextField
            size="small"
            placeholder="Search guest, phone, ref..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{ minWidth: 200 }}
          />

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchBookings}
            sx={{
              backgroundColor: "#47a447",
              "&:hover": { backgroundColor: "#3d8c3d" },
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {filteredBookings.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No safari inquiries found {statusFilter !== "All" ? `with status "${statusFilter}"` : ""}.
        </Alert>
      ) : isMobile ? (
        /* Mobile Card View */
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {paginatedBookings.map((booking) => {
            const isViewed = booking.status === "viewed";
            return (
              <Paper
                key={booking._id}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: isViewed ? "divider" : "#f59e0b",
                  backgroundColor: isViewed ? "background.paper" : "rgba(245, 158, 11, 0.03)",
                  p: 2,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                  <Box>
                    <Typography fontWeight={700} fontSize="0.95rem">{booking.name}</Typography>
                    <Typography fontSize="0.75rem" color="text.secondary" fontFamily="monospace">
                      {booking.refNumber || "—"}
                    </Typography>
                  </Box>
                  <Chip
                    icon={isViewed ? <VisibilityIcon sx={{ fontSize: 13 }} /> : <VisibilityOffIcon sx={{ fontSize: 13 }} />}
                    label={isViewed ? "Viewed" : "Not Viewed"}
                    color={isViewed ? "success" : "warning"}
                    size="small"
                    sx={{ fontWeight: 700, fontSize: "0.7rem" }}
                  />
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
                  <Chip icon={<ZoneIcon sx={{ fontSize: 13 }} />} label={booking.zone} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
                  <Chip icon={<CalendarIcon sx={{ fontSize: 13 }} />} label={formatDate(booking.date)} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
                  <Chip icon={<ShiftIcon sx={{ fontSize: 13 }} />} label={booking.shift} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
                  <Chip icon={<PeopleIcon sx={{ fontSize: 13 }} />} label={`${booking.guests || 2} Guests`} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewFullDetails(booking)}
                    sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.75rem", borderRadius: 2 }}
                  >
                    View Full Details
                  </Button>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip title={isViewed ? "Mark as Not Viewed" : "Mark as Viewed"}>
                      <Switch
                        size="small"
                        checked={isViewed}
                        disabled={processingId === booking._id}
                        onChange={() => handleToggleStatus(booking)}
                        color="success"
                      />
                    </Tooltip>
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
            );
          })}
        </Box>
      ) : (
        /* Desktop Table View */
        <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8faf9" }}>
                <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem", color: "text.secondary" }}>GUEST NAME</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem", color: "text.secondary" }}>REF ID</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem", color: "text.secondary" }}>ZONE & TIMING</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem", color: "text.secondary" }}>SAFARI DATE</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem", color: "text.secondary" }}>GUESTS</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem", color: "text.secondary" }}>PHONE</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: "0.8rem", color: "text.secondary" }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, fontSize: "0.8rem", color: "text.secondary" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBookings.map((booking) => {
                const isViewed = booking.status === "viewed";
                return (
                  <TableRow
                    key={booking._id}
                    hover
                    sx={{
                      cursor: "pointer",
                      bgcolor: isViewed ? "inherit" : "rgba(245, 158, 11, 0.03)",
                      transition: "background-color 0.2s",
                    }}
                    onClick={() => handleViewFullDetails(booking)}
                  >
                    <TableCell>
                      <Typography fontWeight={700} fontSize="0.875rem">{booking.name}</Typography>
                      <Typography fontSize="0.75rem" color="text.secondary">{booking.email || "No email"}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontSize="0.8rem" fontFamily="monospace" fontWeight={600} color="text.secondary">
                        {booking.refNumber || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontSize="0.85rem" fontWeight={600}>{booking.zone}</Typography>
                      <Typography fontSize="0.75rem" color="text.secondary">{booking.shift}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontSize="0.85rem" fontWeight={500}>{formatDate(booking.date)}</Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={`${booking.guests || 2} Guests`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography fontSize="0.85rem" fontWeight={600} fontFamily="monospace">
                        {booking.phone || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={isViewed}
                            disabled={processingId === booking._id}
                            onChange={() => handleToggleStatus(booking)}
                            color="success"
                          />
                        }
                        label={
                          <Chip
                            icon={isViewed ? <VisibilityIcon sx={{ fontSize: 13 }} /> : <VisibilityOffIcon sx={{ fontSize: 13 }} />}
                            label={isViewed ? "Viewed" : "Not Viewed"}
                            color={isViewed ? "success" : "warning"}
                            size="small"
                            sx={{ fontWeight: 700, fontSize: "0.7rem", pointerEvents: "none" }}
                          />
                        }
                      />
                    </TableCell>

                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", alignItems: "center" }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon fontSize="small" />}
                          onClick={() => handleViewFullDetails(booking)}
                          sx={{ textTransform: "none", fontSize: "0.75rem", fontWeight: 600, borderRadius: 1.5 }}
                        >
                          View Full
                        </Button>
                        <Tooltip title="Delete inquiry">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, booking })}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Table Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredBookings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      )}

      {/* FULL DETAILS MODAL DIALOG */}
      <Dialog
        open={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        {selectedBooking && (
          <>
            <DialogTitle sx={{ pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  Safari Inquiry Details
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Read-only inquiry submitted by visitor
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedBooking(null)} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 2.5, pb: 2 }}>
              {/* Status Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  mb: 2.5,
                  borderRadius: 2,
                  bgcolor: selectedBooking.status === "viewed" ? "rgba(16, 185, 129, 0.08)" : "rgba(245, 158, 11, 0.08)",
                  border: "1px solid",
                  borderColor: selectedBooking.status === "viewed" ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)",
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                    INQUIRY STATUS
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color={selectedBooking.status === "viewed" ? "success.main" : "warning.main"}>
                    {selectedBooking.status === "viewed" ? "Viewed" : "Not Viewed"}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  color={selectedBooking.status === "viewed" ? "warning" : "success"}
                  onClick={() => handleToggleStatus(selectedBooking)}
                  startIcon={selectedBooking.status === "viewed" ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  sx={{ textTransform: "none", fontWeight: 700 }}
                >
                  Mark as {selectedBooking.status === "viewed" ? "Not Viewed" : "Viewed"}
                </Button>
              </Box>

              {/* Data Grid */}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                {/* Reference ID */}
                <Box sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <TagIcon sx={{ fontSize: 14 }} /> Reference Number
                  </Typography>
                  <Typography variant="body2" fontWeight={800} fontFamily="monospace" sx={{ mt: 0.5 }}>
                    {selectedBooking.refNumber || "—"}
                  </Typography>
                </Box>

                {/* Submitted Timestamp */}
                <Box sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 14 }} /> Inquiry Submitted At
                  </Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>
                    {formatTimestamp(selectedBooking.createdAt)}
                  </Typography>
                </Box>

                {/* Guest Name */}
                <Box sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PeopleIcon sx={{ fontSize: 14 }} /> Primary Guest Name
                  </Typography>
                  <Typography variant="body1" fontWeight={700} sx={{ mt: 0.5 }}>
                    {selectedBooking.name || "—"}
                  </Typography>
                </Box>

                {/* Phone */}
                <Box sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 14 }} /> WhatsApp Mobile Number
                  </Typography>
                  <Typography variant="body1" fontWeight={800} fontFamily="monospace" color="primary.main" sx={{ mt: 0.5 }}>
                    {selectedBooking.phone ? (
                      <a href={`tel:${selectedBooking.phone}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {selectedBooking.phone}
                      </a>
                    ) : "—"}
                  </Typography>
                </Box>

                {/* Email */}
                <Box sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <EmailIcon sx={{ fontSize: 14 }} /> Email Address
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
                    {selectedBooking.email ? (
                      <a href={`mailto:${selectedBooking.email}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {selectedBooking.email}
                      </a>
                    ) : "—"}
                  </Typography>
                </Box>

                {/* Party Size */}
                <Box sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PeopleIcon sx={{ fontSize: 14 }} /> Number of Guests
                  </Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>
                    {selectedBooking.guests || 2} Guests
                  </Typography>
                </Box>

                {/* Selected Range */}
                <Box sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ZoneIcon sx={{ fontSize: 14 }} /> Safari Zone / Range
                  </Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>
                    {selectedBooking.zone || "—"}
                  </Typography>
                </Box>

                {/* Safari Date */}
                <Box sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarIcon sx={{ fontSize: 14 }} /> Preferred Safari Date
                  </Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>
                    {formatDate(selectedBooking.date)}
                  </Typography>
                </Box>

                {/* Shift / Slot */}
                <Box sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 2, gridColumn: { xs: "1", sm: "span 2" } }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ShiftIcon sx={{ fontSize: 14 }} /> Shift Timing
                  </Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>
                    {selectedBooking.shift || "—"}
                  </Typography>
                </Box>

                {/* Special Requests */}
                <Box sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 2, gridColumn: { xs: "1", sm: "span 2" } }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <NotesIcon sx={{ fontSize: 14 }} /> Special Requests / Notes
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontStyle: selectedBooking.specialRequests ? "normal" : "italic", color: selectedBooking.specialRequests ? "text.primary" : "text.secondary" }}>
                    {selectedBooking.specialRequests || "No special requests provided."}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialog({ open: true, booking: selectedBooking })}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Delete Inquiry
              </Button>

              <Button
                variant="contained"
                onClick={() => setSelectedBooking(null)}
                sx={{ textTransform: "none", fontWeight: 700, backgroundColor: "#47a447", "&:hover": { backgroundColor: "#3d8c3d" }, borderRadius: 2 }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, booking: null })}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle fontWeight={700}>Delete Inquiry</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete the safari inquiry from <strong>{deleteDialog.booking?.name}</strong> ({deleteDialog.booking?.refNumber})?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, booking: null })} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={processingId === deleteDialog.booking?._id}
            onClick={handleDelete}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar feedback */}
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
