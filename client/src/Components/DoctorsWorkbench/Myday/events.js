import { algaehApiCall } from "../../../utils/algaehApiCall";
export default function MyDayEvents() {
  return {
    loadPatientsList: data => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/doctorsWorkBench/getMyDay",
          data: data,
          method: "GET",
          cancelRequestId: "getMyDay",
          onSuccess: response => {
            resolve(response);
          },
          onFailure: error => {
            reject(error);
          }
        });
      });
    }
  };
}
