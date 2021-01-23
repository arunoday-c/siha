import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import _ from "lodash";
import Enumerable from "linq";
import extend from "extend";

const texthandle = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  switch (name) {
    case "sales_order_mode":
      $this.setState({
        [name]: value,
        hims_f_sales_order_id: null,
        sales_quotation_number: null,
        sales_quotation_id: null,
        sales_order_number: null,
        sales_order_date: new Date(),
        reference_number: null,
        customer_id: null,
        quote_validity: null,
        sales_man: null,
        payment_terms: null,
        service_terms: null,
        other_terms: null,
        sub_total: null,
        discount_amount: null,
        net_total: null,
        total_tax: null,
        net_payable: null,
        narration: null,
        project_id: null,
        customer_po_no: null,
        tax_percentage: null,

        sales_order_items: [],
        sales_order_services: [],
        saveEnable: true,
        dataExists: false,
        hospital_id: null,
        sales_person_id: null,
        employee_name: null,
        delivery_date: null,

        addItemButton: true,
        item_description: "",
        addedItem: true,

        item_id: null,
        quantity: 0,
        uom_id: null,
        uom_description: null,
        discount_percentage: 0,
        unit_cost: 0,
        tax_percent: 0,
        organizations: [],
        contract_number: null,
        contract_id: null,
        canceled_reason_sales: "",
        rejectVisible: false,
      });
      break;
    case "project_id":
      $this.setState({
        [name]: value,
        organizations: e.selected.branches,
      });
      break;
    default:
      $this.setState({
        [name]: value,
      });
      break;
  }
};

const customerTexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if ($this.state.sales_order_mode === "I") {
    $this.setState({
      [name]: value,
      payment_terms: e.selected.payment_terms,
    });
  } else {
    AlgaehLoader({ show: true });
    algaehApiCall({
      uri: "/SalesOrder/ValidateContract",
      module: "sales",
      method: "GET",
      data: { customer_id: value },
      onSuccess: (response) => {
        if (response.data.success) {
          $this.setState({
            [name]: value,
            payment_terms: e.selected.payment_terms,
          });
        } else {
          $this.setState({
            [name]: null,
            payment_terms: null,
          });
          swalMessage({
            title:
              "Selected Customer contract expired. Please contact customer for renewal.",
            type: "warning",
          });
        }
        AlgaehLoader({ show: false });
      },
    });
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d,
  });
};

