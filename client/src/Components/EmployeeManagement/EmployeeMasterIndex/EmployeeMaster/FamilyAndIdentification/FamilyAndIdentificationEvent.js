import moment from "moment";
import { AlgaehValidation } from "../../../../../utils/GlobalFunctions";

let texthandlerInterval = null;

const texthandle = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({ [name]: value });
    }
    clearInterval(texthandlerInterval);
  }, 500);
};

const datehandle = ($this, context, ctrl, e) => {
  $this.setState({
    [e]: ctrl
  });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({ [e]: moment(ctrl)._d });
    }
    clearInterval(texthandlerInterval);
  }, 500);
};

const AddEmpId = ($this, context, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='empIdGrid'",
    onSuccess: () => {
      let idDetails = $this.state.idDetails;
      let insertIdDetails = $this.state.insertIdDetails;

      let inpObj = {
        identity_documents_id: $this.state.identity_documents_id,
        identity_number: $this.state.identity_number,
        valid_upto: $this.state.valid_upto,
        issue_date: $this.state.issue_date,
        alert_required: $this.state.alert_required,
        alert_date: $this.state.alert_date
      };

      // if ($this.state.hims_d_employee_id !== null) {
      //   inpObj.employee_id = $this.state.hims_d_employee_id;
      //   insertIdDetails.push(inpObj);
      // }

      idDetails.push(inpObj);

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
      if (context !== undefined) {
        context.updateState({
          idDetails: idDetails,
          insertIdDetails: insertIdDetails
        });
      }
    }
  });
};
const addDependentType = ($this, context, e) => {
  e.preventDefault();

  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='empIdGrid'",
    onSuccess: () => {
      let dependentDetails = $this.state.dependentDetails;
      let insertDependentDetails = $this.state.insertDependentDetails;

      let inpObj = {
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
      if (context !== undefined) {
        context.updateState({
          dependentDetails: dependentDetails,
          insertDependentDetails: insertDependentDetails
        });
      }
    }
  });
};

export { texthandle, datehandle, addDependentType, AddEmpId };
