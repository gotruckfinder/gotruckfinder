const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Truck Finder Dashboard</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,sans-serif;background:#f4f5f7;color:#222}
header{background:#182536;color:white;padding:20px 28px;font-size:20px;font-weight:bold}
main{max-width:1200px;margin:30px auto;padding:0 20px}
h1{font-size:26px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:15px}
.stat,.panel{background:white;padding:22px;border-radius:10px}
.stat strong{display:block;font-size:30px;margin-top:12px}
.panel{margin-top:24px}
button{background:#182536;color:white;border:0;padding:11px 18px;border-radius:6px;cursor:pointer}
input{padding:11px;border:1px solid #ddd;border-radius:6px;width:260px;max-width:100%}
table{width:100%;border-collapse:collapse;margin-top:18px}
th,td{text-align:left;padding:13px;border-bottom:1px solid #eee;font-size:14px}
th{color:#777}
#message{color:#777;margin-top:15px}
@media(max-width:700px){
.stats{grid-template-columns:repeat(2,1fr)}
.panel{overflow-x:auto}
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 15px 0;
}

#vehicleFormPanel h3 {
  margin-top: 24px;
  margin-bottom: 12px;
  font-size: 17px;
}

#vehicleFormPanel label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

#vehicleFormPanel input:not([type="checkbox"]),
#vehicleFormPanel select,
#vehicleFormPanel textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

#vehicleFormPanel textarea {
  resize: vertical;
  margin-bottom: 12px;
}

#vehicleFormPanel input[type="checkbox"] {
  width: auto;
  margin-right: 6px;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
</head>
<body>
<header>TRUCK FINDER　 /　 ADMIN</header>
<main>
<h1>Dashboard</h1>
<div class="stats">
<div class="stat">All Vehicles<strong id="total">—</strong></div>
<div class="stat">Available<strong id="available">—</strong></div>
<div class="stat">Drafts<strong id="draft">—</strong></div>
<div class="stat">Reserved / Sold<strong id="other">—</strong></div>
</div>
<div class="panel">

<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:15px;">

  <h2 style="margin:0;">Vehicle Inventory</h2>

  <button
    type="button"
    onclick="openNewVehicleForm()"
    style="background:#1677d2;color:white;padding:10px 18px;border:0;border-radius:6px;cursor:pointer;"
  >
    + Add New Vehicle
  </button>

</div>

<div style="display:flex;flex-wrap:wrap;gap:10px;margin:15px 0;">

  <input
    id="search"
    type="text"
    placeholder="Search code, vehicle, brand or model"
    style="flex:1;min-width:220px;"
  >

  <select id="categoryFilter" style="min-width:180px;">
    <option value="">All Categories</option>
    <option value="Truck Cranes">Truck Cranes</option>
    <option value="Aerial Work Platforms">Aerial Work Platforms</option>
    <option value="Sanitation Trucks">Sanitation Trucks</option>
    <option value="Tank Trucks">Tank Trucks</option>
  </select>

  <select id="statusFilter" style="min-width:150px;">
    <option value="">All Statuses</option>
    <option value="draft">Draft</option>
    <option value="available">Available</option>
    <option value="reserved">Reserved</option>
    <option value="sold">Sold</option>
  </select>

  <button type="button" onclick="loadVehicles()">Search</button>
  <button type="button" onclick="resetFilters()">Reset</button>
  <button type="button" onclick="loadVehicles()">Refresh</button>

</div>
<!-- Add New Vehicle Form -->
<div id="vehicleFormPanel" class="panel" style="display:none;margin-bottom:20px;">

  <h2 id="vehicleFormTitle">Add New Vehicle</h2>

  <form id="vehicleForm" onsubmit="saveVehicle(event)">

    <h3>Basic Information</h3>

    <div class="form-grid">

      <div>
        <label>Vehicle Code *</label>
        <input name="vehicle_code" required>
      </div>

      <div>
        <label>Vehicle Title *</label>
        <input name="title" required>
      </div>

      <div>
        <label>Category *</label>
        <select name="category" required>
          <option value="">Select Category</option>
          <option value="Truck Cranes">Truck Cranes</option>
          <option value="Aerial Work Platforms">Aerial Work Platforms</option>
          <option value="Sanitation Trucks">Sanitation Trucks</option>
          <option value="Tank Trucks">Tank Trucks</option>
        </select>
      </div>

      <div>
        <label>Brand</label>
        <input name="brand">
      </div>

      <div>
        <label>Model</label>
        <input name="model">
      </div>

      <div>
        <label>Year</label>
        <input name="year" type="number">
      </div>

      <div>
        <label>Mileage</label>
        <input name="mileage" type="number">
      </div>

      <div>
        <label>Price</label>
        <input name="price" type="number" step="0.01">
      </div>

      <div>
        <label>Location</label>
        <input name="location">
      </div>

    </div>

    <h3>Vehicle Specifications</h3>

    <div class="form-grid">

      <div>
        <label>Engine</label>
        <input name="engine">
      </div>

      <div>
        <label>Horsepower</label>
        <input name="horsepower" type="number">
      </div>

      <div>
        <label>Crane Brand</label>
        <input name="crane_brand">
      </div>

      <div>
        <label>Crane Capacity</label>
        <input name="crane_capacity">
      </div>

      <div>
        <label>Boom Type</label>
        <input name="boom_type">
      </div>

      <div>
        <label>Boom Length</label>
        <input name="boom_length">
      </div>

    </div>

<h3>Vehicle Details</h3>

<div>
  <label>Specifications</label>
  <textarea name="specifications" rows="4"></textarea>
</div>

<div>
  <label>Description</label>
  <textarea name="description" rows="5"></textarea>
</div>

<h3>Vehicle Images</h3>

<div style="margin-bottom:15px;">
  <label>Select Vehicle Images</label>
  <input
    type="file"
    id="vehicleImageInput"
    accept="image/jpeg,image/png,image/webp,image/avif"
    multiple
  >
  <p style="font-size:13px;color:#777;">
    Upload up to 20 images. JPEG, PNG, WebP and AVIF. Maximum 12 MB per image.
  </p>
</div>

<div
  id="vehicleImagePreview"
  style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;margin:15px 0;"
>
  <p style="color:#888;">No images loaded.</p>
</div>

<h3>Publishing Settings</h3>

    <div class="form-grid">

      <div>
        <label>Status</label>
        <select name="status">
          <option value="draft">Draft</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      <div>
        <label>
          <input type="checkbox" name="is_published">
          Publish this vehicle
        </label>
      </div>

    </div>

    <div style="display:flex;gap:10px;margin-top:20px;">
      <button type="submit" id="saveVehicleButton">Save Vehicle</button>
      <button type="button" onclick="hideVehicleForm()">Cancel</button>
    </div>

  </form>

</div>
<!-- End Add New Vehicle Form -->
<table>
<thead>
<tr>
<th>Vehicle Code</th>
<th>Vehicle</th>
<th>Category</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>
<tbody id="vehicles"></tbody>
</table>

<div id="message">Loading vehicles...</div>

<div id="pagination" style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:20px;">
  <span id="pageInfo">Page 1</span>
  <div style="display:flex;gap:8px;">
    <button id="prevPage" onclick="changePage(-1)" disabled>Previous</button>
    <button id="nextPage" onclick="changePage(1)" disabled>Next</button>
  </div>
</div>

</div>
</main>
<script>

const PAGE_SIZE = 20;
let currentPage = 1;
let lastFilters = null;
let editingVehicleId = null;

async function getList(params = "", page = 1) {
  const r = await fetch(
    "/api/vehicles?limit=" + PAGE_SIZE + "&page=" + page + params,
    { credentials: "same-origin" }
  );

  if (!r.ok) throw new Error("Unable to load vehicles");
  return await r.json();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[ch]);
}
function showVehicleForm() {
  const panel = document.getElementById("vehicleFormPanel");

  // Check whether the form was hidden before showing it
  const wasHidden =
    window.getComputedStyle(panel).display === "none";

  panel.style.display = "block";

  // Only scroll when opening the form for the first time
  if (wasHidden) {
    panel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}
  function openNewVehicleForm() {
  const form = document.getElementById("vehicleForm");

  form.reset();

  editingVehicleId = null;

  document.getElementById("vehicleFormTitle").textContent =
    "Add New Vehicle";

  document.getElementById("saveVehicleButton").textContent =
    "Save Vehicle";

  showVehicleForm();
}

function hideVehicleForm() {
  document.getElementById("vehicleFormPanel").style.display = "none";
}
async function editVehicle(id) {
  try {
    const response = await fetch("/api/vehicles/" + id, {
      method: "GET",
      credentials: "same-origin"
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to load vehicle");
    }

    const vehicle = result.vehicle;
    const images = result.images || [];
    const form = document.getElementById("vehicleForm");

    if (!vehicle) {
      throw new Error("Vehicle data not found");
    }

    // Fill vehicle information
    Object.entries(vehicle).forEach(([key, value]) => {
      const field = form.elements.namedItem(key);

      if (!field) return;

      if (field.type === "checkbox") {
        field.checked = Boolean(value);
      } else {
        field.value = value ?? "";
      }
    });

    editingVehicleId = Number(vehicle.id);

    document.getElementById("vehicleFormTitle").textContent =
      "Edit Vehicle";

    document.getElementById("saveVehicleButton").textContent =
      "Save Changes";

    showVehicleForm();



    
    // Display existing vehicle images
    const preview = document.getElementById("vehicleImagePreview");

    if (preview) {
      preview.replaceChildren();

      if (images.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No images uploaded yet.";
        emptyMessage.style.color = "#888";
        preview.appendChild(emptyMessage);

      } else {
        images.forEach((image, index) => {
          const item = document.createElement("div");

          item.style.cssText =
            "border:1px solid #ddd;border-radius:8px;padding:8px;";

          const img = document.createElement("img");

          img.src = image.image_url;
          img.alt = "Vehicle image";
          img.style.cssText =
            "width:100%;height:110px;object-fit:cover;border-radius:5px;";

          item.appendChild(img);

          // Display original image file name
          const fileName = document.createElement("div");

          fileName.textContent =
            image.file_name || "Existing image";

          fileName.style.cssText =
            "font-size:12px;color:#555;margin-top:6px;word-break:break-all;";

          item.appendChild(fileName);

          // Image sorting buttons
          const sortArea = document.createElement("div");

          sortArea.style.cssText =
            "display:flex;gap:6px;margin-top:8px;";

          // Move Up button
          const upButton = document.createElement("button");

          upButton.type = "button";
          upButton.textContent = "↑ Move Up";
          upButton.disabled = index === 0;

          upButton.style.cssText =
            "padding:6px 10px;background:#0d6efd;color:white;border:none;border-radius:5px;cursor:pointer;";

          if (upButton.disabled) {
            upButton.style.opacity = "0.4";
            upButton.style.cursor = "not-allowed";
          }

          upButton.addEventListener("click", async () => {
            const newImages = [...images];

            [newImages[index - 1], newImages[index]] =
              [newImages[index], newImages[index - 1]];

            upButton.disabled = true;
            upButton.textContent = "Saving...";

            try {
              const response = await fetch(
                "/api/vehicles/" + id + "/images",
                {
                  method: "PATCH",
                  credentials: "same-origin",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    image_ids: newImages.map(image => image.id)
                  })
                }
              );

              const result = await response.json();

              if (!response.ok) {
                throw new Error(result.error || "Unable to reorder images");
              }

              await editVehicle(id);

            } catch (error) {
              alert("Image sorting failed: " + error.message);
              upButton.disabled = false;
              upButton.textContent = "↑ Move Up";
            }
          });

          sortArea.appendChild(upButton);

          // Move Down button
          const downButton = document.createElement("button");

          downButton.type = "button";
          downButton.textContent = "↓ Move Down";
          downButton.disabled = index === images.length - 1;

          downButton.style.cssText =
            "padding:6px 10px;background:#0d6efd;color:white;border:none;border-radius:5px;cursor:pointer;";

          if (downButton.disabled) {
            downButton.style.opacity = "0.4";
            downButton.style.cursor = "not-allowed";
          }

          downButton.addEventListener("click", async () => {
            const newImages = [...images];

            [newImages[index], newImages[index + 1]] =
              [newImages[index + 1], newImages[index]];

            downButton.disabled = true;
            downButton.textContent = "Saving...";

            try {
              const response = await fetch(
                "/api/vehicles/" + id + "/images",
                {
                  method: "PATCH",
                  credentials: "same-origin",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    image_ids: newImages.map(image => image.id)
                  })
                }
              );

              const result = await response.json();

              if (!response.ok) {
                throw new Error(result.error || "Unable to reorder images");
              }

              await editVehicle(id);

            } catch (error) {
              alert("Image sorting failed: " + error.message);
              downButton.disabled = false;
              downButton.textContent = "↓ Move Down";
            }
          });

          sortArea.appendChild(downButton);
          item.appendChild(sortArea);

          // Display main image label
          if (Number(image.is_main) === 1) {
            const label = document.createElement("div");

            label.textContent = "Main Image";
            label.style.cssText =
              "font-size:12px;color:#16803c;margin-top:6px;font-weight:bold;";

            item.appendChild(label);

          } else {
            // Set as Main Image button
            const mainButton = document.createElement("button");

            mainButton.type = "button";
            mainButton.textContent = "Set as Main";
            mainButton.style.cssText =
              "margin-top:8px;margin-right:8px;padding:6px 12px;background:#198754;color:white;border:none;border-radius:5px;cursor:pointer;";

            mainButton.addEventListener("click", async () => {
              const confirmed = confirm(
                "Set this image as the main image?"
              );

              if (!confirmed) return;

              mainButton.disabled = true;
              mainButton.textContent = "Updating...";

              try {
                const response = await fetch(
                  "/api/vehicles/" + id + "/images/" + image.id,
                  {
                    method: "PATCH",
                    credentials: "same-origin"
                  }
                );

                const result = await response.json();

                if (!response.ok) {
                  throw new Error(result.error || "Unable to set main image");
                }

                await editVehicle(id);

                alert("Main image updated successfully!");

              } catch (error) {
                alert("Failed to update main image: " + error.message);

                mainButton.disabled = false;
                mainButton.textContent = "Set as Main";
              }
            });

            item.appendChild(mainButton);
          }

          // Delete image button
          const deleteButton = document.createElement("button");

          deleteButton.type = "button";
          deleteButton.textContent = "Delete";
          deleteButton.style.cssText =
            "margin-top:8px;padding:6px 12px;background:#dc3545;color:white;border:none;border-radius:5px;cursor:pointer;";

          deleteButton.addEventListener("click", async () => {
            const confirmed = confirm(
              "Are you sure you want to delete this image?"
            );

            if (!confirmed) return;

            deleteButton.disabled = true;
            deleteButton.textContent = "Deleting...";

            try {
              const response = await fetch(
                "/api/vehicles/" + id + "/images/" + image.id,
                {
                  method: "DELETE",
                  credentials: "same-origin"
                }
              );

              const result = await response.json();

              if (!response.ok) {
                throw new Error(result.error || "Unable to delete image");
              }

              await editVehicle(id);

              alert("Image deleted successfully!");

            } catch (error) {
              alert("Image deletion failed: " + error.message);

              deleteButton.disabled = false;
              deleteButton.textContent = "Delete";
            }
          });

          item.appendChild(deleteButton);
          preview.appendChild(item);
        });
      }
    }

  } catch (error) {
    alert("Unable to edit vehicle: " + error.message);
  }
}



