import React, { memo, useState } from "react";
import "./popupCustomStyle.scss";
import {
  AlgaehModal,
  AlgaehDateHandler,
  Spin,
  Button,
  AlgaehMessagePop
} from "algaeh-react-components";
import moment from "moment";
import CostCenter from "../../costCenterComponent";
import { algaehApiCall } from "../../../utils/algaehApiCall";
let resultdata = {};
export default memo(function Modal(props) {
  const { selectedNode, title, onCancel, visible, onOk, parentId } = props;
  const [plaseWait, setPleaseWait] = useState(
    "Please wait report is preparing.."
  );
  const [checkedType, setCheckType] = useState(false);
  const previousMonthDate = [moment().add(-1, "M"), moment().add(-1, "days")];
  const [dateRange, setDateRange] = useState(previousMonthDate);
  const [loading, setLoading] = useState(false);

  function onPdfGeneration() {
    setPleaseWait("Please wait pdf is generating...");
    setLoading(true);
    if (Object.keys(resultdata).length === 0) {
      setLoading(false);
      setPleaseWait("");
      AlgaehMessagePop({
        type: "info",
        display: "Please select Branch and Cost Center"
      });
      return;
    } else {
      if (
        resultdata["hospital_id"] === undefined ||
        resultdata["cost_center_id"] === undefined
      ) {
        setLoading(false);
        setPleaseWait("");
        AlgaehMessagePop({
          type: "info",
          display: "Branch and Cost Center are mandatory"
        });
        return;
      }
    }
    generateReport("pdf", resultdata)
      .then(result => {
        // console.log("result", result);
        // var file = new Blob([result], { type: "application/pdf" });

        // var fileURL = URL.createObjectURL(result);
        // let newWindow = window.open(
        //   "",
        //   "",
        //   "width=800,height=500,left=200,top=200"
        // );
        // newWindow.onload = () => {
        //   newWindow.location = result;
        // };

        let myWindow = window.open(
          "",
          "",
          "width=800,height=500,left=200,top=200,"
        );
        myWindow.document.title = "Ledger report";
        myWindow.document.body.style.overflow = "hidden";
        let divElem = document.createElement("div");
        divElem.id = "algaeh_frame";
        divElem.style.width = "100%";
        divElem.style.height = "100%";
        let elem = document.createElement("iframe");
        elem.src = result;
        elem.setAttribute("webkitallowfullscreen", true);
        elem.setAttribute("allowfullscreen", true);
        elem.style.width = "100%";
        elem.style.height = "100%";
        divElem.appendChild(elem);
        myWindow.document.body.appendChild(divElem);
        onOk("pdf");
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        AlgaehMessagePop({
          type: "error",
          display: error
        });
      });
  }
  function onExcelGeneration() {
    setPleaseWait("Please wait excel is generating...");
    setLoading(true);
    onOk("excel");
  }
  function onCancelClick() {
    setLoading(false);
    onCancel();
  }
  function generateReport(type, inputdata) {
    return new Promise((resolve, reject) => {
      try {
        const { node } = selectedNode;
        const {
          head_id,
          finance_account_head_id,
          finance_account_child_id,
          leafnode,
          label
        } = node;

        const from_date =
          dateRange.length === 0
            ? {}
            : {
                name: "from_date",
                value: moment(dateRange[0]).format("YYYY-MM-DD")
              };
        const to_date =
          dateRange.length === 0
            ? {}
            : {
                name: "to_date",
                value: moment(dateRange[1]).format("YYYY-MM-DD")
              };
        // const monthwise =
        //   dateRange.length === 0
        //     ? {}
        //     : { name: "monthwise", value: checkedType ? "Y" : "N" };

        let reportName = "";
        if (leafnode === "N") {
          reportName = checkedType ? "MonthWiseGroupNode" : "DateWiseGroupNode";
        } else {
          reportName = checkedType ? "MonthWiseLeafNode" : "DateWiseLeafNode";
        }
        let outcomeDataHospital = {};
        let outcomeDataCostCenter = {};
        if (inputdata !== undefined && Object.keys(inputdata).length > 0) {
          outcomeDataHospital = {
            name: "hospital_id",
            value: inputdata["hospital_id"],
            label: "Branch",
            labelValue: inputdata["hospital_id_label"]
          };
          outcomeDataCostCenter = {
            name: "cost_center_id",
            value: inputdata["cost_center_id"],
            label: "Cost Center",
            labelValue: inputdata["cost_center_id_label"]
          };
        }

        const data = {
          report: {
            displayName: "Ledger Report - Date Wise",
            reportName: reportName, //"ledgerDateReport",
            template_name: null,
            reportQuery: null,
            pageSize: "A4",
            pageOrentation: "portrait",
            reportParams: [
              {
                name: "head_id",
                value:
                  head_id === undefined ? finance_account_head_id : head_id,
                label: "Head",
                labelValue: label
              },
              {
                name: "child_id",
                value: finance_account_child_id,
                label: "Child",
                labelValue: label
              },
              {
                name: "child_id",
                value: finance_account_child_id,
                label: "Child",
                labelValue: label
              },
              { name: "leafnode", value: leafnode },
              { name: "parent_id", value: parentId },
              from_date,
              to_date,
              outcomeDataHospital,
              outcomeDataCostCenter
              // monthwise
            ]
          }
        };
        algaehApiCall({
          cancelRequestId: "accountReport",
          uri: type === "excel" ? "/excelReport" : "/report",
          module: "reports",
          method: "GET",
          headers: {
            Accept: "blob"
          },
          others: { responseType: "blob" },
          data: data,
          onSuccess: response => {
            const url = URL.createObjectURL(response.data);
            resolve(url);
          },
          onCatch: error => {
            reject(error);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  const format = checkedType ? { format: "YYYY-MMM" } : {};

  return (
    <AlgaehModal
      className="algaehLedgerReportStyle"
      title={title}
      visible={visible}
      maskClosable={false}
      closable={false}
      destroyOnClose={true}
      afterClose={() => {
        setLoading(false);
      }}
      footer={
        <>
          <Button
            type="primary"
            shape="circle"
            icon="file-pdf"
            loading={loading}
            onClick={() => {
              onPdfGeneration();
            }}
          />
          <Button
            type="success"
            shape="circle"
            icon="file-excel"
            style={{ backgroundColor: "#00a796", color: "#fff" }}
            loading={loading}
            onClick={() => {
              onExcelGeneration();
            }}
          />
          <Button
            type="dashed"
            shape="circle"
            icon="close-circle"
            onClick={() => {
              onCancelClick();
            }}
          />
        </>
      }
    >
      <Spin tip={plaseWait} spinning={loading}>
        <div className="row">
          <div className="col form-group">
            <label className="style_Label">View By</label>
            <label className="radio-inline">
              <input
                type="radio"
                name="d_m_wise"
                onChange={check => {
                  setCheckType(!check);
                }}
                checked={!checkedType}
              />
              Date Wise
            </label>
            <label className="radio-inline">
              <input
                type="radio"
                name="d_m_wise"
                onChange={check => {
                  setCheckType(check);
                }}
                checked={checkedType}
              />
              Month Wise
            </label>
          </div>
          <CostCenter result={resultdata} />
          <AlgaehDateHandler
            type={"range"}
            div={{
              className: "col-12 form-group"
            }}
            label={{
              forceLabel: "Select Date Range"
            }}
            textBox={{
              name: "selectRange",
              value: dateRange
            }}
            maxDate={moment().add(1, "days")}
            events={{
              onChange: dateSelected => {
                if (checkedType) {
                  const months = moment(dateSelected[1]).diff(
                    dateSelected[0],
                    "months"
                  );
                  if (months <= 11) {
                    setDateRange(dateSelected);
                  } else {
                    AlgaehMessagePop({
                      title: "error",
                      display: "you can select maximum one year."
                    });
                  }
                } else {
                  setDateRange(dateSelected);
                }
              }
            }}
            others={{
              ...format
            }}
          />
        </div>
      </Spin>
    </AlgaehModal>
  );
});
