import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import { Save, Key, User, Shield, Trash2, PlusCircle, Users, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/apiClient";
import { ADMIN_USERS_GET, ADMIN_USER_CREATE, ADMIN_USER_DELETE } from "../constants/endpoints";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  useTheme
} from "@mui/material";

export default function Settings() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("users");
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

  // --- User management state ---
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get(ADMIN_USERS_GET);
      const list = res.data?.admins || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch {
      toast.error("Failed to load admin users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      toast.error("All fields are required");
      return;
    }
    if (newUser.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setCreating(true);
    try {
      await api.post(ADMIN_USER_CREATE, newUser);
      toast.success("Admin user created successfully");
      setCreateOpen(false);
      setNewUser({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete admin user "${userName}"? This cannot be undone.`)) return;
    try {
      await api.delete(ADMIN_USER_DELETE, { data: { userId } });
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  // --- Existing profile/password handlers ---
  const handleProfileSave = async () => {
    setSaving(true);
    try {
      await api.patch("admin/update-profile", profile);
      localStorage.setItem("adminName", profile.name);
      localStorage.setItem("adminEmail", profile.email);
      toast.success("Profile updated successfully!");
    } catch {
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
    if (passwords.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!");
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
    } catch {
      toast.error("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "users", label: "Manage Users", icon: Users },
    { id: "profile", label: "Admin Profile", icon: User },
    { id: "password", label: "Security & Password", icon: Key },
  ];

  const currentUserId = localStorage.getItem("adminId");

  return (
    <Box sx={{ minHeight: "100%", pb: 6 }}>
      <Header title="System Settings" subtitle="Manage admin users, profile credentials, and portal security" />

      <Box sx={{ maxWidth: "1100px", mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, pt: 3 }}>
        {/* Tabs */}
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
          {/* ===== USERS TAB ===== */}
          {activeTab === "users" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography sx={{ fontSize: "1.125rem", fontWeight: 700, color: "text.primary" }}>
                    Admin Users
                  </Typography>
                  <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", mt: 0.5 }}>
                    Create and manage admin accounts for the portal.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<PlusCircle size={16} />}
                  onClick={() => setCreateOpen(true)}
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
                  Add User
                </Button>
              </Box>

              {loadingUsers ? (
                <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={28} />
                </Box>
              ) : users.length === 0 ? (
                <Box sx={{ py: 8, textAlign: "center" }}>
                  <Typography sx={{ color: "text.secondary" }}>No admin users found.</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "action.hover" }}>
                        <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>
                          USER
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>
                          EMAIL
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>
                          ROLE
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>
                          CREATED
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: "0.6875rem", fontWeight: 700, color: "text.secondary", py: 1.5, letterSpacing: "0.04em" }}>
                          ACTIONS
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((u) => {
                        const uid = u._id || u.id;
                        const isSelf = uid === currentUserId;
                        return (
                          <TableRow key={uid} hover>
                            <TableCell sx={{ py: 1.5 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                <Box
                                  sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: "8px",
                                    backgroundColor: isSelf ? "primary.main" : "action.selected",
                                    color: isSelf ? "primary.contrastText" : "text.primary",
                                    fontWeight: 700,
                                    fontSize: "0.75rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textTransform: "uppercase",
                                    flexShrink: 0,
                                  }}
                                >
                                  {(u.name || "A")[0]}
                                </Box>
                                <Box>
                                  <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.primary" }}>
                                    {u.name}
                                  </Typography>
                                  {isSelf && (
                                    <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary" }}>
                                      (You)
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ py: 1.5 }}>
                              <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                                {u.email}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1.5 }}>
                              <Chip
                                label={u.role || "admin"}
                                size="small"
                                sx={{
                                  fontSize: "0.6875rem",
                                  fontWeight: 600,
                                  height: 22,
                                  backgroundColor: "action.selected",
                                  color: "text.primary",
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 1.5 }}>
                              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                              </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ py: 1.5 }}>
                              {isSelf ? (
                                <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary", fontStyle: "italic" }}>
                                  Current user
                                </Typography>
                              ) : (
                                <Tooltip title="Delete User">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteUser(uid, u.name)}
                                    sx={{
                                      color: "text.secondary",
                                      "&:hover": { color: "error.main", backgroundColor: "action.hover" },
                                    }}
                                  >
                                    <Trash2 size={15} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Create User Dialog */}
              <Dialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: "16px" } }}
              >
                <DialogTitle sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
                  Create New Admin User
                </DialogTitle>
                <DialogContent sx={{ pt: "16px !important" }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      size="small"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      size="small"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      label="Password (min 8 characters)"
                      type="password"
                      size="small"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                  </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                  <Button
                    onClick={() => setCreateOpen(false)}
                    sx={{ textTransform: "none", fontWeight: 600, color: "text.secondary" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    disabled={creating}
                    onClick={handleCreateUser}
                    startIcon={creating ? <CircularProgress size={16} /> : <PlusCircle size={16} />}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 3,
                    }}
                  >
                    {creating ? "Creating..." : "Create User"}
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          )}

          {/* ===== PROFILE TAB ===== */}
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

          {/* ===== PASSWORD TAB ===== */}
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
