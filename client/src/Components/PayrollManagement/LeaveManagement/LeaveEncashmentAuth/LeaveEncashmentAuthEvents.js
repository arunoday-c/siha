import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import Enumerable from "linq";
import moment from "moment";
import Options from "../../../../Options.json";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import swal from "sweetalert2";

const texthandler = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
  });
};

const employeeSearch = ($this) => {
  if (
    $this.state.hospital_id === null ||
    $this.state.hospital_id === undefined
  ) {
    swalMessage({
      title: "Please Select Branch",
      type: "warning",
    });
    document.querySelector("[name='hospital_id']").focus();
    return;
  }

  let str = " hospital_id=" + $this.state.hospital_id;

  if ($this.state.sub_department_id !== null) {
    if (str === null) {
      str = "sub_department_id = " + $this.state.sub_department_id;
    } else {
      str += " and sub_department_id = " + $this.state.sub_department_id;
    }
    str +=
      str !== null
        ? " and sub_department_id = " + $this.state.sub_department_id
        : "sub_department_id = " + $this.state.sub_department_id;
  }

  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Employee_details.employee,
    },
    searchName: "employee",
    uri: "/gloabelSearch/get",
    inputs: str,
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      $this.setState({
        employee_name: row.full_name,
        employee_id: row.hims_d_employee_id,
      });
    },
  });
};

const LoadEncashment = ($this) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='loadEncashAuth'",
    onSuccess: () => {
      AlgaehLoader({ show: true });

      let inputObj = {
        hospital_id: $this.state.hospital_id,
        from_date: $this.state.from_date,
        to_date: $this.state.to_date,
        authorized: $this.state.authorized,
      };

      if ($this.state.authorized === "PEN") {
        if ($this.state.auth_level === 1) {
          inputObj.authorized1 = "PEN";
        }
        if ($this.state.auth_level === 2) {
          inputObj.authorized1 = "APR";
          inputObj.authorized2 = "PEN";
        }
      }

      if ($this.state.employee_id !== null) {
        inputObj.employee_id = $this.state.employee_id;
      }

      algaehApiCall({
        uri: "/encashmentprocess/getLeaveEncash",
        module: "hrManagement",
        data: inputObj,
        method: "GET",
        onSuccess: (response) => {
          if (response.data.result.length > 0) {
            $this.setState({
              EncashHeader: response.data.result,
            });
          } else {
            $this.setState({
              EncashHeader: [],
            });
          }
          AlgaehLoader({ show: false });
        },
        onFailure: (error) => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: error.response.data.message,
            type: "error",
          });
        },
      });
    },
  });
};

const getLeaveEncashDetails = ($this, row) => {
  // const EncashDetailPer = Enumerable.from($this.state.EncashDetail)
  //   .where(w => w.leave_encash_header_id === row.hims_f_leave_encash_header_id)
  //   .toArray();

  row.auth_level = $this.state.auth_level;
  $this.setState({
    isOpen: true,
    EncashDetailPer: row,
  });
};

const generateLeaveEncashSlip = ($this, row) => {
  console.log(row);
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "LeaveEncashmentSlip",
        reportParams: [
          {
            name: "hims_f_leave_encash_header_id",
            value: row.hims_f_leave_encash_header_id,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      // const url = URL.createObjectURL(res.data);
      // let myWindow = window.open(
      //   "{{ product.metafields.google.custom_label_0 }}",
      //   "_blank"
      // );

      // myWindow.document.write(
      //   "<iframe src= '" + url + "' width='100%' height='100%' />"
      // );
      const urlBlob = URL.createObjectURL(res.data);
      // const documentName="Salary Slip"
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Leave Encashment Slip for ${row.employee_code}-${row.full_name}`;
      window.open(origin);
    },
  });
};

const AuthorizeLEaveEncash = ($this, data) => {
  let message = "";
  if (data === "CAN") {
    message = "Are you sure you want to Cancel?";
  } else if (data === "APR") {
    message = "Are you sure you want to Authorize?";
  } else if (data === "REJ") {
    message = "Are you sure you want to Reject?";
  }
  swal({
    title: message,
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No",
  }).then((willDelete) => {
    if (willDelete.value) {
      let inputObj = {
        auth_level: $this.state.auth_level,
        hims_f_leave_encash_header_id:
          $this.state.hims_f_leave_encash_header_id,
        authorized: data,
        leave_encash_level: $this.state.leave_encash_level,
        leave_days: $this.state.leave_days,
        year: $this.state.year,
        employee_id: $this.state.employee_id,
        leave_id: $this.state.leave_id,
      };

      let Succmsg = "";
      if (data === "APR") {
        Succmsg = "Authorized Successfully.";
      } else if (data === "REJ") {
        Succmsg = "Rejected Successfully.";
      } else {
        Succmsg = "Cancelled Successfully.";
      }

      algaehApiCall({
        uri: "/encashmentprocess/UpdateLeaveEncash",
        module: "hrManagement",
        data: inputObj,
        method: "PUT",
        onSuccess: (response) => {
          swalMessage({
            title: Succmsg,
            type: "success",
          });
          $this.props.onClose();
        },
        onFailure: (error) => {
          swalMessage({
            title: error.response.data.message,
            type: "error",
          });
        },
      });
    }
  });
};

const getLeaveLevels = ($this, leave_encash_level) => {
  algaehApiCall({
    uri: "/encashmentprocess/getLeaveEncashLevels",
    module: "hrManagement",
    method: "GET",
    data: { leave_encash_level: leave_encash_level },
    onSuccess: (res) => {
      if (res.data.success) {
        let auth_level =
          res.data.result.auth_levels.length > 0
            ? Enumerable.from(res.data.result.auth_levels).maxBy((w) => w.value)
            : null;

        $this.setState({
          leave_levels: res.data.result.auth_levels,
          auth_level: auth_level !== null ? auth_level.value : null,
        });
      }
    },
    onFailure: (err) => {
      swalMessage({
        title: err.message,
        type: "error",
      });
    },
  });
};

const dateFormater = (value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const getHrmsOptions = ($this) => {
  algaehApiCall({
    uri: "/payrollOptions/getHrmsOptions",
    method: "GET",
    module: "hrManagement",
    onSuccess: (res) => {
      if (res.data.success) {
        $this.setState({
          leave_encash_level: res.data.result[0].leave_encash_level,
        });
      }
    },
    onFailure: (err) => {
      swalMessage({
        title: err.message,
        type: "error",
      });
    },
  });
};

export {
  texthandler,
  employeeSearch,
  LoadEncashment,
  getLeaveEncashDetails,
  generateLeaveEncashSlip,
  AuthorizeLEaveEncash,
  getLeaveLevels,
  dateFormater,
  getHrmsOptions,
};
