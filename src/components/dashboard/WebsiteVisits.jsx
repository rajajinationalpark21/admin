import { useEffect, useState } from "react";
import { Box, Typography, Tooltip, CircularProgress } from "@mui/material";
import { Eye, Users, UserPlus, CalendarCheck } from "lucide-react";
import api from "../../api/apiClient";

// The panel's emerald accent (the same as the dashboard's feedback card), in every theme.
const BAR = "#10B981";
const card = { backgroundColor: "background.paper", borderRadius: "12px", border: "1px solid", borderColor: "divider" };
const numberFormat = new Intl.NumberFormat("en-IN");
const dayLabel = (day, options = { day: "numeric", month: "short" }) =>
  new Date(`${day}T00:00:00`).toLocaleDateString("en-IN", options);

const PAGE_NAMES = {
  "/": "Home", "/about": "About Rajaji", "/booking": "Booking form", "/contact": "Contact", "/faq": "FAQ", "/blog": "Blog",
  "/zones": "Safari zones", "/activities": "Activities", "/how-to-reach": "How to reach",
  "/rajaji-national-park-jeep-safari-tickets-entry-fees-charges": "Tickets & charges",
  "/rajaji-jeep-safari-terms-conditions-cancellation-refund": "Terms & conditions",
  "/rajaji-jeep-safari": "Jeep Safari", "/rajaji-national-park-bird-watching-jungle-safari": "Bird Watching",
  "/trekking-in-rajaji": "Trekking", "/river-rafting-rishikesh": "River rafting", "/stay-near-rajaji-national-park": "Stay",
  "/wildlife-biodiversity-rajaji-tiger-reserve": "Wildlife & biodiversity", "/mammals-of-rajaji-tiger-reserve": "Mammals",
  "/birds-of-rajaji-national-park": "Birds", "/butterflies-of-rajaji-national-park": "Butterflies",
  "/reptiles-of-rajaji-tiger-reserve": "Reptiles", "/flora-of-rajaji-national-park": "Flora",
  "/chilla-jeep-safari": "Chilla zone", "/ranipur-gate-jeep-safari": "Ranipur zone", "/chillawali-jeep-safari-mohand-gate": "Mohand–Chillawali zone",
  "/motichur-jeep-safari": "Motichur zone", "/jhilmil-jheel-safari": "Jhilmil Jheel zone", "/gohri-range-safari": "Gohri zone",
  "/chaurasi-kutiya-beatles-ashram": "Chaurasi Kutiya",
};
// Anything else (a blog post, a renamed page): its address, made readable.
const pageName = (path) =>
  PAGE_NAMES[path] || (path.startsWith("/blog/") ? `Blog: ${path.slice(6).replace(/-/g, " ")}` : path.slice(1).replace(/-/g, " ") || path);
const DEVICE_NAMES = { mobile: "Phone", tablet: "Tablet", desktop: "Computer" };

