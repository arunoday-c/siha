import { newAlgaehApi } from "../../../hooks";

export async function getAccountHeads() {
  const res = await newAlgaehApi({
    uri: "/finance/getAccountHeadsForDropdown",
    // data: input,
    method: "GET",
    module: "finance",
  });

  return res?.data?.result;
}

export async function getCards(input = {}) {
  const res = await newAlgaehApi({
    uri: "/cardmaster/getCards",
    method: "GET",
    module: "masterSettings",
  });
  return res?.data?.records;
}

export async function addCard(input = {}) {
  const res = await newAlgaehApi({
    uri: "/cardmaster/addCard",
    method: "POST",
    module: "masterSettings",
    data: input,
  });
  return res?.data?.records;
}

export async function updateCard(input = {}) {
  const res = await newAlgaehApi({
    uri: "/cardmaster/updateCard",
    method: "PUT",
    module: "masterSettings",
    data: input,
  });
  return res?.data?.records;
}

export async function deleteCard(hims_d_bank_card_id) {
  const res = await newAlgaehApi({
    uri: "/cardmaster/deleteCard",
    method: "DELETE",
    module: "masterSettings",
    data: { hims_d_bank_card_id },
  });
  return res?.data?.records;
}
