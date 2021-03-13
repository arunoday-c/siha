import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
// import swal from "sweetalert2";

const changeTexts = ($this, e) => {
  //   if (fromAuto) {
  //     $this.setState({
  //       icd_type: e.value,
  //     });
  //   } else {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
  //   }
};
const handleDropDown = ($this, e) => {
  $this.setState({
    icd_type: e.value,
  });
};

// const resetState = $this => {
//     $this.setState($this.baseState);
// };

// const onchangegridcol = ($this, row, e) => {
//     let name = e.name || e.target.name;
//     let value = e.value || e.target.value;
//     row[name] = value;
//     row.update();
// };

const updateICDcode = ($this, data) => {
  // data.updated_by = getCookie("UserID");

  algaehApiCall({
    uri: "/doctorsWorkBench/updateICDcode",
    data: data,
    method: "PUT",
    onSuccess: (response) => {
      if (response.data.success) {
        $this.props.getICDMaster({
          uri: "/doctorsWorkBench/getICDMaster",
          method: "GET",
          cancelRequestId: "getICDMaster",
          redux: {
            type: "ALL_ICDS",
            mappingName: "allIcds",
          },
        });
        swalMessage({
          title: "Record updated successfully . .",
          type: "success",
        });
      }
    },
    onFailure: (error) => {},
  });
};
const deleteICDMaster = ($this, data) => {
  // data.updated_by = getCookie("UserID");

  algaehApiCall({
    uri: "/doctorsWorkBench/deleteICDMaster",
    data: data,
    method: "DELETE",
    onSuccess: (response) => {
      if (response.data.success) {
        $this.props.getICDMaster({
          uri: "/doctorsWorkBench/getICDMaster",
          method: "GET",
          cancelRequestId: "getICDMaster",
          redux: {
            type: "ALL_ICDS",
            mappingName: "allIcds",
          },
        });
        swalMessage({
          title: "Record Deleted successfully . .",
          type: "success",
        });
      }
    },
    onFailure: (error) => {},
  });
};

const insertICDMaster = ($this, e) => {
  e.preventDefault();

  AlgaehValidation({
    alertTypeIcon: "warning",
    onSuccess: () => {
      algaehApiCall({
        uri: "/doctorsWorkBench/addICDMaster",
        data: $this.state,
        onSuccess: (response) => {
          if (response.data.success === true) {
            $this.setState({
              icd_code: null,
              icd_description: null,
              icd_type: "",
            });

            //Handle Successful Add here
            $this.props.getICDMaster({
              uri: "/doctorsWorkBench/getICDMaster",
              method: "GET",
              cancelRequestId: "getICDMaster",
              redux: {
                type: "ALL_ICDS",
                mappingName: "allIcds",
              },
            });
            swalMessage({
              title: "Allergy added successfully",
              type: "success",
            });
          } else {
            //Handle unsuccessful Add here.
          }
        },
      });
    },
  });
};

// const showconfirmDialog = ($this, id) => {
//     swal({
//         title: "Are you sure you want to delete this Selected Allergy?",
//         type: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes",
//         confirmButtonColor: "#44b8bd",
//         cancelButtonColor: "#d33",
//         cancelButtonText: "No"
//     }).then(willDelete => {
//         if (willDelete.value) {
//             let data = {
//                 hims_d_allergy_id: id
//             };
//             algaehApiCall({
//                 uri: "/doctorsWorkBench/deleteAllergy",
//                 data: data,
//                 method: "DELETE",
//                 onSuccess: response => {
//                     if (response.data.success) {
//                         swalMessage({
//                             title: "Record deleted successfully . ",
//                             type: "success"
//                         });
//                         $this.props.getAllergyDetails({
//                             uri: "/doctorsWorkBench/getAllergyDetails",
//                             method: "GET",
//                             cancelRequestId: "getAllergyDetails",
//                             redux: {
//                                 type: "ALL_ALLERGIES",
//                                 mappingName: "allallergies"
//                             }
//                         });
//                     }
//                 },
//                 onFailure: error => { }
//             });
//         }
//     });
// };

// const deleteAllergy = ($this, row) => {
//     showconfirmDialog($this, row.hims_d_allergy_id);
// };

export {
  changeTexts,
  // onchangegridcol,
  insertICDMaster,
  handleDropDown,
  updateICDcode,
  deleteICDMaster,
  // deleteAllergy
};
