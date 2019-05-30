import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";

import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";

export default function OrderProcedureItemsEvent() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value
      });
    },

    quantityEvent: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      let extended_cost = 0;
      extended_cost = parseFloat(value) * parseFloat($this.state.unit_cost);

      $this.setState({
        [name]: value,
        extended_cost: extended_cost
      });
    },

    addItems($this) {
      let Procedure_items = $this.state.Procedure_items;
      let inputObj = {
        procedure_id: $this.props.inputsparameters.procedure_id,
        location_id: $this.state.inventory_location_id,
        location_type: $this.state.location_type,
        patient_id: Window.global["current_patient"],
        episode_id: Window.global["episode_id"],
        item_id: $this.state.item_id,
        item_category_id: $this.state.item_category_id,
        item_group_id: $this.state.item_group_id,
        uom_id: $this.state.uom_id,
        batchno: $this.state.batchno,
        expirydt: $this.state.expirydt,
        barcode: $this.state.barcode,
        grn_no: $this.state.grn_no,
        grn_number: $this.state.grn_no,
        qtyhand: $this.state.qtyhand,
        unit_cost: $this.state.unit_cost,
        extended_cost: $this.state.extended_cost,
        quantity: $this.state.quantity,
        expiry_date: $this.state.expirydt,
        sales_uom: $this.state.uom_id,

        operation: "-"
      };
      Procedure_items.push(inputObj);

      $this.setState({
        Procedure_items: Procedure_items
      });
    },
    SaveProcedureItems: $this => {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/inventory/addProcedureItems",
        module: "inventory",
        data: $this.state,
        method: "POST",
        onSuccess: response => {
          if (response.data.success === true) {
            $this.state.transaction_type = "CS";
            $this.state.location_id = $this.state.inventory_location_id;
            $this.state.location_type = $this.state.location_type;
            $this.state.inventory_stock_detail = $this.state.Procedure_items;
            $this.state.transaction_date = new Date();
            $this.state.provider_id = Window.global["provider_id"];
            algaehApiCall({
              uri: "/inventoryconsumption/addInventoryConsumption",
              module: "inventory",
              data: $this.state,
              onSuccess: response => {
                AlgaehLoader({ show: false });
                if (response.data.success === true) {
                  swalMessage({
                    title: "Saved successfully . .",
                    type: "success"
                  });
                }
              },
              onFailure: err => {
                AlgaehLoader({ show: false });
                swalMessage({
                  title: err.message,
                  type: "error"
                });
              }
            });
          } else {
            AlgaehLoader({ show: false });
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
    },

    itemSearch: $this => {
      if ($this.state.existing_new === "E") {
        AlgaehSearch({
          searchGrid: {
            columns: spotlightSearch.Items.InvItems
          },
          searchName: "procedureExistingItem",
          // reportQuery: "procedureExistingItem",
          uri: "/gloabelSearch/get",
          inputs:
            $this.state.sub_department_id !== null
              ? "sub_department_id = " + $this.state.sub_department_id
              : "1=1",
          onContainsChange: (text, serchBy, callBack) => {
            callBack(text);
          },
          onRowSelect: row => {
            $this.setState({
              employee_name: row.full_name,
              employee_id: row.hims_d_employee_id
            });
          }
        });
      } else {
        AlgaehSearch({
          searchGrid: {
            columns: spotlightSearch.Items.InvItems
          },
          searchName: "invitemmaster",
          uri: "/gloabelSearch/get",
          inputs:
            "IL.inventory_location_id = " + $this.state.inventory_location_id,
          onContainsChange: (text, serchBy, callBack) => {
            callBack(text);
          },
          onRowSelect: row => {
            $this.setState({
              item_id: row.hims_d_inventory_item_master_id,
              item_category_id: row.category_id,
              item_group_id: row.group_id,
              uom_id: row.sales_uom_id,
              batchno: row.batchno,
              expirydt: row.expirydt,
              barcode: row.barcode,
              grn_no: row.grnno,
              grnno: row.grnno,
              qtyhand: row.qtyhand,
              unit_cost: row.avgcost,
              item_description: row.item_description,
              extended_cost: row.avgcost,
              quantity: 1
            });
          }
        });
      }
    }
  };
}
