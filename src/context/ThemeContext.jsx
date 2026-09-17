import React, { createContext, useContext, useState, useEffect } from "react";

export const THEMES = {
  light: {
    id: "light",
    name: "Light (Black & White)",
    description: "Crisp white background with high-contrast black typography",
    mode: "light",
    bgClass: "bg-white text-black",
    sidebarClass: "bg-white border-zinc-200 text-zinc-900",
    headerClass: "bg-white border-zinc-200 text-black",
    cardClass: "bg-white border-zinc-200 text-black",
    activeClass: "bg-black text-white font-bold border-l-4 border-black shadow-xs",
    hoverClass: "hover:bg-zinc-100 text-zinc-700 hover:text-black",
    accent: "#000000",
  },
  dark: {
    id: "dark",
    name: "Dark (Black & White)",
    description: "Deep black background with crisp white typography",
    mode: "dark",
    bgClass: "bg-black text-white",
    sidebarClass: "bg-[#0A0A0A] border-[#222222] text-white",
    headerClass: "bg-[#0A0A0A] border-[#222222] text-white",
    cardClass: "bg-[#0A0A0A] border-[#222222] text-white",
    activeClass: "bg-white text-black font-bold border-l-4 border-white shadow-xs",
    hoverClass: "hover:bg-neutral-900 text-neutral-400 hover:text-white",
    accent: "#FFFFFF",
  },
  jungle: {
    id: "jungle",
    name: "Jungle (Green & Dark Blue)",
    description: "Rich midnight dark blue with vibrant safari green accents",
    mode: "dark",
    bgClass: "bg-[#070E1E] text-slate-100",
    sidebarClass: "bg-[#0A152E] border-[#162955] text-slate-100",
    headerClass: "bg-[#0A152E] border-[#162955] text-white",
    cardClass: "bg-[#0E1F40] border-[#162955] text-white",
    activeClass: "bg-emerald-500/20 text-emerald-300 font-bold border-l-4 border-emerald-400 shadow-xs",
    hoverClass: "hover:bg-[#12224A] text-slate-300 hover:text-emerald-300",
    accent: "#10B981",
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("admin_theme") || "light";
  });

  useEffect(() => {
    const validTheme = THEMES[currentTheme] ? currentTheme : "light";
    localStorage.setItem("admin_theme", validTheme);
    document.documentElement.setAttribute("data-theme", validTheme);

    if (validTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#FFFFFF";
      document.body.style.color = "#000000";
    } else if (validTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#000000";
      document.body.style.color = "#FFFFFF";
    } else if (validTheme === "jungle") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#070E1E";
      document.body.style.color = "#F8FAFC";
    }
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        setTheme: setCurrentTheme,
        themeConfig: THEMES[currentTheme] || THEMES.light,
        themes: THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within ThemeProvider");
  }
  return context;
};
