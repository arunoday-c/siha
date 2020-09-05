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
      <div className="col-12 margin-top-15">
        <label className="style_Label ">Narration</label>
        <h6>
          Add Narration Here | Add Narration Here | Add Narration Here | Add
          Narration Here
        </h6>
      </div>
    </AlgaehModal>
  );
}
