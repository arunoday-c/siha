import swal from "sweetalert2";
import momemt from "moment";
import {
  algaehApiCall,
  swalMessage
} from "../../../../../../../utils/algaehApiCall";
export function deleteProjectRoster(data) {
  return new Promise((resolve, reject) => {
    swal({
      title: `Do you want to delete?`,
      text: `${data.project_desc} for the ${momemt(data.attendance_date).format(
        "DD-MM-YYYY"
      )}`,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/projectjobcosting/deleteProjectRoster",
          method: "DELETE",
          module: "hrManagement",
          data: {
            hims_f_project_roster_id: data.hims_f_project_roster_id
          },
          onSuccess: res => {
            const { success } = res.data;
            if (success) {
              swalMessage({
                title: "Record Deleted Successfully . .",
                type: "success"
              });
              resolve();
              // this.getEmployeesForProjectRoster();
            } else if (!success) {
              swalMessage({
                title: res.data.records.message,
                type: "warning"
              });
              reject();
            }
          },
          onCatch: e => {
            reject();
          }
        });
      } else {
        reject();
      }
    });
  });
}
