import {
  swalMessage,
  algaehApiCall,
  getCookie
} from "../../../utils/algaehApiCall";

import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import SalesInvoiceIO from "../../../Models/SalesInvoice";
import _ from "lodash";
import moment from "moment";

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
  // console.log("data:", data);
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
        reportName:
          data.sales_invoice_mode === "I"
            ? "SalesInvoiceEntry"
            : "SalesInvoiceService",
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
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
      window.open(origin);
      window.document.title = "Invoice Report";
    }
  });
};

const PostSalesInvoice = $this => {
  AlgaehLoader({ show: true });
  let Inputobj = $this.state;

  Inputobj.posted = "Y";
  Inputobj.ScreenCode = getCookie("ScreenCode");
  Inputobj.due_date = moment($this.state.invoice_date, "YYYY-MM-DD")
    .add($this.state.payment_terms, "days")
    .format("YYYY-MM-DD");

  algaehApiCall({
    uri: "/SalesInvoice/postSalesInvoice",
    module: "sales",
    data: Inputobj,
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
      AlgaehLoader({ show: false });
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
                AlgaehLoader({ show: false });
                return;
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
  PostSalesInvoice,
  generateSalesInvoiceReport,
  SalesOrderSearch
};
