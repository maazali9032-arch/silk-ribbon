import { getSupabase, isSupabaseConfigured } from "./supabase";

export type LifecycleState = "live" | "fallback" | "not_found" | "error";

export type ZarContact = {
  name?: string | null;
  role?: string | null;
  phone?: string | null;
  whatsapp_url?: string | null;
};

export type ZarEvent = {
  title?: string | null;
  name?: string | null;
  date?: string | null;
  time?: string | null;
  venue?: string | null;
  address?: string | null;
  note?: string | null;
};

export type ZarContent = {
  groom_name?: string | null;
  bride_name?: string | null;
  groom_photo?: string | null;
  bride_photo?: string | null;
  groom_qualification?: string | null;
  bride_qualification?: string | null;
  groom_occupation?: string | null;
  bride_occupation?: string | null;
  groom_parents?: string[] | string | null;
  bride_parents?: string[] | string | null;
  relatives?: string[] | string | null;
  invocation?: string | null;
  message?: string | null;
  wedding_date?: string | null;
  invitation_start?: string | null;
  invitation_end?: string | null;
  events?: ZarEvent[] | null;
  venue_name?: string | null;
  venue_address?: string | null;
  venue_city?: string | null;
  venue_maps_url?: string | null;
  venue_image?: string | null;
  gallery?: (string | { url?: string | null })[] | null;
  music_enabled?: boolean | null;
  music_url?: string | null;
  contacts?: ZarContact[] | null;
  qr_label?: string | null;
};

export type ZarPayload = {
  state: LifecycleState;
  content: ZarContent | null;
  brandName: string | null;
  publicUrl: string | null;
  fallback: { title?: string | null; message?: string | null; note?: string | null } | null;
};

/** Only the final non-empty pathname segment selects an invitation. */
export function readSlug(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const raw = segments.length ? segments[segments.length - 1] : "";
  if (!raw) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;
  }
  decoded = decoded.trim();
  if (!decoded || decoded.includes("/") || decoded.includes("\\")) return null;
  return decoded;
}

function unwrap(raw: unknown): Record<string, unknown> | null {
  let value = raw;
  if (Array.isArray(value)) value = value[0];
  if (!value || typeof value !== "object") return null;
  const obj = value as Record<string, unknown>;
  if (obj["data"] && typeof obj["data"] === "object" && !Array.isArray(obj["data"])) {
    return obj["data"] as Record<string, unknown>;
  }
  return obj;
}

function pick(obj: Record<string, unknown> | null, keys: string[]): unknown {
  if (!obj) return undefined;
  for (const key of keys) {
    const v = obj[key];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

function normalizeState(value: unknown): LifecycleState {
  const s = typeof value === "string" ? value.toLowerCase() : "";
  if (s === "live" || s === "active" || s === "published") return "live";
  if (s === "fallback" || s === "expired" || s === "inactive") return "fallback";
  return "not_found";
}

export function normalizePayload(raw: unknown): ZarPayload {
  const root = unwrap(raw);
  if (!root) return { state: "not_found", content: null, brandName: null, publicUrl: null, fallback: null };

  const state = normalizeState(pick(root, ["state", "status", "lifecycle", "lifecycle_state"]));
  const invitation = (pick(root, ["invitation"]) as Record<string, unknown>) ?? null;
  const contentRaw =
    (pick(root, ["content", "invitation_content"]) as Record<string, unknown>) ??
    (invitation ? ((pick(invitation, ["content"]) as Record<string, unknown>) ?? null) : null);

  const brandName = pick(root, [
    "shop_display_name",
    "brand_name",
    "shop_name",
    "shop_brand_name",
    "public_brand_name",
  ]);

  const publicUrl =
    pick(invitation, ["public_url"]) ?? pick(root, ["public_url", "invitation_public_url"]);

  const fallbackRaw = (pick(root, ["fallback", "fallback_content"]) as Record<string, unknown>) ?? null;

  // Primary brand name candidates from top‑level fields
  let finalBrandName: string | null = typeof brandName === "string" ? brandName : null;

  // Fallback to nested shop fields if still empty
  if (!finalBrandName) {
    const rootObj = root as any;
    const shop = rootObj?.shop;
    if (shop) {
      finalBrandName = shop.display_name ?? shop.name ?? null;
    }
  }

  // Final fallback to fallback.display_name (if present)
  if (!finalBrandName) {
    const fallbackObj = root as any;
    finalBrandName = fallbackObj?.fallback?.display_name ?? null;
  }

  return {
    state,
    content: state === "live" ? ((contentRaw as ZarContent | null) ?? null) : null,
    brandName: finalBrandName,
    publicUrl: typeof publicUrl === "string" ? publicUrl : null,
    fallback: fallbackRaw
      ? {
          title: (pick(fallbackRaw, ["title", "heading"]) as string) ?? null,
          message: (pick(fallbackRaw, ["message", "body", "text"]) as string) ?? null,
          note: (pick(fallbackRaw, ["note", "footer"]) as string) ?? null,
        }
      : null,
  };
}

export function brandName(payload: ZarPayload): string | null {
  return payload.brandName;
}

  const supabase = getSupabase();
  if (!supabase || !isSupabaseConfigured) {
    throw new Error("config");
  }
  const { data, error } = await supabase.rpc("get_public_invitation_content", {
    p_slug: slug,
  });
  if (error) throw new Error(error.message);
  return normalizePayload(data);
}

/* ---------- content helpers ---------- */

export function toList(value: string[] | string | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string" && v.trim()).map((v) => v.trim());
  return String(value)
    .split(/[,\n]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

export function galleryUrls(gallery: ZarContent["gallery"]): string[] {
  if (!Array.isArray(gallery)) return [];
  return gallery
    .map((g) => (typeof g === "string" ? g : (g?.url ?? "")))
    .filter((u): u is string => Boolean(u && u.trim()));
}

export function formatDateParts(value: string | null | undefined) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    year: String(d.getFullYear()),
  };
}

export function formatEventDate(value: string | null | undefined) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

export function whatsappHref(contact: ZarContact): string | null {
  if (contact.whatsapp_url && contact.whatsapp_url.trim()) return contact.whatsapp_url.trim();
  const digits = (contact.phone ?? "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}
