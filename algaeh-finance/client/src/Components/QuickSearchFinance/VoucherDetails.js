import React, { useEffect, useState } from "react";
import "./QuickSearchFinance.scss";
import {
  AlgaehModal,
  AlgaehDataGrid,
  AlgaehMessagePop,
} from "algaeh-react-components";
import { useHistory } from "react-router-dom";
import { newAlgaehApi } from "../../hooks";
import { getAmountFormart } from "../../utils/GlobalFunctions";

export default function VoucherDetails({ visible, data, onClose }) {
  const history = useHistory();
  const [Details, setDetails] = useState([]);
  useEffect(() => {
    async function getRowDetails(row) {
      try {
        const { finance_voucher_header_id } = row;
        const result = await newAlgaehApi({
          uri: "/quick_search/getSearchDetails",
          data: {
            finance_voucher_header_id,
          },
          module: "finance",
          method: "GET",
        });
        return result.data.result;
      } catch (e) {
        throw new Error(e.message);
      }
    }
    if (visible && data) {
      getRowDetails(data)
        .then((res) => setDetails(res))
        .catch((e) => {
          AlgaehMessagePop({
            type: "Error",
            display: e.message,
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
        onOk={() =>
          history.push("/JournalVoucher", {
            data: {
              ...data,
              Details,
            },
            type: "duplicate",
          })
        }
        destroyOnClose={true}
        // okButtonProps={{
        //   type: "Primary"
        // }}
        okText="Duplicate"
        cancelText="Close"
        onCancel={() => {
          onClose();
        }}
        className={`row algaehNewModal JVModalDetail`}
      >
        <div className="col-12">
          {/* <h6>
              <b>Accounting Entries</b>
            </h6> */}
          <AlgaehDataGrid
            className="JVModalDetailGrid"
            columns={[
              {
                fieldName: "ledger_code",
                label: "Ledger Code",
              },
              {
                fieldName: "ledger_name",
                label: "Ledger Name",
              },
              {
                fieldName: "debit_amount",
                label: "Debit Amount",
                displayTemplate: (row) => {
                  return (
                    <span>
                      {getAmountFormart(row.debit_amount, {
                        appendSymbol: false,
                      })}
                    </span>
                  );
                },
              },
              {
                fieldName: "credit_amount",
                label: "Credit Amount",
                displayTemplate: (row) => {
                  return (
                    <span>
                      {getAmountFormart(row.credit_amount, {
                        appendSymbol: false,
                      })}
                    </span>
                  );
                },
              },
            ]}
            // height="60vh"
            rowUnique="finance_voucher_id"
            data={Details}
          />
        </div>
      </AlgaehModal>
    );
  } else {
    return null;
  }
}
