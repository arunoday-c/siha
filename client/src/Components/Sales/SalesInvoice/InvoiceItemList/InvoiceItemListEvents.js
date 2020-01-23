import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import Options from "../../../../Options.json";
import _ from "lodash";

const deleteInvoiceItemDetail = ($this, row, context) => {
  let invoice_entry_detail_item = $this.state.invoice_entry_detail_item;

  let _index = invoice_entry_detail_item.indexOf(row);
  invoice_entry_detail_item.splice(_index, 1);

  if (invoice_entry_detail_item.length === 0) {
    if (context !== undefined) {
      context.updateState({
        invoice_entry_detail_item: invoice_entry_detail_item,
        discount_amount: 0,
        sub_total: 0,
        total_tax: 0,
        net_total: 0,
        net_payable: 0,
        saveEnable: true
      });
    }
  } else {
    const sub_total = _.sumBy(invoice_entry_detail_item, s => parseFloat(s.sub_total));
    const discount_amount = _.sumBy(invoice_entry_detail_item, s => parseFloat(s.discount_amount));
    const net_total = _.sumBy(invoice_entry_detail_item, s => parseFloat(s.net_total));
    const total_tax = _.sumBy(invoice_entry_detail_item, s => parseFloat(s.total_tax));
    const net_payable = _.sumBy(invoice_entry_detail_item, s => parseFloat(s.net_payable));

    if (context !== undefined) {
      context.updateState({
        invoice_entry_detail_item: invoice_entry_detail_item,
        sub_total: sub_total,
        discount_amount: discount_amount,
        net_total: net_total,
        total_tax: total_tax,
        net_payable: net_payable
      });
    }
  }

};




const getDeliveryItemDetails = ($this, row) => {
  debugger
  algaehApiCall({
    uri: "/SalesInvoice/getDispatchItemDetails",
    module: "sales",
    method: "GET",
    data: {
      hims_f_dispatch_note_header_id: row.dispatch_note_header_id
    },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;

        if (data !== null && data !== undefined) {
          $this.setState({
            dn_item_details: data,
            dn_item_enable: !$this.state.dn_item_enable
          });
        }
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const CloseItemDetail = $this => {
  $this.setState({
    dn_item_details: [],
    dn_item_enable: !$this.state.dn_item_enable
  });
};

export {
  deleteInvoiceItemDetail,
  getDeliveryItemDetails,
  CloseItemDetail
};
