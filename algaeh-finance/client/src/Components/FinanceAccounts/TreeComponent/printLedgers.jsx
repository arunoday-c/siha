import React, { useRef, useState, useLayoutEffect } from "react";
import ReactToPrint from "react-to-print";
import { AlgaehModal, Tree } from "algaeh-react-components";
export default function PrintAccounts({ visible, data, onClose }) {
  const [loading, setLoading] = useState(false);
  const treeRef = useRef(undefined);
  const printRef = useRef(undefined);
  useLayoutEffect(() => {
    if (visible === true) {
      printRef.current.click();
      onClose();
    }
  }, [visible]);
  return (
    <AlgaehModal centered visible={visible} footer={null} closable={false}>
      <ReactToPrint
        trigger={() => (
          <i
            ref={printRef}
            className={`fas fa-${
              loading === true ? "spinner fa-spin" : "print"
            }`}
            style={{ display: "none" }}
          />
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
        documentTitle="Accounts"
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
      <Tree
        ref={treeRef}
        showLine={true}
        defaultExpandAll={true}
        treeData={data}
      />
    </AlgaehModal>
  );
}
