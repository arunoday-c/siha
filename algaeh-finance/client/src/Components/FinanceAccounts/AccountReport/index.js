import React, { memo, useState } from "react";
import {
  AlgaehModal,
  AlgaehDateHandler,
  Spin,
  Switch,
  Button,AlgaehMessagePop
} from "algaeh-react-components";
import moment from "moment";
import {algaehApiCall} from "../../../utils/algaehApiCall";

export default memo(function Modal(props) {
  const { selectedNode, title, onCancel, visible, onOk } = props;
  const [plaseWait, setPleaseWait] = useState(
    "Please wait report is preparing.."
  );
  const [checkedType, setCheckType] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);
  function onPdfGeneration() {
    setPleaseWait("Please wait pdf is generating...");
    setLoading(true);
    generateReport("pdf").then(result=>{
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
    }).catch(error=>{
      setLoading(false);
      AlgaehMessagePop({
        type:"error",
        display:error
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
  function generateReport(type){
    return new Promise((resolve,reject)=>{
      try {
        const {node} = selectedNode;
        const {head_id,finance_account_head_id,finance_account_child_id,leafnode,label}
        = node;


        const  from_date = dateRange.length ===0?{}:{name:"from_date",
          value: moment(dateRange[0]).format("YYYY-MM-DD")}  ;
        const  to_date = dateRange.length ===0?{}:{name:"to_date",
          value: moment(dateRange[1]).format("YYYY-MM-DD")}  ;
        const  monthwise = dateRange.length ===0?{}:{name:"monthwise",
          value: checkedType ?"Y":"N"}  ;
        const data ={
          report:{
            displayName:"Ledger Report",
            reportName:"ledgerReport",
            template_name:null,
            reportQuery:null,
            pageSize:"A4",
            pageOrentation:"landscape",
            reportParams:[{name:"head_id",
              value:head_id ===undefined?finance_account_head_id:head_id,
              label:"Head",labelValue:label},
              {name:"child_id",
                value:finance_account_child_id,
                label:"Child",labelValue:label},
              {name:"child_id",
                value:finance_account_child_id,
                label:"Child",labelValue:label},
              {name:"leafnode",value:leafnode},from_date,to_date,monthwise]
          }
        };
        algaehApiCall({
          cancelRequestId:"accountReport",
          uri:type ==="excel"?"/excelReport":"/report",
          module:"reports",
          method: "GET",
          headers:{
            Accept: "blob"
          },
          others:{responseType: "blob"},
          data:data,
          onSuccess:response=>{
            const url = URL.createObjectURL(response.data);
            resolve(url);
          },
          onCatch:(error)=>{
            reject(error);
          }
        })
      }
      catch (e) {
        reject(e);
      }
    })
  }
  return (
    <AlgaehModal
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
        <AlgaehDateHandler
          type="range"
          div={{
            className: "col"
          }}
          label={{
            forceLabel: "Select Date Range"
          }}
          textBox={{
            name: "selectRange",
            value: dateRange
          }}
          maxDate={moment()}
          events={{
            onChange: dateSelected => {
              setDateRange(dateSelected);
            }
          }}
        />
        <div className="col">
          <Switch
            checkedChildren="Month wise"
            unCheckedChildren="Date Wise"
            onChange={check => {
              setCheckType(check);
            }}
            checked={checkedType}
          />
        </div>
      </Spin>
    </AlgaehModal>
  );
});
