import moment from "moment";
import { AlgaehValidation } from "../../../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";
import swal from "sweetalert2";
import Options from "../../../../../Options.json";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const AddEmpId = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='empIdGrid'",
    onSuccess: () => {
      if ($this.state.issue_date === null) {
        swalMessage({
          title: "Issue Date Cannot be Blank",
          type: "warning"
        });
        return;
      }
      if ($this.state.valid_upto === null) {
        swalMessage({
          title: "Expiry Date Cannot be Blank",
          type: "warning"
        });
        return;
      }
      let idDetails = $this.state.idDetails;
      let insertIdDetails = $this.state.insertIdDetails;

      let inpObj = {
        employee_id: $this.state.hims_d_employee_id,
        identity_documents_id: $this.state.identity_documents_id,
        identity_number: $this.state.identity_number,
        valid_upto: $this.state.valid_upto,
        issue_date: $this.state.issue_date,
        alert_required: $this.state.alert_required,
        alert_date: $this.state.alert_date
      };

      idDetails.push(inpObj);
      insertIdDetails.push(inpObj);

      $this.setState({
        idDetails: idDetails,
        insertIdDetails: insertIdDetails,
        identity_documents_id: null,
        identity_number: null,
        valid_upto: null,
        issue_date: null,
        alert_required: null,
        alert_date: null
      });

      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        idDetails: idDetails,
        insertIdDetails: insertIdDetails
      });
    }
  });
};
const addDependentType = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='dependentGrid'",
    onSuccess: () => {
      let dependentDetails = $this.state.dependentDetails;
      let insertDependentDetails = $this.state.insertDependentDetails;

      let inpObj = {
        employee_id: $this.state.hims_d_employee_id,
        dependent_type: $this.state.dependent_type,
        dependent_name: $this.state.dependent_name,
        dependent_identity_no: $this.state.dependent_identity_no,
        dependent_identity_type: $this.state.dependent_identity_type
      };

      dependentDetails.push(inpObj);
      insertDependentDetails.push(inpObj);

      $this.setState({
        dependentDetails: dependentDetails,
        insertDependentDetails: insertDependentDetails,
        dependent_type: null,
        dependent_name: null,
        dependent_identity_no: null,
        dependent_identity_type: null
      });

      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        dependentDetails: dependentDetails,
        insertDependentDetails: insertDependentDetails
      });
    }
  });
};

const getFamilyIdentification = $this => {
  algaehApiCall({
    uri: "/employee/getFamilyIdentification",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: $this.state.hims_d_employee_id },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        if (data.length > 0) {
          $this.setState({
            idDetails:
              $this.state.idDetails.length > 0
                ? $this.state.idDetails
                : data[0],
            dependentDetails:
              $this.state.dependentDetails.length > 0
                ? $this.state.dependentDetails
                : data[1]
          });
          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            idDetails:
              $this.state.idDetails.length > 0
                ? $this.state.idDetails
                : data[0],
            dependentDetails:
              $this.state.dependentDetails.length > 0
                ? $this.state.dependentDetails
                : data[1],
            dataFamIdsExists: true
          });
        }
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
};

const deleteIdentifications = ($this, row) => {
  swal({
    title: "Are you sure you want to delete Identification Component?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let idDetails = $this.state.idDetails;
      let insertIdDetails = $this.state.insertIdDetails;
      let deleteIdDetails = $this.state.deleteIdDetails;

      if (row.hims_d_employee_identification_id !== undefined) {
        deleteIdDetails.push(row);
        idDetails.splice(row.rowIdx, 1);
      } else {
        for (let x = 0; x < insertIdDetails.length; x++) {
          if (insertIdDetails[x].deductions_id === row.deductions_id) {
            insertIdDetails.splice(x, 1);
          }
        }

        idDetails.splice(row.rowIdx, 1);
      }
      $this.setState({
        idDetails: idDetails,
        deleteIdDetails: deleteIdDetails,
        insertIdDetails: insertIdDetails
      });

      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        idDetails: idDetails,
        deleteIdDetails: deleteIdDetails,
        insertIdDetails: insertIdDetails
      });
    }
  });
};

