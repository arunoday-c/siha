import React, { useRef, useState, useLayoutEffect } from "react";
import ReactToPrint from "react-to-print";
import { AlgaehModal, Tree } from "algaeh-react-components";
export default function PrintAccounts({ visible, data, onClose }) {
  const [loading, setLoading] = useState(false);
  const treeRef = useRef(undefined);
  const printRef = useRef(undefined);
  // useLayoutEffect(() => {
  //   if (visible === true) {
  //     printRef.current.click();
  //     onClose();
  //   }
  // }, [visible]);
  return (
    <AlgaehModal
      title={`Chart of account`}
      //${voucherNo}
      centered
      visible={visible}
      footer={null}
      closable={true}
      className={`row algaehNewModal`}
    >
      <ReactToPrint
        trigger={() => (
          // <i
          //   ref={printRef}
          //   className={`fas fa-${
          //     loading === true ? "spinner fa-spin" : "print"
          //   }`}
          //   // style={{ display: "none" }}
          // />
          <button
            className="btn btn-primary"
            style={{ marginTop: 10, marginLeft: 10, textAlign: "right" }}
            ref={printRef}
          >
            Print{" "}
            <i
              ref={printRef}
              className={`fas fa-${
                loading === true ? "spinner fa-spin" : "print"
              }`}
              // style={{ display: "none" }}
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
        // documentTitle="Accounts"
        pageStyle="@media print {
            html, body {
  
              overflow: initial !important;
              -webkit-print-color-adjust: exact;
            }
          }
  
          @page {
            size: auto;
          }"
      />

      <div className="col-12">
        {" "}
        <div ref={treeRef}>
          <div className="CoAHeader" style={{ textAlign: "center" }}>
            <h2>Asset Account</h2>
            <hr />
          </div>
          <Tree
            showLine={true}
            defaultExpandAll={true}
            treeData={data}
            style={{ fontSize: 18, color: "black" }}
          />
        </div>
      </div>
    </AlgaehModal>
  );
}