function Tile({ icon: Icon, label, value, note }) {
  return (
    <Box sx={{ ...card, p: 2.25, display: "flex", flexDirection: "column", gap: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
        <Icon size={16} />
        <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500 }}>{label}</Typography>
      </Box>
      <Typography sx={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
        {numberFormat.format(value)}
      </Typography>
      {note && <Typography sx={{ fontSize: "0.72rem", color: "text.secondary" }}>{note}</Typography>}
    </Box>
  );
}

/** Page views per day as columns; hovering a column shows that day's numbers. */
function DailyChart({ daily }) {
  const max = Math.max(1, ...daily.map((d) => d.views));
  // Three recessive gridlines at round numbers.
  const step = Math.max(1, Math.ceil(max / 3 / (max > 50 ? 10 : 1)) * (max > 50 ? 10 : 1));
  const top = step * 3;
  const ticks = [top, step * 2, step];
  const labelEvery = Math.ceil(daily.length / 6);

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 1 }}>
      <Box sx={{ position: "relative", height: 180 }}>
        {ticks.map((tick) => (
          <Typography key={tick} sx={{ position: "absolute", right: 0, top: `${(1 - tick / top) * 100}%`, transform: "translateY(-50%)", fontSize: "0.68rem", color: "text.secondary", fontVariantNumeric: "tabular-nums" }}>
            {numberFormat.format(tick)}
          </Typography>
        ))}
      </Box>
      <Box sx={{ position: "relative", height: 180 }}>
        {ticks.map((tick) => (
          <Box key={tick} sx={{ position: "absolute", left: 0, right: 0, top: `${(1 - tick / top) * 100}%`, borderTop: "1px dashed", borderColor: "divider" }} />
        ))}
        <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 0, borderTop: "1px solid", borderColor: "divider" }} />
        <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", gap: "2px" }}>
          {daily.map((d) => (
            <Tooltip
              key={d.day}
              arrow
              placement="top"
              title={
                <Box sx={{ fontSize: "0.75rem", lineHeight: 1.5 }}>
                  <b>{dayLabel(d.day, { weekday: "short", day: "numeric", month: "short" })}</b>
                  <br />{numberFormat.format(d.views)} page views · {numberFormat.format(d.visitors)} visitors ({numberFormat.format(d.newVisitors || 0)} new)
                  <br />{d.enquiries} {d.enquiries === 1 ? "enquiry" : "enquiries"}
                </Box>
              }
            >
              {/* The hit area is the full column height, so thin or empty days are easy to hover. */}
              <Box sx={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end", cursor: "default", "&:hover > div": { opacity: 0.8 } }}>
                <Box sx={{ width: "100%", height: `${(d.views / top) * 100}%`, minHeight: d.views ? 2 : 0, backgroundColor: BAR, borderRadius: "4px 4px 0 0" }} />
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Box>
      <Box />
      <Box sx={{ display: "flex", gap: "2px", mt: 0.75 }}>
        {daily.map((d, index) => (
          <Typography key={d.day} sx={{ flex: 1, fontSize: "0.65rem", color: "text.secondary", textAlign: "center", whiteSpace: "nowrap", overflow: "visible" }}>
            {index % labelEvery === 0 ? dayLabel(d.day) : ""}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

/** A ranked list with a thin bar showing each row's share of the largest. */
function RankedList({ title, rows }) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  return (
    <Box sx={{ ...card, p: 2.25 }}>
      <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, mb: 1.5 }}>{title}</Typography>
      {rows.length === 0 && <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>No data yet.</Typography>}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
        {rows.map((row) => (
          <Box key={row.label}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, fontSize: "0.8rem" }}>
              <Typography component="span" sx={{ fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row.label}>
                {row.label}
              </Typography>
              <Typography component="span" sx={{ fontSize: "0.8rem", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                {numberFormat.format(row.value)}
              </Typography>
            </Box>
            <Box sx={{ mt: 0.5, height: 6, borderRadius: 3, backgroundColor: "action.hover" }}>
              <Box sx={{ height: "100%", width: `${(row.value / max) * 100}%`, borderRadius: 3, backgroundColor: BAR }} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/**
 * Visits to the public website, counted by the site itself: no cookies and no
 * personal data. `days` follows the dashboard's time filter.
 */
export default function WebsiteVisits({ days }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setData(null);
    setError("");
    api.get("admin/visits", { params: { days } })
      .then((res) => active && setData(res.data))
      .catch((err) => active && setError(err.response?.data?.message || "Visits could not be loaded."));
    return () => { active = false; };
  }, [days]);

  return (
    <Box sx={{ mb: 3.5, display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography sx={{ fontSize: "1.05rem", fontWeight: 700 }}>Website visits</Typography>
        <Typography sx={{ fontSize: "0.78rem", color: "text.secondary", mt: 0.25 }}>
          Counted by the website itself, without cookies or personal data. Search-engine robots are left out.
        </Typography>
      </Box>

      {!data && !error && <Box sx={{ ...card, py: 6, display: "flex", justifyContent: "center" }}><CircularProgress size={24} /></Box>}
      {error && <Box sx={{ ...card, p: 3 }}><Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>{error}</Typography></Box>}

      {data && (
        <>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2 }}>
            <Tile icon={Eye} label="Page views" value={data.totals.views} />
            <Tile icon={Users} label="Visitors" value={data.totals.visitors} note="Each person counted once per day" />
            <Tile
              icon={UserPlus}
              label="New visitors"
              value={data.totals.newVisitors || 0}
              note={`First time on the site · ${numberFormat.format(Math.max(0, data.totals.visitors - (data.totals.newVisitors || 0)))} had been before`}
            />
            <Tile icon={CalendarCheck} label="Enquiries" value={data.totals.bookings + data.totals.contacts} note={`${data.totals.bookings} booking · ${data.totals.contacts} contact`} />
          </Box>

          <Box sx={{ ...card, p: 2.25 }}>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, mb: 2 }}>Page views per day</Typography>
            {data.totals.views === 0 ? (
              <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", py: 3 }}>
                No visits counted yet in this period. Counting starts once this update is live on the website.
              </Typography>
            ) : (
              <DailyChart daily={data.daily} />
            )}
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr 0.8fr" }, gap: 2 }}>
            <RankedList title="Most viewed pages" rows={data.topPages.map((row) => ({ label: pageName(row.path), value: row.views }))} />
            <RankedList title="Where visitors come from" rows={data.sources.map((row) => ({ label: row.source, value: row.views }))} />
            <RankedList title="Device" rows={data.devices.map((row) => ({ label: DEVICE_NAMES[row.device] || row.device, value: row.views }))} />
          </Box>
        </>
      )}
    </Box>
  );
}
