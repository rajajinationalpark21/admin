import React from "react";
import { Box, Typography, Button, IconButton, Tooltip } from "@mui/material";
import { Search, ExternalLink, ShieldCheck } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/dashboard": "Dashboard Overview",
  "/content": "Park Content Manager",
  "/blog": "Wilderness Blog",
  "/gallery": "Photo Gallery",
  "/inquiries": "Contact Inquiries",
  "/feedback": "Visitor Feedback",
  "/settings": "System Settings",
};

export default function Header({ title, subtitle }) {
  const location = useLocation();
  const currentTitle = title || PAGE_TITLES[location.pathname] || "Admin Console";
  const adminName = localStorage.getItem("adminName") || "Admin";

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        transition: "background-color 0.2s, border-color 0.2s",
      }}
    >
      <Box
        sx={{
          maxWidth: "1400px",
          mx: "auto",
          px: { xs: 2, sm: 3, lg: 4 },
          py: 1.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Left: Breadcrumbs & Greeting */}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "text.secondary",
              letterSpacing: "0.01em",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mb: 0.25,
            }}
          >
            <span>safari /</span>
            <span style={{ fontWeight: 600, color: "inherit" }}>
              {currentTitle}
            </span>
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1.125rem", sm: "1.25rem" },
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            <span style={{ fontWeight: 400 }}>Hi, </span>
            <span>{adminName}</span>
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.25 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Right Action Bar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
          {/* Live Website Link */}
          <Button
            component="a"
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            size="small"
            startIcon={<ExternalLink size={14} />}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              textTransform: "none",
              fontSize: "0.8125rem",
              fontWeight: 600,
              borderRadius: "12px",
              borderColor: "divider",
              color: "text.primary",
              backgroundColor: "background.paper",
              py: 0.75,
              px: 1.5,
              "&:hover": {
                borderColor: "text.secondary",
                backgroundColor: "action.hover",
              },
            }}
          >
            View Live Site
          </Button>

          {/* Theme Selector Popover Dropdown */}
          <ThemeSelector />
        </Box>
      </Box>
    </Box>
  );
}
