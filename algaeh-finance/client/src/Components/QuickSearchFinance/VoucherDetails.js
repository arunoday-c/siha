import React, { useEffect, useState } from "react";
import {
  AlgaehModal,
  AlgaehDataGrid,
  AlgaehMessagePop
} from "algaeh-react-components";
import { newAlgaehApi } from "../../hooks";

export default function VoucherDetails({ visible, data, onClose }) {
  const [Details, setDetails] = useState([]);
  useEffect(() => {
    async function getRowDetails(row) {
      try {
        const { finance_voucher_header_id } = row;
        const result = await newAlgaehApi({
          uri: "/quick_search/getSearchDetails",
          data: {
            finance_voucher_header_id
          },
          module: "finance",
          method: "GET"
        });
        return result.data.result;
      } catch (e) {
        throw new Error(e.message);
      }
    }
    if (visible && data) {
      getRowDetails(data)
        .then(res => setDetails(res))
        .catch(e => {
          AlgaehMessagePop({
            type: "Error",
            display: e.message
          });
        });
    }
  }, [data, visible]);

  if (data) {
    return (
      <AlgaehModal
        className="modalResponsiveWidth"
        title={`Journal Voucher Details  - ${data.voucher_no}`}
        visible={visible}
        destroyOnClose={true}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={() => {
          onClose();
        }}
        // style={{ width: "100vw" }}
      >
        <div className="row">
          <div className="col-12">
            <h6>
              <b>Accounting Entries</b>
            </h6>
            <AlgaehDataGrid
              columns={[
                {
                  key: "ledger_code",
                  title: "Ledger Code"
                },
                {
                  key: "ledger_name",
                  title: "Ledger Name"
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
              dataSource={{ data: Details }}
            />
          </div>
          {/* <div className="col-7">
            <h6>
              <b>Invoice Details</b>
            </h6>
            <AlgaehDataGrid
              columns={[
                {
                  key: "ledger_code",
                  title: "Ledger Code"
                },
                {
                  key: "ledger_name",
                  title: "Ledger Name"
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
              dataSource={{ data: Details }}
            />
          </div> */}
        </div>
      </AlgaehModal>
    );
  } else {
    return null;
  }
}
