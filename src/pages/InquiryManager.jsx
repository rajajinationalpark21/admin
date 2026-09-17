import { useEffect, useState, useMemo } from "react";
import Header from "../components/common/Header";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
  useTheme
} from "@mui/material";
import { 
  Search, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Mail, 
  Phone, 
  RefreshCw,
  X,
  User
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/apiClient";

export default function InquiryManager() {
  const theme = useTheme();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get("contact/get");
      const data = res.data?.inquiries || res.data?.data || res.data?.contacts || [];
      setInquiries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact inquiry?")) return;
    try {
      await api.delete("contact/delete", { data: { contactId: id } });
      setInquiries((prev) => prev.filter((item) => (item._id || item.id) !== id));
      toast.success("Inquiry deleted successfully");
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Failed to delete inquiry");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const name = (inq.name || `${inq.firstName || ""} ${inq.lastName || ""}`).toLowerCase();
      const email = (inq.email || "").toLowerCase();
      const phone = (inq.phone || inq.mobile || "").toLowerCase();
      const message = (inq.message || inq.description || "").toLowerCase();
      const q = searchTerm.toLowerCase();

      return name.includes(q) || email.includes(q) || phone.includes(q) || message.includes(q);
    });
  }, [inquiries, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedInquiries = filteredInquiries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header 
        title="Contact Inquiries" 
        subtitle="Manage questions and permit inquiries submitted by website visitors" 
      />

      <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3 }}>
        {/* Search & Control Filter Bar */}
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "divider",
            p: { xs: 2, sm: 2.25 },
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Search Pill */}
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: "260px" }, maxWidth: "480px" }}>
            <TextField
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              placeholder="Search by sender, email, phone, or keyword..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} style={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <X size={14} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                sx: {
                  borderRadius: "24px",
                  fontSize: "0.8125rem",
                  height: 38,
                  backgroundColor: "action.hover",
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "divider" },
                  "&.Mui-focused fieldset": { borderColor: "text.primary" },
                },
              }}
            />
          </Box>

          {/* Right Action Bar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              onClick={fetchInquiries}
              disabled={loading}
              variant="outlined"
              size="small"
              startIcon={<RefreshCw size={14} className={loading ? "animate-spin" : ""} />}
              sx={{
                borderRadius: "12px",
                borderColor: "divider",
                color: "text.primary",
                height: 38,
                px: 2,
                textTransform: "none",
                fontSize: "0.8125rem",
                fontWeight: 600,
                "&:hover": { borderColor: "text.secondary", backgroundColor: "action.hover" },
              }}
            >
              Refresh
            </Button>

            <Chip
              label={`${filteredInquiries.length} Inquiries`}
              size="small"
              sx={{
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 32,
                px: 0.5,
                backgroundColor: "action.selected",
                color: "text.primary",
              }}
            />
          </Box>
        </Box>

        {/* Content Section: SaaS Table Container */}
        {loading ? (
          <Box sx={{ py: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress size={28} sx={{ mb: 2 }} />
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
              Loading inquiries...
            </Typography>
          </Box>
        ) : filteredInquiries.length === 0 ? (
          <Box
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: "12px",
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <MessageSquare size={36} style={{ margin: "0 auto 12px", color: theme.palette.text.secondary }} />
            <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "text.primary" }}>
              No inquiries found
            </Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5 }}>
              {searchTerm ? "Try searching with a different keyword." : "Inquiries from the visitor contact form will appear here."}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "action.hover" }}>
                    <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>
                      SENDER
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>
                      EMAIL
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>
                      PHONE
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>
                      MESSAGE PREVIEW
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>
                      ACTIONS
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedInquiries.map((inq, index) => {
                    const id = inq._id || inq.id || `inq-${index}`;
                    const isExpanded = expandedId === id;
                    const senderName = inq.name || `${inq.firstName || ""} ${inq.lastName || ""}` || "Guest Visitor";

                    return (
                      <React.Fragment key={id}>
                        <TableRow hover sx={{ "&:last-child td, &:last-child th": { border: isExpanded ? "1px solid divider" : 0 } }}>
                          <TableCell sx={{ py: 1.5, minWidth: 160 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                              <Box
                                sx={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: "8px",
                                  backgroundColor: "action.selected",
                                  color: "text.primary",
                                  fontWeight: 700,
                                  fontSize: "0.75rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  textTransform: "uppercase",
                                  flexShrink: 0,
                                }}
                              >
                                {senderName[0] || "U"}
                              </Box>
                              <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.primary" }}>
                                {senderName}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell sx={{ py: 1.5, minWidth: 160 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "0.75rem", color: "text.secondary" }}>
                              <Mail size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
                              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                                {inq.email || "—"}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell sx={{ py: 1.5, minWidth: 130 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "0.75rem", color: "text.secondary" }}>
                              <Phone size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
                              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                                {inq.phone || inq.mobile || "—"}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell sx={{ py: 1.5, maxWidth: 320 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Typography
                                sx={{
                                  fontSize: "0.75rem",
                                  color: "text.secondary",
                                  maxWidth: 240,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {inq.message || inq.description || "No message content"}
                              </Typography>
                              <Button
                                size="small"
                                onClick={() => toggleExpand(id)}
                                endIcon={isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                sx={{
                                  p: 0,
                                  minWidth: "auto",
                                  textTransform: "none",
                                  fontSize: "0.6875rem",
                                  fontWeight: 600,
                                  color: "text.primary",
                                }}
                              >
                                {isExpanded ? "Less" : "Expand"}
                              </Button>
                            </Box>
                          </TableCell>

                          <TableCell align="right" sx={{ py: 1.5 }}>
                            <Tooltip title="Delete Inquiry" arrow>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(id)}
                                sx={{
                                  color: "text.secondary",
                                  borderRadius: "6px",
                                  p: 0.75,
                                  "&:hover": { color: "error.main", backgroundColor: "action.hover" },
                                }}
                              >
                                <Trash2 size={15} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>

                        {/* Expandable full message content */}
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={5} sx={{ backgroundColor: "action.hover", py: 2, px: 3 }}>
                              <Box sx={{ pl: 5 }}>
                                <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.04em", mb: 0.5 }}>
                                  Full Message Content
                                </Typography>
                                <Typography sx={{ fontSize: "0.8125rem", color: "text.primary", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                                  {inq.message || inq.description || "No message content provided."}
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredInquiries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: "1px solid",
                borderColor: "divider",
                color: "text.secondary",
                fontSize: "0.75rem",
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
