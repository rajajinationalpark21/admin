import { useState } from "react";
import Header from "../components/common/Header";
import { Save, Key, User, Shield } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/apiClient";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
  useTheme
} from "@mui/material";

export default function Settings() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "Admin Officer",
    email: localStorage.getItem("adminEmail") || "admin@junglesafari.com",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      await api.patch("admin/update-profile", profile);
      localStorage.setItem("adminName", profile.name);
      localStorage.setItem("adminEmail", profile.email);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    setSaving(true);
    try {
      await api.patch("admin/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Admin Profile", icon: User },
    { id: "password", label: "Security & Password", icon: Key },
  ];

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header title="System Settings" subtitle="Manage your officer profile credentials and portal security" />

      <Box sx={{ maxWidth: "1000px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3 }}>
        {/* Segmented Tabs Bar */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            p: 0.5,
            borderRadius: "10px",
            backgroundColor: "action.hover",
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Box
                component="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: "8px",
                  fontSize: "0.8125rem",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: isActive ? "background.paper" : "transparent",
                  color: isActive ? "text.primary" : "text.secondary",
                  boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s ease",
                  "&:hover": { color: "text.primary" },
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </Box>
            );
          })}
        </Box>

        {/* Form Container */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "divider",
            p: { xs: 2.5, sm: 4 },
          }}
        >
          {activeTab === "profile" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography sx={{ fontSize: "1.125rem", fontWeight: 700, color: "text.primary" }}>
                  Officer Profile Information
                </Typography>
                <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5 }}>
                  Update your contact details displayed in the administrative portal.
                </Typography>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                <TextField
                  fullWidth
                  label="Officer Full Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Official Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  size="small"
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
                <Button
                  variant="contained"
                  disabled={saving}
                  onClick={handleProfileSave}
                  startIcon={saving ? <CircularProgress size={16} /> : <Save size={16} />}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "text.primary",
                    color: "background.paper",
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    textTransform: "none",
                    py: 1,
                    px: 2.5,
                    "&:hover": { backgroundColor: "text.primary", opacity: 0.9 },
                  }}
                >
                  {saving ? "Saving Changes..." : "Save Profile"}
                </Button>
              </Box>
            </Box>
          )}

          {activeTab === "password" && (
            <Box component="form" onSubmit={handlePasswordChange} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography sx={{ fontSize: "1.125rem", fontWeight: 700, color: "text.primary" }}>
                  Update Portal Password
                </Typography>
                <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5 }}>
                  Ensure your account is protected with a secure password.
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, maxWidth: "540px" }}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  required
                  size="small"
                />
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  required
                  size="small"
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  required
                  size="small"
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={16} /> : <Key size={16} />}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "text.primary",
                    color: "background.paper",
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    textTransform: "none",
                    py: 1,
                    px: 2.5,
                    "&:hover": { backgroundColor: "text.primary", opacity: 0.9 },
                  }}
                >
                  {saving ? "Updating..." : "Update Password"}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