async function deleteVehicle(id) {
  const confirmed = confirm(
    "Are you sure you want to delete this vehicle? This action cannot be undone."
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch("/api/vehicles/" + id, {
      method: "DELETE",
      credentials: "same-origin"
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to delete vehicle");
    }

    alert("Vehicle deleted successfully!");

    await loadVehicles();

  } catch (error) {
    alert("Delete failed: " + error.message);
  }
}
 
// Preview newly selected vehicle images
let selectedPreviewUrls = [];

function previewSelectedImages() {
  const input = document.getElementById("vehicleImageInput");
  const preview = document.getElementById("vehicleImagePreview");

  if (!input || !preview) return;

  // Remove previous temporary image URLs
  selectedPreviewUrls.forEach(url => URL.revokeObjectURL(url));
  selectedPreviewUrls = [];

  // Create the new-image preview area
  let selectedArea = document.getElementById("selectedImagePreview");

  if (!selectedArea) {
    const heading = document.createElement("p");

    heading.textContent = "New images selected:";
    heading.style.cssText =
      "font-size:13px;font-weight:bold;margin-top:15px;";

    selectedArea = document.createElement("div");
    selectedArea.id = "selectedImagePreview";
    selectedArea.style.cssText =
      "display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;";

    preview.appendChild(heading);
    preview.appendChild(selectedArea);
  }

  selectedArea.replaceChildren();

  Array.from(input.files || []).forEach(file => {
    if (!file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);
    selectedPreviewUrls.push(url);

    const item = document.createElement("div");
    item.style.cssText =
      "border:1px solid #ddd;border-radius:8px;padding:8px;";

    const img = document.createElement("img");
    img.src = url;
    img.alt = "Selected vehicle image";
    img.style.cssText =
      "width:100%;height:110px;object-fit:cover;border-radius:5px;";

    const name = document.createElement("div");
    name.textContent = file.name;
    name.style.cssText =
      "font-size:12px;color:#555;margin-top:6px;word-break:break-all;";

    item.appendChild(img);
    item.appendChild(name);
    selectedArea.appendChild(item);
  });
}

// Listen for newly selected images
const vehicleImageInput =
  document.getElementById("vehicleImageInput");

if (vehicleImageInput) {
  vehicleImageInput.addEventListener(
    "change",
    previewSelectedImages
  );
}

async function saveVehicle(event) {
  event.preventDefault();

  const form = document.getElementById("vehicleForm");
  const submitButton = document.getElementById("saveVehicleButton");
  const imageInput = document.getElementById("vehicleImageInput");

  const isEditing = editingVehicleId !== null;

  submitButton.disabled = true;
  submitButton.textContent = "Saving...";

  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.is_published = form.elements.is_published.checked;

    const numberFields = [
      "year",
      "mileage",
      "price",
      "horsepower"
    ];

    numberFields.forEach(field => {
      if (data[field] === "") {
        data[field] = null;
      } else {
        data[field] = Number(data[field]);
      }
    });

    const url = isEditing
      ? "/api/vehicles/" + editingVehicleId
      : "/api/vehicles";

    const response = await fetch(url, {
      method: isEditing ? "PATCH" : "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to save vehicle");
    }

    // Get the vehicle ID
    const vehicleId = isEditing
      ? editingVehicleId
      : result.id;

    if (!vehicleId) {
      throw new Error("Vehicle ID was not returned by the server");
    }

    // If this is a new vehicle, remember its ID.
    // This prevents duplicate vehicle creation if image upload fails.
    if (!isEditing) {
      editingVehicleId = vehicleId;

      document.getElementById("vehicleFormTitle").textContent =
        "Edit Vehicle";
    }

    // Upload selected images
    const imageFiles = imageInput
      ? Array.from(imageInput.files)
      : [];

    if (imageFiles.length > 0) {
      const imageFormData = new FormData();

      imageFiles.forEach(file => {
        imageFormData.append("files", file);
      });

      const uploadResponse = await fetch(
        "/api/vehicles/" + vehicleId + "/images",
        {
          method: "POST",
          credentials: "same-origin",
          body: imageFormData
        }
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadResult.error || "Vehicle saved, but image upload failed"
        );
      }
    }

    // Reset only after vehicle and images are saved successfully
    form.reset();

    editingVehicleId = null;

    document.getElementById("vehicleFormTitle").textContent =
      "Add New Vehicle";

    hideVehicleForm();

    alert("Vehicle and images saved successfully!");

    resetFilters();

  } catch (error) {
    alert("Save failed: " + error.message);

  } finally {
    submitButton.disabled = false;

    submitButton.textContent =
      editingVehicleId !== null
        ? "Save Changes"
        : "Save Vehicle";
  }
}

