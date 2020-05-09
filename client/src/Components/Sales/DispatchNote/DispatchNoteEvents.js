import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import _ from "lodash";

const texthandle = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  switch (name) {
    case "location_id":
      $this.setState({
        [name]: value,
        location_type: e.selected.location_type,
        ReqData: false
      });
      break;
    default:
      $this.setState({
        [name]: value
      });
      break;
  }
};

const SalesOrderSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Sales.SalesOrder
    },
    searchName: "SalesOrder",
    uri: "/gloabelSearch/get",
    inputs:
      " sales_order_mode = 'I' and is_completed='N' and authorize1='Y' and authorize2='Y'",

    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/DispatchNote/getSalesOrderItem",
        module: "sales",
        method: "GET",
        data: {
          sales_order_number: row.sales_order_number,
          location_id: $this.state.location_id
        },
        onSuccess: response => {
          if (response.data.success) {
            let data = response.data.records;

            data.sales_order_id = data.hims_f_sales_order_id;
            data.saveEnable = true;
            data.selectedData = true;
            data.sub_total = 0;
            data.discount_amount = 0;
            data.net_total = 0;
            data.total_tax = 0;
            data.net_payable = 0;

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
  });
};

const ClearData = ($this, e) => {
  $this.setState({
    hims_f_dispatch_note_id: null,
    dispatch_note_number: null,
    sales_order_id: null,
    sales_order_number: null,
    dispatch_note_date: new Date(),
    customer_id: null,
    sub_total: null,
    discount_amount: null,
    net_total: null,
    total_tax: null,
    net_payable: null,
    narration: null,
    project_id: null,
    customer_po_no: null,
    tax_percentage: null,
    location_id: null,
    location_type: null,

    stock_detail: [],
    saveEnable: true,
    dataExists: false,
    ReqData: true,
    customer_name: null,
    hospital_name: null,
    project_name: null,
    selectedData: false,
    cannotEdit: false,

    item_details: [],
    batch_detail_view: false,
    dispatched_quantity: 0,
    inventory_stock_detail: []
  });
};

const SaveDispatchNote = $this => {
  let InputObj = $this.state;
  AlgaehLoader({ show: true });
  InputObj.transaction_type = "SDN";
  InputObj.transaction_date = moment(
    InputObj.dispatch_note_date,
    "YYYY-MM-DD"
  ).format("YYYY-MM-DD");

  for (let i = 0; i < InputObj.inventory_stock_detail.length; i++) {
    InputObj.inventory_stock_detail[i].location_id = InputObj.location_id;
    InputObj.inventory_stock_detail[i].location_type = InputObj.location_type;
    InputObj.inventory_stock_detail[i].operation = "-";

    InputObj.inventory_stock_detail[i].quantity =
      InputObj.inventory_stock_detail[i].dispatch_quantity;

    InputObj.inventory_stock_detail[i].net_total =
      InputObj.inventory_stock_detail[i].total_amount;

    InputObj.inventory_stock_detail[i].expiry_date =
      InputObj.inventory_stock_detail[i].expiry_date !== null
        ? moment(
          InputObj.inventory_stock_detail[i].expiry_date,
          "YYYY-MM-DD"
        ).format("YYYY-MM-DD")
        : null;
  }
  delete InputObj.item_details;

  for (let j = 0; j < InputObj.stock_detail.length; j++) {
    if (InputObj.stock_detail[j].inventory_stock_detail === undefined) {
      InputObj.stock_detail[j].removed = "Y";
    } else {
      delete InputObj.stock_detail[j].batches;
    }
  }

  if (InputObj.stock_detail.length !== InputObj.inventory_stock_detail.length) {
    InputObj.complete = "N"
  }

  let stock_detail = _.filter(InputObj.stock_detail, f => {
    return f.removed === "N";
  });

  InputObj.stock_detail = stock_detail;

  const settings = { header: undefined, footer: undefined };

  algaehApiCall({
    uri: "/DispatchNote/addDispatchNote",
    module: "sales",
    skipParse: true,
    data: Buffer.from(JSON.stringify(InputObj), "utf8"),
    method: "POST",
    header: {
      "content-type": "application/octet-stream",
      ...settings
    },
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          dispatch_note_number: response.data.records.dispatch_note_number,
          hims_f_sales_dispatch_note_header_id:
            response.data.records.hims_f_sales_dispatch_note_header_id,
          saveEnable: true,
          dataExists: true,
          cannotEdit: true
        });
        swalMessage({
          title: "Saved successfully . .",
          type: "success"
        });
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
};

const getCtrlCode = ($this, docNumber, row) => {
  $this.setState($this.baseState, () => {
    algaehApiCall({
      uri: "/DispatchNote/getDispatchNote",
      module: "sales",
      method: "GET",
      data: { dispatch_note_number: docNumber },
      onSuccess: response => {
        if (response.data.success === true) {
          let inventory_stock_detail = [];
          let data = response.data.records[0];
          for (let i = 0; i < data.stock_detail.length; i++) {
            if (inventory_stock_detail.length === 0) {
              inventory_stock_detail =
                data.stock_detail[i].inventory_stock_detail;
            } else {
              inventory_stock_detail = inventory_stock_detail.concat(
                data.stock_detail[i].inventory_stock_detail
              );
            }
          }
          data.inventory_stock_detail = inventory_stock_detail;

          data.saveEnable = true;
          data.dataExists = true;

          data.cannotEdit = true;
          data.dataExitst = true;

          data.sales_order_number = row.sales_order_number;
          data.customer_name = row.customer_name;
          data.project_name = row.project_desc;
          data.hospital_name = row.hospital_name;

          $this.setState(data);
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

const generateDispatchReport = data => {
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
        reportName: "dispatchNoteReport",
        reportParams: [
          {
            name: "dispatch_note_number",
            value: data.dispatch_note_number
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data.dispatch_note_number}-Dispatch Note Report`
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= ${reportName}`;
      window.open(origin);
      // window.document.title = "Dispatch Note Report";
    }
  });
};

export {
  texthandle,
  SalesOrderSearch,
  ClearData,
  SaveDispatchNote,
  getCtrlCode,
  generateDispatchReport
};
