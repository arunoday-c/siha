import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;

  switch (name) {
    case "lab_section_id":
      let analytes_required = e.selected.test_section === "M" ? false : true;
      $this.setState({
        [name]: value,
        analytes_required: analytes_required
      });

      if (context !== undefined) {
        context.updateState({
          [name]: value,
          analytes_required: analytes_required
        });
      }

      break;

    default:
      $this.setState({
        [name]: value
      });

      if (context !== undefined) {
        context.updateState({
          [name]: value
        });
      }

      break;
  }
};

const containeridhandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    container_code: e.selected.container_id
  });

  if (context !== undefined) {
    context.updateState({
      [name]: value,
      container_code: e.selected.container_id
    });
  }
};

const analyteidhandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    analyte_type: e.selected.analyte_type,
    result_unit: e.selected.result_unit
  });

  if (context !== undefined) {
    context.updateState({
      [name]: value,
      analyte_type: e.selected.analyte_type,
      result_unit: e.selected.result_unit
    });
  }
};

const AddAnalytes = ($this, context) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='analyte_details'",
    onSuccess: () => {
      let insert_analytes = $this.state.insert_analytes;
      let analytes = $this.state.analytes;
      let obj = {
        analyte_id: $this.state.analyte_id,
        analyte_type: $this.state.analyte_type,
        result_unit: $this.state.result_unit,
        age_type: $this.state.age_type,
        gender: $this.state.gender,
        from_age: $this.state.from_age,
        to_age: $this.state.to_age,
        critical_low: $this.state.critical_low,
        critical_high: $this.state.critical_high,
        normal_low: $this.state.normal_low,
        normal_high: $this.state.normal_high
      };

      if ($this.state.hims_d_investigation_test_id !== null) {
        let Insertobj = {
          ...obj,
          test_id: $this.state.hims_d_investigation_test_id
        };
        insert_analytes.push(Insertobj);
      }

      analytes.push(obj);
      $this.setState(
        {
          analytes: analytes,
          insert_analytes: insert_analytes,
          analyte_id: null
        },
        () => $this.clearInputState()
      );
      if (context !== undefined) {
        context.updateState({
          analytes: analytes,
          insert_analytes: insert_analytes,
          analyte_id: null
        });
      }
    }
  });
  // if ($this.state.analyte_id === null) {
  //   swalMessage({
  //     type: "warning",
  //     title: "Please select analyte to add."
  //   });
  //   return;
  // }
};

const updateLabInvestigation = ($this, context, row) => {
  let analytes = $this.state.analytes;
  let update_analytes = $this.state.update_analytes;

  let analytes_index = analytes.indexOf(row)
  // let update_analytes_index = update_analytes.indexOf(row)

  if ($this.state.hims_d_investigation_test_id !== null) {
    let Updateobj = {
      hims_m_lab_analyte_id: row.hims_m_lab_analyte_id,
      critical_low: row.critical_low,
      critical_high: row.critical_high,
      normal_low: row.normal_low,
      normal_high: row.normal_high,
      gender: row.gender,
      from_age: row.from_age,
      to_age: row.to_age,
      age_type: row.age_type,
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

  $this.setState({
    analytes: analytes,
    update_analytes: update_analytes
  });

  if (context !== undefined) {
    context.updateState({
      analytes: analytes,
      update_analytes: update_analytes
    });
  }
};

const deleteLabAnalyte = ($this, context, row, rowId) => {
  let analytes = $this.state.analytes;
  let update_analytes = $this.state.update_analytes;
  let insert_analytes = $this.state.insert_analytes;

  if ($this.state.hims_d_investigation_test_id !== null) {
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
                $this.setState({
                  analytes,
                  update_analytes
                });
                if (context !== undefined) {
                  context.updateState({
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
          $this.setState({
            analytes,
            update_analytes,
            insert_analytes
          });
          if (context !== undefined) {
            context.updateState({
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
};

function findAndRemoveAnalyte(analytes, row) {
  for (let l = 0; l < analytes.length; l++) {
    if (
      analytes[l].analyte_id === row.analyte_id &&
      analytes[l].gender === row.gender &&
      analytes[l].from_age === row.from_age
    ) {
      analytes.splice(l, 1);
    }
  }
}

const onchangegridcol = ($this, row, e) => {
  let analytes = $this.state.analytes;
  let analytes_index = analytes.indexOf(row)
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  analytes[analytes_index] = row;

  $this.setState({ analytes: analytes });
};

export {
  texthandle,
  analyteidhandle,
  containeridhandle,
  AddAnalytes,
  updateLabInvestigation,
  deleteLabAnalyte,
  onchangegridcol
};
