import { algaehApiCall } from "../../utils/algaehApiCall";

export function reportHandler($this) {
  return {
    getDeptDocs: () => {
      algaehApiCall({
        uri: "/department/get/get_All_Doctors_DepartmentWise",
        module: "masterSettings",
        method: "GET",
        onSuccess: response => {
          if (response.data.success) {
            $this.setState({
              doctors: response.data.records.doctors,
              departments: response.data.records.departmets
            });
          }
        },

        onError: error => {}
      });
    }
  };
}
