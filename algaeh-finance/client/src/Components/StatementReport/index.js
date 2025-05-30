import React, { memo, useState } from "react";
import "./statementReport.scss";
import {
  AlgaehModal,
  AlgaehDateHandler,
  Spin,
  AlgaehMessagePop,
} from "algaeh-react-components";
import moment from "moment";
import { GenerateExcel } from "../FinanceReports/printlayout/workers/worker";
import { algaehApiCall } from "../../utils/algaehApiCall";
let resultdata = {};

export default memo(function Modal(props) {
  const {
    selectedNode,
    title,
    onCancel,
    visible,
    onOk,
    parentId,
    fromInvoice,
    screenFrom,
  } = props;
  const [plaseWait, setPleaseWait] = useState(
    "Please wait report is preparing.."
  );
  //   const [checkedType, setCheckType] = useState(false);
  const previousMonthDate = [moment().startOf("month"), moment()];
  const [dateRange, setDateRange] = useState(previousMonthDate);
  const [loading, setLoading] = useState(false);

  function onPdfGeneration() {
    setPleaseWait("Please wait pdf is generating...");
    setLoading(true);

    resultdata["nodeName"] = selectedNode?.node?.full_name;
    debugger;
    generateReport("pdf", resultdata)
      .then((result) => {
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${result}&filename=Ledger report`;
        setLoading(false);
        window.open(origin);
        onOk("pdf");
      })
      .catch((error) => {
        setLoading(false);
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });
  }
  function onExcelGeneration() {
    setPleaseWait("Please wait excel is generating...");
    setLoading(true);
    const from_date =
      dateRange.length === 0 ? null : moment(dateRange[0]).format("YYYY-MM-DD");
    const to_date =
      dateRange.length === 0 ? null : moment(dateRange[1]).format("YYYY-MM-DD");
    algaehApiCall({
      uri:
        screenFrom === "CUST"
          ? "/finance_customer/getCustomerReporttoPrint"
          : "/finance_supplier/getSuppReporttoPrint",
      method: "GET",
      module: "finance",
      data: {
        child_id: selectedNode.finance_account_child_id,
        from_date: from_date,
        to_date: to_date,
      },
      onSuccess: (response) => {
        debugger;
        if (response.data.success === true) {
          GenerateExcel({
            columns: [
              { label: "Date", fieldName: "invoice_date" },
              { label: "Invoice Number", fieldName: "invoice_no" },
              { label: "Due Date", fieldName: "due_date" },
              { label: "Invoice Amount", fieldName: "invoice_amount" },
              { label: "Paid Amount", fieldName: "settled_amount" },
              { label: "Balance Amount", fieldName: "balance_amount" },
              { label: "Status", fieldName: "invoice_status" },
            ],
            data: response.data.result,

            excelBodyRender: (records, cb) => {
              // console.log("records= = ", records);

              records.ledger_code = records.group_code ?? records.ledger_code;
              cb(records);
            },
            sheetName: selectedNode.child_name,
          })
            .then((result) => {
              setLoading(false);
              if (typeof result !== "boolean") {
                const a: HTMLAnchorElement = document.createElement("a");
                a.style.display = "none";
                document.body.appendChild(a);
                const url: string = window.URL.createObjectURL(result);
                a.href = url;
                a.download = `${selectedNode.child_name}-${moment()._d}.xlsx`;
                a.click();

                window.URL.revokeObjectURL(url);

                if (a && a.parentElement) {
                  a.parentElement.removeChild(a);
                }
              }
            })
            .catch((error) => {
              console.error("Error", error);
              setLoading(false);
            });
        }
      },
      onCatch: (error) => {
        console.error("Error", error);
        setLoading(false);
      },
    });
  }
  function onCancelClick() {
    setLoading(false);
    onCancel();
  }
  function generateReport(type, inputdata) {
    return new Promise((resolve, reject) => {
      try {
        debugger;
        let outcomeDataHospital = {};
        let outcomeDataCostCenter = {};
        if (inputdata !== undefined && Object.keys(inputdata).length > 0) {
          outcomeDataHospital = {
            name: "hospital_id",
            value: inputdata["hospital_id"],
            label: "Branch",
            labelValue: inputdata["hospital_id_label"],
          };
          outcomeDataCostCenter = {
            name: "cost_center_id",
            value: inputdata["cost_center_id"],
            label: "Cost Center",
            labelValue: inputdata["cost_center_id_label"],
          };
        }

        const from_date =
          dateRange.length === 0
            ? {}
            : {
                name: "from_date",
                value: moment(dateRange[0]).format("YYYY-MM-DD"),
              };
        const to_date =
          dateRange.length === 0
            ? {}
            : {
                name: "to_date",
                value: moment(dateRange[1]).format("YYYY-MM-DD"),
              };

        const specialHeader = [
          {
            name: "Date Range",
            value: `${moment(dateRange[0]).format("DD-MM-YYYY")} ~ ${moment(
              dateRange[1]
            ).format("DD-MM-YYYY")}`,
          },
          {
            name: "Account Header",
            value:
              parentId === 1
                ? "Assets"
                : parentId === 2
                ? "Liabilities"
                : parentId === 4
                ? "Income"
                : parentId === 3
                ? "Capital"
                : "Expense",
          },
          { name: "Account Name", value: inputdata.nodeName },
        ];

        // data = {
        //   report: {
        //     displayName: "Ledger Report - Date Wise",
        //     reportName: "DateWiseLeafNode",
        //     template_name: null,
        //     reportQuery: null,
        //     pageSize: "A4",
        //     pageOrentation: "portrait",
        //     reportParams: [
        //       {
        //         name: "child_id",
        //         value: selectedNode.finance_account_child_id,
        //         label: "Child",
        //         labelValue: selectedNode.child_name,
        //       },
        //       { name: "leafnode", value: "Y" },
        //       from_date,
        //       to_date,
        //       outcomeDataHospital,
        //       outcomeDataCostCenter,
        //       // monthwise
        //     ],
        //     specialHeader,
        //   },
        // };

        debugger;
        algaehApiCall({
          cancelRequestId: "accountReport",
          uri: type === "excel" ? "/excelReport" : "/report",
          module: "reports",
          method: "GET",
          headers: {
            Accept: "blob",
          },
          others: { responseType: "blob" },
          data: {
            report: {
              displayName: "Customer Statement",
              reportName:
                screenFrom === "CUST"
                  ? "customerStatement"
                  : "supplierStatement",

              // excelTabName:
              //   screenFrom === "CUST"
              //     ? "customerStatement"
              //     : "supplierStatement",

              // excelTabName: `${$this.state.inputs.hospital_name} | ${moment(
              //   $this.state.inputs.month,
              //   "MM"
              // ).format("MMM")}-${$this.state.inputs.year}`,
              template_name: null,
              reportQuery: null,
              pageSize: "A4",
              pageOrentation: "portrait",
              reportParams: [
                {
                  name: "child_id",
                  value: selectedNode.finance_account_child_id,
                  label: "Child",
                  labelValue: selectedNode.child_name,
                },
                { name: "leafnode", value: "Y" },
                from_date,
                to_date,
                outcomeDataHospital,
                outcomeDataCostCenter,
              ],
              specialHeader,
            },
          },
          onSuccess: (response) => {
            const url = URL.createObjectURL(response.data);
            resolve(url);
          },
          onCatch: (error) => {
            reject(error);
          },
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  return (
    <AlgaehModal
      className="algaehStatementStyle"
      title={title}
      visible={visible}
      maskClosable={false}
      closable={false}
      destroyOnClose={true}
      afterClose={() => {
        setLoading(false);
      }}
      footer={
        <div>
          <span className="ant-btn ant-btn-primary ant-btn-circle ant-btn-icon-only">
            <i className="fas fa-file-pdf" onClick={onPdfGeneration}></i>
          </span>
          <span
            className="ant-btn ant-btn-success ant-btn-circle ant-btn-icon-only"
            style={{ backgroundColor: "#00a796", color: "#fff" }}
          >
            <i className="fas fa-file-excel" onClick={onExcelGeneration}></i>
          </span>
          <span className="ant-btn ant-btn-dangerous ant-btn-circle ant-btn-icon-only">
            <i className="fas fa-times" onClick={onCancelClick}></i>
          </span>
        </div>
      }
    >
      <Spin tip={plaseWait} spinning={loading}>
        <div className="row">
          <AlgaehDateHandler
            type={"range"}
            div={{
              className: "col-12 form-group",
            }}
            label={{
              forceLabel: "Select Date Range",
            }}
            textBox={{
              name: "selectRange",
              value: dateRange,
            }}
            maxDate={moment().add(1, "days")}
            events={{
              onChange: (dateSelected) => {
                setDateRange(dateSelected);
              },
            }}
          />
        </div>
      </Spin>
    </AlgaehModal>
  );
});
