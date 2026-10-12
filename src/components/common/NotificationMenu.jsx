import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Badge,
  Popover,
  Typography,
  Tabs,
  Tab,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Bell,
  CalendarCheck,
  MessageSquareQuote,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiClient";
import {
  BOOKINGS_GET,
  FEEDBACK_ADMIN_ALL,
  FEEDBACK_GET_ALL,
} from "../../constants/endpoints";

export default function NotificationMenu() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0: Bookings, 1: Reviews
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  const open = Boolean(anchorEl);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // 1. Fetch bookings
      const bRes = await api.get(BOOKINGS_GET).catch(() => ({ data: {} }));
      const bList = bRes.data?.bookings || bRes.data?.data || [];
      setBookings(Array.isArray(bList) ? bList : []);

      // 2. Fetch reviews
      let rRes;
      try {
        rRes = await api.get(FEEDBACK_ADMIN_ALL);
      } catch {
        rRes = await api.get(FEEDBACK_GET_ALL).catch(() => ({ data: {} }));
      }
      const rList = rRes.data?.feedbacks || rRes.data?.data || [];
      setReviews(Array.isArray(rList) ? rList : []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Filter pending / new items for badges
  const newBookings = bookings.filter(
    (b) => b.status === "not_viewed" || b.status === "new" || !b.status
  );
  const pendingReviews = reviews.filter(
    (r) => r.status === "pending" || r.status !== "approved"
  );
  const totalUnread = newBookings.length + pendingReviews.length;

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: open ? "action.hover" : "background.paper",
          p: 0.85,
          color: "text.primary",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "text.secondary",
            backgroundColor: "action.hover",
          },
        }}
      >
        <Badge
          badgeContent={totalUnread}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.625rem",
              height: 16,
              minWidth: 16,
              fontWeight: 700,
            },
          }}
        >
          <Bell size={16} />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1.25,
            width: { xs: 320, sm: 380 },
            maxHeight: 520,
            borderRadius: "16px",
            boxShadow: "0 14px 40px -10px rgba(0,0,0,0.18)",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header Title */}
        <Box
          sx={{
            px: 2.5,
            py: 1.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "0.9375rem", fontWeight: 700 }}>
              Activity Notifications
            </Typography>
            {totalUnread > 0 && (
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: "12px",
                  backgroundColor: "rgba(239, 68, 68, 0.12)",
                  color: "#ef4444",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                }}
              >
                {totalUnread} new
              </Box>
            )}
          </Box>
          {loading && <CircularProgress size={14} thickness={5} />}
        </Box>

        {/* Tabs: Bookings vs Reviews */}
        <Box sx={{ borderBottom: "1px solid", borderColor: "divider", px: 1 }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            textColor="inherit"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{
              minHeight: 40,
              "& .MuiTab-root": {
                minHeight: 40,
                py: 0.5,
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "none",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.85,
              },
            }}
          >
            <Tab
              icon={<CalendarCheck size={14} />}
              label={`Bookings (${newBookings.length})`}
            />
            <Tab
              icon={<MessageSquareQuote size={14} />}
              label={`Reviews (${pendingReviews.length})`}
            />
          </Tabs>
        </Box>

        {/* Notification List Container */}
        <Box sx={{ overflowY: "auto", flex: 1, py: 1 }}>
          {activeTab === 0 ? (
            /* TAB 0: BOOKINGS */
            bookings.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <CalendarCheck size={28} className="mx-auto text-gray-400 mb-2 opacity-50" />
                <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                  No safari bookings found
                </Typography>
              </Box>
            ) : (
              bookings.slice(0, 5).map((item) => {
                const isUnviewed = item.status === "not_viewed" || item.status === "new" || !item.status;
                return (
                  <Box
                    key={item._id || item.id}
                    onClick={() => {
                      handleClose();
                      navigate("/bookings");
                    }}
                    sx={{
                      px: 2.25,
                      py: 1.5,
                      cursor: "pointer",
                      transition: "background-color 0.15s",
                      backgroundColor: isUnviewed ? "rgba(245, 158, 11, 0.06)" : "transparent",
                      borderLeft: isUnviewed ? "3px solid #f59e0b" : "3px solid transparent",
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <Typography sx={{ fontSize: "0.8125rem", fontWeight: 700, color: "text.primary" }}>
                        {item.name || "Guest Booking"}
                      </Typography>
                      <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary" }}>
                        {item.zone || "Safari Zone"}
                      </Typography>
                    </Box>

                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.25 }}>
                      Date: <strong style={{ color: "inherit" }}>{item.date || "Upcoming"}</strong> • Slot: {item.slot || item.shift || "Morning"}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.75 }}>
                      <span
                        style={{
                          fontSize: "0.625rem",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor: isUnviewed ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
                          color: isUnviewed ? "#d97706" : "#10b981",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.status === "viewed" ? "Viewed" : "Not Viewed"}
                      </span>
                      <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary" }}>
                        {item.persons || 1} guest(s)
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            )
          ) : (
            /* TAB 1: REVIEWS */
            reviews.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <MessageSquareQuote size={28} className="mx-auto text-gray-400 mb-2 opacity-50" />
                <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                  No visitor reviews found
                </Typography>
              </Box>
            ) : (
              reviews.slice(0, 5).map((item) => {
                const isPending = item.status === "pending" || item.status !== "approved";
                return (
                  <Box
                    key={item._id || item.id}
                    onClick={() => {
                      handleClose();
                      navigate("/feedback");
                    }}
                    sx={{
                      px: 2.25,
                      py: 1.5,
                      cursor: "pointer",
                      transition: "background-color 0.15s",
                      backgroundColor: isPending ? "rgba(245, 158, 11, 0.05)" : "transparent",
                      borderLeft: isPending ? "3px solid #f59e0b" : "3px solid transparent",
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <Typography sx={{ fontSize: "0.8125rem", fontWeight: 700, color: "text.primary" }}>
                        {item.name || "Anonymous Visitor"}
                      </Typography>
                      <Typography sx={{ fontSize: "0.6875rem", color: "#f59e0b", fontWeight: 700 }}>
                        ★ {item.rating || 5}.0
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        mt: 0.25,
                        fontStyle: "italic",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      "{item.comment || "Great safari experience!"}"
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.75 }}>
                      <span
                        style={{
                          fontSize: "0.625rem",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor: isPending ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
                          color: isPending ? "#d97706" : "#10b981",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.status === "approved" ? "Live" : "Pending Review"}
                      </span>
                      {item.isVerified && (
                        <span style={{ fontSize: "0.625rem", fontWeight: 600, color: "#10b981" }}>
                          ✓ Verified
                        </span>
                      )}
                    </Box>
                  </Box>
                );
              })
            )
          )}
        </Box>

        <Divider />

        {/* Footer Link to Dedicated Page */}
        <Box sx={{ p: 1.25, backgroundColor: "action.hover", textAlign: "center" }}>
          <Button
            size="small"
            onClick={() => {
              handleClose();
              navigate(activeTab === 0 ? "/bookings" : "/feedback");
            }}
            endIcon={<ArrowRight size={13} />}
            sx={{
              textTransform: "none",
              fontSize: "0.75rem",
              fontWeight: 700,
              width: "100%",
              color: "text.primary",
            }}
          >
            {activeTab === 0 ? "Manage All Safari Bookings" : "Moderate All Visitor Reviews"}
          </Button>
        </Box>
      </Popover>
    </>
  );
}
