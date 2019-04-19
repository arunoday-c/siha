import AlgaehLoader from "../../Wrapper/fullPageLoader";
import ConsumptionIOputs from "../../../Models/InventoryConsumption";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

export default function ConsumptionItemsEvents() {
  return {
    getCtrlCode: ($this, docNumber) => {
      AlgaehLoader({ show: true });
      debugger;
      algaehApiCall({
        uri: "/inventoryconsumption/getInventoryConsumption",
        module: "inventory",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            let data = response.data.records;
            data.saveEnable = true;

            data.addedItem = true;
            $this.setState(data);
            AlgaehLoader({ show: false });
          }
        }
      });
      // $this.props.getConsumptionEntry({
      //   uri: "/inventoryconsumption/getInventoryConsumption",
      //   module: "inventory",
      //   method: "GET",
      //   printInput: true,
      //   data: { consumption_number: docNumber },
      //   redux: {
      //     type: "INV_REQ_ENTRY_GET_DATA",
      //     mappingName: "inventoryconsumption"
      //   },
      //   afterSuccess: data => {
      //     if (
      //       $this.props.consumption_number !== undefined &&
      //       $this.props.consumption_number.length !== 0
      //     ) {
      //       data.authorizeEnable = false;
      //       data.ItemDisable = true;
      //       data.ClearDisable = true;

      //       for (let i = 0; i < data.inventory_stock_detail.length; i++) {
      //         data.inventory_stock_detail[i].quantity_authorized =
      //           data.inventory_stock_detail[i].quantity_required;

      //         data.inventory_stock_detail[i].quantity_outstanding =
      //           data.inventory_stock_detail[i].quantity_required;

      //         data.inventory_stock_detail[i].operation = "+";
      //       }
      //     }
      //     data.saveEnable = true;

      //     if (data.posted === "Y") {
      //       data.postEnable = true;
      //     } else {
      //       data.postEnable = false;
      //     }

      //     data.addedItem = true;
      //     $this.setState(data, () => {});
      //     AlgaehLoader({ show: false });
      //   }
      // });
    },
    ClearData: $this => {
      let IOputs = ConsumptionIOputs.inputParam();
      $this.setState(IOputs);
    },

    SaveConsumptionEntry: $this => {
      algaehApiCall({
        uri: "/inventoryconsumption/addInventoryConsumption",
        module: "inventory",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            $this.setState({
              consumption_number: response.data.records.consumption_number,
              saveEnable: true,

              hims_f_inventory_consumption_header_id:
                response.data.records.hims_f_inventory_consumption_header_id,
              year: response.data.records.year,
              period: response.data.records.period
            });

            swalMessage({
              title: "Saved successfully . .",
              type: "success"
            });
          }
        }
      });
    },
    LocationchangeTexts: ($this, ctrl, e) => {
      debugger;
      e = ctrl || e;
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value,
        location_type: e.selected.location_type,
        location_name: e.selected.location_description
      });
    }
  };
}