function getCurrentFilters() {
  return {
    search: document.getElementById("search").value.trim(),
    category: document.getElementById("categoryFilter").value,
    status: document.getElementById("statusFilter").value
  };
}

async function changePage(delta) {
  currentPage = Math.max(1, currentPage + delta);
  await loadVehicles();
}

function resetFilters() {
  document.getElementById("search").value = "";
  document.getElementById("categoryFilter").value = "";
  document.getElementById("statusFilter").value = "";

  currentPage = 1;
  lastFilters = JSON.stringify(getCurrentFilters());

  loadVehicles();
}

async function loadVehicles() {
  const message = document.getElementById("message");
  message.textContent = "Loading...";

  try {
    const filters = getCurrentFilters();
    const filterKey = JSON.stringify(filters);

    if (filterKey !== lastFilters) {
      currentPage = 1;
      lastFilters = filterKey;
    }

    const lists = await Promise.all([
      getList("", 1),
      getList("&status=available", 1),
      getList("&status=draft", 1),
      getList("&status=reserved", 1),
      getList("&status=sold", 1)
    ]);

    document.getElementById("total").textContent = lists[0].total;
    document.getElementById("available").textContent = lists[1].total;
    document.getElementById("draft").textContent = lists[2].total;
    document.getElementById("other").textContent =
      Number(lists[3].total) + Number(lists[4].total);

    let params = "";

    if (filters.search) {
      params += "&search=" + encodeURIComponent(filters.search);
    }

    if (filters.category) {
      params += "&category=" + encodeURIComponent(filters.category);
    }

    if (filters.status) {
      params += "&status=" + encodeURIComponent(filters.status);
    }

    const data = await getList(params, currentPage);

    const total = Number(data.total) || 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    if (currentPage > totalPages) {
      currentPage = totalPages;
      return await loadVehicles();
    }


document.getElementById("vehicles").innerHTML =
  (data.vehicles || []).map(v =>
    "<tr><td>" + escapeHtml(v.vehicle_code) +
    "</td><td>" + escapeHtml(v.title) +
    "</td><td>" + escapeHtml(v.category) +
    "</td><td>" + escapeHtml(v.status) +
    "</td><td>" +

    "<select id='status-" + Number(v.id) + "'>" +
    "<option value='draft' " + (v.status === "draft" ? "selected" : "") + ">Draft</option>" +
    "<option value='available' " + (v.status === "available" ? "selected" : "") + ">Available</option>" +
    "<option value='reserved' " + (v.status === "reserved" ? "selected" : "") + ">Reserved</option>" +
    "<option value='sold' " + (v.status === "sold" ? "selected" : "") + ">Sold</option>" +
    "</select> " +

    "<button type=\\\"button\\\" onclick=\\\"updateVehicleStatus(" + Number(v.id) + ")\\\">Update</button> " +

    "<button type=\\\"button\\\" onclick=\\\"editVehicle(" + Number(v.id) + ")\\\">Edit</button> " +

    "<button type=\\\"button\\\" onclick=\\\"deleteVehicle(" + Number(v.id) + ")\\\">Delete</button>" +

    "</td></tr>"
  ).join("");


const start = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
const end = Math.min(currentPage * PAGE_SIZE, total);

    message.textContent =
      "Showing " + start + "-" + end + " of " + total + " vehicles";

    document.getElementById("pageInfo").textContent =
      "Page " + currentPage + " of " + totalPages;

    document.getElementById("prevPage").disabled = currentPage <= 1;
    document.getElementById("nextPage").disabled = currentPage >= totalPages;

  } catch (e) {
    message.textContent = e.message;
  }
}

