import { handleVehicleDetailsRequest } from "./_shared/vehicle-seo.js";

export async function onRequest(context) {
  return handleVehicleDetailsRequest(context);
}
