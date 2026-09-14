import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { Save, Upload, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/apiClient";

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [homeContent, setHomeContent] = useState({
    tagline: "",
    heroTitle: "",
    heroSubtitle: "",
    heroBanner: null,
    heroBannerPreview: "",
    timings: "",
    zones: "",
    rules: "",
    aboutTitle: "",
    aboutDescription: "",
    stats: { tigers: "", acres: "" },
  });

  const [aboutContent, setAboutContent] = useState({
    title: "",
    subtitle: "",
    missionTitle: "",
    missionText: "",
    stats: { tigers: "", birds: "", sqKm: "", visitors: "" },
    journey: [{ year: "", title: "", description: "" }],
    activities: [{ name: "", image: null, imagePreview: "" }],
  });

  const [safariContent, setSafariContent] = useState({
    title: "",
    subtitle: "",
    zones: [{ name: "", description: "", timings: "" }],
    animals: [""],
    rules: [""],
    vehicles: [{ name: "", description: "" }],
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get("content/get");
        const data = res.data?.data || res.data || {};
        if (data.home) setHomeContent((prev) => ({ ...prev, ...data.home }));
        if (data.about) setAboutContent((prev) => ({ ...prev, ...data.about }));
        if (data.safari) setSafariContent((prev) => ({ ...prev, ...data.safari }));
      } catch (error) {
        console.log("No existing content, starting fresh");
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("content/update", {
        section: activeTab,
        content: activeTab === "home" ? homeContent : activeTab === "about" ? aboutContent : safariContent,
      });
      toast.success("Content saved successfully!");
    } catch (error) {
      toast.error("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "safari", label: "Safari" },
  ];

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Content Manager" />
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-400 mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Loading content...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-gray-700"
          >
            {/* Home Tab */}
            {activeTab === "home" && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-xl font-semibold text-white">Home Page Content</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={homeContent.tagline}
                      onChange={(e) => setHomeContent({ ...homeContent, tagline: e.target.value })}
                      placeholder="e.g., Unleash Your Wild Side"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={homeContent.heroTitle}
                      onChange={(e) => setHomeContent({ ...homeContent, heroTitle: e.target.value })}
                      placeholder="e.g., Experience the Heart of the Jungle"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-1">Hero Subtitle</label>
                  <textarea
                    value={homeContent.heroSubtitle}
                    onChange={(e) => setHomeContent({ ...homeContent, heroSubtitle: e.target.value })}
                    placeholder="Brief description of the safari experience..."
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-1">Hero Banner Image</label>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                      <Upload size={16} className="text-green-400" />
                      <span className="text-xs sm:text-sm text-gray-300">Choose Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setHomeContent({
                              ...homeContent,
                              heroBanner: file,
                              heroBannerPreview: URL.createObjectURL(file),
                            });
                          }
                        }}
                      />
                    </label>
                    {homeContent.heroBannerPreview && (
                      <img src={homeContent.heroBannerPreview} alt="Preview" className="h-12 sm:h-20 rounded-lg object-cover" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Timings</label>
                    <input
                      type="text"
                      value={homeContent.timings}
                      onChange={(e) => setHomeContent({ ...homeContent, timings: e.target.value })}
                      placeholder="e.g., 06:00 AM - 06:00 PM"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Zones</label>
                    <input
                      type="text"
                      value={homeContent.zones}
                      onChange={(e) => setHomeContent({ ...homeContent, zones: e.target.value })}
                      placeholder="e.g., Buffer, Core & River Safari"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Rules</label>
                    <input
                      type="text"
                      value={homeContent.rules}
                      onChange={(e) => setHomeContent({ ...homeContent, rules: e.target.value })}
                      placeholder="e.g., Do's & Don'ts Guide"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Stats - Tigers</label>
                    <input
                      type="text"
                      value={homeContent.stats?.tigers || ""}
                      onChange={(e) => setHomeContent({ ...homeContent, stats: { ...homeContent.stats, tigers: e.target.value } })}
                      placeholder="e.g., 50+"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Stats - Acres</label>
                    <input
                      type="text"
                      value={homeContent.stats?.acres || ""}
                      onChange={(e) => setHomeContent({ ...homeContent, stats: { ...homeContent.stats, acres: e.target.value } })}
                      placeholder="e.g., 120k"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* About Tab */}
            {activeTab === "about" && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-xl font-semibold text-white">About Page Content</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Page Title</label>
                    <input
                      type="text"
                      value={aboutContent.title}
                      onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                      placeholder="e.g., Our Wild Legacy"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={aboutContent.subtitle}
                      onChange={(e) => setAboutContent({ ...aboutContent, subtitle: e.target.value })}
                      placeholder="e.g., Exploring the heart of nature..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-1">Mission Title</label>
                  <input
                    type="text"
                    value={aboutContent.missionTitle}
                    onChange={(e) => setAboutContent({ ...aboutContent, missionTitle: e.target.value })}
                    placeholder="e.g., Preserving Nature & Wildlife"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-1">Mission Text</label>
                  <textarea
                    value={aboutContent.missionText}
                    onChange={(e) => setAboutContent({ ...aboutContent, missionText: e.target.value })}
                    placeholder="Describe the mission of the safari..."
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Tigers</label>
                    <input
                      type="text"
                      value={aboutContent.stats?.tigers || ""}
                      onChange={(e) => setAboutContent({ ...aboutContent, stats: { ...aboutContent.stats, tigers: e.target.value } })}
                      placeholder="50+"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Birds</label>
                    <input
                      type="text"
                      value={aboutContent.stats?.birds || ""}
                      onChange={(e) => setAboutContent({ ...aboutContent, stats: { ...aboutContent.stats, birds: e.target.value } })}
                      placeholder="300+"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Sq Km</label>
                    <input
                      type="text"
                      value={aboutContent.stats?.sqKm || ""}
                      onChange={(e) => setAboutContent({ ...aboutContent, stats: { ...aboutContent.stats, sqKm: e.target.value } })}
                      placeholder="120"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Visitors</label>
                    <input
                      type="text"
                      value={aboutContent.stats?.visitors || ""}
                      onChange={(e) => setAboutContent({ ...aboutContent, stats: { ...aboutContent.stats, visitors: e.target.value } })}
                      placeholder="1M+"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Safari Tab */}
            {activeTab === "safari" && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-xl font-semibold text-white">Safari Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Page Title</label>
                    <input
                      type="text"
                      value={safariContent.title}
                      onChange={(e) => setSafariContent({ ...safariContent, title: e.target.value })}
                      placeholder="e.g., Safari Zones & Experiences"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={safariContent.subtitle}
                      onChange={(e) => setSafariContent({ ...safariContent, subtitle: e.target.value })}
                      placeholder="e.g., Explore the diverse habitats..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs sm:text-sm text-gray-400">Animals Found</label>
                    <button
                      onClick={() => setSafariContent({ ...safariContent, animals: [...safariContent.animals, ""] })}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-600 text-white rounded-md text-xs sm:text-sm hover:bg-green-700"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {safariContent.animals.map((animal, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={animal}
                          onChange={(e) => {
                            const updated = [...safariContent.animals];
                            updated[index] = e.target.value;
                            setSafariContent({ ...safariContent, animals: updated });
                          }}
                          placeholder="e.g., Bengal Tiger"
                          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {safariContent.animals.length > 1 && (
                          <button
                            onClick={() => {
                              const updated = safariContent.animals.filter((_, i) => i !== index);
                              setSafariContent({ ...safariContent, animals: updated });
                            }}
                            className="p-2 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs sm:text-sm text-gray-400">Rules & Guidelines</label>
                    <button
                      onClick={() => setSafariContent({ ...safariContent, rules: [...safariContent.rules, ""] })}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-600 text-white rounded-md text-xs sm:text-sm hover:bg-green-700"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {safariContent.rules.map((rule, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={rule}
                          onChange={(e) => {
                            const updated = [...safariContent.rules];
                            updated[index] = e.target.value;
                            setSafariContent({ ...safariContent, rules: updated });
                          }}
                          placeholder="e.g., Maintain silence inside the zone"
                          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {safariContent.rules.length > 1 && (
                          <button
                            onClick={() => {
                              const updated = safariContent.rules.filter((_, i) => i !== index);
                              setSafariContent({ ...safariContent, rules: updated });
                            }}
                            className="p-2 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ContentManager;
