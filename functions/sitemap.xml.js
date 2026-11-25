const SITE_ORIGIN = "https://gotruckfinder.com";

const STATIC_URLS = [
  "/",
  "/truck-cranes.html",
  "/aerial-work-platforms.html",
  "/sanitation-trucks.html",
  "/tank-trucks.html",
  "/about-us.html",
  "/our-service.html"
];

function xmlEscape(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  })[character]);
}

export async function onRequest(context) {
  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { "Allow": "GET, HEAD", "Cache-Control": "no-store" }
    });
  }

  let vehicles;
  try {
    if (!context.env?.DB) {
      throw new Error("Pages D1 binding DB is unavailable");
    }

    const result = await context.env.DB.prepare(
      `SELECT vehicle_code
       FROM vehicles
       WHERE is_published = 1 AND status = 'available'
       ORDER BY updated_at DESC, id DESC
       LIMIT 500`
    ).all();

    vehicles = result.results || [];
  } catch (error) {
    console.error("Sitemap D1 inventory lookup failed:", error);
    return new Response("Unable to generate sitemap at this time.", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=UTF-8",
        "Cache-Control": "no-store",
        "Retry-After": "300"
      }
    });
  }

  const urls = STATIC_URLS.map(path => SITE_ORIGIN + path);
  const seen = new Set(urls);

  for (const vehicle of vehicles) {
    const code = String(vehicle?.vehicle_code || "").trim();
    if (!/^[A-Za-z0-9._-]{1,100}$/.test(code)) continue;
    const url = SITE_ORIGIN + "/vehicle-details?id=" + encodeURIComponent(code);
    if (!seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(url => "  <url><loc>" + xmlEscape(url) + "</loc></url>"),
    "</urlset>"
  ].join("\n");

  const headers = {
    "Content-Type": "application/xml; charset=UTF-8",
    "Cache-Control": "public, max-age=300, s-maxage=300",
    "X-Content-Type-Options": "nosniff"
  };
  if (context.request.method === "HEAD") {
    return new Response(null, { status: 200, headers });
  }
  return new Response(body, { status: 200, headers });
}
