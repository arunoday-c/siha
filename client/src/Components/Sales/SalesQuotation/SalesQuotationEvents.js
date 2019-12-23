import AlgaehLoader from "../../Wrapper/fullPageLoader";
import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehOpenContainer } from "../../../utils/GlobalFunctions";

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  switch (name) {
    case "sales_quotation_mode":
      $this.setState({
        [name]: value,
        hims_f_sales_quotation_id: null,
        sales_quotation_number: null,
        sales_quotation_date: new Date(),
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
        tax_percent: 0
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
    tax_percent: 0
  };

  $this.setState(IOputs)
};

const SaveSalesQuotation = $this => {
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
};

const customerTexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    vendor_name: e.selected.vendor_name,
    payment_terms: e.selected.payment_terms,
    tax_percentage: e.selected.vat_percentage,
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
    data: { sales_quotation_number: docNumber },
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

export {
  changeTexts,
  ClearData,
  SaveSalesQuotation,
  // LocationchangeTexts,  
  customerTexthandle,
  datehandle,
  getCtrlCode
};
