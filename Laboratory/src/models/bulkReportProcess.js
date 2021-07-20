import axios from "axios";
export async function report(input) {
  try {
    await axios.get("http://localhost:3018/api/v1/report", {
      headers: {
        Accept: "blob",
        responseType: "blob",
      },
      params: {
        report: {
          reportToPortal: "true",
          reportParams: input,
        },
      },
    });
  } catch (e) {
    console.error(`Report error ${new Date().toLocaleString()} :===>`, e);
  }
}
