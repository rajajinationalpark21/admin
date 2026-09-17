import { useEffect, useState } from "react";
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
  Paper,
  Chip,
  CircularProgress,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme
} from "@mui/material";
import {
  FileText,
  Image as ImageIcon,
  MessageSquare,
  MessageSquareQuote,
  ArrowUpRight,
  ChevronDown,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/apiClient";

// Vartaman AI style PurchaseCard
const KpiCard = ({ icon: Icon, title, value, iconBg, iconColor, linkTo }) => {
  return (
    <Box
      component={Link}
      to={linkTo}
      sx={{
        flex: 1,
        minWidth: { xs: "100%", sm: "240px" },
        backgroundColor: "background.paper",
        borderRadius: "12px",
        p: { xs: 2, sm: 2.25 },
        border: "1px solid",
        borderColor: "divider",
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.15s ease",
        "&:hover": {
          borderColor: "text.secondary",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "10px",
              backgroundColor: iconBg || "action.hover",
              color: iconColor || "text.primary",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={18} />
          </Box>
          <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500, color: "text.secondary" }}>
            {title}
          </Typography>
        </Box>
        <ArrowUpRight size={16} style={{ opacity: 0.4 }} />
      </Box>

      <Box sx={{ mt: "auto" }}>
        <Typography sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" }, fontWeight: 700, color: "text.primary", letterSpacing: "-0.02em" }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default function Dashboard() {
  const theme = useTheme();
  const [stats, setStats] = useState({
    blogs: 0,
    gallery: 0,
    inquiries: 0,
    feedbacks: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time range selector
  const [timeRange, setTimeRange] = useState("31 days");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogRes, galleryRes, inquiryRes, feedbackRes] = await Promise.allSettled([
          api.get("blogs/get"),
          api.get("gallery/get"),
          api.get("contact/get"),
          api.get("feedback/get"),
        ]);

        const blogs = blogRes.status === "fulfilled" ? (blogRes.value.data?.blogs || blogRes.value.data?.data || []) : [];
        const gallery = galleryRes.status === "fulfilled" ? (galleryRes.value.data?.images || galleryRes.value.data?.data || []) : [];
        const inquiries = inquiryRes.status === "fulfilled" ? (inquiryRes.value.data?.inquiries || inquiryRes.value.data?.data || []) : [];
        const feedbacks = feedbackRes.status === "fulfilled" ? (feedbackRes.value.data?.feedbacks || feedbackRes.value.data?.data || []) : [];

        setStats({
          blogs: Array.isArray(blogs) ? blogs.length : 0,
          gallery: Array.isArray(gallery) ? gallery.length : 0,
          inquiries: Array.isArray(inquiries) ? inquiries.length : 0,
          feedbacks: Array.isArray(feedbacks) ? feedbacks.length : 0,
        });

        if (Array.isArray(inquiries)) {
          setRecentInquiries(inquiries.slice(0, 5));
        }
        if (Array.isArray(feedbacks)) {
          setRecentFeedbacks(feedbacks.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header />

      <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3 }}>
        {/* Top Overview Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, color: "text.primary" }}>
              Overview
            </Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.25 }}>
              Live metrics and incoming visitor interactions across Rajaji National Park.
            </Typography>
          </Box>

          {/* Time Filter Button */}
          <Box>
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              endIcon={<ChevronDown size={14} />}
              startIcon={<Calendar size={14} />}
              sx={{
                borderRadius: "12px",
                borderColor: "divider",
                color: "text.primary",
                backgroundColor: "background.paper",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.8125rem",
                py: 0.75,
                px: 1.5,
                "&:hover": { borderColor: "text.secondary", backgroundColor: "action.hover" },
              }}
            >
              {timeRange}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: {
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  minWidth: 140,
                },
              }}
            >
              {["7 days", "14 days", "31 days", "All time"].map((period) => (
                <MenuItem
                  key={period}
                  selected={timeRange === period}
                  onClick={() => {
                    setTimeRange(period);
                    setAnchorEl(null);
                  }}
                  sx={{ fontSize: "0.8125rem", fontWeight: timeRange === period ? 600 : 400 }}
                >
                  {period}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>

        {/* 4 KPI Cards (Vartaman AI style) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
            gap: 2,
            mb: 3.5,
          }}
        >
          <KpiCard
            icon={MessageSquareQuote}
            title="Visitor Feedback"
            value={loading ? "..." : stats.feedbacks}
            iconBg="rgba(16, 185, 129, 0.12)"
            iconColor="#10B981"
            linkTo="/feedback"
          />
          <KpiCard
            icon={MessageSquare}
            title="Contact Inquiries"
            value={loading ? "..." : stats.inquiries}
            iconBg="rgba(59, 130, 246, 0.12)"
            iconColor="#3B82F6"
            linkTo="/inquiries"
          />
          <KpiCard
            icon={FileText}
            title="Published Blogs"
            value={loading ? "..." : stats.blogs}
            iconBg="rgba(249, 115, 22, 0.12)"
            iconColor="#F97316"
            linkTo="/blog"
          />
          <KpiCard
            icon={ImageIcon}
            title="Gallery Captures"
            value={loading ? "..." : stats.gallery}
            iconBg="rgba(139, 92, 246, 0.12)"
            iconColor="#8B5CF6"
            linkTo="/gallery"
          />
        </Box>

        {/* Two Tables Grid: Recent Inquiries & Recent Feedback */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 3 }}>
          {/* Recent Inquiries Table */}
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                px: 2.5,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "0.9375rem", fontWeight: 700, color: "text.primary" }}>
                  Recent Inquiries
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                  Visitor questions and safari permit requests
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/inquiries"
                size="small"
                sx={{
                  textTransform: "none",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                View all
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "action.hover" }}>
                    <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.25 }}>VISITOR</TableCell>
                    <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.25 }}>DATE</TableCell>
                    <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.25 }}>STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                        <CircularProgress size={20} />
                      </TableCell>
                    </TableRow>
                  ) : recentInquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: "text.secondary", fontSize: "0.8125rem" }}>
                        No inquiries received yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentInquiries.map((inq) => (
                      <TableRow key={inq._id || inq.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.primary" }}>
                            {inq.name || "Anonymous"}
                          </Typography>
                          <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary" }}>
                            {inq.email || inq.phone}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : "Recent"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={inq.status || "New"}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.6875rem",
                              fontWeight: 600,
                              borderRadius: "6px",
                              backgroundColor: inq.status === "Replied" ? "rgba(16,185,129,0.12)" : "action.hover",
                              color: inq.status === "Replied" ? "#10B981" : "text.secondary",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Recent Feedback Table */}
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                px: 2.5,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "0.9375rem", fontWeight: 700, color: "text.primary" }}>
                  Visitor Feedback
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                  Verified guest testimonials and star ratings
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/feedback"
                size="small"
                sx={{
                  textTransform: "none",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                View all
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "action.hover" }}>
                    <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.25 }}>GUEST</TableCell>
                    <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.25 }}>RATING</TableCell>
                    <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.25 }}>STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                        <CircularProgress size={20} />
                      </TableCell>
                    </TableRow>
                  ) : recentFeedbacks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: "text.secondary", fontSize: "0.8125rem" }}>
                        No feedback submitted yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentFeedbacks.map((fb) => (
                      <TableRow key={fb._id || fb.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.primary" }}>
                            {fb.name || "Guest"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.6875rem",
                              color: "text.secondary",
                              maxWidth: 180,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {fb.feedback || fb.comment || "Safari experience"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Star size={13} fill="#F59E0B" color="#F59E0B" />
                            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                              {fb.rating || 5}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={fb.status || (fb.isApproved ? "Approved" : "Pending")}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.6875rem",
                              fontWeight: 600,
                              borderRadius: "6px",
                              backgroundColor: (fb.status === "Approved" || fb.isApproved) ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                              color: (fb.status === "Approved" || fb.isApproved) ? "#10B981" : "#F59E0B",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
