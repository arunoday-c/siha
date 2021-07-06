import React from "react";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import _ from "lodash";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import swal from "sweetalert2";

const texthandle = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  switch (name) {
    case "location_id":
      $this.setState({
        [name]: value,
        location_type: e.selected.location_type,
        ReqData: false,
      });
      break;
    default:
      $this.setState({
        [name]: value,
      });
      break;
  }
};

const SalesOrderSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Sales.SalesOrder,
    },
    searchName: "SalesOrder",
    uri: "/gloabelSearch/get",
    inputs:
      " sales_order_mode = 'I' and is_completed='N' and cancelled='N' and authorize1='Y' and authorize2='Y'",

    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/DispatchNote/getSalesOrderItem",
        module: "sales",
        method: "GET",
        data: {
          sales_order_number: row.sales_order_number,
          location_id: $this.state.location_id,
        },
        onSuccess: (response) => {
          if (response.data.success) {
            let data = response.data.records;

            data.sales_order_id = data.hims_f_sales_order_id;
            data.saveEnable = true;
            data.ReqData = true;
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
        onFailure: (error) => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: error.message,
            type: "error",
          });
        },
      });
    },
  });
};

const ClearData = ($this, e) => {
  $this.setState({
    hims_f_dispatch_note_header_id: null,
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
    inventory_stock_detail: [],
    calcelEnable: true,
    adjustEnable: true,
    deleteItem_data: [],
    delete_dispatch_items: [],
    invoice_generated: "N",
    adjust_reason: null,
  });
};

const SaveDispatchNote = ($this) => {
  let InputObj = $this.state;

  debugger;
  if ($this.state.hims_f_dispatch_note_header_id === null) {
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
      if (
        InputObj.stock_detail[j].inventory_stock_detail === undefined ||
        InputObj.stock_detail[j].inventory_stock_detail.length === 0
      ) {
        InputObj.stock_detail[j].removed = "Y";
      } else {
        delete InputObj.stock_detail[j].batches;
      }
    }

    // const partial_recived = _.filter(InputObj.stock_detail, (f) => {
    //   return parseFloat(f.quantity_outstanding) > 0;
    // });
    // // .Where((w) =>
    // // .ToArray();

    // if (partial_recived.length > 0) {
    //   InputObj.complete = "N";
    // }

    let stock_detail = _.filter(InputObj.stock_detail, (f) => {
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
        ...settings,
      },
      onSuccess: (response) => {
        if (response.data.success === true) {
          $this.setState({
            dispatch_note_number: response.data.records.dispatch_note_number,
            hims_f_sales_dispatch_note_header_id:
              response.data.records.hims_f_sales_dispatch_note_header_id,
            saveEnable: true,
            dataExists: true,
            cannotEdit: true,
            adjustEnable: true,
          });
          swalMessage({
            title: "Dispatch successfully . .",
            type: "success",
          });
          AlgaehLoader({ show: false });
        }
      },
      onFailure: (error) => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  } else {
    $this.setState({ dispatch_adjust: true });
    // debugger
    // InputObj.transaction_type = "SDN";
    // InputObj.transaction_date = moment(
    //   new Date(),
    //   "YYYY-MM-DD"
    // ).format("YYYY-MM-DD");

    // for (let i = 0; i < InputObj.delete_dispatch_items.length; i++) {
    //   InputObj.delete_dispatch_items[i].location_id = InputObj.location_id;
    //   InputObj.delete_dispatch_items[i].location_type = InputObj.location_type;
    //   InputObj.delete_dispatch_items[i].operation = "+";

    //   InputObj.delete_dispatch_items[i].quantity =
    //     InputObj.delete_dispatch_items[i].dispatch_quantity;

    //   InputObj.delete_dispatch_items[i].net_total =
    //     InputObj.delete_dispatch_items[i].total_amount;

    //   InputObj.delete_dispatch_items[i].expiry_date =
    //     InputObj.delete_dispatch_items[i].expiry_date !== null
    //       ? moment(
    //         InputObj.delete_dispatch_items[i].expiry_date,
    //         "YYYY-MM-DD"
    //       ).format("YYYY-MM-DD")
    //       : null;
    // }

    // const settings = { header: undefined, footer: undefined };

    // algaehApiCall({
    //   uri: "/DispatchNote/adjustDispatchNote",
    //   module: "sales",
    //   skipParse: true,
    //   data: Buffer.from(JSON.stringify(InputObj), "utf8"),
    //   method: "POST",
    //   header: {
    //     "content-type": "application/octet-stream",
    //     ...settings,
    //   },
    //   onSuccess: (response) => {
    //     if (response.data.success === true) {
    //       $this.setState({
    //         saveEnable: true,
    //         dataExists: true,
    //         cannotEdit: true,
    //         adjustEnable: true,
    //         deleteItem_data: []
    //       });
    //       swalMessage({
    //         title: "Adjusted successfully . .",
    //         type: "success",
    //       });
    //       AlgaehLoader({ show: false });
    //     }
    //   },
    //   onFailure: (error) => {
    //     AlgaehLoader({ show: false });
    //     swalMessage({
    //       title: error.message,
    //       type: "error",
    //     });
    //   },
    // });
  }
};

