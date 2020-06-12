import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

export function AddAnalytes() {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='analyte_details'",
    onSuccess: () => {
      const { state } = this.context;
      let insert_analytes = state.insert_analytes;
      let analytes = state.analytes;
      let obj = {
        analyte_id: state.analyte_id
      };

      if (state.hims_d_investigation_test_id !== null) {
        let Insertobj = {
          ...obj,
          test_id: state.hims_d_investigation_test_id
        };
        insert_analytes.push(Insertobj);
      }

      analytes.push(obj);
      if (this.context !== undefined) {
        this.context.updateState({
          analytes: analytes,
          insert_analytes: insert_analytes,
          analyte_id: null
        });
      }
    }
  });
}

export function updateLabInvestigation(row) {
  const { state } = this.context;
  let analytes = state.analytes;
  let update_analytes = state.update_analytes;

  let analytes_index = analytes.indexOf(row);

  if (state.hims_d_investigation_test_id !== null) {
    let Updateobj = {
      hims_m_lab_analyte_id: row.hims_m_lab_analyte_id,
      record_status: "A"
    };
    if (row.hims_m_lab_analyte_id !== undefined) {
      update_analytes.push(Updateobj);
    } else {
      for (let j = 0; j < update_analytes.length; j++) {
        if (update_analytes[j].analyte_id === row.analyte_id) {
          update_analytes.splice(j, 1);
        }
      }
      update_analytes.push(Updateobj);
    }
  }

  analytes[analytes_index] = row;

  if (this.context !== undefined) {
    this.context.updateState({
      analytes: analytes,
      update_analytes: update_analytes
    });
  }
}

export function deleteLabAnalyte(row, rowId) {
  const { state } = this.context;
  let analytes = [...state.analytes];
  let update_analytes = [...state.update_analytes];
  let insert_analytes = [...state.insert_analytes];
  console.log(analytes, "analytes");
  if (state.hims_d_investigation_test_id !== null) {
    swal({
      title: "Are you Sure you want to Delete this Analyte?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willUpdate => {
      if (willUpdate.value) {
        if (row.hims_m_lab_analyte_id !== undefined) {
          console.log("hello", row);
          algaehApiCall({
            uri: "/investigation/deleteLabAnalyte",
            module: "laboratory",
            data: {
              hims_m_lab_analyte_id: row.hims_m_lab_analyte_id
            },
            method: "DELETE",
            onSuccess: response => {
              if (response.data.success === true) {
                findAndRemoveAnalyte(analytes, row);
                findAndRemoveAnalyte(update_analytes, row);
                if (this.context !== undefined) {
                  this.context.updateState({
                    analytes,
                    update_analytes
                  });
                }
                swalMessage({
                  type: "success",
                  title: "Deleted successfully ..."
                });
              }
            }
          });
        } else {
          findAndRemoveAnalyte(insert_analytes, row);
          findAndRemoveAnalyte(update_analytes, row);
          findAndRemoveAnalyte(analytes, row);
          if (this.context !== undefined) {
            this.context.updateState({
              analytes,
              update_analytes,
              insert_analytes
            });
          }
          swalMessage({
            type: "success",
            title: "Deleted successfully ..."
          });
        }
      }
    });
  }
}

function findAndRemoveAnalyte(analytes, row) {
  for (let l = 0; l < analytes.length; l++) {
    if (analytes[l].analyte_id === row.analyte_id) {
      analytes.splice(l, 1);
    }
  }
}

export function texthandle(ctrl, e) {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;
  let obj = {};
  if (name === "lab_section_id") {
    let analytes_required = e.selected.test_section === "M" ? false : true;
    obj = { [name]: value, analytes_required: analytes_required };
  } else {
    obj = { [name]: value };
  }
  this.context.updateState({
    ...obj
  });
}

export function analyteidhandle(ctrl, e) {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (this.context !== undefined) {
    this.context.updateState({
      [name]: value,
      analyte_type: e.selected.analyte_type,
      result_unit: e.selected.result_unit
    });
  }
}

export function containeridhandle(ctrl, e) {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (this.context !== undefined) {
    this.context.updateState({
      [name]: value,
      container_code: e.selected.container_id
    });
  }
}

// Dead Code

// export const texthandle = (ctrl, e) => {
//   e = e || ctrl;
//   let name = e.name || e.target.name;
//   let value = e.value === "" ? null : e.value || e.target.value;

//   switch (name) {
//     case "lab_section_id":
//       let analytes_required = e.selected.test_section === "M" ? false : true;
//       if (this.context !== undefined) {
//         this.context.updateState({
//           [name]: value,
//           analytes_required: analytes_required
//         });
//       }
//       break;

//     default:
//       if (this.context !== undefined) {
//         this.context.updateState({
//           [name]: value
//         });
//       }
//       break;
//   }
// };

// export const ageValidater = ($this, context) => {
//   let isError = false;

//   if ($this.state.age_type === "D" && parseFloat($this.state.to_age) > 30) {
//     swalMessage({
//       type: "warning",
//       title: "To Age cannot be greater than 30 Days"
//     });
//     isError = true;
//   } else if (
//     $this.state.age_type === "M" &&
//     parseFloat($this.state.to_age) > 12
//   ) {
//     swalMessage({
//       type: "warning",
//       title: "To Age cannot be greater than 12 Months"
//     });
//     isError = true;
//   }
//   if (parseFloat($this.state.from_age) > 0 && parseFloat($this.state.to_age)) {
//     if (parseFloat($this.state.from_age) > parseFloat($this.state.to_age)) {
//       swalMessage({
//         type: "warning",
//         title: "To Age cannot be less than From Age"
//       });
//       isError = true;
//     }
//   }
//   if (isError === true) {
//     $this.setState({
//       to_age: 0
//     });
//     context.updateState({
//       to_age: 0
//     });
//   }
// };

// export const containeridhandle = (ctrl, e) => {
//   e = e || ctrl;
//   let name = e.name || e.target.name;
//   let value = e.value || e.target.value;

//   if (this.context !== undefined) {
//     this.context.updateState({
//       [name]: value,
//       container_code: e.selected.container_id
//     });
//   }
// };

// export const analyteidhandle = (ctrl, e) => {
//   e = e || ctrl;
//   let name = e.name || e.target.name;
//   let value = e.value || e.target.value;

//   if (this.context !== undefined) {
//     this.context.updateState({
//       [name]: value,
//       analyte_type: e.selected.analyte_type,
//       result_unit: e.selected.result_unit
//     });
//   }
// };

// if ($this.state.analyte_id === null) {
//   swalMessage({
//     type: "warning",
//     title: "Please select analyte to add."
//   });
//   return;
// }
// }

// export const onchangegridcol = ($this, row, e) => {
//   let analytes = $this.state.analytes;
//   let analytes_index = analytes.indexOf(row);
//   let name = e.name || e.target.name;
//   let value = e.value || e.target.value;
//   row[name] = value;
//   analytes[analytes_index] = row;

//   $this.setState({ analytes: analytes });
// };
