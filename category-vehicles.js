(function () {
  "use strict";
  const page = document.querySelector("[data-vehicle-category]");
  if (!page) return;
  const category = page.dataset.vehicleCategory;
  const grid = document.getElementById("categoryVehicleGrid");
  const count = document.getElementById("categoryVehicleCount");
  const empty = document.getElementById("categoryVehicleEmpty");
  const searchInput = document.getElementById("categoryVehicleSearch");
  let searchTerm = "";
  if (!grid || !count || !empty) return;

  function addLine(parent, label, value) {
    if (value === undefined || value === null || String(value).trim() === "") return;
    const line = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = label + ": ";
    line.append(strong, document.createTextNode(String(value)));
    parent.appendChild(line);
  }

  function render(allVehicles) {
    const vehicles = (Array.isArray(allVehicles) ? allVehicles : []).filter(vehicle =>
      String(vehicle.category || "").trim() === category &&
      String(vehicle.status || "").toLowerCase() === "available" &&
      (!searchTerm || [vehicle.title,vehicle.brand,vehicle.model,vehicle.year,vehicle.sub_category,vehicle.subCategory,vehicle.specifications,vehicle.mileage,vehicle.price,vehicle.capacity,vehicle.ton,vehicle.location].some(value => String(value || "").toLowerCase().includes(searchTerm)))
    );
    grid.replaceChildren();
    count.textContent = vehicles.length + " matching vehicle(s)";
    empty.hidden = vehicles.length > 0;
    vehicles.forEach(vehicle => {
      const card = document.createElement("article");
      card.className = "category-vehicle-card";
      const link = document.createElement("a");
      link.className = "category-vehicle-link";
      link.href = "vehicle-details.html?id=" + encodeURIComponent(vehicle.id);
      if (vehicle.image) {
        const image = document.createElement("img");
        image.src = vehicle.image;
        image.alt = vehicle.imageAlt || vehicle.title || category;
        image.loading = "lazy";
        image.onerror = function () { this.style.display = "none"; };
        link.appendChild(image);
      }
      const body = document.createElement("div");
      body.className = "category-vehicle-body";
      const heading = document.createElement("h3");
      heading.textContent = vehicle.title || "Used " + category;
      body.appendChild(heading);
      addLine(body, "Brand", vehicle.brand);
      addLine(body, "Model", vehicle.model);
      addLine(body, "Year", vehicle.year);
      if (category === "Tank Trucks") {
        addLine(body, "Tanker Volume", vehicle.mileage ? String(vehicle.mileage) + " CBM" : "");
      } else {
        addLine(body, "Type", vehicle.sub_category || vehicle.subCategory);
        addLine(body, "Specifications", vehicle.specifications);
      }
      const price = document.createElement("p");
      price.className = "category-vehicle-price";
      price.textContent = vehicle.price || "Contact for Price";
      body.appendChild(price);
      const hint = document.createElement("span");
      hint.className = "details-hint";
      hint.textContent = "View Details →";
      body.appendChild(hint);
      link.appendChild(body);
      card.appendChild(link);

      const actions = document.createElement("div");
      actions.className = "vehicle-buttons";
      const inquiry = document.createElement("button");
      inquiry.type = "button";
      inquiry.className = "inquiry-btn";
      inquiry.textContent = "Inquire Now";
      inquiry.addEventListener("click", function () {
        if (typeof window.openInquiry === "function") window.openInquiry(vehicle);
      });
      actions.appendChild(inquiry);
      card.appendChild(actions);
      grid.appendChild(card);
    });
  }

  if (searchInput) searchInput.addEventListener("input", function () { searchTerm = searchInput.value.trim().toLowerCase(); render(window.TRUCK_FINDER_VEHICLES || []); });

  render(window.TRUCK_FINDER_VEHICLES || []);
  if (window.TRUCK_FINDER_VEHICLES_READY &&
      typeof window.TRUCK_FINDER_VEHICLES_READY.then === "function") {
    window.TRUCK_FINDER_VEHICLES_READY.then(render);
  }
})();