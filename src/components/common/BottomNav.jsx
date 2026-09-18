import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import {
  LayoutDashboard,
  Layers,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  MessageSquareQuote,
  Settings,
  LogOut,
  CalendarCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Content", icon: Layers, path: "/content" },
  { label: "Blog", icon: FileText, path: "/blog" },
  { label: "Gallery", icon: ImageIcon, path: "/gallery" },
  { label: "More", icon: Settings, path: "/settings" },
];

const MORE_ITEMS = [
  { label: "Inquiries", icon: MessageSquare, path: "/inquiries" },
  { label: "Reviews", icon: MessageSquareQuote, path: "/feedback" },
  { label: "Bookings", icon: CalendarCheck, path: "/bookings" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isMoreOpen = location.pathname === "/inquiries" || location.pathname === "/feedback" || location.pathname === "/bookings" || location.pathname === "/settings";
  const activePath = location.pathname;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        backgroundColor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        pb: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Main bottom nav */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          height: 60,
          px: 0.5,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path;

          if (item.label === "More") {
            const showActive = isMoreOpen;
            return (
              <Box
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.25,
                  flex: 1,
                  py: 0.5,
                  cursor: "pointer",
                  color: showActive ? "primary.main" : "text.secondary",
                  transition: "color 0.15s ease",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <Icon size={20} strokeWidth={showActive ? 2.4 : 1.8} />
                <Typography
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: showActive ? 700 : 500,
                    lineHeight: 1,
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          }

          return (
            <Box
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.25,
                flex: 1,
                py: 0.5,
                cursor: "pointer",
                color: isActive ? "primary.main" : "text.secondary",
                transition: "color 0.15s ease",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  fontWeight: isActive ? 700 : 500,
                  lineHeight: 1,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export function MobileTopBar() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("adminName") || "Admin";
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        zIndex: 1300,
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <img src="/logo.png" alt="Logo" style={{ width: 28, height: 28, objectFit: "contain" }} onError={(e) => { e.target.style.display = "none"; }} />
        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 700, color: "text.primary" }}>
          Rajaji Safari
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", display: { xs: "none", sm: "block" } }}>
          {adminName}
        </Typography>
        <Box
          onClick={handleLogout}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "8px",
            cursor: "pointer",
            color: "text.secondary",
            "&:hover": { color: "error.main", backgroundColor: "action.hover" },
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <LogOut size={18} />
        </Box>
      </Box>
    </Box>
  );
}
