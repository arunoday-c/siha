import React, { useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { AlgaehModal, Tree, AlgaehButton } from "algaeh-react-components";
import { GenerateExcel } from "../../FinanceReports/printlayout/workers/worker";
import moment from "moment";
export default function PrintAccounts({ visible, data, onClose, title }) {
  const [loading, setLoading] = useState(false);
  const treeRef = useRef(undefined);
  const printRef = useRef(undefined);
  function nodeToShow(nodeData) {
    return (
      <span>
        {nodeData.title} / {nodeData.group_code ?? nodeData.ledger_code}
      </span>
    );
  }
  function handleExcel() {
    debugger;
    setLoading(true);
    GenerateExcel({
      columns: [
        { label: "Code", fieldName: "ledger_code" },
        { label: "Account English", fieldName: "title" },
        { label: "Account Arabic", fieldName: "arabic_account_name" },
      ],
      data: data,

      excelBodyRender: (records, cb) => {
        console.log("records= = ", records);

        records.ledger_code = records.group_code ?? records.ledger_code;
        cb(records);
      },
      sheetName: title,
    })
      .then((result) => {
        setLoading(false);
        if (typeof result !== "boolean") {
          const a: HTMLAnchorElement = document.createElement("a");
          a.style.display = "none";
          document.body.appendChild(a);
          const url: string = window.URL.createObjectURL(result);
          a.href = url;
          a.download = `${title}-${moment()._d}.xlsx`;
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
  return (
    <AlgaehModal
      title={`Chart of Accounts - ${title}`}
      //${voucherNo}
      centered
      visible={visible}
      // footer={true}
      onCancel={onClose}
      closable={true}
      okText="Print"
      footer={
        <div>
          <AlgaehButton type="primary" danger onClick={onClose}>
            Close
          </AlgaehButton>
          <AlgaehButton
            type="primary"
            onClick={() => printRef.current.click()}
            loading={loading}
          >
            Print PDF
          </AlgaehButton>
          <AlgaehButton
            type="primary"
            style={{ backgroundColor: "#00a796" }}
            loading={loading}
            onClick={handleExcel}
          >
            Print Excel
          </AlgaehButton>
        </div>
      }
      className={`row algaehNewModal`}
    >
      <ReactToPrint
        trigger={() => (
          <button
            className="btn btn-primary"
            style={{
              marginTop: 10,
              marginLeft: 10,
              textAlign: "right",
              display: "none",
            }}
            ref={printRef}
          >
            Print{" "}
            <i
              ref={printRef}
              className={`fas fa-${
                loading === true ? "spinner fa-spin" : "print"
              }`}
            />
          </button>
        )}
        content={() => {
          return treeRef.current;
        }}
        onBeforeGetContent={() => {
          setLoading(true);
        }}
        onAfterPrint={() => {
          setLoading(false);
        }}
        removeAfterPrint={true}
        documentTitle={`Chart of Accounts - ${title}`}
        pageStyle="@media print {
          html, body {

            overflow: initial !important;
            -webkit-print-color-adjust: exact;
            margin:20px;
            color:black;
          }
        }

        @page {
          size: auto;
        }"
      />

      <div className="col-12">
        <div ref={treeRef}>
          <div className="CoAHeader" style={{ textAlign: "center" }}>
            <h2>{title}</h2>
            <hr />
          </div>
          <Tree
            showLine={true}
            defaultExpandAll={true}
            titleRender={nodeToShow}
            treeData={data}
            style={{ fontSize: 18, color: "black" }}
          />
        </div>
      </div>
    </AlgaehModal>
  );
}
