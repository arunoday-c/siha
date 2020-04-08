import {
  swalMessage,
  algaehApiCall,
  getCookie
} from "../../../utils/algaehApiCall";
import moment from "moment";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const loctexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    location_type: e.selected.location_type
  });
};

const vendortexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    vendor_name: e.selected.vendor_name,
    payment_terms: e.selected.payment_terms,
    tax_percentage: e.selected.vat_percentage
  });
};

const discounthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let sheet_discount_percentage = 0;
  let sheet_discount_amount = 0;

  if (e.target.name === "sheet_discount_percentage") {
    sheet_discount_percentage = parseFloat(e.target.value.replace(" %", ""));
    sheet_discount_amount = 0;
  } else {
    sheet_discount_amount = parseFloat(e.target.value);
    sheet_discount_percentage = 0;
  }
  if (sheet_discount_percentage > 100) {
    swalMessage({
      title: "Discount % cannot be greater than 100.",
      type: "warning"
    });
  } else {
    $this.setState({
      sheet_discount_percentage: sheet_discount_percentage,
      sheet_discount_amount: sheet_discount_amount
    });

    if (context !== null) {
      context.updateState({
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      });
    }
  }
};

const numberchangeTexts = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (value < 0) {
    swalMessage({
      title: "Quantity cannot be less than Zero",
      type: "warning"
    });
  } else if (value > $this.state.qtyhand) {
    swalMessage({
      title: "Quantity cannot be greater than Quantity in hand",
      type: "warning"
    });
  } else {
    $this.setState({ [name]: value });

    if (context !== undefined) {
      context.updateState({
        [name]: value
      });
    }
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const InvoiceSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Sales.SalesInvoice
    },
    searchName: "SalesInvoice",
    uri: "/gloabelSearch/get",
    inputs: "sales_invoice_mode = 'I' and return_done = 'N' and is_posted='Y' ",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/SalesReturnEntry/getInvoiceEntryItems",
        module: "sales",
        method: "GET",
        data: {
          hims_f_sales_invoice_header_id: row.hims_f_sales_invoice_header_id
        },
        onSuccess: response => {
          if (response.data.success) {
            let data = response.data.records;

            data.saveEnable = false;
            data.postEnable = true;
            data.dataFinder = true;
            data.tax_amount = data.total_tax;
            data.sales_invoice_header_id = data.hims_f_sales_invoice_header_id;

            // data.location_type = row.location_type;
            // data.grn_header_id = row.hims_f_procurement_grn_header_id;
            $this.setState(data);
          }
          AlgaehLoader({ show: false });
        }
      });
    }
  });
};

const ClearData = ($this, e) => {
  $this.setState({
    sales_return_number: null,
    invoice_number: null,
    customer_name: null,
    hospital_name: null,
    project_name: null,
    sales_return_detail: [],
    dataFinder: false,
    dataExitst: false,

    sub_total: null,
    receipt_net_total: null,
    receipt_net_payable: null,
    net_total: null,
    return_total: null,
    inv_is_posted: "N",
    tax_amount: null,
    discount_amount: null,

    comment: null,

    location_description: null,
    location_type: null,
    location_id: null,
    saveEnable: true,
    postEnable: true
  });
};

const SaveSalesReutrnEnrty = $this => {
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/SalesReturnEntry/addSalesReturn",
    module: "sales",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          sales_return_number: response.data.records.sales_return_number,
          hims_f_sales_return_header_id:
            response.data.records.hims_f_sales_return_header_id,
          saveEnable: true,
          postEnable: false,
          dataExitst: true
        });

        swalMessage({
          type: "success",
          title: "Saved successfully . ."
        });
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
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });

  $this.setState(
    {
      hims_f_sales_return_header_id: null,
      return_date: new Date(),
      sales_return_number: null,
      invoice_number: null,
      sales_invoice_header_id: null,
      customer_name: null,
      hospital_name: null,
      project_name: null,
      sales_return_detail: [],
      dataFinder: false,
      dataExitst: false,

      sub_total: null,
      receipt_net_total: null,
      receipt_net_payable: null,
      net_total: null,
      return_total: null,
      inv_is_posted: "N",
      tax_amount: null,
      discount_amount: null,
      comment: null,

      location_description: null,
      location_type: null,
      location_id: null
    },
    () => {
      algaehApiCall({
        uri: "/SalesReturnEntry/getSalesReturn",
        module: "sales",
        method: "GET",
        data: { sales_return_number: docNumber },
        onSuccess: response => {
          if (response.data.success) {
            let data = response.data.records;

            data.saveEnable = true;
            data.dataExitst = true;
            data.dataFinder = true;
            data.inv_is_posted = data.is_posted;
            if (data.is_posted === "N") {
              data.postEnable = false;
            } else {
              data.postEnable = true;
            }

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
  );
};

const generateSalesInvoice = data => {
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
        reportName: "InvSalesReturn",
        reportParams: [
          {
            name: "sales_return_number",
            value: data.sales_return_number
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data.sales_return_number}-Sales Quotation Report`
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= ${reportName}`;
      window.open(origin);
      // window.document.title = "Return Entry";
    }
  });
};

const PostSalesReturnEntry = $this => {
  AlgaehLoader({ show: true });
  let InputObj = $this.state;
  InputObj.transaction_type = "SRT";
  InputObj.transaction_id = $this.state.hims_f_sales_return_header_id;
  InputObj.transaction_date = $this.state.return_date;
  InputObj.year = moment().format("YYYY");
  InputObj.period = moment().format("MM");

  for (let i = 0; i < InputObj.sales_return_detail.length; i++) {
    InputObj.sales_return_detail[i].location_id = InputObj.location_id;
    InputObj.sales_return_detail[i].location_type = InputObj.location_type;

    InputObj.sales_return_detail[i].quantity = parseFloat(
      InputObj.sales_return_detail[i].return_qty
    );

    InputObj.sales_return_detail[i].sales_uom =
      InputObj.sales_return_detail[i].sales_uom_id;

    InputObj.sales_return_detail[i].operation = "+";
  }

  InputObj.ScreenCode = getCookie("ScreenCode");

  algaehApiCall({
    uri: "/SalesReturnEntry/postSalesReturnEntry",
    module: "sales",
    data: InputObj,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          postEnable: true,
          inv_is_posted: "Y"
        });
        swalMessage({
          title: "Posted successfully . .",
          type: "success"
        });
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
};

export {
  texthandle,
  discounthandle,
  numberchangeTexts,
  datehandle,
  InvoiceSearch,
  vendortexthandle,
  ClearData,
  SaveSalesReutrnEnrty,
  getCtrlCode,
  loctexthandle,
  PostSalesReturnEntry,
  generateSalesInvoice
};
