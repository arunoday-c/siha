/* eslint-disable no-multi-str */
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import SalesInvoiceIO from "../../../Models/SalesInvoice";
import _ from "lodash";
import moment from "moment";
// import { newAlgaehApi } from "../../../hooks";

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
        sales_order_number: null,
        sales_quotation_number: null,
        invoice_entry_detail_item: [],
        invoice_entry_detail_services: [],
        saveEnable: true,
        sub_total: null,
        discount_amount: null,
        net_total: null,
        total_tax: null,
        net_payable: null,
      });
      break;

    default:
      $this.setState({
        [name]: value,
      });
      break;
  }
};

const ClearData = ($this) => {
  let IOputs = SalesInvoiceIO.inputParam();
  $this.setState(IOputs);
};

const SaveInvoiceEnrty = ($this) => {
  if ($this.state.invoice_date === null) {
    swalMessage({
      type: "warning",
      title: "Invoice Date - Cannot be empty.",
    });
    return;
  } else if (
    $this.state.sales_invoice_mode === "I" &&
    $this.state.cust_good_rec_date === null
  ) {
    swalMessage({
      type: "warning",
      title: "Goods Recived Date - Cannot be empty.",
    });
    return;
  }
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/SalesInvoice/addInvoiceEntry",
    module: "sales",
    method: "POST",
    data: $this.state,
    onSuccess: (response) => {
      if (response.data.success) {
        getCtrlCode($this, true, response.data.records.invoice_number);
        // if ($this.state.sales_invoice_files.length) {
        //   $this.saveDocument();
        // }
        // $this.setState({
        //   invoice_number: response.data.records.invoice_number,
        //   hims_f_sales_invoice_header_id:
        //     response.data.records.hims_f_sales_invoice_header_id,
        //   saveEnable: true,
        //   postEnable: false,
        //   dataExitst: true,
        // });
        swalMessage({
          type: "success",
          title: "Saved successfully ...",
        });
        AlgaehLoader({ show: false });
      } else {
        AlgaehLoader({ show: false });
        swalMessage({
          type: "error",
          title: response.data.records.message,
        });
      }
    },
  });
};

