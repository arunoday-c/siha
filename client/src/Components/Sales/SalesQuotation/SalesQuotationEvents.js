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
        dataExists: false
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
    dataExists: false
  };

  $this.setState(IOputs)
};

const SaveSalesQuotation = $this => {
  AlgaehLoader({ show: true });

  debugger
  algaehApiCall({
    uri: "/addSalesQuotation",
    module: "sales",
    method: "POST",
    data: $this.state,
    onSuccess: response => {
      debugger
      if (response.data.success) {
        $this.setState({
          sales_quotation_number: response.records.sales_quotation_number,
          hims_f_sales_quotation_id:
            response.data.records.hims_f_sales_quotation_id,
          saveEnable: true
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

// const LocationchangeTexts = ($this, ctrl, e) => {
//   e = ctrl || e;
//   let name = e.name || e.target.name;
//   let value = e.value || e.target.value;
//   $this.setState(
//     { [name]: value, location_type: e.selected.location_type },
//     () => {
//       let _screenName = getCookie("ScreenName").replace("/", "");
//       algaehApiCall({
//         uri: "/userPreferences/save",
//         data: {
//           screenName: _screenName,
//           identifier: "InventoryLocation",
//           value: value
//         },
//         method: "POST"
//       });

//       algaehApiCall({
//         uri: "/userPreferences/save",
//         data: {
//           screenName: _screenName,
//           identifier: "LocationType",
//           value: e.selected.location_type
//         },
//         method: "POST"
//       });
//     }
//   );
// };

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

export {
  changeTexts,
  ClearData,
  SaveSalesQuotation,
  // LocationchangeTexts,  
  customerTexthandle,
  datehandle
};
