(function () {
  "use strict";

  const API_URL = "https://gotruckfinder.com/api/public/vehicles";
  const API_TIMEOUT_MS = 5000;

  // Keep the local inventory available immediately. The API is an enhancement,
  // not a prerequisite for rendering the page.
  const staticVehicles = Array.isArray(window.TRUCK_FINDER_VEHICLES)
    ? window.TRUCK_FINDER_VEHICLES
    : [];

  window.TRUCK_FINDER_VEHICLES = staticVehicles;

  window.TRUCK_FINDER_VEHICLES_READY = (async function () {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      API_TIMEOUT_MS
    );

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        signal: controller.signal,
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Vehicle API HTTP " + response.status);
      }

      const data = await response.json();
      if (!data || !Array.isArray(data.vehicles)) {
        throw new Error("Invalid vehicle API response");
      }

      // Static records are inserted first; a D1 record with the same ID
      // replaces the static version so the database remains authoritative.
      const inventoryById = new Map();
      staticVehicles.forEach(vehicle => {
        const id = String(vehicle.id || "").trim();
        if (id) inventoryById.set(id, vehicle);
      });

      data.vehicles.forEach(vehicle => {
        const id = String(vehicle.id || "").trim();
        if (id) inventoryById.set(id, vehicle);
      });

      const mergedVehicles = Array.from(inventoryById.values());
      window.TRUCK_FINDER_VEHICLES = mergedVehicles;

      console.info(
        "Truck Finder inventory updated:",
        staticVehicles.length,
        "static records +",
        data.vehicles.length,
        "D1 records;",
        mergedVehicles.length,
        "unique vehicles"
      );

      return mergedVehicles;
    } catch (error) {
      // Keep the already-rendered static inventory if the API fails or times out.
      window.TRUCK_FINDER_VEHICLES = staticVehicles;
      console.warn(
        "D1 vehicle loading unavailable; keeping static inventory.",
        error && error.name === "AbortError" ? "Request timed out." : error
      );
      return staticVehicles;
    } finally {
      window.clearTimeout(timeoutId);
    }
  })();
})();
