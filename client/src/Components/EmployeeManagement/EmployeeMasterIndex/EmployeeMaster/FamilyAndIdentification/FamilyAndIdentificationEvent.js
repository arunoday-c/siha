// import moment from "moment";
import { AlgaehValidation } from "../../../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: ctrl
  });
};

const AddEmpId = ($this, e) => {
  debugger;
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='empIdGrid'",
    onSuccess: () => {
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

      $this.setState({
        idDetails: idDetails,
        insertIdDetails: idDetails,
        identity_documents_id: null,
        identity_number: null,
        valid_upto: null,
        issue_date: null,
        alert_required: null,
        alert_date: null
      });

      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        idDetails: idDetails,
        insertIdDetails: idDetails
      });
    }
  });
};
const addDependentType = ($this, e) => {
  debugger;

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

      // if ($this.state.hims_d_employee_id !== null) {
      //   inpObj.employee_id = $this.state.hims_d_employee_id;
      //   insertIdDetails.push(inpObj);
      // }

      dependentDetails.push(inpObj);

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
        insertDependentDetails: dependentDetails
      });
    }
  });
};

const getFamilyIdentification = $this => {
  debugger;
  algaehApiCall({
    uri: "/employee/getFamilyIdentification",
    method: "GET",
    data: { employee_id: $this.state.hims_d_employee_id },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        if (data.length > 0) {
          debugger;
          $this.setState({
            idDetails: data[0],
            dependentDetails: data[1]
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

export {
  texthandle,
  datehandle,
  addDependentType,
  AddEmpId,
  getFamilyIdentification
};
