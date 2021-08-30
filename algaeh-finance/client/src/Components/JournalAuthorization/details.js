import React from "react";
import {
  AlgaehLabel,
  AlgaehModal,
  AlgaehDataGrid,
} from "algaeh-react-components";
import { getAmountFormart } from "../../utils/GlobalFunctions";

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
      <div className="col-12" id="JVModalDetailGrid">
        <AlgaehDataGrid
          columns={[
            {
              fieldName: "ledger",
              label: <AlgaehLabel label={{ forceLabel: "Head Ledger" }} />,
              disabled: true,
              filterable: true,
              sortable: false,
              others: {
                resizable: false,
                style: { textAlign: "left" },
              },
            },
            {
              fieldName: "child_ledger_code",
              label: <AlgaehLabel label={{ forceLabel: "Code" }} />,
              disabled: true,
              filterable: true,
              sortable: false,
              others: {
                resizable: false,
                width: 100,
                style: { textAlign: "left" },
              },
            },
            {
              fieldName: "child_ledger",
              label: <AlgaehLabel label={{ forceLabel: "Child Ledger" }} />,
              disabled: true,
              filterable: true,
              sortable: false,
              others: {
                resizable: false,
                style: { textAlign: "left" },
              },
            },
            {
              fieldName: "debit_amount",
              label: <AlgaehLabel label={{ forceLabel: "Debit Amt." }} />,
              displayTemplate: (row) => {
                return (
                  <span>
                    {getAmountFormart(row.debit_amount, {
                      appendSymbol: false,
                    })}
                  </span>
                );
              },
              disabled: true,
              filterable: true,
              sortable: false,
              others: {
                resizable: false,
                width: 100,
                style: { textAlign: "right" },
              },
            },
            {
              fieldName: "credit_amount",
              label: <AlgaehLabel label={{ forceLabel: "Credit Amt." }} />,
              displayTemplate: (row) => {
                return (
                  <span>
                    {getAmountFormart(row.credit_amount, {
                      appendSymbol: false,
                    })}
                  </span>
                );
              },
              disabled: true,
              filterable: true,
              sortable: false,
              others: {
                resizable: false,
                width: 100,
                style: { textAlign: "right" },
              },
            },
            {
              fieldName: "narration",
              label: <AlgaehLabel label={{ forceLabel: "Narration" }} />,
              disabled: true,
              filterable: true,
              sortable: false,
              others: {
                resizable: false,
                // width: 100,
                style: { textAlign: "left" },
              },
            },
          ]}
          // height="40vh"
          rowUnique="finance_voucher_id"
          data={data}
          filter={true}
          noDataText="No data available for selected period"
          pageOptions={{ rows: 50, page: 1 }}
          isFilterable={true}
          pagination={true}
        />
      </div>
      {/* <div className="col-12 margin-top-15">
        <label className="style_Label ">Narration</label>
        <h6>{narratn}</h6>
      </div> */}
    </AlgaehModal>
  );
}
