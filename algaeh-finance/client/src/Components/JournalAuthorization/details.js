import React from "react";
import { AlgaehModal, AlgaehDataGrid } from "algaeh-react-components";
export default function ({ visible, voucherNo, inVisible, data }) {
  // let narration = data[0];

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
            {
              fieldName: "narration",
              label: "Narration",
            },
          ]}
          // height="40vh"
          rowUnique="finance_voucher_id"
          data={data}
        />
      </div>
      {/* <div className="col-12 margin-top-15">
        <label className="style_Label ">Narration</label>
        <h6>{narratn}</h6>
      </div> */}
    </AlgaehModal>
  );
}
