import React, { useRef, useState, useLayoutEffect } from "react";
import ReactToPrint from "react-to-print";
import { AlgaehModal, Tree } from "algaeh-react-components";
export default function PrintAccounts({ visible, data, onClose, title }) {
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
      title={`Chart of Accounts - ${title}`}
      //${voucherNo}
      centered
      visible={visible}
      // footer={true}
      closable={true}
      okText="Print"
      onOk={() => {
        printRef.current.click();
      }}
      okButtonProps={{
        loading: loading,
      }}
      onCancel={onClose}
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
            treeData={data}
            style={{ fontSize: 18, color: "black" }}
          />
        </div>
      </div>
    </AlgaehModal>
  );
}
