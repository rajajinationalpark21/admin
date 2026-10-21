import { useState } from "react";
import { Box, Typography, TextField, Button, InputAdornment, IconButton, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, MapPin } from "lucide-react";
import api from "../api/apiClient";

// Colours taken from the Rajaji National Park logo.
const FOREST = "#1f4a2c";
const FOREST_DARK = "#163a22";
const OLIVE = "#7d8a3c";
const PAPER = "#f7f5ed";
const NIGHT = "#07120a";
const SERIF = '"Playfair Display", Georgia, serif';

const fieldSx = (dark) => ({
  "& .MuiOutlinedInput-input": { py: "14px", fontSize: "0.95rem" },
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    fontSize: "0.95rem",
    bgcolor: dark ? "rgba(255,255,255,0.04)" : "#fffefa",
    "& fieldset": { borderColor: dark ? "rgba(167,243,208,0.18)" : "rgba(31,74,44,0.22)" },
    "&:hover fieldset": { borderColor: dark ? "rgba(167,243,208,0.4)" : "rgba(31,74,44,0.45)" },
    "&.Mui-focused fieldset": { borderColor: dark ? "#6ee7b7" : FOREST, borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: dark ? "#6ee7b7" : FOREST },
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(val)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (val) => {
    if (!val) {
      setPasswordError("Password is required");
      return false;
    } else if (val.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setAuthError("");

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) return;

    setLoading(true);
    try {
      const res = await api.post("admin/login", { email, password });

      if (res?.data?.token) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("adminEmail", res.data.admin?.email || email);
        localStorage.setItem("adminName", res.data.admin?.name || "Administrator");
        if (res.data.admin?.id) {
          localStorage.setItem("adminId", res.data.admin.id);
        }
        navigate("/dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Invalid credentials. Please verify your email and password.";
      setAuthError(msg);
    } finally {
      setLoading(false);
    }
  };

  const sessionExpired = window.location.search.includes("session=expired") && !authError;

  return (
    <Box
      sx={(theme) => {
        const dark = theme.palette.mode === "dark";
        return {
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: "100dvh",
          bgcolor: dark ? NIGHT : PAPER,
          color: dark ? "#ecfdf5" : "#14231a",
          "& p": { mb: 0 },
        };
      }}
    >
      {/* Photo: the Gohri zone riverbed with a safari jeep */}
      <Box
        sx={{
          position: "relative",
          flex: { md: "1 1 55%" },
          order: { xs: 0, md: 1 },
          height: { xs: 200, sm: 260, md: "auto" },
          minHeight: { md: "100dvh" },
          overflow: "hidden",
          bgcolor: "#5f6b4f",
        }}
      >
        <Box
          component="img"
          src="/login-jungle.jpg"
          alt="A safari jeep crossing the riverbed in the Gohri zone, Rajaji National Park"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }}
        />
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            background: {
              xs: "linear-gradient(180deg, rgba(7,18,10,0.05) 40%, rgba(7,18,10,0.55) 100%)",
              md: "linear-gradient(180deg, rgba(7,18,10,0) 45%, rgba(7,18,10,0.78) 100%)",
            },
          }}
        />
        <Box sx={{ position: "absolute", left: { xs: 20, md: 48 }, right: { xs: 20, md: 48 }, bottom: { xs: 16, md: 44 }, color: "#fff" }}>
          <Typography
            sx={{
              display: { xs: "none", md: "block" },
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: { md: "2rem", lg: "2.4rem" },
              lineHeight: 1.15,
              maxWidth: 520,
              textWrap: "balance",
              mb: 1.5,
            }}
          >
            Forests, rivers and wildlife of the Shiwalik foothills.
          </Typography>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, fontSize: { xs: "0.75rem", md: "0.85rem" }, opacity: 0.92 }}>
            <MapPin size={15} />
            <span>Gohri Zone · Rajaji Tiger Reserve, Uttarakhand</span>
          </Box>
        </Box>
      </Box>

      {/* Sign-in panel */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={(theme) => ({
          position: "relative",
          flex: { xs: "1 1 auto", md: "1 1 45%" },
          order: { xs: 1, md: 0 },
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          px: { xs: 2, sm: 5, lg: 8 },
          pt: { xs: 3, md: 5 },
          pb: { xs: 3, md: 4 },
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: theme.palette.mode === "dark" ? "url('/login-leaves-dark.jpg')" : "url('/login-leaves.jpg')",
            backgroundSize: "420px auto",
            backgroundRepeat: "repeat",
            opacity: theme.palette.mode === "dark" ? 0.1 : 0.07,
            pointerEvents: "none",
          },
        })}
      >
        <Box sx={{ position: "relative", width: "100%", maxWidth: 400, mx: "auto", my: "auto", display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Logo: its white background disappears on paper (multiply); on dark it sits on a cream plaque */}
          <Box
            sx={(theme) => ({
              alignSelf: "flex-start",
              ...(theme.palette.mode === "dark" && { bgcolor: PAPER, borderRadius: "16px", px: 1.5, py: 1 }),
            })}
          >
            <Box
              component="img"
              src="/logo-full.png"
              alt="Rajaji National Park"
              sx={(theme) => ({
                display: "block",
                height: { xs: 60, sm: 68 },
                width: "auto",
                mixBlendMode: theme.palette.mode === "dark" ? "normal" : "multiply",
              })}
            />
          </Box>

          <Box sx={{ mt: 1 }}>
            <Typography
              sx={(theme) => ({
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: theme.palette.mode === "dark" ? "#a3b86c" : OLIVE,
                mb: 0.75,
              })}
            >
              Admin panel
            </Typography>
            <Typography
              component="h1"
              sx={(theme) => ({
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: { xs: "1.75rem", sm: "2rem" },
                lineHeight: 1.2,
                color: theme.palette.mode === "dark" ? "#ecfdf5" : FOREST_DARK,
              })}
            >
              Welcome back
            </Typography>
            <Typography sx={(theme) => ({ mt: 1, fontSize: "0.92rem", lineHeight: 1.6, color: theme.palette.mode === "dark" ? "rgba(236,253,245,0.7)" : "#4b5a4f" })}>
              Sign in to manage the website's pages, bookings, enquiries and photos.
            </Typography>
          </Box>

          {sessionExpired && (
            <Alert severity="info" sx={{ borderRadius: "12px", py: 0.25 }}>
              Your session has ended. Please sign in again.
            </Alert>
          )}

          {authError && (
            <Alert severity="error" sx={{ borderRadius: "12px", py: 0.25 }}>
              {authError}
            </Alert>
          )}

          <TextField
            type="email"
            label="Email"
            autoComplete="username"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            error={!!emailError}
            helperText={emailError}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={17} />
                  </InputAdornment>
                ),
              },
            }}
            sx={(theme) => fieldSx(theme.palette.mode === "dark")}
          />

          <TextField
            type={showPassword ? "text" : "password"}
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            error={!!passwordError}
            helperText={passwordError}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={17} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      sx={{ color: "text.secondary" }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={(theme) => fieldSx(theme.palette.mode === "dark")}
          />

          <Button
            type="submit"
            disabled={!email || !password || !!emailError || !!passwordError || loading}
            startIcon={loading ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : null}
            sx={(theme) => ({
              mt: 0.5,
              width: "100%",
              py: 1.4,
              borderRadius: "14px",
              bgcolor: theme.palette.mode === "dark" ? "#34d399" : FOREST,
              color: theme.palette.mode === "dark" ? NIGHT : "#fff",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.95rem",
              boxShadow: "0 8px 20px -10px rgba(31,74,44,0.7)",
              transition: "background-color 0.2s ease, transform 0.15s ease",
              "&:hover": { bgcolor: theme.palette.mode === "dark" ? "#6ee7b7" : FOREST_DARK },
              "&:active": { transform: "scale(0.98)" },
              "&:focus-visible": { outline: `3px solid ${theme.palette.mode === "dark" ? "#6ee7b7" : OLIVE}`, outlineOffset: 2 },
              "&.Mui-disabled": {
                bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(31,74,44,0.14)",
                color: theme.palette.mode === "dark" ? "rgba(236,253,245,0.4)" : "rgba(20,35,26,0.45)",
                boxShadow: "none",
              },
            })}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <Typography sx={(theme) => ({ fontSize: "0.84rem", lineHeight: 1.55, color: theme.palette.mode === "dark" ? "rgba(236,253,245,0.6)" : "#5b685f" })}>
            No account yet? The panel owner adds new admins from Settings → Manage Users.
          </Typography>
        </Box>

        <Typography
          sx={(theme) => ({
            position: "relative",
            textAlign: "center",
            pt: 4,
            fontSize: "0.75rem",
            color: theme.palette.mode === "dark" ? "rgba(236,253,245,0.45)" : "#7a857d",
          })}
        >
          Rajaji National Park · Safari booking assistance
        </Typography>
      </Box>
    </Box>
  );
}
