import AlgaehLoader from "../../Wrapper/fullPageLoader";
import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehOpenContainer, AlgaehValidation } from "../../../utils/GlobalFunctions";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";

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
    decimal_place: JSON.parse(
      AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
    ).decimal_places,
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
    hospital_id: JSON.parse(
      AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
    ).hims_d_hospital_id,
    hims_f_terms_condition_id: null,
    selected_terms_conditions: null,
    comment_list: []
  };

  $this.setState(IOputs)
};

const SaveSalesQuotation = $this => {

  debugger
  if ($this.state.hims_f_sales_quotation_id !== null) {

    if ($this.state.comments === null || $this.state.comments === "") {
      swalMessage({
        type: "warning",
        title: "To update comments is mandatory"
      });
      return
    }
    AlgaehLoader({ show: true });
    let inputObj = { hims_f_sales_quotation_id: $this.state.hims_f_sales_quotation_id, comments: $this.state.comments }
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
        debugger
        if ($this.HRMNGMT_Active && $this.state.sales_person_id === null) {
          swalMessage({
            type: "warning",
            title: "Please select Sales Person"
          });
          return
        }
        $this.state.terms_conditions = $this.state.comment_list.join("<br/>")
        AlgaehLoader({ show: true });
        algaehApiCall({
          uri: "/SalesQuotation/addSalesQuotation",
          module: "sales",
          method: "POST",
          data: $this.state,
          onSuccess: response => {

            if (response.data.success) {
              $this.setState({
                sales_quotation_number: response.data.records.sales_quotation_number,
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
    vendor_name: e.selected.vendor_name,
    payment_terms: e.selected.payment_terms,
    // tax_percentage: e.selected.vat_percentage,
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
    data: { sales_quotation_number: docNumber, HRMNGMT_Active: $this.HRMNGMT_Active },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;

        if (data.sales_quotation_mode === "I") {
          data.sales_quotation_items = data.qutation_detail
        } else {
          data.sales_quotation_services = data.qutation_detail
        }
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

const getSalesOptions = ($this) => {
  algaehApiCall({
    uri: "/SalesSettings/getSalesOptions",
    method: "GET",
    module: "sales",
    onSuccess: res => {
      if (res.data.success) {
        $this.setState({ services_required: res.data.records[0].services_required });
      }
    }
  });
}

const employeeSearch = ($this) => {
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
      $this.setState(
        {
          employee_name: row.full_name,
          sales_person_id: row.hims_d_employee_id
        }
      );
    }
  });
}

const addToTermCondition = ($this) => {
  if ($this.state.hims_f_terms_condition_id === null) {
    swalMessage({
      title: "Select T&C.",
      type: "warning"
    });
  }
  let comment_list = $this.state.comment_list;
  comment_list.push($this.state.selected_terms_conditions);

  $this.setState({
    hims_f_terms_condition_id: null,
    comment_list: comment_list
  })
}

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
  addToTermCondition
};
