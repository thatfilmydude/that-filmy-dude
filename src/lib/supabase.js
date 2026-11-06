// Minimal Supabase REST helper. Server only: it uses the service role key.
// No extra npm package is needed.
function base() {
  return process.env.SUPABASE_URL + "/rest/v1";
}

function headers(extra) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Object.assign(
    { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json" },
    extra || {}
  );
}

export function supabaseReady() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function sbSelect(table, query) {
  const res = await fetch(base() + "/" + table + "?" + query, { headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error("supabase select " + table + " " + res.status);
  return res.json();
}

export async function sbUpsert(table, row, conflict) {
  const res = await fetch(base() + "/" + table + "?on_conflict=" + conflict, {
    method: "POST",
    headers: headers({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error("supabase upsert " + table + " " + res.status);
}

export async function sbInsert(table, row) {
  const res = await fetch(base() + "/" + table, {
    method: "POST",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error("supabase insert " + table + " " + res.status);
}

export async function sbDelete(table, query) {
  const res = await fetch(base() + "/" + table + "?" + query, { method: "DELETE", headers: headers() });
  if (!res.ok) throw new Error("supabase delete " + table + " " + res.status);
}
