import React from "react";
import { AlgaehModal, AlgaehDataGrid } from "algaeh-react-components";
export default function ({ visible, voucherNo, inVisible, data }) {
  return (
    <AlgaehModal
      title={`Journal Voucher Details - ${voucherNo}`}
      visible={visible}
      destroyOnClose={true}
      okButtonProps={{ style: { display: "none" } }}
      onCancel={() => {
        inVisible();
      }}
      className={`row algaehNewModal JVModalDetail`}
    >
      <div className="col-12">
        <AlgaehDataGrid
          className="JVModalDetailGrid"
          columns={[
            {
              fieldName: "ledger",
              label: "Ledger",
            },
            {
              fieldName: "credit_amount",
              label: "Credit Amount",
            },
            {
              fieldName: "debit_amount",
              label: "Debit Amount",
            },
          ]}
          // height="40vh"
          rowUnique="finance_voucher_id"
          data={data}
        />
      </div>
    </AlgaehModal>
  );
}
