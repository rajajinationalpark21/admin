import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import api from "../../api/apiClient";

// Names used in save messages ("Tickets page saved").
const SECTION_LABELS = {
  home: "Home page",
  about: "About page",
  safari: "Safari zones",
  settings: "Website details",
  birds: "Birds page",
  fauna: "Mammals & Wildlife pages",
  flora: "Flora page",
  butterflies: "Butterflies page",
  reptiles: "Reptiles page",
  parkRules: "Terms & rules",
  tickets: "Tickets page",
  howToReach: "How to Reach page",
  stay: "Stay page",
  faqs: "FAQ page",
  activities: "Activities page",
  rafting: "Rafting page",
  booking: "Booking page",
  jeepSafari: "Jeep Safari page",
  birdWatching: "Bird Watching page",
  trekking: "Trekking page",
};

const clone = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/**
 * Loads one CMS section for an editor and saves it back.
 *
 * - Defaults only fill fields the section does not have at all; a field the
 *   admin emptied stays empty.
 * - If loading fails, the editor still opens (with defaults) but Save is
 *   blocked, so a failed load can never overwrite the live content.
 * - Save sends only the fields that changed since the last load or save; the
 *   server merges them into the section.
 */
export default function useSectionContent(sectionKey, defaults = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const defaultsRef = useRef(defaults);
  // The section as last loaded or saved; what "changed" is measured against.
  const baselineRef = useRef(null);
  const label = SECTION_LABELS[sectionKey] || sectionKey;

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await api.get("content/get");
        const all = res.data?.data || res.data || {};
        const sec = all[sectionKey];
        const resolved = { ...defaultsRef.current, ...(sec && typeof sec === "object" ? sec : {}) };
        if (cancelled) return;
        baselineRef.current = clone(resolved);
        setLoadError(null);
        setData(resolved);
        toast.dismiss(`load-error-${sectionKey}`);
      } catch (error) {
        if (cancelled) return;
        baselineRef.current = null;
        setLoadError(error);
        setData(clone(defaultsRef.current));
        toast.error(
          `${label}: the saved content could not be loaded, so saving is turned off. Reload the page to try again.`,
          { toastId: `load-error-${sectionKey}`, autoClose: false }
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [sectionKey, reloadKey, label]);

  const changedFields = data && baselineRef.current
    ? Object.keys(data).filter((key) => !same(data[key], baselineRef.current[key]))
    : [];

  const save = useCallback(async () => {
    if (loadError || !baselineRef.current) {
      toast.error(`${label} was not saved: its content did not load. Reload the page and try again.`);
      return false;
    }
    const baseline = baselineRef.current;
    const changes = Object.fromEntries(
      Object.keys(data || {})
        .filter((key) => !same(data[key], baseline[key]))
        .map((key) => [key, data[key]])
    );
    if (Object.keys(changes).length === 0) {
      toast.info("No changes to save", { toastId: "no-changes" });
      return true;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("section", sectionKey);
      formData.append("content", JSON.stringify(changes));
      await api.post("content/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      baselineRef.current = clone(data);
      toast.success(`${label} saved`);
      return true;
    } catch (err) {
      toast.error(`${label} could not be saved: ${err?.response?.data?.message || err.message}`);
      console.error(err);
      return false;
    } finally {
      setSaving(false);
    }
  }, [sectionKey, data, label, loadError]);

  return {
    data,
    setData,
    loading,
    saving,
    save,
    loadError,
    reload,
    dirty: changedFields.length > 0,
    changedFields,
  };
}