async function updateVehicleStatus(id) {
  const select = document.getElementById("status-" + id);

  if (!select) return;

  const newStatus = select.value;

  const confirmed = confirm(
    "Change this vehicle status to " + newStatus + "?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch("/api/vehicles/" + id, {
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: newStatus
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to update vehicle status");
    }

    alert("Vehicle status updated successfully!");

    await loadVehicles();

  } catch (error) {
    alert("Status update failed: " + error.message);
  }
}

loadVehicles();

</script>
</body>
</html>`;
const ADMIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Truck Finder Admin</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#f4f5f7;font-family:Arial,sans-serif;color:#222}
.container{max-width:420px;margin:90px auto;padding:30px;background:#fff;border-radius:12px;box-shadow:0 4px 20px #00000010}
h1{font-size:25px;margin:0 0 8px}
p{color:#777;font-size:14px;margin-bottom:25px}
input{width:100%;padding:13px;border:1px solid #ddd;border-radius:6px;font-size:16px;margin-bottom:15px}
button{width:100%;padding:13px;background:#1d2939;color:white;border:0;border-radius:6px;font-size:16px;cursor:pointer}
button:disabled{opacity:.6}
#message{margin-top:15px;font-size:14px;color:#c0392b}
</style>
</head>
<body>
<div class="container">
<h1>Truck Finder</h1>
<p>Vehicle Inventory Management</p>
<form id="loginForm">
<input id="password" type="password" placeholder="Admin password" required autocomplete="current-password">
<button id="loginButton" type="submit">Sign in</button>
</form>
<div id="message"></div>
</div>
<script>
document.getElementById("loginForm").addEventListener("submit",async function(e){
  e.preventDefault();
  const button=document.getElementById("loginButton");
  const message=document.getElementById("message");
  button.disabled=true;
  message.textContent="Signing in...";
  try{
    const response=await fetch("/api/login",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      credentials:"same-origin",
      body:JSON.stringify({password:document.getElementById("password").value})
    });
    const data=await response.json();
    if(!response.ok) throw new Error(data.error||"Login failed");
    message.style.color="green";
    message.textContent="Login successful";
    window.location.href="/admin";
  }catch(error){
    message.style.color="#c0392b";
    message.textContent=error.message;
  }finally{
    button.disabled=false;
  }
});
</script>
</body>
</html>`;
const IMAGE_BASE = "https://dev-images.gotruckfinder.com/";
const IMAGE_PREFIX = "test/vehicles/";
const MAX_IMAGE_SIZE = 12 * 1024 * 1024;
const MAX_FILES = 20;
const SESSION_HOURS = 8;

