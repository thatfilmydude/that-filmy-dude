// Shared helpers for the homepage sections. Safe to import from server and client code.

// "Scene Review: A Jithu Madhavan Special" becomes "Scene"
export function filmName(title) {
  if (!title) return "";
  let t = String(title).split(":")[0].replace(/\s*review\s*$/i, "").trim();
  if (t.length > 26) t = t.slice(0, 24).trim() + "...";
  return t;
}

export function fmtRating(r) {
  const n = Number(r);
  if (!isFinite(n)) return "";
  return String(Math.round(n * 100) / 100);
}

export const GLOWS = ["#e2241a", "#4a78d6", "#e8b34c", "#2fb38a", "#a24ad6", "#e0742a"];