const updateIdentifications = ($this, row) => {
  let idDetails = $this.state.idDetails;
  let insertIdDetails = $this.state.insertIdDetails;
  let updateIdDetails = $this.state.updateIdDetails;

  if (row.hims_d_employee_identification_id !== undefined) {
    let Updateobj = {
      hims_d_employee_identification_id: row.hims_d_employee_identification_id,
      identity_documents_id: row.identity_documents_id,
      identity_number: row.identity_number,
      issue_date: row.issue_date,
      valid_upto: row.valid_upto
    };
    updateIdDetails.push(Updateobj);
    idDetails[row.rowIdx] = Updateobj;
  } else {
    {
      let Updateobj = {
        identity_documents_id: row.identity_documents_id,
        identity_number: row.identity_number,
        issue_date: row.issue_date,
        valid_upto: row.valid_upto
      };
      insertIdDetails[row.rowIdx] = Updateobj;
      idDetails[row.rowIdx] = Updateobj;
    }
  }
  $this.setState({
    idDetails: idDetails,
    updateIdDetails: updateIdDetails,
    insertIdDetails: insertIdDetails
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    idDetails: idDetails,
    updateIdDetails: updateIdDetails,
    insertIdDetails: insertIdDetails
  });
};

const deleteDependencies = ($this, row) => {
  swal({
    title: "Are you sure you want to delete Dependenties Component?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let dependentDetails = $this.state.dependentDetails;
      let insertDependentDetails = $this.state.insertDependentDetails;
      let deleteDependentDetails = $this.state.deleteDependentDetails;

      if (row.hims_d_employee_dependents_id !== undefined) {
        deleteDependentDetails.push(row);
        dependentDetails.splice(row.rowIdx, 1);
      } else {
        for (let x = 0; x < insertDependentDetails.length; x++) {
          if (insertDependentDetails[x].deductions_id === row.deductions_id) {
            insertDependentDetails.splice(x, 1);
          }
        }

        dependentDetails.splice(row.rowIdx, 1);
      }
      $this.setState({
        dependentDetails: dependentDetails,
        deleteDependentDetails: deleteDependentDetails,
        insertDependentDetails: insertDependentDetails
      });
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        dependentDetails: dependentDetails,
        deleteDependentDetails: deleteDependentDetails,
        insertDependentDetails: insertDependentDetails
      });
    } else {
      swalMessage({
        title: "Delete request cancelled",
        type: "error"
      });
    }
  });
};

const updateDependencies = ($this, row) => {
  let dependentDetails = $this.state.dependentDetails;
  let insertDependentDetails = $this.state.insertDependentDetails;
  let updateDependentDetails = $this.state.updateDependentDetails;

  if (row.hims_d_employee_dependents_id !== undefined) {
    let Updateobj = {
      hims_d_employee_dependents_id: row.hims_d_employee_dependents_id,
      dependent_type: row.dependent_type,
      dependent_name: row.dependent_name,
      dependent_identity_type: row.dependent_identity_type,
      dependent_identity_no: row.dependent_identity_no
    };
    updateDependentDetails.push(Updateobj);
    dependentDetails[row.rowIdx] = Updateobj;
  } else {
    {
      let Updateobj = {
        dependent_type: row.dependent_type,
        dependent_name: row.dependent_name,
        dependent_identity_type: row.dependent_identity_type,
        dependent_identity_no: row.dependent_identity_no
      };
      insertDependentDetails[row.rowIdx] = Updateobj;
      dependentDetails[row.rowIdx] = Updateobj;
    }
  }
  $this.setState({
    dependentDetails: dependentDetails,
    updateDependentDetails: updateDependentDetails,
    insertDependentDetails: insertDependentDetails
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    dependentDetails: dependentDetails,
    updateDependentDetails: updateDependentDetails,
    insertDependentDetails: insertDependentDetails
  });
};

const dateFormater = value => {
  if (value !== null) {
    return String(moment(value).format(Options.dateFormat));
  }
};

const datehandlegrid = ($this, row, ctrl, e) => {
  row[e] = moment(ctrl)._d;
  $this.setState({ append: !$this.state.append });
};

const datehandle = ($this, ctrl, e) => {
  let intFailure = false;
  if (e === "issue_date") {
    if (Date.parse($this.state.valid_upto) < Date.parse(moment(ctrl)._d)) {
      intFailure = true;
      swalMessage({
        title: "Issue Date cannot be grater than Expiry Date.",
        type: "warning"
      });
    }
  } else if (e === "valid_upto") {
    if (Date.parse(moment(ctrl)._d) < Date.parse($this.state.issue_date)) {
      intFailure = true;
      swalMessage({
        title: "Expiry Date cannot be less than Issue Date.",
        type: "warning"
      });
    }
  }

  if (intFailure === false) {
    $this.setState({
      [e]: moment(ctrl)._d
    });
  }
};

export {
  texthandle,
  datehandlegrid,
  addDependentType,
  AddEmpId,
  getFamilyIdentification,
  onchangegridcol,
  deleteIdentifications,
  updateIdentifications,
  deleteDependencies,
  updateDependencies,
  dateFormater,
  datehandle
};