const getCtrlCode = ($this, docNumber, row) => {
  AlgaehLoader({ show: true });
  $this.setState($this.baseState, () => {
    algaehApiCall({
      uri: "/DispatchNote/getDispatchNote",
      module: "sales",
      method: "GET",
      data: { dispatch_note_number: docNumber },
      onSuccess: (response) => {
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
          data.adjustEnable = false;
          data.calcelEnable = data.invoice_generated === "Y" ? true : false;
          $this.setState(data);
        }
        AlgaehLoader({ show: false });
      },
      onFailure: (error) => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  });
};

const generateDispatchReport = (data) => {
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
        reportName: "dispatchNoteReport",
        reportParams: [
          {
            name: "dispatch_note_number",
            value: data.dispatch_note_number,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data.dispatch_note_number}-Dispatch Note Report`;
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= ${reportName}`;
      window.open(origin);
      // window.document.title = "Dispatch Note Report";
    },
  });
};

const CancelDispatchNote = ($this) => {
  let InputObj = $this.state;
  AlgaehLoader({ show: true });
  InputObj.transaction_type = "CDN";
  InputObj.transaction_date = moment(
    InputObj.dispatch_note_date,
    "YYYY-MM-DD"
  ).format("YYYY-MM-DD");

  for (let i = 0; i < InputObj.inventory_stock_detail.length; i++) {
    InputObj.inventory_stock_detail[i].location_id = InputObj.location_id;
    InputObj.inventory_stock_detail[i].location_type = InputObj.location_type;
    InputObj.inventory_stock_detail[i].operation = "+";

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

  const settings = { header: undefined, footer: undefined };

  algaehApiCall({
    uri: "/DispatchNote/cancelDispatchNote",
    module: "sales",
    skipParse: true,
    data: Buffer.from(JSON.stringify(InputObj), "utf8"),
    method: "POST",
    header: {
      "content-type": "application/octet-stream",
      ...settings,
    },
    onSuccess: (response) => {
      if (response.data.success === true) {
        $this.setState({
          dispatch_note_number: response.data.records.dispatch_note_number,
          hims_f_sales_dispatch_note_header_id:
            response.data.records.hims_f_sales_dispatch_note_header_id,
          saveEnable: true,
          dataExists: true,
          cannotEdit: true,
        });
        swalMessage({
          title: "Saved successfully . .",
          type: "success",
        });
        AlgaehLoader({ show: false });
      }
    },
    onFailure: (error) => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
};

const AdjustDisptachEntry = ($this) => {
  $this.setState({
    adjustEnable: true,
    deleteItem_data: [
      {
        fieldName: "actions",
        label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
        displayTemplate: (row) => {
          return (
            <span onClick={deleteDispatchItems.bind($this, $this, row)}>
              <i className="fas fa-trash-alt" />
            </span>
          );
        },
      },
    ],
    delete_dispatch_items: [],
  });
};

const deleteDispatchItems = ($this, row) => {
  debugger;
  let _inventory_stock_detail = $this.state.inventory_stock_detail;
  let _delete_dispatch_items = $this.state.delete_dispatch_items;

  const _index = _inventory_stock_detail.indexOf(row);
  _inventory_stock_detail.splice(_index, 1);
  _delete_dispatch_items.push(row);
  const sub_total = _.sumBy(_inventory_stock_detail, (s) =>
    parseFloat(s.extended_cost)
  );
  const discount_amount = _.sumBy(_inventory_stock_detail, (s) =>
    parseFloat(s.discount_amount)
  );

  const net_total = _.sumBy(_inventory_stock_detail, (s) =>
    parseFloat(s.net_extended_cost)
  );

  const total_tax = _.sumBy(_inventory_stock_detail, (s) =>
    parseFloat(s.tax_amount)
  );

  const net_payable = _.sumBy(_inventory_stock_detail, (s) =>
    parseFloat(s.total_amount)
  );
  $this.setState({
    inventory_stock_detail: _inventory_stock_detail,
    delete_dispatch_items: _delete_dispatch_items,
    saveEnable: false,

    sub_total: sub_total,
    discount_amount: discount_amount,
    net_total: net_total,
    total_tax: total_tax,
    net_payable: net_payable,
  });
};

const AdjustDispatch = ($this) => {
  swal({
    title:
      "If you adjust sales order also will adjust, Are you sure you want to Adjust ?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No",
  }).then((willAdjust) => {
    if (willAdjust.value) {
      let InputObj = $this.state;
      AlgaehLoader({ show: true });

      InputObj.transaction_type = "SDN";
      InputObj.transaction_date = moment(new Date(), "YYYY-MM-DD").format(
        "YYYY-MM-DD"
      );

      for (let i = 0; i < InputObj.delete_dispatch_items.length; i++) {
        InputObj.delete_dispatch_items[i].location_id = InputObj.location_id;
        InputObj.delete_dispatch_items[i].location_type =
          InputObj.location_type;
        InputObj.delete_dispatch_items[i].operation = "+";

        InputObj.delete_dispatch_items[i].quantity =
          InputObj.delete_dispatch_items[i].dispatch_quantity;

        InputObj.delete_dispatch_items[i].net_total =
          InputObj.delete_dispatch_items[i].total_amount;

        InputObj.delete_dispatch_items[i].expiry_date =
          InputObj.delete_dispatch_items[i].expiry_date !== null
            ? moment(
                InputObj.delete_dispatch_items[i].expiry_date,
                "YYYY-MM-DD"
              ).format("YYYY-MM-DD")
            : null;
      }

      const settings = { header: undefined, footer: undefined };

      algaehApiCall({
        uri: "/DispatchNote/adjustDispatchNote",
        module: "sales",
        skipParse: true,
        data: Buffer.from(JSON.stringify(InputObj), "utf8"),
        method: "POST",
        header: {
          "content-type": "application/octet-stream",
          ...settings,
        },
        onSuccess: (response) => {
          if (response.data.success === true) {
            $this.setState({
              saveEnable: true,
              dataExists: true,
              cannotEdit: true,
              adjustEnable: true,
              dispatch_adjust: false,
              deleteItem_data: [],
            });
            swalMessage({
              title: "Adjusted successfully . .",
              type: "success",
            });
            AlgaehLoader({ show: false });
          }
        },
        onFailure: (error) => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: error.message,
            type: "error",
          });
        },
      });
    }
  });
};
const getDrilDownData = ($this, transaction_id) => {
  AlgaehLoader({ show: true });

  $this.setState($this.baseState, () => {
    algaehApiCall({
      uri: "/DispatchNote/getDispatchNote",
      module: "sales",
      method: "GET",
      data: { transaction_id: transaction_id },
      onSuccess: (response) => {
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
          data.adjustEnable = false;
          data.calcelEnable = data.invoice_generated === "Y" ? true : false;
          $this.setState(data);
        }
        AlgaehLoader({ show: false });
      },
      onFailure: (error) => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  });
};

export {
  texthandle,
  SalesOrderSearch,
  ClearData,
  SaveDispatchNote,
  getCtrlCode,
  generateDispatchReport,
  CancelDispatchNote,
  AdjustDisptachEntry,
  AdjustDispatch,
  getDrilDownData,
};
