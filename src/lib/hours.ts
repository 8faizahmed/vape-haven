// Opening hours helpers. The weekly schedule lives in siteConfig.openingHours;
// display rows and the live "Open now" status are both derived from it.

import { siteConfig } from "@/config/site";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Day = { open: string; close: string } | null;

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** "21:00" → "9 PM", "10:30" → "10:30 AM". */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, "0")} ${suffix}` : `${hour} ${suffix}`;
}

const week = (): Day[] => DAY_NAMES.map((_, i) => siteConfig.openingHours[i] ?? null);

/** Groups consecutive days with identical hours, Monday first: "Monday – Thursday · 10 AM – 9 PM". */
export function hoursRows() {
  const days = week();
  const order = [1, 2, 3, 4, 5, 6, 0];
  const rows: { days: string; time: string }[] = [];
  let start = order[0];
  for (let i = 0; i < order.length; i++) {
    const day = order[i];
    const next = order[i + 1];
    const same = next !== undefined && JSON.stringify(days[next]) === JSON.stringify(days[day]);
    if (same) continue;
    const label = start === day ? DAY_NAMES[day] : `${DAY_NAMES[start]} – ${DAY_NAMES[day]}`;
    const hours = days[day];
    rows.push({ days: label, time: hours ? `${formatTime(hours.open)} – ${formatTime(hours.close)}` : "Closed" });
    if (next !== undefined) start = next;
  }
  return rows;
}

/** Live status in the store's time zone, e.g. { open: true, label: "Open now · until 9 PM" }. */
export function openStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: siteConfig.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const today = SHORT_DAYS.indexOf(get("weekday"));
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const days = week();

  const todayHours = days[today];
  if (todayHours && minutes >= toMinutes(todayHours.open) && minutes < toMinutes(todayHours.close)) {
    return { open: true, label: `Open now · until ${formatTime(todayHours.close)}` };
  }
  for (let offset = 0; offset < 7; offset++) {
    const day = (today + offset) % 7;
    const hours = days[day];
    if (!hours || (offset === 0 && minutes >= toMinutes(hours.open))) continue;
    const when = offset === 0 ? "" : offset === 1 ? " tomorrow" : ` ${SHORT_DAYS[day]}`;
    return { open: false, label: `Closed · opens${when} ${formatTime(hours.open)}` };
  }
  return { open: false, label: "Closed" };
}
