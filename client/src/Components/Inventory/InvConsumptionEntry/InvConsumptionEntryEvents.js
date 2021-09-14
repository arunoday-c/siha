import AlgaehLoader from "../../Wrapper/fullPageLoader";
import ConsumptionIOputs from "../../../Models/InventoryConsumption";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

export default function ConsumptionItemsEvents() {
  return {
    getCtrlCode: ($this, docNumber) => {
      AlgaehLoader({ show: true });

      let IOputs = ConsumptionIOputs.inputParam();
      $this.setState(IOputs, () => {
        algaehApiCall({
          uri: "/inventoryconsumption/getInventoryConsumption",
          module: "inventory",
          method: "GET",
          data: { consumption_number: docNumber },
          onSuccess: (response) => {
            if (response.data.success === true) {
              let data = response.data.records;
              data.saveEnable = true;

              data.addedItem = true;
              data.ItemDisable = true;
              data.addItemButton = true;
              $this.setState(data);
              AlgaehLoader({ show: false });
            }
          },
          onFailure: (err) => {
            swalMessage({
              title: err.message,
              type: "error",
            });
          },
        });
      });
    },

    getDrilDownData: ($this, transaction_id) => {
      AlgaehLoader({ show: true });

      algaehApiCall({
        uri: "/inventoryconsumption/getInventoryConsumption",
        module: "inventory",
        method: "GET",
        data: { transaction_id: transaction_id },
        onSuccess: (response) => {
          if (response.data.success === true) {
            let data = response.data.records;
            data.saveEnable = true;

            data.addedItem = true;
            data.ItemDisable = true;
            data.addItemButton = true;
            $this.setState(data);
            AlgaehLoader({ show: false });
          }
        },
        onFailure: (err) => {
          swalMessage({
            title: err.message,
            type: "error",
          });
        },
      });
    },

    ClearData: ($this) => {
      let IOputs = ConsumptionIOputs.inputParam();
      $this.setState(IOputs);
    },

    SaveConsumptionEntry: ($this) => {
      AlgaehLoader({ show: true });
      $this.state.ScreenCode = "INV0007";
      algaehApiCall({
        uri: "/inventoryconsumption/addInventoryConsumption",
        module: "inventory",
        data: $this.state,
        onSuccess: (response) => {
          if (response.data.success === true) {
            $this.setState({
              consumption_number: response.data.records.consumption_number,
              saveEnable: true,
              ItemDisable: true,
              addItemButton: true,

              hims_f_inventory_consumption_header_id:
                response.data.records.hims_f_inventory_consumption_header_id,
              year: response.data.records.year,
              period: response.data.records.period,
            });

            swalMessage({
              title: "Saved successfully . .",
              type: "success",
            });
          }
          AlgaehLoader({ show: false });
        },
      });
    },
    LocationchangeTexts: ($this, ctrl, e) => {
      e = ctrl || e;
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value,
        location_type: e.selected.location_type,
        location_name: e.selected.location_description,
      });
    },

    generateConsumptionRecpt: (consumption_number, rpt_name, rpt_desc) => {
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
            reportName: "consumptionReceiptInventory",
            reportParams: [
              {
                name: "consumption_number",
                value: consumption_number,
              },
            ],
            outputFileType: "PDF",
          },
        },
        onSuccess: (res) => {
          const urlBlob = URL.createObjectURL(res.data);
          const reportName = `${consumption_number}-Consumption Receipt - Inventory`;
          const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= ${reportName}`;
          window.open(origin);
          // window.document.title = "Consumption Receipt - Inventory";
        },
      });
    },
  };
}
