import { useEffect, useState, useMemo } from "react";
import React from "react";
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
  useTheme,
  useMediaQuery,
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
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/apiClient";

export default function InquiryManager() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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

  const handleChangePage = (event, newPage) => setPage(newPage);
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
      <Header title="Contact Inquiries" subtitle="Manage questions and permit inquiries submitted by website visitors" />

      <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 1.5, sm: 3, lg: 4 }, pt: { xs: 1.5, sm: 3 } }}>
        {/* Search & Control Bar */}
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "divider",
            p: { xs: 1.5, sm: 2.25 },
            mb: { xs: 1.5, sm: 3 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: "260px" }, maxWidth: "480px" }}>
            <TextField
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
              placeholder="Search by name, email, phone..."
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
              }}
            >
              {!isMobile && "Refresh"}
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

        {/* Content */}
        {loading ? (
          <Box sx={{ py: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress size={28} sx={{ mb: 2 }} />
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Loading inquiries...</Typography>
          </Box>
        ) : filteredInquiries.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center", borderRadius: "12px", backgroundColor: "background.paper", border: "1px solid", borderColor: "divider" }}>
            <MessageSquare size={36} style={{ margin: "0 auto 12px", color: theme.palette.text.secondary }} />
            <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "text.primary" }}>No inquiries found</Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5 }}>
              {searchTerm ? "Try a different keyword." : "Inquiries from the contact form will appear here."}
            </Typography>
          </Box>
        ) : isMobile ? (
          /* MOBILE: Card Layout */
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {displayedInquiries.map((inq, index) => {
              const id = inq._id || inq.id || `inq-${index}`;
              const isExpanded = expandedId === id;
              const senderName = inq.name || `${inq.firstName || ""} ${inq.lastName || ""}` || "Guest";

              return (
                <Box
                  key={id}
                  className="mobile-card-enter"
                  sx={{
                    backgroundColor: "background.paper",
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{ p: 2, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, flex: 1 }}>
                      <Box sx={{
                        width: 36, height: 36, borderRadius: "10px", backgroundColor: "action.selected",
                        color: "text.primary", fontWeight: 700, fontSize: "0.8125rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        textTransform: "uppercase", flexShrink: 0,
                      }}>
                        {senderName[0] || "U"}
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "text.primary", lineHeight: 1.3 }}>
                          {senderName}
                        </Typography>
                        {inq.email && (
                          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                            <Mail size={11} /> {inq.email}
                          </Typography>
                        )}
                        {(inq.phone || inq.mobile) && (
                          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                            <Phone size={11} /> {inq.phone || inq.mobile}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <IconButton size="small" onClick={() => handleDelete(id)} sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}>
                      <Trash2 size={15} />
                    </IconButton>
                  </Box>

                  {/* Message */}
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography sx={{
                        fontSize: "0.8125rem", color: "text.secondary", lineHeight: 1.5,
                        display: "-webkit-box", WebkitLineClamp: isExpanded ? "unset" : 2,
                        WebkitBoxOrient: "vertical", overflow: isExpanded ? "visible" : "hidden",
                      }}>
                        {inq.message || inq.description || "No message"}
                      </Typography>
                    </Box>
                    {(inq.message || inq.description || "").length > 80 && (
                      <Box
                        onClick={() => toggleExpand(id)}
                        sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.75, cursor: "pointer", color: "primary.main" }}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>{isExpanded ? "Less" : "Read more"}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (
          /* DESKTOP: Table Layout */
          <Box sx={{ backgroundColor: "background.paper", borderRadius: "12px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "action.hover" }}>
                    <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>SENDER</TableCell>
                    <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>EMAIL</TableCell>
                    <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>PHONE</TableCell>
                    <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>MESSAGE PREVIEW</TableCell>
                    <TableCell align="right" sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedInquiries.map((inq, index) => {
                    const id = inq._id || inq.id || `inq-${index}`;
                    const isExpanded = expandedId === id;
                    const senderName = inq.name || `${inq.firstName || ""} ${inq.lastName || ""}` || "Guest Visitor";
                    return (
                      <React.Fragment key={id}>
                        <TableRow hover>
                          <TableCell sx={{ py: 1.5, minWidth: 160 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                              <Box sx={{ width: 30, height: 30, borderRadius: "8px", backgroundColor: "action.selected", color: "text.primary", fontWeight: 700, fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", textTransform: "uppercase", flexShrink: 0 }}>
                                {senderName[0] || "U"}
                              </Box>
                              <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.primary" }}>{senderName}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 1.5, minWidth: 160 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "0.75rem", color: "text.secondary" }}>
                              <Mail size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
                              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{inq.email || "—"}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 1.5, minWidth: 130 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "0.75rem", color: "text.secondary" }}>
                              <Phone size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
                              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{inq.phone || inq.mobile || "—"}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 1.5, maxWidth: 320 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", maxWidth: 240, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {inq.message || inq.description || "No message content"}
                              </Typography>
                              <Button size="small" onClick={() => toggleExpand(id)} endIcon={isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />} sx={{ p: 0, minWidth: "auto", textTransform: "none", fontSize: "0.6875rem", fontWeight: 600, color: "text.primary" }}>
                                {isExpanded ? "Less" : "Expand"}
                              </Button>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1.5 }}>
                            <Tooltip title="Delete Inquiry" arrow>
                              <IconButton size="small" onClick={() => handleDelete(id)} sx={{ color: "text.secondary", borderRadius: "6px", p: 0.75, "&:hover": { color: "error.main", backgroundColor: "action.hover" } }}>
                                <Trash2 size={15} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={5} sx={{ backgroundColor: "action.hover", py: 2, px: 3 }}>
                              <Box sx={{ pl: 5 }}>
                                <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.04em", mb: 0.5 }}>Full Message Content</Typography>
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
              sx={{ borderTop: "1px solid", borderColor: "divider", color: "text.secondary", fontSize: "0.75rem" }}
            />
          </Box>
        )}

        {/* Mobile Pagination */}
        {isMobile && filteredInquiries.length > rowsPerPage && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
            <Button disabled={page === 0} onClick={() => setPage(page - 1)} size="small" variant="outlined" sx={{ borderRadius: "8px", textTransform: "none", minWidth: 44, minHeight: 44 }}>
              Prev
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", px: 2 }}>
              <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                {page + 1} / {Math.ceil(filteredInquiries.length / rowsPerPage)}
              </Typography>
            </Box>
            <Button disabled={page >= Math.ceil(filteredInquiries.length / rowsPerPage) - 1} onClick={() => setPage(page + 1)} size="small" variant="outlined" sx={{ borderRadius: "8px", textTransform: "none", minWidth: 44, minHeight: 44 }}>
              Next
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
