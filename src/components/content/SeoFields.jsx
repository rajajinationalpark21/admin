import { Box, TextField } from "@mui/material";
import { linesToText, textToLines } from "./listHelpers";

/**
 * A page's URL and search-engine settings. `keys` maps each setting to the
 * section field that stores it (the Wildlife hub uses `hub…` fields).
 */
export default function SeoFields({ data, keys, onChange, urlPrefix = "/" }) {
  const value = (name) => data?.[keys[name]];
  const set = (name, next) => onChange({ ...data, [keys[name]]: next });
  const description = value("metaDescription") || "";
  const title = value("seoTitle") || "";

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      {keys.slug && (
        <TextField size="small" fullWidth label="Page URL" value={value("slug") || ""}
          onChange={(e) => set("slug", e.target.value.trim().replace(/^\/+|\/+$/g, ""))}
          InputProps={{ startAdornment: <Box component="span" sx={{ color: "text.secondary", mr: 0.5 }}>{urlPrefix}</Box> }}
          helperText="The address of this page on the website. Old addresses keep working." />
      )}
      <TextField size="small" fullWidth label="SEO title" value={title} onChange={(e) => set("seoTitle", e.target.value)}
        helperText={`${title.length} characters — shown in the browser tab and Google results (about 60 fit).`} />
      <TextField size="small" fullWidth multiline minRows={2} label="Meta description" value={description}
        onChange={(e) => set("metaDescription", e.target.value)}
        helperText={`${description.length} characters — the summary under the title in Google (about 155 fit).`} />
      <TextField size="small" fullWidth multiline minRows={2} label="Keywords, one per line" value={linesToText(value("keywords"))}
        onChange={(e) => set("keywords", e.target.value.split("\n"))} onBlur={(e) => set("keywords", textToLines(e.target.value))} />
      {keys.heroImageAlt && (
        <TextField size="small" fullWidth label="Header photo description (alt text)" value={value("heroImageAlt") || ""}
          onChange={(e) => set("heroImageAlt", e.target.value)}
          helperText="Read out by screen readers and used by Google Images." />
      )}
    </Box>
  );
}
