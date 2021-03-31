import AlgaehLoader from "../../Wrapper/fullPageLoader";
import CashSaleInvIOputs from "../../../Models/CashSaleInv";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import moment from "moment";
import _ from "lodash";
import swal from "sweetalert2";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
// import Enumerable from "linq";

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  switch (name) {
    case "project_id":
      $this.setState({
        [name]: value,
        organizations: e.selected.branches,
      });
      break;
    case "location_id":
      $this.setState({
        [name]: value,
        location_type: e.selected.location_type,
      });
      break;

    default:
      $this.setState({
        [name]: value,
      });
      break;
  }
};
const ClearData = ($this, e) => {
  let IOputs = CashSaleInvIOputs.inputParam();

  IOputs.item_id = null;
  IOputs.quantity = 0;
  IOputs.uom_id = null;
  IOputs.uom_description = null;
  IOputs.discount_percentage = 0;
  IOputs.unit_cost = 0;
  IOputs.tax_percent = 0;

  IOputs.item_description = "";
  IOputs.batchno = null;
  IOputs.expiry_date = null;
  IOputs.qtyhand = 0;

  $this.setState(IOputs);
};

const Validations = ($this) => {
  let isError = false;

  if ($this.state.invoice_date === null) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Invoice Date - Cannot be empty.",
    });

    return isError;
  } else if ($this.state.customer_id === null) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Define Cash Customer in customer setup. Contact Admin.",
    });

    return isError;
  } else if (
    $this.state.customer_name === null ||
    $this.state.customer_name === ""
  ) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Enter Customer Name.",
    });

    return isError;
  } else if ($this.state.project_id === null) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Select Project.",
    });

    return isError;
  } else if ($this.state.hospital_id === null) {
    isError = true;

    swalMessage({
      type: "warning",
      title: "Select Branch.",
    });

    return isError;
  }
};
const SaveCashSalesInvoice = ($this) => {
  const err = Validations($this);
  if (!err) {
    let InputObj = $this.state;

    const item_id_data = _.chain(InputObj.inventory_stock_detail)
      .groupBy((g) => g.item_id)
      .map((details, key) => {
        return key;
      })
      .value();
    InputObj.stock_detail = [];

    InputObj.invoice_date = moment(InputObj.invoice_date).format(
      "YYYY-MM-DD HH:mm:ss"
    );

    InputObj.cust_good_rec_date = moment(InputObj.cust_good_rec_date).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    InputObj.delivery_date = moment(InputObj.delivery_date).format(
      "YYYY-MM-DD HH:mm:ss"
    );

    InputObj.transaction_type = "SDN";
    InputObj.transaction_date = moment(
      InputObj.invoice_date,
      "YYYY-MM-DD"
    ).format("YYYY-MM-DD");

    for (let i = 0; i < item_id_data.length; i++) {
      const item_data = InputObj.inventory_stock_detail.filter(
        (f) => f.item_id === parseInt(item_id_data[i])
      );
      console.log("item_data", item_data);
      InputObj.stock_detail.push({
        item_id: item_id_data[i],
        uom_id: item_data[0].uom_id,
        ordered_quantity: item_data[0].quantity,
        dispatched_quantity: item_data[0].quantity,
        quantity_outstanding: 0,
        delivered_to_date: 0,
        inventory_stock_detail: item_data,
      });
    }

    const settings = { header: undefined, footer: undefined };
    // AlgaehLoader({ show: false });
    AlgaehLoader({ show: true });
    algaehApiCall({
      uri: "/SalesInvoice/addCashSalesInvoice",
      module: "sales",
      skipParse: true,
      data: Buffer.from(JSON.stringify(InputObj), "utf8"),
      method: "POST",
      header: {
        "content-type": "application/octet-stream",
        ...settings,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          getCtrlCode($this, response.data.records.invoice_number);
          swalMessage({
            type: "success",
            title: "Saved successfully ...",
          });
          // AlgaehLoader({ show: false });
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
};
const employeeSearch = ($this) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Employee_details.employee,
    },
    searchName: "employee_branch_wise",
    uri: "/gloabelSearch/get",
    // inputs: "hospital_id = " + $this.state.hospital_id,
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      $this.setState({
        employee_name: row.full_name,
        sales_person_id: row.hims_d_employee_id,
      });
    },
  });
};
const closePopup = ($this) => {
  $this.setState({ popUpGenereted: false });
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });

  let IOputs = CashSaleInvIOputs.inputParam();

  $this.setState(IOputs, () => {
    algaehApiCall({
      uri: "/SalesInvoice/getInvoiceEntryCash",
      module: "sales",
      method: "GET",
      data: { invoice_number: docNumber },
      onSuccess: (response) => {
        if (response.data.success) {
          let data = response.data.records;

          data.saveEnable = true;
          data.dataExitst = true;
          data.grid_edit = true;
          data.dateEditable = true;
          data.itemAdd = true;

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

          data.organizations = $this.props.hospitaldetails;

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
        reportName: "SalesInvoiceEntry",
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

const getCostCenters = ($this) => {
  algaehApiCall({
    uri: "/finance_masters/getCostCenters",
    method: "GET",
    module: "finance",

    onSuccess: (response) => {
      if (response.data.success === true) {
        $this.setState({ cost_projects: response.data.result });
      }
    },
  });
};

const getCashCustomer = ($this) => {
  algaehApiCall({
    uri: "/customer/getCustomerMaster",
    module: "masterSettings",
    method: "GET",
    data: { customer_status: "A", cash_customer: "Y" },
    onSuccess: (response) => {
      if (response.data.success === true) {
        $this.setState({
          customer_id: response.data.records[0].hims_d_customer_id,
        });
      }
    },
    onFailure: (error) => {
      swalMessage({
        title: error.message,
        type: "error",
      });
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
        getCtrlCode($this, $this.state.invoice_number);
        swalMessage({
          title: "Posted successfully . .",
          type: "success",
        });
      }
      AlgaehLoader({ show: false });
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
            // AlgaehLoader({ show: false });
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

export {
  changeTexts,
  SaveCashSalesInvoice,
  ClearData,
  closePopup,
  getCtrlCode,
  datehandle,
  dateValidate,
  generateSalesInvoiceReport,
  getCostCenters,
  PostSalesInvoice,
  CancelSalesInvoice,
  getCashCustomer,
  employeeSearch,
};
