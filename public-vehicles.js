/*
 * Truck Finder public inventory loader.
 * Keep the existing static inventory as a fallback and merge published D1
 * vehicles by vehicle code. A D1 record replaces a static record with the
 * same ID so the website never shows duplicates.
 */
(function () {
  const staticVehicles = Array.isArray(window.TRUCK_FINDER_VEHICLES)
    ? window.TRUCK_FINDER_VEHICLES.slice()
    : [];

  const endpoint = "https://gotruckfinder-dev.cscvehicle.workers.dev/api/public/vehicles";

  window.TRUCK_FINDER_VEHICLES_READY = fetch(endpoint, {
    method: "GET",
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
    headers: { "Accept": "application/json" }
  })
    .then(function (response) {
      if (!response.ok) throw new Error("Public inventory request failed: " + response.status);
      return response.json();
    })
    .then(function (data) {
      if (!data || !Array.isArray(data.vehicles)) {
        throw new Error("Public inventory response has an invalid format");
      }

      const merged = new Map();
      staticVehicles.forEach(function (vehicle) {
        if (vehicle && vehicle.id) merged.set(String(vehicle.id), vehicle);
      });

      data.vehicles.forEach(function (vehicle) {
        if (vehicle && vehicle.id) merged.set(String(vehicle.id), vehicle);
      });

      const inventory = Array.from(merged.values());
      window.TRUCK_FINDER_VEHICLES = inventory;
      return inventory;
    })
    .catch(function (error) {
      console.warn("Using static vehicle inventory fallback:", error);
      window.TRUCK_FINDER_VEHICLES = staticVehicles;
      return staticVehicles;
    });
})();
