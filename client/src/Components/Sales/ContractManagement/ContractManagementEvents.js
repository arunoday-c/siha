import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { newAlgaehApi } from "../../../hooks";

const texthandle = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  switch (name) {
    case "hims_f_terms_condition_id":
      $this.setState({
        [name]: value,
        selected_terms_conditions: e.selected.terms_cond_description,
      });
      break;
    case "project_id":
      $this.setState({
        [name]: value,
        organizations: e.selected.branches,
      });
      break;
    default:
      $this.setState({
        [name]: value,
      });
      break;
  }
};

const datehandle = ($this, ctrl, e) => {
  let intFailure = false;
  if (e === "start_date") {
    if (Date.parse($this.state.end_date) < Date.parse(moment(ctrl)._d)) {
      intFailure = true;
      swalMessage({
        title: "Start Date cannot be grater than End Date.",
        type: "warning",
      });
    }
  } else if (e === "end_date") {
    if (Date.parse(moment(ctrl)._d) < Date.parse($this.state.start_date)) {
      intFailure = true;
      swalMessage({
        title: "End Date cannot be less than Start Date.",
        type: "warning",
      });
    }
  }

  if (intFailure === false) {
    $this.setState({
      [e]: moment(ctrl)._d,
    });
  }
};

const ClearData = ($this, e) => {
  let IOputs = {
    hims_f_contract_management_id: null,
    contract_number: null,
    contract_code: null,
    contract_date: new Date(),
    customer_id: null,
    project_id: null,
    hospital_id: null,
    start_date: null,
    end_date: null,
    contract_services: [],
    contract_files: [],
    contract_docs: [],
    organizations: [],
    quotation_ref_numb: null,
    saveEnable: true,
    editMode: false,
    service_name: "",
    services_id: null,
    service_frequency: null,
    service_price: 0,
    addItemButton: true,
    hims_f_terms_condition_id: null,
    selected_terms_conditions: "",
    comment_list: [],
    dataExists: false,

    employee_name: null,
    incharge_employee_id: null,
    notification_days1: null,
    notification_days2: null,
  };

  $this.setState(IOputs);
};

const SaveContract = ($this) => {
  if ($this.state.dataExists) {
    saveDocument(
      $this.state.contract_files,
      $this.state.contract_number,
      $this.state.hims_f_contract_management_id,
      $this
    );
  } else {
    AlgaehValidation({
      querySelector: "data-validate='HeaderDiv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        if ($this.HRMNGMT_Active) {
          if ($this.state.incharge_employee_id === null) {
            swalMessage({
              type: "warning",
              title: "Please select Incharge Employee",
            });
            return;
          }
        }

        AlgaehLoader({ show: true });
        $this.state.terms_conditions = $this.state.comment_list.join("<br/>");
        algaehApiCall({
          uri: "/ContractManagement/addContractManagement",
          module: "sales",
          method: "POST",
          data: $this.state,
          onSuccess: (response) => {
            if (response.data.success) {
              $this.setState({
                contract_number: response.data.records.contract_number,
                hims_f_contract_management_id:
                  response.data.records.hims_f_contract_management_id,
                saveEnable: true,
                dataExists: true,
              });
              saveDocument(
                $this.state.contract_files,
                response.data.records.contract_number,
                response.data.records.hims_f_contract_management_id,
                $this
              );
              swalMessage({
                type: "success",
                title: "Saved successfully ...",
              });
              AlgaehLoader({ show: false });
            } else {
              AlgaehLoader({ show: false });
              swalMessage({
                type: "error",
                title: response.data.records.message,
              });
            }
          },
          onFailure: (error) => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.message,
              type: "error",
            });
          },
        });
      },
    });
  }
};

function saveDocument(files = [], contract_no, contract_id, $this) {
  const formData = new FormData();
  formData.append("contract_no", contract_no);
  formData.append("contract_id", contract_id);
  files.forEach((file, index) => {
    formData.append(`file_${index}`, file, file.name);
  });
  newAlgaehApi({
    uri: "/saveContractDoc",
    data: formData,
    extraHeaders: { "Content-Type": "multipart/form-data" },
    method: "POST",
    module: "documentManagement",
  })
    .then((value) => getDocuments(contract_no, $this))
    .catch((e) => console.log(e));
}

function getDocuments(contract_no, $this) {
  newAlgaehApi({
    uri: "/getContractDoc",
    module: "documentManagement",
    method: "GET",
    data: {
      contract_no,
    },
  })
    .then((res) => {
      if (res.data.success) {
        let { data } = res.data;
        $this.setState(
          {
            contract_docs: data,
            contract_files: [],
            saveEnable: $this.state.dataExists,
          },
          () => {
            AlgaehLoader({ show: false });
          }
        );
      }
    })
    .catch((e) => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: e.message,
        type: "error",
      });
    });
}

