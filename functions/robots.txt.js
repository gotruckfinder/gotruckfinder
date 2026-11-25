const ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: https://gotruckfinder.com/sitemap.xml
`;

export async function onRequest(context) {
  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: {
        "Allow": "GET, HEAD",
        "Cache-Control": "no-store"
      }
    });
  }

  return new Response(
    context.request.method === "HEAD" ? null : ROBOTS_TXT,
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=UTF-8",
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff"
      }
    }
  );
}
