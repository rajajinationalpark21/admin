import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Drawer
} from "@mui/material";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  MessageSquareQuote,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  X,
  Compass,
  Layers,
  CalendarCheck
} from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const COLLAPSED_WIDTH = 68;
const EXPANDED_WIDTH = 230;

const NAV_SECTIONS = [
  {
    group: "OVERVIEW",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    ],
  },
  {
    group: "CONTENT & PARK",
    items: [
      { label: "Park Content", icon: Layers, path: "/content" },
      { label: "Wilderness Blog", icon: FileText, path: "/blog" },
      { label: "Photo Gallery", icon: ImageIcon, path: "/gallery" },
    ],
  },
  {
    group: "VISITOR SERVICES",
    items: [
      { label: "Contact Inquiries", icon: MessageSquare, path: "/inquiries", badge: "Inbox" },
      { label: "Visitor Feedback", icon: MessageSquareQuote, path: "/feedback", badge: "Live" },
      { label: "Safari Bookings", icon: CalendarCheck, path: "/bookings" },
    ],
  },
  {
    group: "SYSTEM",
    items: [
      { label: "Settings", icon: Settings, path: "/settings" },
    ],
  },
];

const NavigationLabel = ({ icon: Icon, label, isActive, collapsed, badge, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        height: 40,
        px: collapsed ? 0 : 1.5,
        my: 0.35,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: isActive ? "action.selected" : "transparent",
        color: isActive ? "text.primary" : "text.secondary",
        transition: "all 0.15s ease",
        "&:hover": {
          backgroundColor: "action.hover",
          color: "text.primary",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          mr: collapsed ? 0 : 1.25,
          color: isActive ? "text.primary" : "text.secondary",
          shrink: 0,
        }}
      >
        <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
      </Box>

      {!collapsed && (
        <>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: isActive ? 600 : 450,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
            }}
          >
            {label}
          </Typography>
          {badge && (
            <Chip
              label={badge}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.6875rem",
                fontWeight: 600,
                borderRadius: "6px",
                px: 0.5,
                backgroundColor: isActive ? "text.primary" : "action.hover",
                color: isActive ? "background.paper" : "text.secondary",
                border: "none",
                "& .MuiChip-label": { px: 0.5 },
              }}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("safari_sidebar_collapsed");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("safari_sidebar_collapsed", JSON.stringify(next));
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const adminName = localStorage.getItem("adminName") || "Admin Officer";
  const adminEmail = localStorage.getItem("adminEmail") || "wildbrookrajaji@gmail.com";

  const renderContent = (isDrawer = false) => {
    const isCollapsed = isDrawer ? false : collapsed;
    const currentWidth = isDrawer ? 240 : (isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH);

    return (
      <Box
        sx={{
          width: currentWidth,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
          boxSizing: "border-box",
          transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
        }}
      >
        {/* Brand Header */}
        <Box
          sx={{
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            px: isCollapsed ? 1 : 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <Box
            component={Link}
            to="/dashboard"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              textDecoration: "none",
              color: "inherit",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "action.hover",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src="/logo.png"
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </Box>
            {!isCollapsed && (
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: "0.9375rem",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "text.primary",
                    lineHeight: 1.15,
                    whiteSpace: "nowrap",
                  }}
                >
                  Rajaji Safari
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    color: "text.secondary",
                    lineHeight: 1,
                    letterSpacing: "0.02em",
                  }}
                >
                  Portal Console
                </Typography>
              </Box>
            )}
          </Box>

          {!isCollapsed && !isDrawer && (
            <IconButton
              size="small"
              onClick={toggleCollapse}
              sx={{
                color: "text.secondary",
                borderRadius: "6px",
                p: 0.5,
                "&:hover": { color: "text.primary", backgroundColor: "action.hover" },
              }}
            >
              <ChevronsLeft size={16} />
            </IconButton>
          )}
        </Box>

        {/* Navigation Items */}
        <Box
          sx={{
            flex: 1,
            px: isCollapsed ? 1 : 1.5,
            py: 1.5,
            overflowY: "auto",
            overflowX: "hidden",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {NAV_SECTIONS.map((section, idx) => (
            <Box key={section.group} sx={{ mb: 2 }}>
              {!isCollapsed && (
                <Typography
                  sx={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "text.secondary",
                    px: 1,
                    mb: 0.5,
                  }}
                >
                  {section.group}
                </Typography>
              )}
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                const content = (
                  <NavigationLabel
                    icon={item.icon}
                    label={item.label}
                    isActive={isActive}
                    collapsed={isCollapsed}
                    badge={item.badge}
                    onClick={() => {
                      navigate(item.path);
                      if (isDrawer) setMobileOpen(false);
                    }}
                  />
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.path} title={item.label} placement="right" arrow>
                      <Box>{content}</Box>
                    </Tooltip>
                  );
                }
                return <Box key={item.path}>{content}</Box>;
              })}
            </Box>
          ))}
        </Box>

        {/* Collapsed Toggle Button at Bottom when collapsed */}
        {isCollapsed && !isDrawer && (
          <Box sx={{ p: 1, display: "flex", justifyContent: "center", borderTop: "1px solid", borderColor: "divider" }}>
            <IconButton
              size="small"
              onClick={toggleCollapse}
              sx={{
                color: "text.secondary",
                borderRadius: "6px",
                p: 0.75,
                "&:hover": { color: "text.primary", backgroundColor: "action.hover" },
              }}
            >
              <ChevronsRight size={18} />
            </IconButton>
          </Box>
        )}

        {/* Bottom User Card */}
        <Box
          sx={{
            p: isCollapsed ? 1 : 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            gap: 1,
          }}
        >
          {isCollapsed ? (
            <Tooltip title={`Sign Out (${adminName})`} placement="right" arrow>
              <IconButton
                size="small"
                onClick={handleLogout}
                sx={{
                  color: "error.main",
                  borderRadius: "8px",
                  p: 0.75,
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <LogOut size={18} />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, flex: 1 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    backgroundColor: "text.primary",
                    color: "background.paper",
                  }}
                >
                  {adminName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "text.primary",
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {adminName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.6875rem",
                      color: "text.secondary",
                      lineHeight: 1.1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {adminEmail}
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Sign Out" arrow>
                <IconButton
                  size="small"
                  onClick={handleLogout}
                  sx={{
                    color: "text.secondary",
                    borderRadius: "6px",
                    p: 0.75,
                    "&:hover": { color: "error.main", backgroundColor: "action.hover" },
                  }}
                >
                  <LogOut size={16} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>
    );
  };

  // Mobile Top Bar + Drawer
  if (isMobile) {
    return (
      <>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 56,
            zIndex: 1200,
            backgroundColor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <IconButton
              size="small"
              onClick={() => setMobileOpen(true)}
              sx={{ color: "text.primary", p: 0.75 }}
            >
              <Menu size={20} />
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src="/logo.png" alt="Logo" style={{ width: 24, height: 24, objectFit: "contain" }} />
              <Typography sx={{ fontSize: "0.9375rem", fontWeight: 700, color: "text.primary" }}>
                Rajaji Safari
              </Typography>
            </Box>
          </Box>

          <IconButton
            size="small"
            onClick={handleLogout}
            sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
          >
            <LogOut size={18} />
          </IconButton>
        </Box>

        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: "background.paper",
              backgroundImage: "none",
            },
          }}
        >
          {renderContent(true)}
        </Drawer>
      </>
    );
  }

  // Desktop Static Sidebar
  return renderContent(false);
}
