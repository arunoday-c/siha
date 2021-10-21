import React, { memo, useState } from "react";
import "./popupCustomStyle.scss";
import {
  AlgaehModal,
  AlgaehDateHandler,
  Spin,
  AlgaehMessagePop,
} from "algaeh-react-components";
import moment from "moment";
// import { getReportOnScroll } from "./lazyScroll";
// import CostCenter from "../../costCenterComponent";
import { algaehApiCall } from "../../../utils/algaehApiCall";
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
  } = props;
  const [plaseWait, setPleaseWait] = useState(
    "Please wait report is preparing.."
  );
  const [checkedType, setCheckType] = useState(false);
  const previousMonthDate = [moment().startOf("month"), moment()];
  const [dateRange, setDateRange] = useState(previousMonthDate);
  const [loading, setLoading] = useState(false);

  function onPdfGeneration() {
    if (dateRange.length < 2) {
      setPleaseWait("Please enter Data range!");
      setLoading(false);
      return;
    }
    setPleaseWait("Please wait pdf is generating...");
    setLoading(true);

    resultdata["nodeName"] = selectedNode?.node?.full_name;
    resultdata["head_id"] = selectedNode?.node?.head_id
      ? selectedNode?.node?.head_id
      : selectedNode?.node?.finance_account_head_id;
    console.log("selectedNode===>", selectedNode);
    generateReport("pdf", resultdata)
      .then((result, html) => {
        debugger;
        const nodeFields = selectedNode?.node;
        const from_date = moment(dateRange[0]).format("YYYY-MM-DD");
        const to_date = moment(dateRange[1]).format("YYYY-MM-DD");
        // const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${result}&filename=Ledger report`;
        // window.open(origin);
        const myWindow = window.open(
          "Ledger Report",
          "Ledger Report",
          "resizable=yes"
        );
        myWindow.document.write(
          `${result}<script>
          let recordsPerPage = document.querySelector("table").querySelector("tbody")?.rows?.length; 
          
          const totalRecords = parseInt(document.getElementById("total_records").innerText);
          window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
            var db;
          document.querySelector(".print-body").addEventListener("scroll",(e)=>{
           
            const totalBodyHeight = document.querySelector(".print-body").scrollHeight;            //document.body.scrollHeight;
            if((e.target.scrollTop+e.target.offsetHeight) < totalBodyHeight){
              return;
            }
            const rowsExistCount = document.querySelector("table").querySelector("tbody")?.rows?.length;
            if(rowsExistCount >= totalRecords){
              return;
            }
           
            
            var request = window.indexedDB.open("localforage");
          request.onerror = function(event) {
            console.log("Why didn't you allow my web app to use IndexedDB?!");
          };
          request.onsuccess = function(event) {
            db = event.target.result;
            var customerObjectStore = db.transaction("keyvaluepairs").objectStore("keyvaluepairs").get("token");
            customerObjectStore.onerror = function(event) {
              console.error("Unable to retrieve daa from database!");
           };
           const checkLoading = document.getElementById("pleaseWait");
           if(checkLoading){
             return;
           }

           const waitElement = document.createElement("div");
           waitElement.setAttribute("id","pleaseWait");
           waitElement.innerText ="Please Wait...";
          document.body.append(waitElement);
           customerObjectStore.onsuccess = function(event){
             if(customerObjectStore.result){
              const token = customerObjectStore.result;
            
              const resultdata = {
                report:JSON.stringify({
                  displayName: "Ledger Report - Date Wise",
                  reportName: "DateWiseLeafNode",
                  template_name: null,
                  reportQuery: null,
                  pageSize: "A4",
                  pageOrentation: "portrait",
                  recordSetup:{
                    limit_from:recordsPerPage,
                    limit_to:rowsExistCount
                  },
                  reportParams:[{
                    name: "child_id",
                    value:${nodeFields.finance_account_child_id},
                    label:"Child",
                    labelValue:"${nodeFields.full_name}"
                  },{ name: "leafnode", value: "Y" },
                {
                  name:"from_date",
                  value:"${from_date}"
                },
                {
                  name:"to_date",
                  value:"${to_date}"
                },{
                  name: "Date Range",
                  value:"${from_date} ~ ${to_date}"
                },{
                  name: "Account Header",
                  value:"${
                    parentId === 1
                      ? "Assets"
                      : parentId === 2
                      ? "Liabilities"
                      : parentId === 4
                      ? "Income"
                      : parentId === 3
                      ? "Capital"
                      : "Expense"
                  }"
                },{
                  name: "Account Name", value:"${nodeFields.full_name}"
                }]
                })
              };
              function serialize(obj, prefix) {
                var str = [],
                  p;
                for (p in obj) {
                  if(obj.hasOwnProperty(p)) {
                    var k = prefix ? prefix + "[" + p + "]" : p,
                      v = obj[p];
                    str.push((v !== null && typeof v === "object") ?
                      serialize(v, k) :
                      encodeURIComponent(k) + "=" + encodeURIComponent(v));
                  }
                }
                return str.join("&");
              }
               const qry = serialize(resultdata);
               let url ="";
               if(window.location.port===""){
                 url = window.location.protocol+"//"+window.location.hostname+"/reports";
               }else{
                url = window.location.protocol+"//"+window.location.hostname+":3018";
               }
               fetch(url+'/api/v1/getRawReport?'+qry,{
                method: 'GET',
                headers:{
                 "x-api-key":token,
                 "x-client-ip":${window.localStorage.getItem("identity")}
                },
               
               }).then((response)=>{
                return response.text();
               }).then((html)=>{
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, "text/html");
              //  document.body.append(doc);
              const rows = doc.querySelector("tbody").rows;
                for(let x=0;x<rows.length;x++){
                   document.querySelector("table").querySelector("tbody").append(rows[x]);
                  }
               })
               .catch(error=>{
                 console.error("Error ====>",error);
               }).finally(()=>{
               document.body.removeChild(document.getElementById("pleaseWait"));
               });
             }else{
               console.error("Some error occurred");
             }
           }
          };
          });
          </script>`
        );
        setLoading(false);
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

    resultdata["nodeName"] = selectedNode?.node?.full_name;

    generateReport("excel", resultdata)
      .then((res) => {
        onOk("excel");
        // const urlBlob = URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = res;
        a.download = `${selectedNode?.node?.label}_${moment(
          dateRange[0]
        ).format("DD-MM-YYYY")}-${moment(dateRange[1]).format(
          "DD-MM-YYYY"
        )}.${"xlsx"}`;
        a.click();
      })

      .catch((error) => {
        setLoading(false);
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });

    // onOk("excel");
  }
  function onCancelClick() {
    setLoading(false);
    onCancel();
  }
  function generateReport(type, inputdata) {
    return new Promise((resolve, reject) => {
      try {
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
        let data;
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

        if (fromInvoice) {
          data = {
            report: {
              displayName: "Ledger Report - Date Wise",
              reportName: "DateWiseLeafNode",
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
                // monthwise
              ],
              specialHeader,
            },
          };
        } else {
          const { node } = selectedNode;
          const {
            head_id,
            finance_account_head_id,
            finance_account_child_id,
            leafnode,
            label,
          } = node;

          // const monthwise =
          //   dateRange.length === 0
          //     ? {}
          //     : { name: "monthwise", value: checkedType ? "Y" : "N" };

          let reportName = "";
          if (leafnode === "N") {
            reportName = checkedType
              ? "MonthWiseGroupNode"
              : "DateWiseGroupNode";
          } else {
            reportName = checkedType ? "MonthWiseLeafNode" : "DateWiseLeafNode";
          }

          data = {
            report: {
              displayName: "Ledger Report - Date Wise",
              reportName: reportName, //"ledgerDateReport",
              template_name: null,
              reportQuery: null,
              pageSize: "A4",
              pageOrentation: "portrait",
              recordSetup: {
                limit_from: 0,
                limit_to: 600,
              },
              reportParams: [
                {
                  name: "head_id",
                  value: head_id ? head_id : finance_account_head_id,
                  label: "Head",
                  labelValue: label,
                },
                {
                  name: "child_id",
                  value: finance_account_child_id,
                  label: "Child",
                  labelValue: label,
                },
                {
                  name: "child_id",
                  value: finance_account_child_id,
                  label: "Child",
                  labelValue: label,
                },
                { name: "leafnode", value: leafnode },
                { name: "parent_id", value: parentId },
                from_date,
                to_date,
                outcomeDataHospital,
                outcomeDataCostCenter,
                // monthwise
              ],
              specialHeader,
            },
          };
        }
        const _type =
          type === "excel"
            ? {
                headers: {
                  Accept: "blob",
                },
                others: { responseType: "blob" },
              }
            : {};
        algaehApiCall({
          cancelRequestId: "accountReport",
          uri: type === "excel" ? "/excelReport" : "/getRawReport", //"/report",
          module: "reports",
          method: "GET",
          ..._type,
          // headers: {
          //   Accept: "blob",
          // },
          // others: { responseType: "blob" },
          data: data,
          onSuccess: (response) => {
            debugger;
            if (type === "pdf") {
              resolve(response.data);
            } else {
              const url = URL.createObjectURL(response.data);
              resolve(url);
            }
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

          {/* <Button
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
          />*/}
        </div>
      }
    >
      <Spin tip={plaseWait} spinning={loading}>
        <div className="row">
          {fromInvoice ? null : (
            <div className="col form-group">
              <label className="style_Label">View By</label>
              <label className="radio-inline">
                <input
                  type="radio"
                  name="d_m_wise"
                  onChange={(check) => {
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
                  onChange={(check) => {
                    setCheckType(check);
                  }}
                  checked={checkedType}
                />
                Month Wise
              </label>
            </div>
          )}
          {/* <CostCenter result={resultdata} /> */}
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
                      display: "you can select maximum one year.",
                    });
                  }
                } else {
                  setDateRange(dateSelected);
                }
              },
            }}
            others={{
              ...format,
            }}
          />
        </div>
      </Spin>
    </AlgaehModal>
  );
});
