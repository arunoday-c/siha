import { algaehApiCall } from "../../../utils/algaehApiCall";
import { displayFileFromServer } from "../../../utils/GlobalFunctions";
export default function examination() {
  return {
    getMaster: (that, props) => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/examinationDiagram/getMaster",
          method: "GET",
          onSuccess: response => {
            if (response.data.success) {
              resolve(response.data.records);
            } else {
              reject(response);
            }
          }
        });
      });
    }
  };
}
