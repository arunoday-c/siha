import AlgaehLoader from "../../Wrapper/fullPageLoader";
import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import Enumerable from "linq";

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  switch (name) {
    case "hims_f_terms_condition_id":
      $this.setState({
        [name]: value,
        selected_terms_conditions: e.selected.terms_cond_description
      });
      break;
    default:
      $this.setState({
        [name]: value
      });
      break;
  }
};

const ClearData = ($this, e) => {
  let IOputs = {
    hims_f_sales_quotation_id: null,
    sales_quotation_number: null,
    sales_quotation_date: new Date(),
    sales_quotation_mode: "I",
    reference_number: null,
    customer_id: null,
    quote_validity: null,
    sales_man: null,
    payment_terms: null,
    service_terms: null,
    other_terms: null,
    sub_total: null,
    discount_amount: null,
    net_total: null,
    total_tax: null,
    net_payable: null,
    narration: null,
    tax_percentage: null,
    delivery_date: null,
    no_of_days_followup: 0,

    sales_quotation_items: [],
    sales_quotation_services: [],
    saveEnable: true,
    dataExists: false,

    addItemButton: true,
    item_description: "",
    addedItem: true,

    item_id: null,
    quantity: 0,
    uom_id: null,
    uom_description: null,
    discount_percentage: 0,
    unit_cost: 0,
    tax_percent: 0,
    sales_person_id: null,
    employee_name: null,
    hims_f_terms_condition_id: null,
    selected_terms_conditions: "",
    comment_list: [],
    qotation_status: "G",

    service_name: "",
    services_id: null,
    service_frequency: null
  };

  $this.setState(IOputs);
};

const SaveSalesQuotation = $this => {
  if ($this.state.hims_f_sales_quotation_id !== null) {
    if ($this.state.comments === null || $this.state.comments === "") {
      swalMessage({
        type: "warning",
        title: "To update comments is mandatory"
      });
      return;
    }
    AlgaehLoader({ show: true });
    let inputObj = {
      hims_f_sales_quotation_id: $this.state.hims_f_sales_quotation_id,
      comments: $this.state.comments
    };
    algaehApiCall({
      uri: "/SalesQuotation/updateSalesQuotation",
      module: "sales",
      method: "PUT",
      data: inputObj,
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            type: "success",
            title: "Updated successfully ..."
          });
          AlgaehLoader({ show: false });
        } else {
          AlgaehLoader({ show: false });
          swalMessage({
            type: "error",
            title: response.data.records.message
          });
        }
      }
    });
  } else {
    AlgaehValidation({
      querySelector: "data-validate='HeaderDiv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        if ($this.HRMNGMT_Active && $this.state.sales_person_id === null) {
          swalMessage({
            type: "warning",
            title: "Please select Sales Person"
          });
          return;
        }

        let qty_exists = Enumerable.from($this.state.sales_quotation_items).any(
          w => parseFloat(w.quantity) === 0 || w.quantity === ""
        );
        if (qty_exists === true) {
          swalMessage({
            title: "Please enter Quantity In Item list.",
            type: "warning"
          });
          return;
        }
        qty_exists = Enumerable.from($this.state.sales_quotation_services).any(
          w => parseFloat(w.quantity) === 0 || w.quantity === ""
        );

        if (qty_exists === true) {
          swalMessage({
            title: "Please enter Quantity In Service list.",
            type: "warning"
          });
          return;
        }

        $this.state.terms_conditions = $this.state.comment_list.join("<br/>");
        $this.state.quote_items_status =
          $this.state.sales_quotation_items.length > 0 ? "G" : "N";
        $this.state.quote_services_status =
          $this.state.sales_quotation_services.length > 0 ? "G" : "N";

        AlgaehLoader({ show: true });
        algaehApiCall({
          uri: "/SalesQuotation/addSalesQuotation",
          module: "sales",
          method: "POST",
          data: $this.state,
          onSuccess: response => {
            if (response.data.success) {
              $this.setState({
                sales_quotation_number:
                  response.data.records.sales_quotation_number,
                hims_f_sales_quotation_id:
                  response.data.records.hims_f_sales_quotation_id,
                saveEnable: true,
                dataExists: true
              });
              swalMessage({
                type: "success",
                title: "Saved successfully ..."
              });
              AlgaehLoader({ show: false });
            } else {
              AlgaehLoader({ show: false });
              swalMessage({
                type: "error",
                title: response.data.records.message
              });
            }
          },
          onFailure: error => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      }
    });
  }
};

const customerTexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    payment_terms: e.selected.payment_terms
  });
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/SalesQuotation/getSalesQuotation",
    module: "sales",
    method: "GET",
    data: {
      sales_quotation_number: docNumber,
      HRMNGMT_Active: $this.HRMNGMT_Active
    },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        // data.sales_quotation_items = data.qutation_detail[0]
        // data.sales_quotation_services = data.qutation_detail[1]
        // if (data.sales_quotation_mode === "I") {

        // } else {

        // }
        data.comment_list =
          data.terms_conditions !== null
            ? data.terms_conditions.split("<br/>")
            : [];
        data.saveEnable = true;
        data.dataExists = true;

        data.addedItem = true;
        $this.setState(data);
      }
      AlgaehLoader({ show: false });
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const dateValidate = ($this, value, event) => {
  let inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
  if (inRange) {
    swalMessage({
      title: "Selected Date cannot be past Date.",
      type: "warning"
    });
    event.target.focus();
    $this.setState({
      [event.target.name]: null
    });
  }
};

const getSalesOptions = $this => {
  algaehApiCall({
    uri: "/SalesSettings/getSalesOptions",
    method: "GET",
    module: "sales",
    onSuccess: res => {
      if (res.data.success) {
        $this.setState({
          services_required: res.data.records[0].services_required
        });
      }
    }
  });
};

const employeeSearch = $this => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Employee_details.employee
    },
    searchName: "employee_branch_wise",
    uri: "/gloabelSearch/get",
    inputs: "hospital_id = " + $this.state.hospital_id,
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState({
        employee_name: row.full_name,
        sales_person_id: row.hims_d_employee_id
      });
    }
  });
};

const addToTermCondition = $this => {
  if (
    $this.state.hims_f_terms_condition_id === null &&
    $this.state.selected_terms_conditions === ""
  ) {
    swalMessage({
      title: "Select or Enter T&C.",
      type: "warning"
    });
    return;
  }
  let comment_list = $this.state.comment_list;
  comment_list.push($this.state.selected_terms_conditions);

  $this.setState({
    hims_f_terms_condition_id: null,
    selected_terms_conditions: "",
    comment_list: comment_list
  });
};

const deleteComment = ($this, row) => {
  let comment_list = $this.state.comment_list;
  let _index = comment_list.indexOf(row);
  comment_list.splice(_index, 1);

  $this.setState({
    comment_list: comment_list
  });
};

const generateSalesQuotation = ($this, data) => {
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob"
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "salesQuotationReport",
        reportParams: [
          {
            name: "hims_f_sales_quotation_id",
            value: data.hims_f_sales_quotation_id
          },
          {
            name: "HRMNGMT_Active",
            value: $this.HRMNGMT_Active
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      // console.log("gg",data)
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data.sales_quotation_number}-Sales Quotation Report`
            const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=${reportName}`;
      window.open(origin);
      // window.document.title = "Sales Quotation Report";
    }
  });
};
export {
  changeTexts,
  ClearData,
  SaveSalesQuotation,
  customerTexthandle,
  datehandle,
  getCtrlCode,
  dateValidate,
  getSalesOptions,
  employeeSearch,
  addToTermCondition,
  deleteComment,
  generateSalesQuotation
};