const getCtrlCode = ($this, saveDocument, docNumber) => {
  AlgaehLoader({ show: true });

  let IOputs = SalesInvoiceIO.inputParam();

  $this.setState(IOputs, () => {
    algaehApiCall({
      uri: "/SalesInvoice/getInvoiceEntry",
      module: "sales",
      method: "GET",
      data: { invoice_number: docNumber },
      onSuccess: (response) => {
        if (response.data.success) {
          let data = response.data.records;

          data.saveEnable = true;
          data.dataExitst = true;
          data.dateEditable = true;

          if (data.is_cancelled === "Y") {
            data.postEnable = true;
            data.dataRevert = true;
            data.cancelEnable = true;
          } else {
            if (data.is_posted === "Y" || data.is_revert === "Y") {
              data.postEnable = true;
              data.dataRevert = true;
              data.cancelEnable = true;
            } else {
              data.postEnable = false;
              data.dataRevert = false;
              data.cancelEnable = false;
              data.dateEditable = false;
            }
          }

          if (data.sales_invoice_mode === "I") {
            data.invoice_entry_detail_item = data.invoice_detail;
          } else {
            data.invoice_entry_detail_services = data.invoice_detail;
          }

          $this.setState(data, () => {
            if (saveDocument) {
              $this.saveDocument();
            } else {
              return;
            }
          });
          AlgaehLoader({ show: false });

          // $this.setState({ ...response.data.records });
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

const generateSalesInvoiceReport = (data) => {
  // console.log("data:", data);
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
        reportName:
          data.sales_invoice_mode === "I"
            ? "SalesInvoiceEntry"
            : "SalesInvoiceService",
        reportParams: [
          {
            name: "invoice_number",
            value: data.invoice_number,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data.invoice_number}-Invoice Report`;
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=${reportName}`;
      window.open(origin);
      // window.document.title = "Invoice Report";
    },
  });
};

const PostSalesInvoice = ($this) => {
  if ($this.state.delivery_date === null) {
    swalMessage({
      type: "warning",
      title: "Delivery Date - Cannot be empty.",
    });
    return;
  }

  AlgaehLoader({ show: true });
  let Inputobj = $this.state;

  Inputobj.posted = "Y";
  Inputobj.ScreenCode = "SAL005";
  Inputobj.due_date = moment($this.state.delivery_date, "YYYY-MM-DD")
    .add($this.state.payment_terms, "days")
    .format("YYYY-MM-DD");

  Inputobj.invoice_date = moment(Inputobj.invoice_date).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  algaehApiCall({
    uri: "/SalesInvoice/postSalesInvoice",
    module: "sales",
    data: Inputobj,
    method: "PUT",
    onSuccess: (response) => {
      if (response.data.success === true) {
        getCtrlCode($this, false, $this.state.invoice_number);
        swalMessage({
          title: "Posted successfully . .",
          type: "success",
        });
      }
      AlgaehLoader({ show: false });
    },
  });
};

const SalesOrderSearch = ($this, e) => {
  const invoice_date = moment($this.state.invoice_date, "YYYY-MM-DD").format(
    "YYYY-MM-DD"
  );
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Sales.SalesOrder,
    },
    searchName: "SalesOrder",
    uri: "/gloabelSearch/get",
    inputs:
      " date(sales_order_date) <= date('" +
      invoice_date +
      "') and sales_order_mode = '" +
      $this.state.sales_invoice_mode +
      "' and authorize1='Y' \
                and authorize2='Y' and closed='N' and cancelled='N'",

    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      AlgaehLoader({ show: true });
      if ($this.state.sales_invoice_mode === "I") {
        algaehApiCall({
          uri: "/SalesInvoice/getDispatchForInvoice",
          module: "sales",
          method: "GET",
          data: { sales_order_id: row.hims_f_sales_order_id },
          onSuccess: (response) => {
            if (response.data.success) {
              let data = response.data.records;

              if (data.invoice_entry_detail_item.length === 0) {
                swalMessage({
                  title: "Item not dispatched yet",
                  type: "warning",
                });
                AlgaehLoader({ show: false });
                return;
              }

              data.sales_order_id = data.hims_f_sales_order_id;
              data.saveEnable = false;

              data.sub_total = _.sumBy(data.invoice_entry_detail_item, (s) =>
                parseFloat(s.sub_total)
              );
              data.discount_amount = _.sumBy(
                data.invoice_entry_detail_item,
                (s) => parseFloat(s.discount_amount)
              );
              data.net_total = _.sumBy(data.invoice_entry_detail_item, (s) =>
                parseFloat(s.net_total)
              );
              data.total_tax = _.sumBy(data.invoice_entry_detail_item, (s) =>
                parseFloat(s.total_tax)
              );
              data.net_payable = _.sumBy(data.invoice_entry_detail_item, (s) =>
                parseFloat(s.net_payable)
              );

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
      } else {
        algaehApiCall({
          uri: "/SalesInvoice/getSalesOrderServiceInvoice",
          module: "sales",
          method: "GET",
          data: { hims_f_sales_order_id: row.hims_f_sales_order_id },
          onSuccess: (response) => {
            if (response.data.success) {
              let data = response.data.records;
              data.sales_order_id = data.hims_f_sales_order_id;
              data.saveEnable = false;

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
      }
    },
  });
};

const RevertSalesInvoice = ($this) => {
  if ($this.state.revert_reason === null || $this.state.revert_reason === "") {
    swalMessage({
      type: "warning",
      title: "Revert reason is Mandatory",
    });
    return;
  }

  swal({
    title: "Are you sure you want to Revert ?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No",
  }).then((willDelete) => {
    if (willDelete.value) {
      const { sales_order_number, sales_person_id } = $this.state;
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/SalesInvoice/revertSalesInvoice",
        module: "sales",
        method: "PUT",
        data: {
          hims_f_sales_invoice_header_id:
            $this.state.hims_f_sales_invoice_header_id,
          sales_order_id: $this.state.sales_order_id,
          revert_reason: $this.state.revert_reason,
          sales_invoice_mode: $this.state.sales_invoice_mode,
        },
        onSuccess: (response) => {
          if (response.data.success) {
            getCtrlCode($this, false, $this.state.invoice_number);
            if ($this.context.socket.connected) {
              $this.context.socket.emit("sales_revet", {
                sales_order_number,
                sales_person_id,
              });
            }
            swalMessage({
              type: "success",
              title: "Reverted successfully ...",
            });
            AlgaehLoader({ show: false });
          } else {
            AlgaehLoader({ show: false });
            swalMessage({
              type: "error",
              title: response.data.records.message,
            });
          }
        },
      });
    }
  });
};

const SaveNarration = ($this) => {
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/SalesSettings/SaveNarration",
    module: "sales",
    method: "PUT",
    data: {
      hims_f_sales_invoice_header_id:
        $this.state.hims_f_sales_invoice_header_id,
      narration: $this.state.narration,
    },
    onSuccess: (response) => {
      if (response.data.success) {
        swalMessage({
          type: "success",
          title: "Updated successfully ...",
        });
        AlgaehLoader({ show: false });
      } else {
        AlgaehLoader({ show: false });
        swalMessage({
          type: "error",
          title: response.data.records.message,
        });
      }
    },
  });
};

const CancelSalesInvoice = ($this) => {
  if ($this.state.cancel_reason === null || $this.state.cancel_reason === "") {
    swalMessage({
      type: "warning",
      title: "Cancellation reason is Mandatory",
    });
    return;
  }
  swal({
    title: "Are you sure you want to Cancel ?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No",
  }).then((willDelete) => {
    if (willDelete.value) {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/SalesInvoice/cancelSalesInvoice",
        module: "sales",
        method: "PUT",
        data: {
          hims_f_sales_invoice_header_id:
            $this.state.hims_f_sales_invoice_header_id,
          sales_order_id: $this.state.sales_order_id,
          sales_invoice_mode: $this.state.sales_invoice_mode,
          cancel_reason: $this.state.cancel_reason,
          invoice_entry_detail_item: $this.state.invoice_entry_detail_item,
        },
        onSuccess: (response) => {
          if (response.data.success) {
            getCtrlCode($this, false, $this.state.invoice_number);
            swalMessage({
              type: "success",
              title: "Cancelled successfully ...",
            });
            AlgaehLoader({ show: false });
          } else {
            AlgaehLoader({ show: false });
            swalMessage({
              type: "error",
              title: response.data.records.message,
            });
          }
        },
      });
    }
  });
};

const datehandle = ($this, ctrl, e) => {
  let date = moment(ctrl);
  $this.setState({
    [e]: date,
  });
};

const dateValidate = ($this, value, event) => {
  let inRange = false;
  if (event.target.name === "invoice_date") {
    inRange = moment(value).isAfter(moment().format("YYYY-MM-DD"));
    if (inRange) {
      swalMessage({
        title: "Selected Date cannot be future Date.",
        type: "warning",
      });
      event.target.focus();
      $this.setState({
        [event.target.name]: null,
      });
    }
  }
};

const SaveDeliveryDate = ($this) => {
  if ($this.state.delivery_date === null) {
    swalMessage({
      type: "warning",
      title: "Delivery Date - Cannot be empty.",
    });
    return;
  }

  AlgaehLoader({ show: true });
  let Inputobj = {
    hims_f_sales_invoice_header_id: $this.state.hims_f_sales_invoice_header_id,
    invoice_number: $this.state.invoice_number,
    delivery_date: $this.state.delivery_date,
    due_date: moment($this.state.delivery_date, "YYYY-MM-DD")
      .add($this.state.payment_terms, "days")
      .format("YYYY-MM-DD"),
  };

  // Inputobj.posted = "Y";
  // Inputobj.ScreenCode = "SAL005";
  // Inputobj.due_date = moment($this.state.delivery_date, "YYYY-MM-DD")
  //   .add($this.state.payment_terms, "days")
  //   .format("YYYY-MM-DD");

  // Inputobj.invoice_date = moment(Inputobj.invoice_date).format(
  //   "YYYY-MM-DD HH:mm:ss"
  // );
  algaehApiCall({
    uri: "/SalesInvoice/saveDeliveryDate",
    module: "sales",
    data: Inputobj,
    method: "PUT",
    onSuccess: (response) => {
      if (response.data.success === true) {
        getCtrlCode($this, false, $this.state.invoice_number);
        swalMessage({
          title: "Saved successfully . .",
          type: "success",
        });
      }
      AlgaehLoader({ show: false });
    },
  });
};

export {
  texthandle,
  ClearData,
  SaveInvoiceEnrty,
  // getDocuments,
  getCtrlCode,
  PostSalesInvoice,
  generateSalesInvoiceReport,
  SalesOrderSearch,
  RevertSalesInvoice,
  CancelSalesInvoice,
  SaveNarration,
  datehandle,
  dateValidate,
  SaveDeliveryDate,
};
