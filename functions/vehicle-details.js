/**
 * Server-render vehicle-specific SEO for /vehicle-details?id=VEHICLE_CODE.
 *
 * The Pages project has a production D1 binding named DB. This function only
 * handles the detail route; all other requests continue to the static asset
 * handler unchanged.
 */
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function cleanText(value, maxLength) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function isHttpUrl(value) {
  try {
    const parsed = new URL(String(value || ""));
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function renderSeoTags(html, seo) {
  const escapedTitle = escapeHtml(seo.title);
  const escapedDescription = escapeHtml(seo.description);
  const escapedCanonical = escapeHtml(seo.canonical);
  const escapedImage = seo.image ? escapeHtml(seo.image) : "";
  const escapedImageAlt = escapeHtml(seo.imageAlt);

  let head = html.match(/<head\b[^>]*>[\s\S]*?<\/head>/i)?.[0];
  if (!head) return html;

  head = head.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i,
    `<title>${escapedTitle}</title>`);

  const descriptionTag = `<meta name="description" content="${escapedDescription}">`;
  if (/<meta\s+[^>]*name=["']description["'][^>]*>/i.test(head)) {
    head = head.replace(/<meta\s+[^>]*name=["']description["'][^>]*>/i, descriptionTag);
  } else {
    head = head.replace(/<\/head>/i, descriptionTag + "\n</head>");
  }

  // Remove any previous SEO tags so the server response contains one canonical
  // set, even if the static template is updated later.
  head = head
    .replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<meta\s+[^>]*property=["']og:[^"']+["'][^>]*>/gi, "")
    .replace(/<meta\s+[^>]*name=["']twitter:[^"']+["'][^>]*>/gi, "")
    .replace(/<meta\s+[^>]*name=["']tf:seo-[^"']+["'][^>]*>/gi, "");

  const tags = [
    `<link rel="canonical" href="${escapedCanonical}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Truck Finder">`,
    `<meta property="og:title" content="${escapedTitle}">`,
    `<meta property="og:description" content="${escapedDescription}">`,
    `<meta property="og:url" content="${escapedCanonical}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapedTitle}">`,
    `<meta name="twitter:description" content="${escapedDescription}">`,
    `<meta name="tf:seo-title" content="${escapedTitle}">`,
    `<meta name="tf:seo-description" content="${escapedDescription}">`,
    `<meta name="tf:seo-image-alt" content="${escapedImageAlt}">`
  ];

  if (escapedImage) {
    tags.push(`<meta property="og:image" content="${escapedImage}">`);
    tags.push(`<meta name="twitter:image" content="${escapedImage}">`);
  }
  if (escapedImageAlt) {
    tags.push(`<meta property="og:image:alt" content="${escapedImageAlt}">`);
    tags.push(`<meta name="twitter:image:alt" content="${escapedImageAlt}">`);
  }

  head = head.replace(/<\/head>/i, tags.join("\n") + "\n</head>");
  return html.replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, head);
}

export async function onRequest(context) {
  const requestUrl = new URL(context.request.url);

  // Only serve SEO for the canonical vehicle detail route.
  if (requestUrl.pathname !== "/vehicle-details" || context.request.method !== "GET") {
    return context.next();
  }

  const vehicleCode = cleanText(requestUrl.searchParams.get("id"), 100);
  if (!vehicleCode || !/^[A-Za-z0-9._-]+$/.test(vehicleCode)) {
    return context.next();
  }

  let vehicle;
  let mainImage = "";
  try {
    vehicle = await context.env.DB.prepare(
      `SELECT vehicle_code, title, description, seo_title, meta_description, image_alt
       FROM vehicles
       WHERE vehicle_code = ? AND is_published = 1 AND status = 'available'
       LIMIT 1`
    ).bind(vehicleCode).first();

    if (vehicle) {
      const image = await context.env.DB.prepare(
        `SELECT image_url
         FROM vehicle_images
         WHERE vehicle_id = (
           SELECT id FROM vehicles WHERE vehicle_code = ? LIMIT 1
         )
         ORDER BY is_main DESC, sort_order ASC, id ASC
         LIMIT 1`
      ).bind(vehicleCode).first();
      if (image && isHttpUrl(image.image_url)) mainImage = image.image_url;
    }
  } catch (error) {
    // A database hiccup must not take down the existing static detail page.
    console.error("Vehicle SEO lookup failed:", error);
    return context.next();
  }

  if (!vehicle) return context.next();

  const title = cleanText(vehicle.seo_title, 70) ||
    (cleanText(vehicle.title, 180) + " | TRUCK FINDER");
  const description = cleanText(vehicle.meta_description, 160) ||
    cleanText(vehicle.description, 160) ||
    "Explore this used commercial vehicle from China. Contact Truck Finder for details and an export quotation.";
  const imageAlt = cleanText(vehicle.image_alt, 180) || cleanText(vehicle.title, 180);
  const canonicalUrl = new URL("/vehicle-details", "https://gotruckfinder.com");
  canonicalUrl.searchParams.set("id", vehicleCode);

  const assetResponse = await context.next();
  if (!assetResponse.ok) return assetResponse;

  const contentType = assetResponse.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("text/html")) return assetResponse;

  const html = await assetResponse.text();
  const rendered = renderSeoTags(html, {
    title,
    description,
    image: mainImage,
    imageAlt,
    canonical: canonicalUrl.href
  });

  const headers = new Headers(assetResponse.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");
  headers.delete("etag");
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("cache-control", "public, max-age=60, s-maxage=300");

  return new Response(rendered, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers
  });
}
