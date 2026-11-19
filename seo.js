(function () {
  "use strict";

  const SITE_NAME = "Truck Finder";
  const SITE_ORIGIN = "https://gotruckfinder.com";

  function getCanonicalUrl() {
    const current = new URL(window.location.href);
    let pathname = current.pathname;

    if (pathname === "/index.html") {
      pathname = "/";
    }

    const canonical = new URL(pathname, SITE_ORIGIN);

    if (pathname.endsWith("vehicle-details.html")) {
      const vehicleId = current.searchParams.get("id");
      if (vehicleId) {
        canonical.searchParams.set("id", vehicleId);
      }
    }

    return canonical.href;
  }

  function ensureMeta(attribute, key) {
    let element = document.head.querySelector(
      'meta[' + attribute + '="' + key + '"]'
    );

    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }

    return element;
  }

  function setMeta(attribute, key, content) {
    if (content === undefined || content === null || content === "") {
      return;
    }

    ensureMeta(attribute, key).setAttribute("content", content);
  }

  function ensureCanonical() {
    let element = document.head.querySelector('link[rel="canonical"]');

    if (!element) {
      element = document.createElement("link");
      element.setAttribute("rel", "canonical");
      document.head.appendChild(element);
    }

    element.setAttribute("href", getCanonicalUrl());
  }

  function applySEO(options) {
    const data = options || {};
    const title = data.title || document.title;
    const description =
      data.description ||
      document.querySelector('meta[name="description"]')?.content ||
      "";

    if (title) {
      document.title = title;
      setMeta("property", "og:title", title);
      setMeta("name", "twitter:title", title);
    }

    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }

    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:url", getCanonicalUrl());
    setMeta("name", "twitter:card", "summary_large_image");

    if (data.image) {
      setMeta("property", "og:image", data.image);
      setMeta("name", "twitter:image", data.image);
    }

    if (data.imageAlt) {
      setMeta("property", "og:image:alt", data.imageAlt);
      setMeta("name", "twitter:image:alt", data.imageAlt);
    }

    ensureCanonical();
  }

  window.applyTruckFinderSEO = applySEO;

  applySEO();
})();
