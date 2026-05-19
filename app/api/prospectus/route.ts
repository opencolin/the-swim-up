import { put, head } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PATHNAME = "prospectus-state.json";

function getToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  return token;
}

export async function GET() {
  let token: string;
  try {
    token = getToken();
  } catch {
    // No token configured — return null so client falls back to defaults
    return Response.json(null);
  }

  try {
    const meta = await head(PATHNAME, { token });
    const res = await fetch(meta.url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return Response.json(null);
    const data = await res.json();
    return Response.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    // Most commonly: blob doesn't exist yet
    return Response.json(null);
  }
}

export async function POST(req: Request) {
  let token: string;
  try {
    token = getToken();
  } catch (e) {
    return Response.json(
      { ok: false, error: "storage not configured" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "expected object" }, { status: 400 });
  }

  try {
    await put(PATHNAME, JSON.stringify(body), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      token,
    });
    return Response.json({ ok: true, updatedAt: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