const SalesQuotationSearch = ($this, e) => {
  let inputObj =
    " date(quote_validity) >= date('" +
    moment(new Date()).format("YYYY-MM-DD") +
    "') and ";
  inputObj =
    $this.state.sales_order_mode === "I"
      ? " quote_items_status='G'"
      : " quote_services_status='G'";
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Sales.SalesQuotation,
    },
    searchName: "SalesQuotation",
    uri: "/gloabelSearch/get",
    inputs: inputObj,

    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/SalesOrder/getSalesQuotationForOrder",
        module: "sales",
        method: "GET",
        data: {
          sales_quotation_number: row.sales_quotation_number,
          sales_order_mode: $this.state.sales_order_mode,
          HRMNGMT_Active: $this.HRMNGMT_Active,
        },
        onSuccess: (response) => {
          if (response.data.success) {
            let data = response.data.records;
            if (data.qutation_detail.length === 0) {
              AlgaehLoader({ show: false });
              if ($this.state.sales_order_mode === "I") {
                swalMessage({
                  title:
                    "Selcted Quotation Has no Item Details, Select proper Quotation",
                  type: "warning",
                });
              } else {
                swalMessage({
                  title:
                    "Selcted Quotation Has no Service Details, Select proper Quotation",
                  type: "warning",
                });
              }
              return;
            }

            data.sales_quotation_id = data.hims_f_sales_quotation_id;

            if ($this.state.sales_order_mode === "I") {
              data.sales_order_items = data.qutation_detail;
            } else {
              data.sales_order_services = data.qutation_detail;
            }
            data.saveEnable = false;
            data.selectedData = true;
            data.grid_edit = false;
            data.tax_percentage = data.vat_percentage;

            data.sub_total = _.sumBy(data.qutation_detail, (s) =>
              parseFloat(s.extended_cost)
            );
            data.discount_amount = _.sumBy(data.qutation_detail, (s) =>
              parseFloat(s.discount_amount)
            );
            data.net_total = _.sumBy(data.qutation_detail, (s) =>
              parseFloat(s.net_extended_cost)
            );

            data.total_tax = _.sumBy(data.qutation_detail, (s) =>
              parseFloat(s.tax_amount)
            );

            data.net_payable =
              parseFloat(data.net_total) + parseFloat(data.total_tax);

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

const ContractSearch = ($this, e) => {
  // let inputObj =
  //   " date(quote_validity) >= date('" +
  //   moment(new Date()).format("YYYY-MM-DD") +
  //   "') and ";
  // inputObj =
  //   $this.state.sales_order_mode === "I"
  //     ? " quote_items_status='G'"
  //     : " quote_services_status='G'";
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Sales.ContractMang,
    },
    searchName: "ContractMang",
    uri: "/gloabelSearch/get",
    // inputs: inputObj,

    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/SalesOrder/getContractSalesOrder",
        module: "sales",
        method: "GET",
        data: {
          contract_number: row.contract_number,
          HRMNGMT_Active: $this.HRMNGMT_Active,
        },
        onSuccess: (response) => {
          if (response.data.success) {
            let data = response.data.records;
            data.sales_order_services = data.contract_services;

            data.contract_id = data.hims_f_contract_management_id;
            data.saveEnable = false;
            data.selectedData = true;
            data.grid_edit = false;

            for (let i = 0; i < data.sales_order_services.length; i++) {
              data.sales_order_services[i].quantity = 1;
              data.sales_order_services[i].unit_cost =
                data.sales_order_services[i].service_price;
              data.sales_order_services[i].extended_cost =
                data.sales_order_services[i].service_price;
              data.sales_order_services[i].discount_percentage = 0;
              data.sales_order_services[i].discount_amount = 0;
              data.sales_order_services[i].net_extended_cost =
                data.sales_order_services[i].service_price;
              data.sales_order_services[i].tax_amount =
                (parseFloat(data.sales_order_services[i].service_price) *
                  parseFloat(data.sales_order_services[i].tax_percentage)) /
                100;

              data.sales_order_services[i].total_amount =
                parseFloat(data.sales_order_services[i].service_price) +
                parseFloat(data.sales_order_services[i].tax_amount);
            }

            data.sub_total = _.sumBy(data.sales_order_services, (s) =>
              parseFloat(s.extended_cost)
            );
            data.discount_amount = _.sumBy(data.sales_order_services, (s) =>
              parseFloat(s.discount_amount)
            );
            data.net_total = _.sumBy(data.sales_order_services, (s) =>
              parseFloat(s.net_extended_cost)
            );

            data.total_tax = _.sumBy(data.sales_order_services, (s) =>
              parseFloat(s.tax_amount)
            );

            data.net_payable = _.sumBy(data.sales_order_services, (s) =>
              parseFloat(s.total_amount)
            );

            data.organizations = $this.state.cost_projects.filter(
              (item) => item.cost_center_id == data.project_id //eslint-disable-line
            )[0].branches;
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
  let IOputs = {
    hims_f_sales_order_id: null,
    sales_order_mode: "I",
    sales_quotation_number: null,
    sales_quotation_id: null,
    sales_order_number: null,
    sales_order_date: new Date(),
    reference_number: null,
    customer_id: null,
    quote_validity: null,
    sales_man: null,
    payment_terms: null,
    service_terms: null,
    other_terms: null,
    sub_total: null,
    discount_amount: null,
    net_total: null,
    total_tax: null,
    net_payable: null,
    narration: null,
    project_id: null,
    customer_po_no: null,
    // tax_percentage: null,
    invoice_files: [],
    invoice_docs: [],
    docChanged: false,
    sales_order_items: [],
    sales_order_services: [],
    saveEnable: true,
    dataExists: false,

    hospital_id: null,
    sales_person_id: null,
    employee_name: null,
    delivery_date: null,

    addItemButton: true,
    item_description: "",
    addedItem: true,

    item_id: null,
    quantity: 0,
    uom_id: null,
    uom_description: null,
    discount_percentage: 0,
    unit_cost: 0,
    tax_percent: 0,
    selectedData: false,
    organizations: [],
    contract_number: null,
    contract_id: null,
    dataPosted: true,
    canceled_reason_sales: "",
    rejectVisible: false,
    is_posted: "N",
    is_revert: "N",
    cancelled: "N",
    is_reject: "N",
    // services_required: "N"
  };

  $this.setState(IOputs);
};

const SaveSalesOrderEnrty = ($this, from) => {
  AlgaehValidation({
    querySelector: "data-validate='HeaderDiv'",
    alertTypeIcon: "warning",
    onSuccess: () => {
      if ($this.HRMNGMT_Active && $this.state.sales_person_id === null) {
        swalMessage({
          type: "warning",
          title: "Please select Sales Person",
        });
        return;
      }
      if ($this.state.sales_order_date === null) {
        swalMessage({
          type: "warning",
          title: "Order Date - Cannot be empty.",
        });
        return;
      }
      let InputObj = extend({}, $this.state);
      let order_detail =
        InputObj.sales_order_mode === "I"
          ? InputObj.sales_order_items
          : InputObj.sales_order_services;
      let qty_exists = Enumerable.from(order_detail).any(
        (w) => parseFloat(w.quantity) === 0 || w.quantity === ""
      );
      if (qty_exists === true) {
        swalMessage({
          title: "Please enter Quantity in the List.",
          type: "warning",
        });
        return;
      }

      InputObj.quote_validity =
        InputObj.sales_order_mode === "S"
          ? null
          : moment(InputObj.quote_validity, "YYYY-MM-DD").format("YYYY-MM-DD");

      InputObj.delivery_date =
        InputObj.sales_order_mode === "S"
          ? null
          : moment(InputObj.delivery_date, "YYYY-MM-DD").format("YYYY-MM-DD");

      InputObj.sales_order_date = moment(InputObj.sales_order_date).format(
        "YYYY-MM-DD h:mm:ss"
      );

      let strUri = "";
      let strMessage = "Saved successfully";

      if (from === "P") {
        InputObj.is_posted = "Y";
        strMessage = "Sent for authorization";
      }

      if (InputObj.hims_f_sales_order_id !== null) {
        strUri = "/SalesOrder/postSalesOrder";
      } else {
        strUri = "/SalesOrder/addSalesOrder";
      }
      delete InputObj.organizations;
      delete InputObj.cost_projects;
      delete InputObj.order_detail;
      delete InputObj.invoice_docs;
      const settings = { header: undefined, footer: undefined };

      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: strUri,
        skipParse: true,
        data: Buffer.from(JSON.stringify(InputObj), "utf8"),
        module: "sales",
        method: "POST",
        header: {
          "content-type": "application/octet-stream",
          ...settings,
        },
        onSuccess: (response) => {
          if (response.data.success) {
            const saveDoc = true;
            getCtrlCode(
              $this,

              saveDoc,
              response.data.records.sales_order_number
            );
            // if ($this.state.invoice_files.length) {
            //   $this.saveDocument();
            // }
            // if ($this.state.invoice_files.length) {
            //   $this.saveDocument();
            // }
            if ($this.context.socket.connected) {
              $this.context.socket.emit("sales_order_auth", {
                sales_order_number: response.data.records.sales_order_number,
              });
            }
            // if (from === "P") {
            //   if ($this.context.socket.connected) {
            //     $this.context.socket.emit("SALE_LST_AUTH1", sendJsonBody);
            //   }
            // }
            // $this.setState(
            //   {
            //     sales_order_number: response.data.records.sales_order_number,
            //     hims_f_sales_order_id:
            //       response.data.records.hims_f_sales_order_id,
            //     saveEnable: true,
            //     dataExists: true,
            //     grid_edit: true,
            //   },
            //   () => {
            //     if ($this.state.invoice_files.length) {
            //       $this.saveDocument();
            //     }
            //   }
            // );
            swalMessage({
              type: "success",
              title: strMessage,
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

const getCtrlCode = ($this, saveDocument, docNumber) => {
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/SalesOrder/getSalesOrder",
    module: "sales",
    method: "GET",
    data: {
      sales_order_number: docNumber,
      HRMNGMT_Active: $this.HRMNGMT_Active,
    },
    onSuccess: (response) => {
      if (response.data.success) {
        const queryParams = new URLSearchParams($this.props.location.search);
        let data = response.data.records;

        data.grid_edit = true;

        if (queryParams.get("sales_order_number")) {
          data.authBtnEnable =
            data.cancelled === "Y" || data.is_posted === "N" ? true : false;
          data.ItemDisable = true;
          data.ClearDisable = true;
          data.cancelDisable =
            data.cancelled === "Y" || data.is_posted === "N" ? true : false;
          data.order_auth = true;
          // for (let i = 0; i < data.order_detail.length; i++) {
          //   data.order_detail[i].quantity_outstanding =
          //     data.order_detail[i].quantity;
          // }
          if (data.authorize1 === "N" || data.authorize2 === "N") {
            data.grid_edit = false;
          }
        }
        if (data.sales_order_mode === "I") {
          data.sales_order_items = data.order_detail;
        } else {
          data.sales_order_services = data.order_detail;
        }

        data.rejectVisible = false;
        data.cancelVisible = false;
        data.dataExists = true;
        data.selectedData = true;
        data.itemAdd = false;

        if (data.is_revert === "Y" || data.is_reject === "Y") {
          data.itemAdd = true;
          data.serviceAdd = false;
          data.dataExists = false;
        }
        if (data.is_posted === "Y") {
          data.saveEnable = true;
          data.addedItem = true;
          data.dataPosted = true;
          data.serviceAdd = true;
          data.itemAdd = true;
        } else {
          data.saveEnable = false;
          data.addedItem = false;
          data.dataPosted = false;
          data.serviceAdd = false;
        }
        if (data.authorize1 === "Y" && data.authorize2 === "Y") {
          data.cancelDisable = true;
        }
        // let project_details = $this.state.cost_projects.find(
        //   f => f.cost_center_id === data.project_id
        // );
        data.organizations = $this.props.hospitaldetails;

        $this.setState(data, () => {
          // console.log("test", test);
          if (saveDocument) {
            $this.saveDocument();
          } else {
            return;
          }
        });
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
};

const generateSalesOrderReport = (data) => {
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
          data.sales_order_mode === "S"
            ? "SalesOrderReportService"
            : "SalesOrderReportItem",
        reportParams: [
          {
            name: "sales_order_number",
            value: data.sales_order_number,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data.sales_order_number}-Sales Order Report`;
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=${reportName}`;
      window.open(origin);
      // window.document.title = "Sales Order";
    },
  });
};

// const generatePOReceiptNoPrice = data => {
//   console.log("data:", data);
//   algaehApiCall({
//     uri: "/report",
//     method: "GET",
//     module: "reports",
//     headers: {
//       Accept: "blob"
//     },
//     others: { responseType: "blob" },
//     data: {
//       report: {
//         reportName: "SalesOrderReport",
//         reportParams: [
//           {
//             name: "hims_f_sales_order_number",
//             value: data.hims_f_sales_order_number
//           }
//         ],
//         outputFileType: "PDF"
//       }
//     },
//     onSuccess: res => {

//       const urlBlob = URL.createObjectURL(res.data);
//       const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Sales Order Report`;
//       window.open(origin);
//       // window.document.title = "Sales Order Report";
//     }
//   });
// };

const getSalesOptions = ($this) => {
  algaehApiCall({
    uri: "/SalesSettings/getSalesOptions",
    method: "GET",
    module: "sales",
    onSuccess: (res) => {
      if (res.data.success) {
        $this.setState({
          services_required: res.data.records[0].services_required,
          sales_order_auth_level: res.data.records[0].sales_order_auth_level,
        });
      }
    },
  });
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

const dateValidate = ($this, value, event) => {
  let inRange = false;
  if (event.target.name === "sales_order_date") {
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
  } else {
    inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
    if (inRange) {
      swalMessage({
        title: "Selected Date cannot be past Date.",
        type: "warning",
      });
      event.target.focus();
      $this.setState({
        [event.target.name]: null,
      });
    }
  }
};

const AuthorizeOrderEntry = ($this, authorize) => {
  let order_detail =
    $this.state.sales_order_mode === "I"
      ? $this.state.sales_order_items
      : $this.state.sales_order_services;
  if (order_detail.length === 0) {
    swalMessage({
      title: "Atleast One item is required to Authorize Order.",
      type: "warning",
    });
  }
  let qty_exists = Enumerable.from(order_detail).any(
    (w) => parseFloat(w.quantity) === 0 || w.quantity === ""
  );
  if (qty_exists === true) {
    swalMessage({
      title: "Please enter Quantity.",
      type: "warning",
    });
    return;
  }
  AlgaehLoader({ show: true });

  let authorize1 = "";
  let authorize2 = "";
  if ($this.state.sales_order_auth_level === "1") {
    $this.state.authorize1 = "Y";
    $this.state.authorize2 = "Y";
    $this.state.is_completed = $this.state.sales_order_mode === "S" ? "Y" : "N";
    authorize1 = "Y";
    authorize2 = "Y";
  } else {
    if (authorize === "authorize1") {
      $this.state.authorize1 = "Y";
      authorize1 = "Y";
      authorize2 = "N";
    } else if (authorize === "authorize2") {
      $this.state.authorize1 = "Y";
      $this.state.authorize2 = "Y";
      authorize1 = "Y";
      authorize2 = "Y";
      $this.state.is_completed =
        $this.state.sales_order_mode === "S" ? "Y" : "N";
    }
  }

  const settings = { header: undefined, footer: undefined };
  algaehApiCall({
    uri: "/SalesOrder/updateSalesOrderEntry",
    module: "sales",
    method: "PUT",
    skipParse: true,
    data: Buffer.from(JSON.stringify($this.state), "utf8"),
    header: {
      "content-type": "application/octet-stream",
      ...settings,
    },
    onSuccess: (response) => {
      if (response.data.success === true) {
        $this.setState({
          authorize1: authorize1,
          authorize2: authorize2,
        });
        getCtrlCode($this, false, $this.state.sales_order_number);
        if (authorize1 === "Y") {
          if ($this.context.socket.connected) {
            $this.context.socket.emit("sales_order_auth_level_one", {
              sales_order_number: $this.state.sales_order_number,
            });
          }
        } else if (authorize2 === "Y") {
          if ($this.context.socket.connected) {
            $this.context.socket.emit(
              "sales_order_auth_level_two",
              { sales_order_number: $this.state.sales_order_number },
              $this.state.created_by
            );
          }
        }
        swalMessage({
          title: "Authorized successfully . .",
          type: "success",
        });
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
};

const RejectSalesServiceOrder = ($this) => {
  if (!$this.state.reject_reason_sales) {
    swalMessage({
      title: "Please add reason for Revert.",
      type: "warning",
    });
    return;
  }
  algaehApiCall({
    uri: "/SalesOrder/rejectSalesServiceOrder",
    module: "sales",
    data: $this.state,
    method: "PUT",
    onSuccess: (response) => {
      const { sales_order_number, sales_person_id } = $this.state;
      if (response.data.success === true) {
        swalMessage({
          title: "Rejected successfully . .",
          type: "success",
        });
        if ($this.context.socket.connected) {
          $this.context.socket.emit("sales_revet", {
            sales_order_number,
            sales_person_id,
          });
        }
        getCtrlCode($this, false, $this.state.sales_order_number);
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
};

const CancelSalesServiceOrder = ($this) => {
  if (!$this.state.canceled_reason_sales) {
    swalMessage({
      title: "Please add reason for Cancellation",
      type: "warning",
    });
    return;
  }
  algaehApiCall({
    uri: "/SalesOrder/cancelSalesServiceOrder",
    module: "sales",
    data: $this.state,
    method: "PUT",
    onSuccess: (response) => {
      if (response.data.success === true) {
        swalMessage({
          title: "Cancelled successfully . .",
          type: "success",
        });
        getCtrlCode($this, false, $this.state.sales_order_number);
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
export {
  texthandle,
  datehandle,
  SalesQuotationSearch,
  customerTexthandle,
  ClearData,
  SaveSalesOrderEnrty,
  getCtrlCode,
  generateSalesOrderReport,
  getSalesOptions,
  employeeSearch,
  dateValidate,
  AuthorizeOrderEntry,
  CancelSalesServiceOrder,
  getCostCenters,
  ContractSearch,
  RejectSalesServiceOrder,
};
