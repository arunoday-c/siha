export default {
  inputParam: function (param) {
    var output;

    output = {
      hims_f_procurement_return_po_header_id: null,
      receipt_header_id: null,
      purchase_return_number: null,
      grn_number: null,

      return_date: new Date(),
      po_return_from: null,
      pharmcy_location_id: null,
      inventory_location_id: null,
      location_type: null,
      vendor_id: null,
      payment_terms: "",
      comment: null,
      sub_total: 0,
      discount_amount: 0,
      extended_total: 0,
      net_total: 0,
      tax_amount: 0,
      receipt_net_total: 0,
      receipt_net_payable: 0,
      return_total: 0,

      cancelled: "N",
      is_posted: "N",
      postEnable: true,
      dataFinder: false,


      pharmacy_stock_detail: [],
      inventory_stock_detail: [],
      po_return_entry_detail: [],
      saveEnable: true,
      dataExitst: false,
      ReqData: true,
    };
    return output;
  }
};
