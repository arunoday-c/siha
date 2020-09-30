import { newAlgaehApi } from "../../../hooks";

export async function getPromotions() {
  const res = await newAlgaehApi({
    uri: "/promotionmaster/getPromotions",
    method: "GET",
    module: "masterSettings",
  });
  return res?.data?.records;
}

export async function addPromotion(input = {}) {
  const res = await newAlgaehApi({
    uri: "/promotionmaster/addPromotion",
    method: "POST",
    module: "masterSettings",
    data: input,
  });
  return res?.data?.records;
}

export async function updatePromotion(input = {}) {
  const res = await newAlgaehApi({
    uri: "/promotionmaster/updatePromotion",
    method: "PUT",
    module: "masterSettings",
    data: input,
  });
  return res?.data?.records;
}

export async function deletePromotion(hims_d_promo_id) {
  const res = await newAlgaehApi({
    uri: "/promotionmaster/deletePromotion",
    method: "DELETE",
    module: "masterSettings",
    data: { hims_d_promo_id },
  });
  return res?.data?.records;
}
