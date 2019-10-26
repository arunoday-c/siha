import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall.js";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import Enumerable from "linq";
import LeaveEncashmentProcessIOputs from "../../../Models/LeaveEncashmentProcess";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

const texthandler = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const LoadEncashment = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='loadEncash'",
    onSuccess: () => {
      AlgaehLoader({ show: true });

      let inputObj = {
        employee_id: $this.state.employee_id,
        year: $this.state.year
      };

      algaehApiCall({
        uri: "/encashmentprocess/getEncashmentToProcess",
        module: "hrManagement",
        data: inputObj,
        method: "GET",
        onSuccess: response => {
          if (response.data.result.length > 0) {
            let data = response.data.result[0];
            if (data.Exists) {
              $this.setState({
                ...data.Leave_Encash_Header[0],
                encashDetail: data.Leave_Encash_Detail,
                processBtn: true,
                processed_already: true
              });
            } else {
              let total_amount = Enumerable.from(response.data.result).sum(w =>
                parseFloat(w.total_amount)
              );

              $this.setState({
                encashDetail: response.data.result,
                total_amount: total_amount,
                processBtn: false
              });
            }
          }
          AlgaehLoader({ show: false });
        },
        onFailure: error => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: error.message || error.response.data.message,
            type: "error"
          });
        }
      });
    }
  });
};

const ClearData = $this => {
  let IOputs = LeaveEncashmentProcessIOputs.inputParam();
  $this.setState(IOputs);
};

const ProcessEncash = ($this, e) => {
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/encashmentprocess/InsertLeaveEncashment",
    module: "hrManagement",
    data: $this.state,
    method: "POST",
    onSuccess: response => {
      $this.setState({
        encashment_number: response.data.result.encashment_number,
        processBtn: true
      });
      AlgaehLoader({ show: false });
      swalMessage({
        title: "Processed Succesfully...",
        type: "success"
      });
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message || error.response.data.message,
        type: "error"
      });
    }
  });
};

const employeeSearch = $this => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Employee_details.employee
    },
    searchName: "employee",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState({
        employee_name: row.full_name,
        employee_id: row.hims_d_employee_id
      });
    }
  });
};

const numberhandle = ($this, row, e) => {
  // let name = e.target.name;
  let value = e.target.value;
  if (parseFloat(value) > parseFloat(row.close_balance)) {
    swalMessage({
      title: "Cannot be greater than Closing Balancing",
      type: "warning"
    });
    return;
  }

  let inputObj = {
    employee_id: $this.state.employee_id,
    year: $this.state.year,
    leave_days: value
  };

  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/encashmentprocess/calculateEncashmentAmount",
    module: "hrManagement",
    data: inputObj,
    method: "GET",
    onSuccess: response => {
      if (response.data.result.length > 0) {
        let data = response.data.result[0];
        if (data.Exists) {
          $this.setState({
            ...data.Leave_Encash_Header[0],
            encashDetail: data.Leave_Encash_Detail
          });
        } else {
          let total_amount = Enumerable.from(response.data.result).sum(w =>
            parseFloat(w.total_amount)
          );

          $this.setState({
            encashDetail: response.data.result,
            total_amount: total_amount,
            processBtn: false
          });
        }
      }
      AlgaehLoader({ show: false });
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message || error.response.data.message,
        type: "error"
      });
    }
  });

  // let encashDetail = $this.state.encashDetail;
  // let _index = encashDetail.indexOf(row);

  // row[name] = value;
  // encashDetail[_index] = row;
  // $this.setState({
  //   encashDetail: encashDetail
  // });
};

export {
  texthandler,
  LoadEncashment,
  ClearData,
  ProcessEncash,
  employeeSearch,
  numberhandle
};
