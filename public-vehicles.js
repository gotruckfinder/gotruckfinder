(function () {
  "use strict";

  const API_URL = "https://gotruckfinder.com/api/public/vehicles";

  window.TRUCK_FINDER_VEHICLES_READY = (async function () {
    const staticVehicles = Array.isArray(window.TRUCK_FINDER_VEHICLES)
      ? window.TRUCK_FINDER_VEHICLES
      : [];

    try {
      const response = await fetch(API_URL, { method: "GET" });
      if (!response.ok) {
        throw new Error("Vehicle API HTTP " + response.status);
      }

      const data = await response.json();
      if (!data || !Array.isArray(data.vehicles)) {
        throw new Error("Invalid vehicle API response");
      }

      const existingIds = new Set(
        staticVehicles.map(v => String(v.id || "")).filter(Boolean)
      );

      const dynamicVehicles = data.vehicles.filter(vehicle => {
        const id = String(vehicle.id || "");
        return id && !existingIds.has(id);
      });

      window.TRUCK_FINDER_VEHICLES = staticVehicles.concat(dynamicVehicles);

      console.info(
        "Truck Finder inventory loaded:",
        staticVehicles.length,
        "static +",
        dynamicVehicles.length,
        "D1 vehicles"
      );
    } catch (error) {
      window.TRUCK_FINDER_VEHICLES = staticVehicles;
      console.error("D1 vehicle loading failed; using static inventory.", error);
    }

    return window.TRUCK_FINDER_VEHICLES;
  })();
})();
