import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../../api/apiClient";

export default function useSectionContent(sectionKey, defaults = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("content/get");
        const all = res.data?.data || res.data || {};
        if (!cancelled) setData(all[sectionKey] || defaults);
      } catch {
        if (!cancelled) setData(defaults);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [sectionKey]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("section", sectionKey);
      formData.append("content", JSON.stringify(data));
      await api.post("content/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`${sectionKey.toUpperCase()} content saved!`);
    } catch (err) {
      toast.error("Failed to save content");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }, [sectionKey, data]);

  return { data, setData, loading, saving, save };
}
