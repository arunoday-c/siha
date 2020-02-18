import React from "react";
import { AlgaehModal, AlgaehDataGrid } from "algaeh-react-components";
export default function(props) {
  const { visible, voucherNo, inVisible, data } = props;

  return (
    <AlgaehModal
      title={`Journal Voucher Details - ${voucherNo}`}
      visible={visible}
      destroyOnClose={true}
      okButtonProps={{ style: { display: "none" } }}
      onCancel={() => {
        inVisible();
      }}
    >
      <AlgaehDataGrid
        columns={[
          {
            key: "ledger",
            title: "Ledger"
          },
          {
            key: "credit_amount",
            title: "Credit Amount"
          },
          {
            key: "debit_amount",
            title: "Debit Amount"
          }
        ]}
        height="40vh"
        rowUnique="finance_voucher_id"
        dataSource={{ data: data }}
      />
    </AlgaehModal>
  );
}
