import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";

import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import SalesInvoiceIO from "../../../Models/SalesInvoice";
import _ from "lodash";

const texthandle = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  switch (name) {
    case "sales_invoice_mode":
      $this.setState({
        [name]: value,
        dataExitst: false,
        project_name: null,
        customer_name: null,
        hospital_name: null,
        payment_terms: null,
        customer_id: null,
        payment_terms: null,
        sales_order_number: null,
        sales_quotation_number: null,
        invoice_entry_detail_item: [],
        invoice_entry_detail_services: [],
        saveEnable: true,
        sub_total: null,
        discount_amount: null,
        net_total: null,
        total_tax: null,
        net_payable: null
      });
      break;

    default:
      $this.setState({
        [name]: value
      });
      break;
  }
};

const ClearData = $this => {
  let IOputs = SalesInvoiceIO.inputParam();
  $this.setState(IOputs);
};

const SaveInvoiceEnrty = $this => {
  AlgaehLoader({ show: true });
  debugger;
  algaehApiCall({
    uri: "/SalesInvoice/addInvoiceEntry",
    module: "sales",
    method: "POST",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success) {
        $this.setState({
          invoice_number: response.data.records.invoice_number,
          hims_f_sales_invoice_header_id:
            response.data.records.hims_f_sales_invoice_header_id,
          saveEnable: true,
          postEnable: false,
          dataExitst: true
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
    }
  });
};

const getCtrlCode = ($this, docNumber, row) => {
  AlgaehLoader({ show: true });

  let IOputs = SalesInvoiceIO.inputParam();

  $this.setState(IOputs, () => {
    algaehApiCall({
      uri: "/SalesInvoice/getInvoiceEntry",
      module: "sales",
      method: "GET",
      data: { invoice_number: docNumber },
      onSuccess: response => {
        if (response.data.success) {
          let data = response.data.records;

          data.saveEnable = true;
          data.dataExitst = true;

          if (data.is_posted === "Y") {
            data.postEnable = true;
          } else {
            data.postEnable = false;
          }

          if (data.sales_invoice_mode === "I") {
            data.invoice_entry_detail_item = data.invoice_detail;
          } else {
            data.invoice_entry_detail_services = data.invoice_detail;
          }

          $this.setState(data);
          AlgaehLoader({ show: false });

          // $this.setState({ ...response.data.records });
        }
        AlgaehLoader({ show: false });
      },
      onFailure: error => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  });
};

const generateSalesInvoiceReport = data => {
  console.log("data:", data);
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob"
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "SalesInvoiceEntry",
        reportParams: [
          {
            name: "invoice_number",
            value: data.invoice_number
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const url = URL.createObjectURL(res.data);
      let myWindow = window.open(
        "{{ product.metafields.google.custom_label_0 }}",
        "_blank"
      );
      myWindow.document.write(
        "<iframe src= '" + url + "' width='100%' height='100%' />"
      );
      myWindow.document.title = "Invoice Report";
    }
  });
};

const PostInvoiceEntry = $this => {
  $this.state.posted = "Y";
  $this.state.transaction_type = "REC";
  $this.state.transaction_id = $this.state.hims_f_procurement_grn_header_id;
  $this.state.transaction_date = $this.state.grn_date;

  if ($this.state.grn_for === "PHR") {
    $this.state.pharmacy_stock_detail = $this.state.receipt_entry_detail;

    for (let i = 0; i < $this.state.pharmacy_stock_detail.length; i++) {
      $this.state.pharmacy_stock_detail[i].location_id =
        $this.state.pharmcy_location_id;
      $this.state.pharmacy_stock_detail[i].location_type =
        $this.state.location_type;

      $this.state.pharmacy_stock_detail[i].quantity =
        $this.state.pharmacy_stock_detail[i].recieved_quantity;

      $this.state.pharmacy_stock_detail[i].uom_id =
        $this.state.pharmacy_stock_detail[i].pharmacy_uom_id;

      $this.state.pharmacy_stock_detail[i].sales_uom =
        $this.state.pharmacy_stock_detail[i].pharmacy_uom_id;
      $this.state.pharmacy_stock_detail[i].item_id =
        $this.state.pharmacy_stock_detail[i].phar_item_id;
      $this.state.pharmacy_stock_detail[i].item_code_id =
        $this.state.pharmacy_stock_detail[i].phar_item_id;
      $this.state.pharmacy_stock_detail[i].grn_number = $this.state.grn_number;
      $this.state.pharmacy_stock_detail[i].item_category_id =
        $this.state.pharmacy_stock_detail[i].phar_item_category;
      $this.state.pharmacy_stock_detail[i].item_group_id =
        $this.state.pharmacy_stock_detail[i].phar_item_group;

      $this.state.pharmacy_stock_detail[i].net_total =
        $this.state.pharmacy_stock_detail[i].net_extended_cost;
      $this.state.pharmacy_stock_detail[i].operation = "+";
    }
  } else if ($this.state.grn_for === "INV") {
    $this.state.inventory_stock_detail = $this.state.receipt_entry_detail;

    for (let i = 0; i < $this.state.inventory_stock_detail.length; i++) {
      $this.state.inventory_stock_detail[i].location_id =
        $this.state.inventory_location_id;
      $this.state.inventory_stock_detail[i].location_type =
        $this.state.location_type;

      $this.state.inventory_stock_detail[i].quantity =
        $this.state.inventory_stock_detail[i].recieved_quantity;

      $this.state.inventory_stock_detail[i].uom_id =
        $this.state.inventory_stock_detail[i].inventory_uom_id;
      $this.state.inventory_stock_detail[i].sales_uom =
        $this.state.inventory_stock_detail[i].inventory_uom_id;
      $this.state.inventory_stock_detail[i].item_id =
        $this.state.inventory_stock_detail[i].inv_item_id;
      $this.state.inventory_stock_detail[i].item_code_id =
        $this.state.inventory_stock_detail[i].inv_item_id;
      $this.state.inventory_stock_detail[i].grn_number = $this.state.grn_number;
      $this.state.inventory_stock_detail[i].item_category_id =
        $this.state.inventory_stock_detail[i].inv_item_category_id;
      $this.state.inventory_stock_detail[i].item_group_id =
        $this.state.inventory_stock_detail[i].inv_item_group_id;

      $this.state.inventory_stock_detail[i].net_total =
        $this.state.inventory_stock_detail[i].net_extended_cost;
      $this.state.inventory_stock_detail[i].operation = "+";
    }
  }

  algaehApiCall({
    uri: "/ReceiptEntry/updateReceiptEntry",
    module: "procurement",
    data: $this.state,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          postEnable: true
        });
        swalMessage({
          title: "Posted successfully . .",
          type: "success"
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

const SalesOrderSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Sales.SalesOrder
    },
    searchName: "SalesOrder",
    uri: "/gloabelSearch/get",
    inputs:
      " sales_order_mode = '" +
      $this.state.sales_invoice_mode +
      "' and authorize1='Y' \
                and authorize2='Y' and closed='N' and cancelled='N'",

    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      AlgaehLoader({ show: true });
      if ($this.state.sales_invoice_mode === "I") {
        algaehApiCall({
          uri: "/SalesInvoice/getDispatchForInvoice",
          module: "sales",
          method: "GET",
          data: { sales_order_id: row.hims_f_sales_order_id },
          onSuccess: response => {
            if (response.data.success) {
              let data = response.data.records;
              if (data.invoice_entry_detail_item.length === 0) {
                swalMessage({
                  title: "Item not dispatched yet",
                  type: "warning"
                });
              }

              data.sales_order_id = data.hims_f_sales_order_id;
              data.saveEnable = false;

              data.sub_total = _.sumBy(data.invoice_entry_detail_item, s =>
                parseFloat(s.sub_total)
              );
              data.discount_amount = _.sumBy(
                data.invoice_entry_detail_item,
                s => parseFloat(s.discount_amount)
              );
              data.net_total = _.sumBy(data.invoice_entry_detail_item, s =>
                parseFloat(s.net_total)
              );
              data.total_tax = _.sumBy(data.invoice_entry_detail_item, s =>
                parseFloat(s.total_tax)
              );
              data.net_payable = _.sumBy(data.invoice_entry_detail_item, s =>
                parseFloat(s.net_payable)
              );

              $this.setState(data);
              AlgaehLoader({ show: false });
            }
            AlgaehLoader({ show: false });
          },
          onFailure: error => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      } else {
        algaehApiCall({
          uri: "/SalesInvoice/getSalesOrderServiceInvoice",
          module: "sales",
          method: "GET",
          data: { hims_f_sales_order_id: row.hims_f_sales_order_id },
          onSuccess: response => {
            if (response.data.success) {
              let data = response.data.records;
              data.sales_order_id = data.hims_f_sales_order_id;
              data.saveEnable = false;

              $this.setState(data);
              AlgaehLoader({ show: false });
            }
            AlgaehLoader({ show: false });
          },
          onFailure: error => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      }
    }
  });
};

export {
  texthandle,
  ClearData,
  SaveInvoiceEnrty,
  getCtrlCode,
  PostInvoiceEntry,
  generateSalesInvoiceReport,
  SalesOrderSearch
};
