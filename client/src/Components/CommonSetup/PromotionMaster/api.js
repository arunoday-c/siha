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

export async function getServiceTypes() {
  const res = await newAlgaehApi({
    uri: "/serviceType",
    module: "masterSettings",
    method: "GET",
  });
  return res?.data?.records;
}

export async function addPromotionDetail(input = {}) {
  const res = await newAlgaehApi({
    uri: "/promotionmaster/addPromotionDetail",
    method: "POST",
    module: "masterSettings",
    data: input,
  });
  return res?.data?.records;
}

export async function getPromotionDetails(key, { promo_id }) {
  const res = await newAlgaehApi({
    uri: "/promotionmaster/getPromotionDetails",
    method: "GET",
    module: "masterSettings",
    data: { promo_id },
  });
  return res?.data?.records;
}

export async function updatePromotionDetail(input = {}) {
  const res = await newAlgaehApi({
    uri: "/promotionmaster/updatePromotionDetail",
    method: "PUT",
    module: "masterSettings",
    data: input,
  });
  return res?.data?.records;
}

export async function deletePromotionDetail({ hims_d_promotion_detail_id }) {
  const res = await newAlgaehApi({
    uri: "/promotionmaster/deletePromotionDetail",
    method: "DELETE",
    module: "masterSettings",
    data: { hims_d_promotion_detail_id },
  });
  return res?.data?.records;
}

export async function getPatientsForPromo(key, { gender, age_range }) {
  const res = await newAlgaehApi({
    uri: "/promotionmaster/getPatientsForPromo",
    method: "GET",
    module: "masterSettings",
    data: { gender, age_range },
  });
  return res?.data?.records;
}
