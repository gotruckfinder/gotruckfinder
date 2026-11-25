/**
 * Shared server-side SEO and structured data for all public vehicle detail URLs.
 * Canonical URL: /vehicle-details?id=VEHICLE_CODE
 */
function cleanText(value, maxLength = 1000) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}
function isHttpUrl(value) {
  try {
    const parsed = new URL(String(value || ""));
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch { return false; }
}
function parseMileage(value) {
  const match = String(value ?? "").trim().match(/^([\d,]+(?:\.\d+)?)\s*(km|kilometers?|mi|miles?)$/i);
  if (!match) return null;
  const amount = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(amount) || amount < 0) return null;
  const isMiles = /^(mi|miles?)/i.test(match[2]);
  return { "@type": "QuantitativeValue", value: amount, unitCode: isMiles ? "SMI" : "KMT" };
}
/**
 * Only an exact, explicitly USD-denominated price is a Google Product Offer.
 * A negotiation range for one used vehicle is NOT an AggregateOffer.
 */
function parseExactUsdOffer(value, canonicalUrl) {
  const raw = String(value ?? "").trim();
  if (!raw || !/(?:\bUSD\b|\$)/i.test(raw)) return null;
  const match = raw.match(/^(?:USD\s*)?\$?\s*([\d,]+(?:\.\d+)?)\s*(?:USD)?$/i);
  if (!match) return null;
  const price = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(price) || price <= 0) return null;
  return {
    "@type": "Offer",
    url: canonicalUrl,
    price,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/UsedCondition"
  };
}
function buildVehicleSchema(vehicle, canonicalUrl, mainImage) {
  const name = cleanText(vehicle.title, 180);
  if (!name) return null;
  const description = cleanText(vehicle.meta_description || vehicle.description, 1000);
  const vehicleNode = {
    "@type": "Vehicle",
    "@id": canonicalUrl + "#vehicle",
    name,
    url: canonicalUrl,
    itemCondition: "https://schema.org/UsedCondition"
  };
  if (description) vehicleNode.description = description;
  if (mainImage) vehicleNode.image = [mainImage];
  if (vehicle.brand) vehicleNode.brand = { "@type": "Brand", name: cleanText(vehicle.brand, 120) };
  if (vehicle.model) vehicleNode.model = cleanText(vehicle.model, 120);
  if (vehicle.category) vehicleNode.vehicleConfiguration = cleanText(vehicle.category, 120);
  if (vehicle.year && /^\d{4}$/.test(String(vehicle.year))) vehicleNode.vehicleModelDate = String(vehicle.year);
  const mileage = parseMileage(vehicle.mileage);
  if (mileage) vehicleNode.mileageFromOdometer = mileage;
  const graph = [vehicleNode];
  const offer = parseExactUsdOffer(vehicle.price, canonicalUrl);
  // Never invent reviews/ratings or misrepresent one vehicle's price range as
  // an aggregation of multiple sellers' offers.
  if (offer) {
    const productNode = {
      "@type": "Product",
      "@id": canonicalUrl + "#product",
      name,
      url: canonicalUrl,
      itemCondition: "https://schema.org/UsedCondition",
      offers: offer,
      isRelatedTo: { "@id": canonicalUrl + "#vehicle" }
    };
    if (description) productNode.description = description;
    if (mainImage) productNode.image = [mainImage];
    if (vehicle.vehicle_code) productNode.sku = cleanText(vehicle.vehicle_code, 100);
    if (vehicle.brand) productNode.brand = { "@type": "Brand", name: cleanText(vehicle.brand, 120) };
    if (vehicle.model) productNode.model = cleanText(vehicle.model, 120);
    if (vehicle.category) productNode.category = cleanText(vehicle.category, 120);
    if (mileage) productNode.mileageFromOdometer = mileage;
    graph.push(productNode);
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
function renderSeoTags(html, seo) {
  const escapedTitle = escapeHtml(seo.title);
  const escapedDescription = escapeHtml(seo.description);
  const escapedCanonical = escapeHtml(seo.canonical);
  const escapedImage = seo.image ? escapeHtml(seo.image) : "";
  const escapedImageAlt = escapeHtml(seo.imageAlt);
  const schemaJson = seo.schema ? JSON.stringify(seo.schema).replace(/</g, "\\u003c") : "";
  let head = html.match(/<head\b[^>]*>[\s\S]*?<\/head>/i)?.[0];
  if (!head) return html;
  if (/<title\b[^>]*>[\s\S]*?<\/title>/i.test(head)) {
    head = head.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, \`<title>\${escapedTitle}</title>\`);
  } else {
    head = head.replace(/<\/head>/i, \`<title>\${escapedTitle}</title>\n</head>\`);
  }
  const descriptionTag = \`<meta name="description" content="\${escapedDescription}">\`;
  if (/<meta\s+[^>]*name=["']description["'][^>]*>/i.test(head)) {
    head = head.replace(/<meta\s+[^>]*name=["']description["'][^>]*>/i, descriptionTag);
  } else {
    head = head.replace(/<\/head>/i, descriptionTag + "\n</head>");
  }
  head = head
    .replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<script\s+[^>]*id=["']tf-product-schema["'][^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<script\s+[^>]*id=["']tf-vehicle-schema["'][^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<meta\s+[^>]*property=["']og:[^"']+["'][^>]*>/gi, "")
    .replace(/<meta\s+[^>]*name=["']twitter:[^"']+["'][^>]*>/gi, "")
    .replace(/<meta\s+[^>]*name=["']tf:seo-[^"']+["'][^>]*>/gi, "");
  const tags = [
    \`<link rel="canonical" href="\${escapedCanonical}">\`,
    '<meta property="og:type" content="product">',
    '<meta property="og:site_name" content="Truck Finder">',
    \`<meta property="og:title" content="\${escapedTitle}">\`,
    \`<meta property="og:description" content="\${escapedDescription}">\`,
    \`<meta property="og:url" content="\${escapedCanonical}">\`,
    '<meta name="twitter:card" content="summary_large_image">',
    \`<meta name="twitter:title" content="\${escapedTitle}">\`,
    \`<meta name="twitter:description" content="\${escapedDescription}">\`,
    \`<meta name="tf:seo-title" content="\${escapedTitle}">\`,
    \`<meta name="tf:seo-description" content="\${escapedDescription}">\`,
    \`<meta name="tf:seo-image-alt" content="\${escapedImageAlt}">\`
  ];
  if (escapedImage) {
    tags.push(\`<meta property="og:image" content="\${escapedImage}">\`);
    tags.push(\`<meta name="twitter:image" content="\${escapedImage}">\`);
  }
  if (escapedImageAlt) {
    tags.push(\`<meta property="og:image:alt" content="\${escapedImageAlt}">\`);
    tags.push(\`<meta name="twitter:image:alt" content="\${escapedImageAlt}">\`);
  }
  if (schemaJson) tags.push('<script type="application/ld+json" id="tf-vehicle-schema">' + schemaJson + '</script>');
  head = head.replace(/<\/head>/i, tags.join("\n") + "\n</head>");
  return html.replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, head);
}
export async function handleVehicleDetailsRequest(context) {
  const requestUrl = new URL(context.request.url);
  const supportedPaths = new Set(["/vehicle-details", "/vehicle-details.html"]);
  if (!supportedPaths.has(requestUrl.pathname) || context.request.method !== "GET") return context.next();
  const vehicleCode = cleanText(requestUrl.searchParams.get("id"), 100);
  if (!vehicleCode || !/^[A-Za-z0-9._-]+$/.test(vehicleCode)) return context.next();
  let vehicle;
  let mainImage = "";
  try {
    vehicle = await context.env.DB.prepare(
      \`SELECT vehicle_code, title, description, seo_title, meta_description,
              image_alt, brand, model, category, mileage, price, year
       FROM vehicles
       WHERE vehicle_code = ? AND is_published = 1 AND status = 'available'
       LIMIT 1\`
    ).bind(vehicleCode).first();
    if (vehicle) {
      const image = await context.env.DB.prepare(
        \`SELECT image_url
         FROM vehicle_images
         WHERE vehicle_id = (
           SELECT id FROM vehicles WHERE vehicle_code = ? LIMIT 1
         )
         ORDER BY is_main DESC, sort_order ASC, id ASC
         LIMIT 1\`
      ).bind(vehicleCode).first();
      if (image && isHttpUrl(image.image_url)) mainImage = image.image_url;
    }
  } catch (error) {
    console.error("Vehicle SEO lookup failed:", error);
    return context.next();
  }
  if (!vehicle) return context.next();
  const title = cleanText(vehicle.seo_title, 70) || (cleanText(vehicle.title, 180) + " | TRUCK FINDER");
  const description = cleanText(vehicle.meta_description, 160) ||
    cleanText(vehicle.description, 160) ||
    "Explore this used commercial vehicle from China. Contact Truck Finder for details and an export quotation.";
  const imageAlt = cleanText(vehicle.image_alt, 180) || cleanText(vehicle.title, 180);
  // Use one canonical URL for both legacy and extensionless detail routes.
  const canonicalUrl = new URL("/vehicle-details", "https://gotruckfinder.com");
  canonicalUrl.searchParams.set("id", vehicleCode);
  const assetResponse = await context.next();
  if (!assetResponse.ok) return assetResponse;
  const contentType = assetResponse.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("text/html")) return assetResponse;
  const html = await assetResponse.text();
  const schema = buildVehicleSchema(vehicle, canonicalUrl.href, mainImage);
  const rendered = renderSeoTags(html, {
    title, description, image: mainImage, imageAlt, canonical: canonicalUrl.href, schema
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
