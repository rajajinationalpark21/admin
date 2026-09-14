import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import api from "../api/apiClient";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("admin/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("adminEmail", res.data.admin.email);
        localStorage.setItem("adminName", res.data.admin.name);
        navigate("/dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#080c09]">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-[#0a1510] to-[#060a07]" />
        
        {/* Animated Mesh */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mesh-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#059669" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="url(#mesh-gradient)" strokeWidth="0.5" opacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative"
          >
            {/* Outer Ring */}
            <div className="w-80 h-80 rounded-full border border-emerald-500/10" />
            <div className="absolute inset-4 rounded-full border border-emerald-500/15" />
            <div className="absolute inset-8 rounded-full border border-emerald-500/20" />
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-600/10 backdrop-blur-sm border border-emerald-500/20 flex items-center justify-center"
              >
                <svg className="w-14 h-14 text-emerald-400/80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 2 4 6h-3l4 6h-3l3 6H4l3-6H4l4-6H5l7-6z" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Rajaji National Park
            </h2>
            <p className="text-emerald-300/70 text-lg max-w-md leading-relaxed">
              Managing 820 sq km of pristine wilderness. Home to 500+ elephants, 51 tigers, and 400+ bird species.
            </p>
            <div className="flex gap-8 mt-8">
              <div>
                <p className="text-3xl font-bold text-emerald-400">820+</p>
                <p className="text-sm text-gray-500">Sq. Km Area</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-400">500+</p>
                <p className="text-sm text-gray-500">Elephants</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-400">400+</p>
                <p className="text-sm text-gray-500">Bird Species</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-emerald-950/5 to-transparent" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden text-center mb-10"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-900/50">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="m12 2 4 6h-3l4 6h-3l3 6H4l3-6H4l4-6H5l7-6z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Jungle Safari</h1>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-400">Sign in to your admin account</p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
              >
                <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-emerald-500/30' : ''}`}>
                <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'email' ? 'text-emerald-400' : 'text-gray-500'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-[#0f1813] text-white border border-emerald-900/30 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
                  placeholder="admin@junglesafari.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-emerald-500/30' : ''}`}>
                <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'password' ? 'text-emerald-400' : 'text-gray-500'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-[#0f1813] text-white border border-emerald-900/30 rounded-xl pl-12 pr-12 py-4 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-[#0f1813] text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:from-emerald-500 hover:to-green-500 hover:shadow-lg hover:shadow-emerald-900/50 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 group"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 pt-6 border-t border-emerald-900/20"
          >
            <p className="text-center text-xs text-gray-600">
              Protected area. Authorized personnel only.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
