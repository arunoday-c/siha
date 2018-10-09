import { successfulMessage } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import Enumerable from "linq";

let texthandlerInterval = null;

const discounthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let sheet_discount_percentage = 0;
  let sheet_discount_amount = 0;

  if ([e.target.name] == "sheet_discount_percentage") {
    sheet_discount_percentage = parseFloat(e.target.value.replace(" %", ""));
    sheet_discount_amount = 0;
  } else {
    sheet_discount_amount = parseFloat(e.target.value);
    sheet_discount_percentage = 0;
  }
  if (sheet_discount_percentage > 100) {
    successfulMessage({
      message: "Invalid Input. Discount % cannot be greater than 100.",
      title: "Warning",
      icon: "warning"
    });
  } else {
    $this.setState(
      {
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      },
      () => {
        // billheaderCalculation($this, context);
      }
    );

    if (context != null) {
      context.updateState({
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      });
    }
  }
};

const changeTexts = ($this, ctrl, e) => {
  debugger;
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const numberchangeTexts = ($this, context, e) => {
  debugger;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({
        [name]: value
      });
    }
    clearInterval(texthandlerInterval);
  }, 1000);
};

const itemchangeText = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.props.getSelectedItemDetais({
    uri: "/pharmacyGlobal/getUomLocationStock",
    method: "GET",
    data: {
      location_id: $this.state.location_id,
      item_id: value
    },
    redux: {
      type: "ITEMS_UOM_DETAILS_GET_DATA",
      mappingName: "itemdetaillist"
    },
    afterSuccess: data => {
      debugger;
      if (data.locationResult.length > 0) {
        debugger;
        $this.setState({
          [name]: value,
          item_category: e.selected.category_id,
          group_id: e.selected.group_id,
          uom_id: e.selected.sales_uom_id,
          service_id: e.selected.service_id,
          quantity: 1,
          unit_cost: data.locationResult[0].avgcost,
          expiry_date: data.locationResult[0].expirydt,
          batchno: data.locationResult[0].batchno,
          ItemUOM: data.uomResult,
          Batch_Items: data.locationResult
        });
      } else {
        successfulMessage({
          message: "Invalid Input. No Stock Avaiable for selected Item.",
          title: "Warning",
          icon: "warning"
        });
      }
    }
  });
};

const AddItems = ($this, context) => {
  let ListItems = $this.state.ListItems;
  debugger;
  let serviceInput = [
    {
      insured: "N",
      vat_applicable: "Y",
      hims_d_services_id: $this.state.service_id,
      unit_cost: $this.state.unit_cost,
      pharmacy_item: "Y"
      // primary_insurance_provider_id: $this.state.primary_insurance_provider_id,
      // primary_network_office_id: $this.state.primary_network_office_id,
      // primary_network_id: $this.state.primary_network_id,
      // sec_insured: $this.state.sec_insured,
      // secondary_insurance_provider_id:
      //   $this.state.secondary_insurance_provider_id,
      // secondary_network_id: $this.state.secondary_network_id,
      // secondary_network_office_id: $this.state.secondary_network_office_id
    }
  ];

  $this.props.generateBill({
    uri: "/billing/getBillDetails",
    method: "POST",
    data: serviceInput,
    redux: {
      type: "BILL_GEN_GET_DATA",
      mappingName: "xxx"
    },
    afterSuccess: data => {
      debugger;

      if (data.billdetails[0].pre_approval === "Y") {
        successfulMessage({
          message:
            "Invalid Input. Selected Service is Pre-Approval required, you don't have rights to bill.",
          title: "Warning",
          icon: "warning"
        });
      } else {
        let existingservices = $this.state.PrescriptionItemList;

        if (data.billdetails.length !== 0) {
          data.billdetails[0].extended_cost = data.billdetails[0].gross_amount;
          data.billdetails[0].net_extended_cost = data.billdetails[0].net_amout;

          data.billdetails[0].item_id = $this.state.item_id;
          data.billdetails[0].item_category = $this.state.item_category;
          data.billdetails[0].expiry_date = $this.state.expiry_date;
          data.billdetails[0].batchno = $this.state.batchno;
          data.billdetails[0].uom_id = $this.state.uom_id;
          existingservices.splice(0, 0, data.billdetails[0]);
        }

        if (context != null) {
          context.updateState({ PrescriptionItemList: existingservices });
        }

        // $this.props.billingCalculations({
        //   uri: "/billing/billingCalculations",
        //   method: "POST",
        //   data: { billdetails: existingservices },
        //   redux: {
        //     type: "BILL_HEADER_GEN_GET_DATA",
        //     mappingName: "genbill"
        //   }
        // });
      }

      // $this.setState({
      //   PrescriptionItemList: data
      // });
    }
  });
  // let itemObj = {
  //   location_id: $this.state.location_id,
  //   category_id: $this.state.category_id,
  //   group_id: $this.state.group_id,
  //   item_id: $this.state.item_id,
  //   batch_no: $this.state.batch_no,
  //   expirt_date: $this.state.expirt_date,
  //   quantity: $this.state.quantity,
  //   unit_cost: $this.state.unit_cost,
  //   quantity: $this.state.quantity
  // };
  // ListItems.push(itemObj);
  // $this.setState({
  //   ListItems: ListItems
  // });
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

export {
  discounthandle,
  changeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle
};
