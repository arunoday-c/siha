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

const SavePosEnrty = $this => {
  AlgaehLoader({ show: true });

  $this.state.posted = "Y";
  $this.state.transaction_type = "POS";
  $this.state.transaction_date = $this.state.pos_date;

  for (let i = 0; i < $this.state.inventory_stock_detail.length; i++) {
    $this.state.inventory_stock_detail[i].location_id =
      $this.state.location_id;
    $this.state.inventory_stock_detail[i].location_type =
      $this.state.location_type;
    $this.state.inventory_stock_detail[i].operation = "-";
    $this.state.inventory_stock_detail[i].sales_uom =
      $this.state.inventory_stock_detail[i].uom_id;
    $this.state.inventory_stock_detail[i].item_code_id =
      $this.state.item_id;
    $this.state.inventory_stock_detail[i].grn_number =
      $this.state.inventory_stock_detail[i].grn_no;
    $this.state.inventory_stock_detail[i].item_category_id =
      $this.state.inventory_stock_detail[i].item_category;
    $this.state.inventory_stock_detail[i].net_total =
      $this.state.inventory_stock_detail[i].net_extended_cost;
  }

  algaehApiCall({
    uri: "/posEntry/addPosEntry",
    module: "inventory",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success) {
        $this.setState({
          pos_number: response.data.records.pos_number,
          hims_f_inventory_pos_header_id:
            response.data.records.hims_f_inventory_pos_header_id,
          year: response.data.records.year,
          period: response.data.records.period,
          receipt_number: response.data.records.receipt_number,
          saveEnable: true,
          postEnable: false,
          popUpGenereted: true
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
  SavePosEnrty,
  // LocationchangeTexts,  
  customerTexthandle,
  datehandle
};
