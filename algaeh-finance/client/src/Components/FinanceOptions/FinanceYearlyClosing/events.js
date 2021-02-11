import { newAlgaehApi } from "../../../hooks";
export async function getAccountsForYearEnd() {
  try {
    const response = await newAlgaehApi({
      uri: "/finance/getAccountsForYearEnd",
      module: "finance",
    }).catch((error) => {
      throw error;
    });
    return response.data;
  } catch (e) {
    throw e;
  }
}
export async function getYearEndingDetails() {
  try {
    const response = await newAlgaehApi({
      uri: "/finance/getYearEndingDetails",
      module: "finance",
    }).catch((error) => {
      throw error;
    });
    return response.data;
  } catch (e) {
    throw e;
  }
}
export async function getSelectedAccountDetails(input) {
  try {
    const response = await newAlgaehApi({
      uri: "/finance/getSelectedAccountDetails",
      module: "finance",
    }).catch((error) => {
      throw error;
    });
    return response.data;
  } catch (e) {
    throw e;
  }
}
export async function getFromPandL(input: {
  from_date: String,
  to_date: String,
  year: Number,
  to_head_id: Number,
  to_child_id: Number,
}) {
  try {
    const response = await newAlgaehApi({
      uri: "/finance/getYearEndData",
      module: "finance",
      data: input,
    }).catch((error) => {
      throw error;
    });
    console.log("response.data", response.data);
  } catch (e) {
    console.error(e);
  }
}
//
export async function processYearEnd(input) {
  try {
    const response = await newAlgaehApi({
      uri: "/finance/processYearEnd",
      module: "finance",
      method: "POST",
      data: input,
    }).catch((error) => {
      throw error;
    });
    return response.data;
  } catch (e) {
    throw e;
  }
}