const getCtrlCode = ($this, docNumber, row) => {
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/ContractManagement/getContractManagement",
    module: "sales",
    method: "GET",
    data: {
      contract_number: docNumber,
      HRMNGMT_Active: $this.state.HRMNGMT_Active,
    },
    onSuccess: (response) => {
      if (response.data.success) {
        let data = response.data.records;

        data.comment_list =
          data.terms_conditions !== null
            ? data.terms_conditions.split("<br/>")
            : [];
        const [project] = $this.state.cost_projects.filter(
          (item) => item.cost_center_id === data.project_id
        );
        getDocuments(docNumber, $this);
        data.saveEnable = true;
        data.dataExists = true;
        $this.setState({ ...data, organizations: project.branches });
      }
    },
    onFailure: (error) => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
};

const generateContractReport = (data) => {
  console.log("data:", data);
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
        reportName:
          data.sales_order_mode === "S"
            ? "SalesOrderReportService"
            : "SalesOrderReportItem",
        reportParams: [
          {
            name: "sales_order_number",
            value: data.sales_order_number,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data.contract_number}-Contract`;
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= ${reportName}`;
      window.open(origin);
      // window.document.title = "Sales Order";
    },
  });
};

const dateValidate = ($this, value, event) => {
  let inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
  if (inRange) {
    swalMessage({
      title: "Selected Date cannot be past Date.",
      type: "warning",
    });
    event.target.focus();
    $this.setState({
      [event.target.name]: null,
    });
  }
};

const servicechangeText = ($this, e, ctrl) => {
  let name = ctrl;

  let value = e.hims_d_services_id;

  $this.setState({
    [name]: value,
    addItemButton: false,
    service_name: e.service_name,
    service_price: e.standard_fee,
  });
};

const deleteContarctServices = ($this, row) => {
  let contract_services = $this.state.contract_services;
  let _index = contract_services.indexOf(row);
  contract_services.splice(_index, 1);

  $this.setState({
    contract_services: contract_services,
    saveEnable: contract_services.length > 0 ? false : true,
  });
};

const AddSerices = ($this) => {
  if (
    $this.state.service_price === "" ||
    $this.state.service_price === null ||
    parseFloat($this.state.service_price) === 0
  ) {
    swalMessage({
      title: "Enter Service Price.",
      type: "warning",
    });
    document.querySelector("[name='service_price']").focus();
    return;
  }

  if ($this.state.service_frequency === null) {
    swalMessage({
      title: "Enter Service Frequency.",
      type: "warning",
    });
    document.querySelector("[name='service_frequency']").focus();
    return;
  }
  let inputObj = {
    services_id: $this.state.services_id,
    service_name: $this.state.service_name,
    service_frequency: $this.state.service_frequency,
    service_price: $this.state.service_price,
    comments: $this.state.comments,
  };
  let contract_services = $this.state.contract_services;

  contract_services.push(inputObj);
  $this.setState({
    contract_services: contract_services,
    service_name: "",
    services_id: null,
    service_frequency: null,
    service_price: 0,
    saveEnable: false,
    addItemButton: true,
    comments: "",
  });
};

const addToTermCondition = ($this) => {
  if (
    $this.state.hims_f_terms_condition_id === null &&
    $this.state.selected_terms_conditions === ""
  ) {
    swalMessage({
      title: "Select or Enter T&C.",
      type: "warning",
    });
    return;
  }
  let comment_list = $this.state.comment_list;
  comment_list.push($this.state.selected_terms_conditions);

  $this.setState({
    hims_f_terms_condition_id: null,
    selected_terms_conditions: "",
    comment_list: comment_list,
  });
};

const deleteComment = ($this, row) => {
  let comment_list = $this.state.comment_list;
  let _index = comment_list.indexOf(row);
  comment_list.splice(_index, 1);

  $this.setState({
    comment_list: comment_list,
    saveEnable: true,
  });
};

const employeeSearch = ($this) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Employee_details.employee,
    },
    searchName: "employee_branch_wise",
    uri: "/gloabelSearch/get",
    // inputs: "hospital_id = " + $this.state.hospital_id,
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      $this.setState({
        employee_name: row.full_name,
        incharge_employee_id: row.hims_d_employee_id,
      });
    },
  });
};

const getCostCenters = ($this) => {
  algaehApiCall({
    uri: "/finance_masters/getCostCenters",
    method: "GET",
    module: "finance",

    onSuccess: (response) => {
      if (response.data.success === true) {
        $this.setState({ cost_projects: response.data.result });
      }
    },
  });
};

export {
  texthandle,
  datehandle,
  ClearData,
  SaveContract,
  getCtrlCode,
  generateContractReport,
  dateValidate,
  servicechangeText,
  deleteContarctServices,
  AddSerices,
  addToTermCondition,
  deleteComment,
  employeeSearch,
  getCostCenters,
  saveDocument,
};
