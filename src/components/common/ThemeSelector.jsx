import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Trees, ChevronDown, Check } from "lucide-react";
import { useAdminTheme } from "../../context/ThemeContext";

const THEME_OPTIONS = [
  {
    id: "light",
    label: "Light",
    subtitle: "Pure white & deep black",
    badge: "Default",
    icon: Sun,
    iconColor: "text-amber-500",
    swatch: "bg-white border-zinc-300",
  },
  {
    id: "dark",
    label: "Dark",
    subtitle: "Black background & white words",
    icon: Moon,
    iconColor: "text-zinc-300",
    swatch: "bg-black border-zinc-700",
  },
  {
    id: "jungle",
    label: "Jungle",
    subtitle: "Dark blue & safari green",
    icon: Trees,
    iconColor: "text-emerald-400",
    swatch: "bg-[#070E1E] border-emerald-500",
  },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useAdminTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeOption = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];
  const ActiveIcon = activeOption.icon;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Theme Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer shadow-xs
          bg-zinc-100 hover:bg-zinc-200/80 text-black border border-zinc-200
          dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-white dark:border-zinc-800
          data-[theme=jungle]:bg-[#0E1F40] data-[theme=jungle]:hover:bg-[#152B57] data-[theme=jungle]:text-white data-[theme=jungle]:border-[#172E5C]"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <ActiveIcon size={14} className={activeOption.iconColor} />
        <span>{activeOption.label}</span>
        <ChevronDown
          size={13}
          className={`text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100
            bg-white border-zinc-200 text-black
            dark:bg-[#0A0A0A] dark:border-zinc-800 dark:text-white
            data-[theme=jungle]:bg-[#0E1F40] data-[theme=jungle]:border-[#172E5C] data-[theme=jungle]:text-white"
        >
          <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 data-[theme=jungle]:border-[#172E5C]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Color Theme
            </p>
          </div>

          <div className="p-1.5 space-y-1">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = theme === opt.id;
              const Icon = opt.icon;

              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-zinc-100 dark:bg-zinc-900 data-[theme=jungle]:bg-emerald-500/15 font-semibold"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50 data-[theme=jungle]:hover:bg-[#14284F]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center border shrink-0 ${opt.swatch}`}
                    >
                      <Icon size={13} className={opt.iconColor} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-black dark:text-white truncate">
                          {opt.label}
                        </span>
                        {opt.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                        {opt.subtitle}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check
                      size={15}
                      className="text-black dark:text-white data-[theme=jungle]:text-emerald-400 shrink-0 ml-2"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
