import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import _ from "lodash";

export default function ConsumptionItemsEvents() {
  return {
    UomchangeTexts: ($this, context, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      let unit_cost = e.selected.conversion_factor * $this.state.unit_cost;
      $this.setState({
        [name]: value,
        conversion_factor: e.selected.conversion_factor,
        unit_cost: unit_cost,
        uom_description: e.selected.uom_description,
      });
      if (context !== undefined) {
        context.updateState({
          [name]: value,
          conversion_factor: e.selected.conversion_factor,
          unit_cost: unit_cost,
          uom_description: e.selected.uom_description,
        });
      }
    },
    numberchangeTexts: ($this, context, e) => {
      let name = e.name || e.target.name;
      let value =
        e.value === ""
          ? null
          : e.value || e.target.value === ""
          ? null
          : e.target.value;
      if (parseFloat(value) < 0) {
        swalMessage({
          title: "Cannot be less than zero.",
          type: "warning",
        });
      } else if (parseFloat(value) > parseFloat($this.state.qtyhand)) {
        swalMessage({
          title: "Cannot be greater than QTY in Hand.",
          type: "warning",
        });
      } else {
        let extended_cost = $this.state.unit_cost * value;
        $this.setState({ [name]: value, extended_cost: extended_cost });
        if (context !== undefined) {
          context.updateState({
            [name]: value,
            extended_cost: extended_cost,
          });
        }
      }
    },

    itemchangeText: ($this, context, e, ctrl) => {
      // let name = e.name || e.target.name;
      let name = ctrl;
      if ($this.state.location_id !== null) {
        // let value = e.value || e.target.value;
        let value = e.hims_d_item_master_id;

        algaehApiCall({
          uri: "/pharmacyGlobal/getUomLocationStock",
          module: "pharmacy",
          method: "GET",
          data: {
            location_id: $this.state.location_id,
            item_id: e.hims_d_item_master_id,
          },
          onSuccess: (response) => {
            if (response.data.success === true) {
              let data = response.data.records;
              if (data.locationResult.length > 0) {
                // getItemLocationStock($this, context, {
                //   location_id: $this.state.location_id,
                //   item_id: e.hims_d_item_master_id,
                // });

                let uom_array = _.filter(data.uomResult, (f) => {
                  return f.uom_id === e.stocking_uom_id;
                });

                $this.setState({
                  [name]: value,
                  item_description: e.item_description,
                  item_code: e.item_code,
                  item_category_id: e.category_id,
                  uom_id: e.stocking_uom_id,
                  sales_uom: e.sales_uom_id,
                  item_group_id: e.group_id,
                  quantity: 1,
                  addItemButton: false,
                  item_id: e.hims_d_item_master_id,
                  expiry_date: data.locationResult[0].expirydt,
                  batchno: data.locationResult[0].batchno,
                  grn_no: data.locationResult[0].grnno,
                  qtyhand: data.locationResult[0].qtyhand,
                  unit_cost: data.locationResult[0].avgcost,
                  barcode: data.locationResult[0].barcode,

                  ItemUOM: data.uomResult,
                  uom_description: uom_array[0].uom_description,
                  extended_cost: parseFloat(data.locationResult[0].avgcost),
                });

                if (context !== undefined) {
                  context.updateState({
                    [name]: value,
                    item_description: e.item_description,
                    item_code: e.item_code,
                    item_category_id: e.category_id,
                    uom_id: e.stocking_uom_id,
                    sales_uom: e.sales_uom_id,
                    item_group_id: e.group_id,
                    quantity: 1,
                    addItemButton: false,

                    expiry_date: data.locationResult[0].expirydt,
                    batchno: data.locationResult[0].batchno,
                    grn_no: data.locationResult[0].grnno,
                    qtyhand: data.locationResult[0].qtyhand,
                    unit_cost: data.locationResult[0].avgcost,
                    barcode: data.locationResult[0].barcode,
                    extended_cost: parseFloat(data.locationResult[0].avgcost),
                    ItemUOM: data.uomResult,
                  });
                }
              } else {
                swalMessage({
                  title: "No Stock Avaiable for selected Item.",
                  type: "warning",
                });
              }
            }
          },
        });
      } else {
        $this.setState(
          {
            [name]: null,
          },
          () => {
            swalMessage({
              title: "Please select Location.",
              type: "warning",
            });
          }
        );
      }
    },
    AddItems: ($this, context) => {
      if ($this.state.item_id === null) {
        swalMessage({
          title: "Select Item.",
          type: "warning",
        });
      } else if (
        parseFloat($this.state.quantity) === 0 ||
        $this.state.quantity === null
      ) {
        swalMessage({
          title: "Please enter Quantity.",
          type: "warning",
        });
      } else {
        let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

        let ItemInput = {
          location_id: $this.state.location_id,
          location_type: $this.state.location_type,
          item_category_id: $this.state.item_category_id,
          item_group_id: $this.state.item_group_id,
          item_id: $this.state.item_id,
          quantity: $this.state.quantity,
          uom_id: $this.state.uom_id,
          sales_uom: $this.state.sales_uom,
          qtyhand: $this.state.qtyhand,
          item_description: $this.state.item_description,
          item_code: $this.state.item_code,
          uom_description: $this.state.uom_description,
          expiry_date: $this.state.expiry_date,
          batchno: $this.state.batchno,
          grn_no: $this.state.grn_no,
          grn_number: $this.state.grn_no,
          barcode: $this.state.barcode,
          unit_cost: $this.state.unit_cost,
          extended_cost: $this.state.extended_cost,
          operation: "-",
        };
        pharmacy_stock_detail.push(ItemInput);
        $this.setState({
          pharmacy_stock_detail: pharmacy_stock_detail,
          addedItem: true,
          item_category_id: null,
          item_group_id: null,
          item_id: null,
          quantity: 0,

          uom_id: null,
          qtyhand: 0,
          barcode: null,
          expiry_date: null,
          batchno: null,
          grn_no: null,
          unit_cost: 0,
          extended_cost: 0,
          item_description: "",
        });

        if (context !== undefined) {
          context.updateState({
            pharmacy_stock_detail: pharmacy_stock_detail,
            addedItem: true,
            saveEnable: false,
            item_category_id: null,
            item_group_id: null,
            item_id: null,
            quantity: 0,
            uom_id: null,

            qtyhand: 0,
            barcode: null,
            expiry_date: null,
            batchno: null,
            grn_no: null,
            unit_cost: 0,
            extended_cost: 0,
            item_description: "",
          });
        }
      }
    },
    datehandle: ($this, ctrl, e) => {
      $this.setState({
        [e]: moment(ctrl)._d,
      });
    },
    deleteConsumptionDetail: ($this, context, row) => {
      let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
      let saveEnable = false;
      pharmacy_stock_detail.splice(row.rowIdx, 1);

      if (pharmacy_stock_detail.length === 0) {
        saveEnable = true;
      }
      $this.setState({ pharmacy_stock_detail: pharmacy_stock_detail });

      if (context !== undefined) {
        context.updateState({
          pharmacy_stock_detail: pharmacy_stock_detail,
          saveEnable: saveEnable,
        });
      }
    },
  };
}

// function getItemLocationStock($this, context, value) {
//   algaehApiCall({
//     uri: "/pharmacyGlobal/getItemLocationStockConsumtion",
//     module: "pharmacy",
//     method: "GET",
//     data: {
//       pharmacy_location_id: value.location_id,
//       item_id: value.item_id,
//     },
//     onSuccess: (response) => {
//       if (response.data.success === true) {
//         let data = response.data.records;
//         if (data.length !== 0) {
//           let total_quantity = 0;
//           for (let i = 0; i < data.length; i++) {
//             let qtyhand = data[i].qtyhand;
//             total_quantity = total_quantity + parseFloat(qtyhand);
//           }
//           let extended_cost = $this.state.quantity * data[0].avgcost;
//           $this.setState({
//             // qtyhand: total_quantity,
//             unit_cost: data[0].avgcost,
//             extended_cost: extended_cost,
//           });
//           if (context !== undefined) {
//             context.updateState({
//               // qtyhand: total_quantity,
//               unit_cost: data[0].avgcost,
//               extended_cost: extended_cost,
//             });
//           }
//         }
//       }
//     },
//   });
// }
