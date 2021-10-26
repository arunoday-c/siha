import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import _ from "lodash";
import Enumerable from "linq";

export default function ItemSetupEvent() {
  return {
    getItems: ($this) => {
      $this.props.getItemMaster({
        uri: "/pharmacy/getItemMasterPharmacyData",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEMS_GET_DATA",
          mappingName: "itemlist",
        },
      });
    },
    EditItemMaster: ($this, row) => {
      algaehApiCall({
        uri: "/pharmacy/getItemMasterAndItemUom",
        module: "pharmacy",
        method: "GET",
        data: {
          hims_d_item_master_id: row.hims_d_item_master_id,
        },
        onSuccess: (response) => {
          debugger;
          if (response.data.success) {
            let ItemList = Enumerable.from(response.data.records)
              .groupBy("$.hims_d_item_master_id", null, (k, g) => {
                let firstRecordSet = Enumerable.from(g).firstOrDefault();

                return {
                  item_code: firstRecordSet.item_code,
                  hims_d_item_master_id: firstRecordSet.hims_d_item_master_id,
                  item_description: firstRecordSet.item_description,
                  generic_id: firstRecordSet.generic_id,
                  category_id: firstRecordSet.category_id,
                  group_id: firstRecordSet.group_id,
                  form_id: firstRecordSet.form_id,
                  storage_id: firstRecordSet.storage_id,
                  item_uom_id: firstRecordSet.item_uom_id,
                  purchase_uom_id: firstRecordSet.purchase_uom_id,
                  sales_uom_id: firstRecordSet.sales_uom_id,
                  stocking_uom_id: firstRecordSet.stocking_uom_id,
                  item_status: firstRecordSet.item_status,
                  radioActive:
                    firstRecordSet.item_status === "A" ? true : false,
                  radioInactive:
                    firstRecordSet.item_status === "I" ? true : false,
                  service_id: firstRecordSet.service_id,
                  purchase_cost: firstRecordSet.purchase_cost,
                  addl_information: firstRecordSet.addl_information,
                  exp_date_required: firstRecordSet.exp_date_required,
                  sfda_code: firstRecordSet.sfda_code,
                  reorder_qty: firstRecordSet.reorder_qty,
                  standard_fee: firstRecordSet.sales_price,
                  vat_applicable: firstRecordSet.vat_applicable,
                  vat_percent: firstRecordSet.vat_percent,
                  detail_item_uom:
                    firstRecordSet.hims_m_item_uom_id === null
                      ? []
                      : g.getSource(),
                };
              })
              .toArray();
            const _head = _.head(ItemList);
            _head.addNew = false;
            $this.setState({
              isOpen: !$this.state.isOpen,
              itemPop: _head,
              addNew: false,
            });
          }
        },
        onError: (error) => {
          swalMessage({
            title: error.message,
            type: "warning",
          });
        },
      });
      // row.addNew = false;
      // $this.setState({
      //   isOpen: !$this.state.isOpen,
      //   itemPop: row,
      //   addNew: false,
      // });
    },
    OpenReQtyLocation: ($this, row) => {
      algaehApiCall({
        uri: "/pharmacy/getLocationReorder",
        method: "GET",
        module: "pharmacy",
        data: { item_id: row.hims_d_item_master_id },
        onSuccess: (response) => {
          if (response.data.success === true) {
            $this.setState({
              isReQtyOpen: !$this.state.isReQtyOpen,
              item_description: row.item_description,
              item_id: row.hims_d_item_master_id,
              reorder_locations: response.data.records,
            });
          }
        },
      });
    },
    generateReports: ($this) => {
      // console.log("abcd");
      algaehApiCall({
        uri: $this.state.exportAsPdf === "Y" ? "/report" : "/excelReport",
        // uri: "/excelReport",
        method: "GET",
        module: "reports",
        headers: {
          Accept: "blob",
        },
        others: { responseType: "blob" },
        data: {
          report: {
            reportName: "phrMastrReport",
            pageOrentation: "landscape",
            // excelTabName: ,
            excelHeader: false,
            reportParams: [],
            // outputFileType: "EXCEL", //"EXCEL", //"PDF",
          },
        },
        onSuccess: (res) => {
          if ($this.state.exportAsPdf === "Y") {
            const urlBlob = URL.createObjectURL(res.data);
            const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Inventory Item Master`;
            window.open(origin);
          } else {
            const urlBlob = URL.createObjectURL(res.data);
            const a = document.createElement("a");
            a.href = urlBlob;
            a.download = `Inventory Item Master.${"xlsx"}`;
            a.click();
          }
        },
      });
    },
  };
}