const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif"
};

const VEHICLE_FIELDS = [
  "vehicle_code", "title", "category", "brand", "model",
  "year", "mileage", "price", "location", "engine",
  "horsepower", "crane_brand", "crane_capacity",
  "boom_type", "boom_length", "specifications",
  "description", "status", "is_published"
];

const STATUSES = ["draft", "available", "reserved", "sold"];

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders
    }
  });
}

function cookieHeaders(value, maxAge = SESSION_HOURS * 3600) {
  return {
    "Set-Cookie":
      `tf_admin=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`
  };
}

function clearCookie() {
  return {
    "Set-Cookie":
      "tf_admin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"
  };
}

function base64url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signSession(expiry, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(String(expiry))
  );

  return `${expiry}.${base64url(new Uint8Array(signature))}`;
}

async function verifySession(request, secret) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/(?:^|;\s*)tf_admin=([^;]+)/);
  if (!match) return false;

  const parts = match[1].split(".");
  if (parts.length !== 2) return false;

  const expiry = Number(parts[0]);
  if (!Number.isSafeInteger(expiry) || expiry < Date.now()) return false;

  const expected = await signSession(expiry, secret);
  return match[1] === expected;
}

async function sameSecret(a, b) {
  const encoder = new TextEncoder();
  const hashA = new Uint8Array(
    await crypto.subtle.digest("SHA-256", encoder.encode(a))
  );
  const hashB = new Uint8Array(
    await crypto.subtle.digest("SHA-256", encoder.encode(b))
  );

  let difference = 0;
  for (let i = 0; i < hashA.length; i++) {
    difference |= hashA[i] ^ hashB[i];
  }
  return difference === 0;
}

