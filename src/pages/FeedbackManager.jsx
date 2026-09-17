import { useEffect, useState, useMemo } from "react";
import Header from "../components/common/Header";
import {
  Box,
  Card,
  CardContent,
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
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Button,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import { 
  Star, 
  MessageSquareQuote, 
  Trash2, 
  Search, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  Filter,
  X,
  ArrowUpDown,
  RotateCcw
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/apiClient";
import { 
  FEEDBACK_ADMIN_ALL, 
  FEEDBACK_GET_ALL, 
  FEEDBACK_UPDATE, 
  FEEDBACK_DELETE 
} from "../constants/endpoints";

const ZONES = [
  "All Zones",
  "Chilla Range",
  "Motichur Range",
  "Gohari Range",
  "Ranipur Range",
  "Jhilmil Jheel Sanctuary",
  "General Sanctuary"
];

const FeedbackManager = () => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await api.get(FEEDBACK_ADMIN_ALL);
      } catch {
        res = await api.get(FEEDBACK_GET_ALL);
      }

      const list = res.data?.feedbacks || res.data?.data || [];
      setFeedbacks(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Failed to load visitor feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    const id = item._id || item.id;
    const newStatus = item.status === "approved" ? "pending" : "approved";
    setUpdatingId(id);

    try {
      await api.patch(FEEDBACK_UPDATE, { feedbackId: id, status: newStatus });
      setFeedbacks((prev) =>
        prev.map((fb) => ((fb._id || fb.id) === id ? { ...fb, status: newStatus } : fb))
      );
      toast.success(`Review ${newStatus === "approved" ? "published live" : "moved to pending"}`);
    } catch (error) {
      try {
        await api.put(FEEDBACK_UPDATE, { feedbackId: id, status: newStatus });
        setFeedbacks((prev) =>
          prev.map((fb) => ((fb._id || fb.id) === id ? { ...fb, status: newStatus } : fb))
        );
        toast.success(`Review ${newStatus === "approved" ? "published live" : "moved to pending"}`);
      } catch {
        toast.error("Failed to update publication status");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleVerified = async (item) => {
    const id = item._id || item.id;
    const newVerified = !item.isVerified;
    setUpdatingId(id);

    try {
      await api.patch(FEEDBACK_UPDATE, { feedbackId: id, isVerified: newVerified });
      setFeedbacks((prev) =>
        prev.map((fb) => ((fb._id || fb.id) === id ? { ...fb, isVerified: newVerified } : fb))
      );
      toast.success(`Marked as ${newVerified ? "Verified Visitor" : "Standard"}`);
    } catch (error) {
      try {
        await api.put(FEEDBACK_UPDATE, { feedbackId: id, isVerified: newVerified });
        setFeedbacks((prev) =>
          prev.map((fb) => ((fb._id || fb.id) === id ? { ...fb, isVerified: newVerified } : fb))
        );
        toast.success(`Marked as ${newVerified ? "Verified Visitor" : "Standard"}`);
      } catch {
        toast.error("Failed to update verification status");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visitor review?")) return;
    
    try {
      await api.delete(FEEDBACK_DELETE, { data: { feedbackId: id } });
      toast.success("Review deleted successfully");
      setFeedbacks((prev) => prev.filter((fb) => (fb._id || fb.id) !== id));
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete review");
    }
  };

  const stats = useMemo(() => {
    const total = feedbacks.length;
    if (total === 0) return { total: 0, avg: "0.0", approved: 0, pending: 0, fiveStars: 0 };

    const approved = feedbacks.filter((f) => f.status === "approved").length;
    const pending = total - approved;
    const sumRatings = feedbacks.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0);
    const avg = (sumRatings / total).toFixed(1);
    const fiveStars = feedbacks.filter((f) => Number(f.rating) === 5).length;

    return { total, avg, approved, pending, fiveStars };
  }, [feedbacks]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim()) count++;
    if (selectedRating !== "All") count++;
    if (selectedZone !== "All Zones") count++;
    if (selectedStatus !== "All") count++;
    if (sortBy !== "newest") count++;
    return count;
  }, [searchTerm, selectedRating, selectedZone, selectedStatus, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedRating("All");
    setSelectedStatus("All");
    setSelectedZone("All Zones");
    setSortBy("newest");
    setPage(0);
  };

  const filteredFeedbacks = useMemo(() => {
    const list = feedbacks.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.comment || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.zone || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRating =
        selectedRating === "All" || Number(item.rating) === Number(selectedRating);

      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Approved" && item.status === "approved") ||
        (selectedStatus === "Pending" && item.status === "pending");

      const matchesZone =
        selectedZone === "All Zones" || item.zone === selectedZone;

      return matchesSearch && matchesRating && matchesStatus && matchesZone;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === "rating-high") {
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      }
      if (sortBy === "rating-low") {
        return (Number(a.rating) || 0) - (Number(b.rating) || 0);
      }
      return 0;
    });
  }, [feedbacks, searchTerm, selectedRating, selectedStatus, selectedZone, sortBy]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedFeedbacks = filteredFeedbacks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header 
        title="Visitor Reviews & Feedback" 
        subtitle="Manage, verify, and moderate visitor safari trail stories and ratings"
      />

      <main className="max-w-7xl mx-auto py-5 sm:py-6 px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card sx={{ borderRadius: "12px" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase" }}>
                    Total Reviews
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", mt: 0.5 }}>
                    {stats.total}
                  </Typography>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <MessageSquareQuote size={20} />
                </div>
              </div>
              <Typography variant="caption" sx={{ color: "text.secondary", mt: 1, display: "block" }}>
                All visitor feedback
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: "12px" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase" }}>
                    Average Rating
                  </Typography>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#D97706" }}>
                      {stats.avg}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      / 5.0
                    </Typography>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                  <Star size={20} className="fill-yellow-400" />
                </div>
              </div>
              <Typography variant="caption" sx={{ color: "text.secondary", mt: 1, display: "block" }}>
                {stats.fiveStars} five-star reviews
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: "12px" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase" }}>
                    Published Live
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#059669", mt: 0.5 }}>
                    {stats.approved}
                  </Typography>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <Typography variant="caption" sx={{ color: "text.secondary", mt: 1, display: "block" }}>
                Active on public marquee
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: "12px" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase" }}>
                    Pending Review
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#EA580C", mt: 0.5 }}>
                    {stats.pending}
                  </Typography>
                </div>
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                  <ShieldAlert size={20} />
                </div>
              </div>
              <Typography variant="caption" sx={{ color: "text.secondary", mt: 1, display: "block" }}>
                Awaiting moderator action
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Sleek Enterprise SaaS Search & Filter Control Bar */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "14px",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Top Sub-Bar: Quick Status Tabs & Action Metadata */}
          <Box
            sx={{
              px: { xs: 2, sm: 2.5 },
              py: 1.25,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
              bgcolor: (theme) => theme.palette.mode === "light" ? "#FAFAFA" : "transparent",
            }}
          >
            {/* Status Segmented Tabs */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                p: 0.5,
                borderRadius: "10px",
                backgroundColor: "action.hover",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {[
                { id: "All", label: "All Reviews", count: stats.total },
                { id: "Approved", label: "Live Published", count: stats.approved, dot: "#10B981" },
                { id: "Pending", label: "Pending", count: stats.pending, dot: "#F59E0B", hasAlert: stats.pending > 0 },
              ].map((tab) => {
                const isActive = selectedStatus === tab.id;
                return (
                  <Box
                    component="button"
                    key={tab.id}
                    onClick={() => {
                      setSelectedStatus(tab.id);
                      setPage(0);
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      border: "none",
                      backgroundColor: isActive ? "background.paper" : "transparent",
                      color: isActive ? "text.primary" : "text.secondary",
                      boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        color: "text.primary",
                      },
                    }}
                  >
                    {tab.dot && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: tab.dot,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <span>{tab.label}</span>
                    <Box
                      component="span"
                      sx={{
                        px: 0.75,
                        py: 0.2,
                        borderRadius: "10px",
                        fontSize: "0.6875rem",
                        fontFamily: "monospace",
                        backgroundColor: isActive ? "action.selected" : "action.hover",
                        color: isActive ? "text.primary" : "text.secondary",
                      }}
                    >
                      {tab.count}
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Live Count & Refresh Action */}
            <div className="flex items-center gap-2.5 ml-auto">
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  display: { xs: "none", md: "inline-block" },
                  fontWeight: 500,
                }}
              >
                Showing <strong>{filteredFeedbacks.length}</strong> of <strong>{stats.total}</strong> reviews
              </Typography>

              <Button
                onClick={fetchFeedbacks}
                disabled={loading}
                variant="outlined"
                size="small"
                startIcon={<RefreshCw size={13} className={loading ? "animate-spin text-emerald-500" : ""} />}
                sx={{
                  height: 32,
                  px: 1.5,
                  fontSize: "0.75rem",
                  borderColor: "divider",
                  color: "text.primary",
                  bgcolor: (theme) => theme.palette.mode === "light" ? "#FFFFFF" : "background.paper",
                  "&:hover": {
                    borderColor: "primary.main",
                  },
                }}
              >
                Refresh
              </Button>
            </div>
          </Box>

          {/* Bottom Control Bar: Search Input & Clean Filters */}
          <Box
            sx={{
              p: { xs: 2, sm: 2.25 },
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              alignItems: { xs: "stretch", lg: "center" },
              gap: 1.5,
            }}
          >
            {/* Search Input with Instant Clear */}
            <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 280 } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by visitor name, story keywords, or location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} className="text-slate-400" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSearchTerm("");
                          setPage(0);
                        }}
                        edge="end"
                        sx={{ color: "text.secondary", p: 0.5 }}
                      >
                        <X size={14} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                  sx: { height: 38 },
                }}
              />
            </Box>

            {/* Filters Row */}
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.25 }}>
              {/* Rating Filter */}
              <Select
                size="small"
                value={selectedRating}
                onChange={(e) => {
                  setSelectedRating(e.target.value);
                  setPage(0);
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <Star size={14} className="text-amber-400 shrink-0" />
                  </InputAdornment>
                }
                sx={{ height: 38, minWidth: 140, fontSize: "0.8125rem" }}
              >
                <MenuItem value="All">All Ratings</MenuItem>
                <MenuItem value="5">5 Stars ★★★★★</MenuItem>
                <MenuItem value="4">4 Stars ★★★★☆</MenuItem>
                <MenuItem value="3">3 Stars ★★★☆☆</MenuItem>
                <MenuItem value="2">2 Stars ★★☆☆☆</MenuItem>
                <MenuItem value="1">1 Star ★☆☆☆☆</MenuItem>
              </Select>

              {/* Zone Filter */}
              <Select
                size="small"
                value={selectedZone}
                onChange={(e) => {
                  setSelectedZone(e.target.value);
                  setPage(0);
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <MapPin size={14} className="text-emerald-500 shrink-0" />
                  </InputAdornment>
                }
                sx={{ height: 38, minWidth: 160, fontSize: "0.8125rem" }}
              >
                {ZONES.map((z) => (
                  <MenuItem key={z} value={z}>{z}</MenuItem>
                ))}
              </Select>

              {/* Sort Order */}
              <Select
                size="small"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(0);
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <ArrowUpDown size={14} className="text-slate-400 shrink-0" />
                  </InputAdornment>
                }
                sx={{ height: 38, minWidth: 145, fontSize: "0.8125rem" }}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="rating-high">Highest Rating</MenuItem>
                <MenuItem value="rating-low">Lowest Rating</MenuItem>
              </Select>

              {/* Reset Active Filters Button */}
              {activeFilterCount > 0 && (
                <Button
                  onClick={handleResetFilters}
                  size="small"
                  variant="outlined"
                  startIcon={<RotateCcw size={13} />}
                  sx={{
                    height: 38,
                    px: 1.5,
                    fontSize: "0.75rem",
                    borderColor: "divider",
                    color: "error.main",
                    "&:hover": {
                      borderColor: "error.main",
                      bgcolor: "error.main",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  Reset ({activeFilterCount})
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Content */}
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={12}>
            <CircularProgress size={32} sx={{ color: "#10B981", mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading visitor reviews...
            </Typography>
          </Box>
        ) : filteredFeedbacks.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: "12px" }}>
            <MessageSquareQuote size={40} className="mx-auto mb-2 text-gray-400" />
            <Typography variant="subtitle1" sx={{ color: "text.primary", fontWeight: 600 }}>
              No reviews match the selected filters
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Try clearing search terms or selecting All Statuses.
            </Typography>
          </Paper>
        ) : isMobile ? (
          /* MOBILE: Card Layout */
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {displayedFeedbacks.map((item, idx) => {
              const id = item._id || item.id || idx;
              const isExpanded = expandedId === id;
              const isBusy = updatingId === id;
              const ratingVal = Number(item.rating) || 5;

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
                  {/* Header */}
                  <Box sx={{ p: 2, pb: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, flex: 1 }}>
                      <Box sx={{
                        width: 36, height: 36, borderRadius: "10px",
                        backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#F59E0B",
                        fontWeight: 700, fontSize: "0.8125rem", display: "flex",
                        alignItems: "center", justifyContent: "center", textTransform: "uppercase", flexShrink: 0,
                      }}>
                        {(item.name || "V")[0]}
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "text.primary", lineHeight: 1.3 }}>
                          {item.name}
                        </Typography>
                        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.25 }}>
                          {item.location}{item.visitDate && ` • ${item.visitDate}`}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton size="small" onClick={() => handleDelete(id)} disabled={isBusy} sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}>
                      <Trash2 size={15} />
                    </IconButton>
                  </Box>

                  {/* Rating & Zone */}
                  <Box sx={{ px: 2, pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ display: "flex", gap: 0.25 }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className={s <= ratingVal ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                      ))}
                    </Box>
                    <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary" }}>{ratingVal}.0</Typography>
                    {item.zone && (
                      <Chip label={item.zone} size="small" sx={{ height: 20, fontSize: "0.625rem", fontWeight: 600, backgroundColor: "action.hover", color: "text.secondary" }} />
                    )}
                    <Box sx={{ display: "flex", gap: 0.5, ml: "auto" }}>
                      <Chip
                        onClick={() => handleToggleStatus(item)}
                        disabled={isBusy}
                        label={item.status === "approved" ? "Live" : "Pending"}
                        size="small"
                        clickable
                        sx={{
                          height: 22, fontSize: "0.625rem", fontWeight: 700,
                          backgroundColor: item.status === "approved" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                          color: item.status === "approved" ? "#34D399" : "#FBBF24",
                        }}
                      />
                      <Chip
                        onClick={() => handleToggleVerified(item)}
                        disabled={isBusy}
                        icon={item.isVerified ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                        label={item.isVerified ? "Verified" : "Unverified"}
                        size="small"
                        clickable
                        sx={{
                          height: 22, fontSize: "0.625rem", fontWeight: 600,
                          backgroundColor: item.isVerified ? "rgba(16, 185, 129, 0.12)" : "rgba(107, 114, 128, 0.15)",
                          color: item.isVerified ? "#34D399" : "#9CA3AF",
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Comment */}
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Typography sx={{
                      fontSize: "0.8125rem", color: "text.secondary", lineHeight: 1.5, fontStyle: "italic",
                      display: "-webkit-box", WebkitLineClamp: isExpanded ? "unset" : 3,
                      WebkitBoxOrient: "vertical", overflow: isExpanded ? "visible" : "hidden",
                    }}>
                      "{item.comment}"
                    </Typography>
                    {item.comment && item.comment.length > 90 && (
                      <Box onClick={() => setExpandedId(isExpanded ? null : id)} sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.75, cursor: "pointer", color: "primary.main" }}>
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        <Typography sx={{ fontSize: "0.6875rem", fontWeight: 600 }}>{isExpanded ? "Less" : "Read more"}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "12px", border: "1px solid", borderColor: "divider" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "action.hover" }}>
                  <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>VISITOR</TableCell>
                  <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>RATING & ZONE</TableCell>
                  <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>EXPERIENCE STORY</TableCell>
                  <TableCell align="center" sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>VERIFICATION</TableCell>
                  <TableCell align="center" sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {displayedFeedbacks.map((item, idx) => {
                  const id = item._id || item.id || idx;
                  const isExpanded = expandedId === id;
                  const isBusy = updatingId === id;
                  const ratingVal = Number(item.rating) || 5;

                  return (
                    <TableRow key={id}>
                      {/* Visitor Details */}
                      <TableCell sx={{ minWidth: 170, py: 1.5 }}>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-500 font-bold text-xs flex items-center justify-center border border-amber-500/20 shrink-0 uppercase">
                            {item.name ? item.name[0] : "V"}
                          </div>
                          <div>
                            <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.primary", lineHeight: 1.2 }}>
                              {item.name}
                            </Typography>
                            <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary", mt: 0.25 }}>
                              {item.location && <span>{item.location}</span>}
                              {item.visitDate && <span> • {item.visitDate}</span>}
                            </Typography>
                          </div>
                        </div>
                      </TableCell>

                      {/* Rating & Zone */}
                      <TableCell sx={{ minWidth: 140 }}>
                        <div className="flex items-center gap-1 text-amber-500 mb-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={11}
                              className={s <= ratingVal ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-gray-700"}
                            />
                          ))}
                          <span className="text-[11px] font-bold text-slate-700 dark:text-gray-300 ml-0.5">
                            {ratingVal}.0
                          </span>
                        </div>
                        {item.zone && (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161F30] data-[theme=jungle]:bg-[#0E261A] text-slate-700 dark:text-gray-300 text-[10px] font-medium border border-slate-200 dark:border-gray-700/80">
                            {item.zone}
                          </span>
                        )}
                      </TableCell>

                      {/* Experience Story */}
                      <TableCell sx={{ maxWidth: 360 }}>
                        <p className={`text-xs text-slate-700 dark:text-gray-300 data-[theme=jungle]:text-emerald-100/90 leading-relaxed italic ${!isExpanded ? "line-clamp-2" : ""}`}>
                          "{item.comment}"
                        </p>
                        {item.comment && item.comment.length > 90 && (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : id)}
                            className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline mt-1 font-semibold flex items-center gap-0.5 cursor-pointer"
                          >
                            {isExpanded ? <><span>Show less</span><ChevronUp size={11} /></> : <><span>Read more</span><ChevronDown size={11} /></>}
                          </button>
                        )}
                      </TableCell>

                      {/* Verification Toggle */}
                      <TableCell align="center">
                        <Chip
                          onClick={() => handleToggleVerified(item)}
                          disabled={isBusy}
                          icon={item.isVerified ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                          label={item.isVerified ? "Verified" : "Unverified"}
                          size="small"
                          clickable
                          sx={{
                            backgroundColor: item.isVerified ? "rgba(16, 185, 129, 0.12)" : "rgba(107, 114, 128, 0.15)",
                            color: item.isVerified ? "#34D399" : "#9CA3AF",
                            border: `1px solid ${item.isVerified ? "rgba(16, 185, 129, 0.3)" : "rgba(107, 114, 128, 0.25)"}`,
                            fontWeight: 600,
                            fontSize: "0.6875rem",
                            cursor: "pointer",
                            height: 24,
                          }}
                        />
                      </TableCell>

                      {/* Publication Status Toggle */}
                      <TableCell align="center">
                        <Chip
                          onClick={() => handleToggleStatus(item)}
                          disabled={isBusy}
                          label={item.status === "approved" ? "Live" : "Pending"}
                          size="small"
                          clickable
                          sx={{
                            backgroundColor: item.status === "approved" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                            color: item.status === "approved" ? "#34D399" : "#FBBF24",
                            border: `1px solid ${item.status === "approved" ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                            fontWeight: 700,
                            fontSize: "0.6875rem",
                            cursor: "pointer",
                            height: 24,
                          }}
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right">
                        <Tooltip title="Delete Review">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(id)}
                            disabled={isBusy}
                            sx={{
                              color: "#9CA3AF",
                              "&:hover": {
                                color: "#F87171",
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                              },
                            }}
                          >
                            <Trash2 size={15} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredFeedbacks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: "1px solid #1F2937",
                color: "#9CA3AF",
              }}
            />
          </TableContainer>
        )}

        {/* Mobile Pagination */}
        {isMobile && filteredFeedbacks.length > rowsPerPage && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
            <Button disabled={page === 0} onClick={() => setPage(page - 1)} size="small" variant="outlined" sx={{ borderRadius: "8px", textTransform: "none", minWidth: 44, minHeight: 44 }}>
              Prev
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", px: 2 }}>
              <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                {page + 1} / {Math.ceil(filteredFeedbacks.length / rowsPerPage)}
              </Typography>
            </Box>
            <Button disabled={page >= Math.ceil(filteredFeedbacks.length / rowsPerPage) - 1} onClick={() => setPage(page + 1)} size="small" variant="outlined" sx={{ borderRadius: "8px", textTransform: "none", minWidth: 44, minHeight: 44 }}>
              Next
            </Button>
          </Box>
        )}
      </main>
    </div>
  );
};

export default FeedbackManager;