function validId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function imageKeyFromUrl(value) {
  try {
    const url = new URL(value);
    const expectedOrigin = new URL(IMAGE_BASE).origin;

    if (url.origin !== expectedOrigin) return null;

    const key = decodeURIComponent(url.pathname.slice(1));
    return key.startsWith(IMAGE_PREFIX) ? key : null;
  } catch {
    return null;
  }
}

function makeImageUrl(key) {
  return IMAGE_BASE + key.split("/").map(encodeURIComponent).join("/");
}

function validOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

async function readJson(request) {
  const length = Number(request.headers.get("Content-Length") || 0);
  if (length > 1024 * 1024) throw new Error("Request body too large");
  return await request.json();
}

async function handle(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method.toUpperCase();
  if (path === "/admin" && method === "GET") {
  const authenticated = await verifySession(request, env.ADMIN_TOKEN);
  const page = authenticated ? DASHBOARD_HTML : ADMIN_HTML;

  return new Response(page, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "no-store"
    }
  });
}
  if (method === "OPTIONS") {
    return json({ error: "Preflight requests are not supported" }, 405);
  }

  if (path === "/" && method === "GET") {
    return json({
      service: "Truck Finder Development API",
      status: "online",
      version: "1.1"
    });
  }

  if (!path.startsWith("/api/")) {
    return json({ error: "Not found" }, 404);
  }

  if (!env.TEST_DB || !env.BUCKET || !env.ADMIN_TOKEN) {
    return json({ error: "Server configuration incomplete" }, 500);
  }

  if (!validOrigin(request)) {
    return json({ error: "Invalid request origin" }, 403);
  }

  // Login
  if (path === "/api/login" && method === "POST") {
    const data = await readJson(request);

    if (typeof data.password !== "string" ||
        !(await sameSecret(data.password, env.ADMIN_TOKEN))) {
      return json({ error: "Incorrect password" }, 401);
    }

    const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
    const session = await signSession(expiry, env.ADMIN_TOKEN);

    return json(
      { success: true, expires_in: SESSION_HOURS * 3600 },
      200,
      cookieHeaders(session)
    );
  }

  // Logout
  if (path === "/api/logout" && method === "POST") {
    return json({ success: true }, 200, clearCookie());
  }

  // Authentication check
  if (!(await verifySession(request, env.ADMIN_TOKEN))) {
    return json({ error: "Unauthorized" }, 401);
  }

  const db = env.TEST_DB;
  const bucket = env.BUCKET;

  // Check login session
  if (path === "/api/me" && method === "GET") {
    return json({ authenticated: true });
  }

  // List and search vehicles
  if (path === "/api/vehicles" && method === "GET") {
    const search = (url.searchParams.get("search") || "").trim();
    const category = url.searchParams.get("category");
    const status = url.searchParams.get("status");
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 30));
    const offset = (page - 1) * limit;

    let where = " WHERE 1=1";
    const params = [];

    if (search) {
      where += " AND (vehicle_code LIKE ? OR title LIKE ? OR brand LIKE ? OR model LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (category) {
      where += " AND category = ?";
      params.push(category);
    }

    if (status) {
      where += " AND status = ?";
      params.push(status);
    }

    const count = await db.prepare(
      "SELECT COUNT(*) AS total FROM vehicles" + where
    ).bind(...params).first();

    const result = await db.prepare(
      "SELECT * FROM vehicles" + where +
      " ORDER BY updated_at DESC LIMIT ? OFFSET ?"
    ).bind(...params, limit, offset).all();

    return json({
      vehicles: result.results || [],
      total: count?.total || 0,
      page,
      limit
    });
  }

  // Create vehicle
  if (path === "/api/vehicles" && method === "POST") {
    const data = await readJson(request);

    if (typeof data.vehicle_code !== "string" ||
        !data.vehicle_code.trim() ||
        typeof data.title !== "string" ||
        !data.title.trim() ||
        typeof data.category !== "string" ||
        !data.category.trim()) {
      return json({
        error: "Vehicle code, title and category are required"
      }, 400);
    }

    const status = data.status || "draft";
    if (!STATUSES.includes(status)) {
      return json({ error: "Invalid vehicle status" }, 400);
    }

    const fields = VEHICLE_FIELDS.filter(
      field => data[field] !== undefined
    );

    if (!fields.includes("status")) fields.push("status");
    if (!fields.includes("is_published")) fields.push("is_published");

    const values = fields.map(field => {
      if (field === "status") return status;
      if (field === "is_published") return data[field] ? 1 : 0;
      return data[field];
    });

    const result = await db.prepare(
      `INSERT INTO vehicles (${fields.join(", ")})
       VALUES (${fields.map(() => "?").join(", ")})`
    ).bind(...values).run();

    return json({
      success: true,
      id: result.meta.last_row_id,
      vehicle_code: data.vehicle_code
    }, 201);
  }

  // Vehicle-specific routes
  const vehicleMatch = path.match(/^\/api\/vehicles\/(\d+)(?:\/(images)(?:\/(\d+))?)?$/);

  if (vehicleMatch) {
    const id = validId(vehicleMatch[1]);
    if (!id) return json({ error: "Invalid vehicle ID" }, 400);
    const imageId = vehicleMatch[3]
  ? Number(vehicleMatch[3])
  : null;

if (imageId !== null &&
    (!Number.isSafeInteger(imageId) || imageId <= 0)) {
  return json({ error: "Invalid image ID" }, 400);
}

    const isImagesRoute = vehicleMatch[2] === "images";

    const vehicle = await db.prepare(
      "SELECT * FROM vehicles WHERE id = ?"
    ).bind(id).first();

    if (!vehicle) return json({ error: "Vehicle not found" }, 404);

    // Delete a single vehicle image
    // Reorder vehicle images
if (isImagesRoute && imageId === null && method === "PATCH") {
  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const imageIds = body.image_ids;

  if (
    !Array.isArray(imageIds) ||
    imageIds.some(id => !Number.isSafeInteger(id) || id <= 0) ||
    new Set(imageIds).size !== imageIds.length
  ) {
    return json({ error: "Invalid image ID list" }, 400);
  }

  const existing = await db.prepare(
    "SELECT id FROM vehicle_images WHERE vehicle_id = ? ORDER BY sort_order, id"
  ).bind(id).all();

  const existingIds = existing.results.map(image => image.id);

  if (
    imageIds.length !== existingIds.length ||
    existingIds.some(id => !imageIds.includes(id))
  ) {
    return json({ error: "Image list does not match vehicle images" }, 400);
  }

  const statements = imageIds.map((imageId, index) =>
    db.prepare(
      "UPDATE vehicle_images SET sort_order = ? WHERE id = ? AND vehicle_id = ?"
    ).bind(index, imageId, id)
  );

  if (statements.length > 0) {
    await db.batch(statements);
  }

  return json({
    success: true,
    image_ids: imageIds
  });
}
// Set a vehicle image as the main image
if (isImagesRoute && imageId !== null && method === "PATCH") {
  const image = await db.prepare(
    "SELECT id FROM vehicle_images WHERE id = ? AND vehicle_id = ?"
  ).bind(imageId, id).first();

  if (!image) {
    return json({ error: "Image not found" }, 404);
  }

  await db.batch([
    db.prepare(
      "UPDATE vehicle_images SET is_main = 0 WHERE vehicle_id = ?"
    ).bind(id),

    db.prepare(
      "UPDATE vehicle_images SET is_main = 1 WHERE id = ? AND vehicle_id = ?"
    ).bind(imageId, id)
  ]);

  return json({
    success: true,
    main_image_id: imageId
  });
}
    if (isImagesRoute && imageId !== null && method === "DELETE") {
      const image = await db.prepare(
        "SELECT * FROM vehicle_images WHERE id = ? AND vehicle_id = ?"
      ).bind(imageId, id).first();

      if (!image) {
        return json({ error: "Image not found" }, 404);
      }

      let imageKey;

      try {
        const imageUrl = new URL(image.image_url);

        if (imageUrl.origin !== new URL(IMAGE_BASE).origin) {
          return json({ error: "Invalid image location" }, 400);
        }

        imageKey = decodeURIComponent(
          imageUrl.pathname.replace(/^\/+/, "")
        );
      } catch {
        return json({ error: "Invalid image URL" }, 400);
      }

      const expectedPrefix =
        `${IMAGE_PREFIX}${vehicle.vehicle_code}/`;

      if (!imageKey.startsWith(expectedPrefix)) {
        return json({ error: "Image is outside the development vehicle folder" }, 400);
      }

      // Delete the R2 object first
      await bucket.delete(imageKey);

      // Delete the D1 image record
      await db.prepare(
        "DELETE FROM vehicle_images WHERE id = ? AND vehicle_id = ?"
      ).bind(imageId, id).run();

      // Reset main image status
      await db.prepare(
        "UPDATE vehicle_images SET is_main = 0 WHERE vehicle_id = ?"
      ).bind(id).run();

      const nextMain = await db.prepare(
        "SELECT id FROM vehicle_images WHERE vehicle_id = ? ORDER BY sort_order, id LIMIT 1"
      ).bind(id).first();

      if (nextMain) {
        await db.prepare(
          "UPDATE vehicle_images SET is_main = 1 WHERE id = ? AND vehicle_id = ?"
        ).bind(nextMain.id, id).run();
      }

      return json({
        success: true,
        deleted_image_id: imageId,
        new_main_image_id: nextMain ? nextMain.id : null
      });
    }


    // Upload multiple images
    if (isImagesRoute && method === "POST") {
      const form = await request.formData();
      const files = form.getAll("files").filter(
        file => file && typeof file.arrayBuffer === "function"
      );

      if (!files.length || files.length > MAX_FILES) {
        return json({ error: "Upload between 1 and 20 images" }, 400);
      }

      for (const file of files) {
        if (!IMAGE_TYPES[file.type] ||
            file.size <= 0 ||
            file.size > MAX_IMAGE_SIZE) {
          return json({
            error: "Only JPEG, PNG, WebP and AVIF images up to 12 MB are accepted"
          }, 400);
        }
      }

      const existing = await db.prepare(
        "SELECT COUNT(*) AS total FROM vehicle_images WHERE vehicle_id = ?"
      ).bind(id).first();

      let order = Number(existing?.total || 0);
      const uploadedKeys = [];
      const uploadedRows = [];

      try {
        for (const file of files) {
          const extension = IMAGE_TYPES[file.type];
          const key =
            `${IMAGE_PREFIX}${vehicle.vehicle_code}/${crypto.randomUUID()}.${extension}`;



          await bucket.put(key, await file.arrayBuffer(), {
  httpMetadata: { contentType: file.type }
});

uploadedKeys.push(key);

const result = await db.prepare(
  `INSERT INTO vehicle_images
   (vehicle_id, image_url, is_main, sort_order)
   VALUES (?, ?, ?, ?)`
).bind(
  id,
  makeImageUrl(key),
  order === 0 ? 1 : 0,
  order
).run();

uploadedRows.push({
  id: result.meta.last_row_id,
  image_url: makeImageUrl(key),
  file_name: file.name,
  is_main: order === 0,
  sort_order: order
});

order++;

        }
      } catch (error) {
        for (const row of uploadedRows) {
          await db.prepare(
            "DELETE FROM vehicle_images WHERE id = ?"
          ).bind(row.id).run();
        }

        for (const key of uploadedKeys) {
          await bucket.delete(key);
        }

        throw error;
      }

      return json({ success: true, images: uploadedRows }, 201);
    }

    if (isImagesRoute) {
      return json({ error: "Method not allowed" }, 405);
    }

    // Vehicle details and images
    if (method === "GET") {
      const images = await db.prepare(
        "SELECT * FROM vehicle_images WHERE vehicle_id = ? ORDER BY sort_order, id"
      ).bind(id).all();

      return json({
        vehicle,
        images: images.results || []
      });
    }

    // Update vehicle
    if (method === "PATCH") {
      const data = await readJson(request);

      if (data.status !== undefined && !STATUSES.includes(data.status)) {
        return json({ error: "Invalid vehicle status" }, 400);
      }

      const fields = VEHICLE_FIELDS.filter(
        field => data[field] !== undefined
      );

      if (!fields.length) {
        return json({ error: "No editable fields supplied" }, 400);
      }

      const assignments = fields.map(field => `${field} = ?`).join(", ");
      const values = fields.map(field => {
        if (field === "is_published") return data[field] ? 1 : 0;
        return data[field];
      });

      await db.prepare(
        `UPDATE vehicles SET ${assignments},
         updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).bind(...values, id).run();

      return json({ success: true, id });
    }

    // Delete vehicle and its images
    if (method === "DELETE") {
      const images = await db.prepare(
        "SELECT image_url FROM vehicle_images WHERE vehicle_id = ?"
      ).bind(id).all();

      await db.batch([
        db.prepare("DELETE FROM vehicle_images WHERE vehicle_id = ?").bind(id),
        db.prepare("DELETE FROM vehicles WHERE id = ?").bind(id)
      ]);

      for (const image of images.results || []) {
        const key = imageKeyFromUrl(image.image_url);
        const expectedVehiclePrefix =
          `${IMAGE_PREFIX}${vehicle.vehicle_code}/`;

        if (key && key.startsWith(expectedVehiclePrefix)) {
          await bucket.delete(key);
        }
      }

      return json({ success: true, deleted_id: id });
    }
  }

  // Individual image operations
  const imageMatch = path.match(/^\/api\/images\/(\d+)$/);

  if (imageMatch) {
    const imageId = validId(imageMatch[1]);
    if (!imageId) return json({ error: "Invalid image ID" }, 400);

    const image = await db.prepare(
      "SELECT * FROM vehicle_images WHERE id = ?"
    ).bind(imageId).first();

    if (!image) return json({ error: "Image not found" }, 404);

    if (method === "PATCH") {
      const data = await readJson(request);
      const statements = [];

      if (data.is_main === true) {
        statements.push(
          db.prepare(
            "UPDATE vehicle_images SET is_main = 0 WHERE vehicle_id = ?"
          ).bind(image.vehicle_id)
        );

        statements.push(
          db.prepare(
            "UPDATE vehicle_images SET is_main = 1 WHERE id = ?"
          ).bind(imageId)
        );
      }

      if (data.sort_order !== undefined) {
        const sortOrder = Number(data.sort_order);

        if (!Number.isInteger(sortOrder) || sortOrder < 0) {
          return json({ error: "Invalid sort_order" }, 400);
        }

        statements.push(
          db.prepare(
            "UPDATE vehicle_images SET sort_order = ? WHERE id = ?"
          ).bind(sortOrder, imageId)
        );
      }

      if (!statements.length) {
        return json({ error: "No image changes supplied" }, 400);
      }

      await db.batch(statements);
      return json({ success: true });
    }

    if (method === "DELETE") {
      await db.prepare(
        "DELETE FROM vehicle_images WHERE id = ?"
      ).bind(imageId).run();

      const key = imageKeyFromUrl(image.image_url);
      if (key) await bucket.delete(key);

      if (image.is_main) {
        const next = await db.prepare(
          `SELECT id FROM vehicle_images
           WHERE vehicle_id = ?
           ORDER BY sort_order, id LIMIT 1`
        ).bind(image.vehicle_id).first();

        if (next) {
          await db.prepare(
            "UPDATE vehicle_images SET is_main = 1 WHERE id = ?"
          ).bind(next.id).run();
        }
      }

      return json({ success: true, deleted_image_id: imageId });
    }
  }

  return json({ error: "Not found" }, 404);
}

export default {
  async fetch(request, env) {
    try {
      return await handle(request, env);
    } catch (error) {
      console.error("Truck Finder API error:", error);

      const message = String(error?.message || "");

      if (message.includes("UNIQUE constraint failed")) {
        return json({ error: "Vehicle code already exists" }, 409);
      }

      if (message.includes("Request body too large")) {
        return json({ error: message }, 413);
      }

      return json({ error: "Internal server error" }, 500);
    }
  }
};