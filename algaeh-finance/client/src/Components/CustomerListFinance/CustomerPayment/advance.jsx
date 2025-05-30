import React, { memo, useState, useEffect } from "react";
import {
  Modal,
  Spin,
  // AlgaehMessagePop,
  AlgaehTable,
  Checkbox,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks";
export default memo(function Advance({
  show,
  child_id,
  hide,
  getCustomerAdvance,
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (show === true) {
      setLoading(true);
      (async () => {
        const res = await newAlgaehApi({
          uri: "/finance_customer/getCustomerAdvance",
          method: "GET",
          module: "finance",
          data: {
            child_id,
          },
        });
        setLoading(false);
        if (res.data.success) {
          const { result } = res.data;
          setData(result);
        }
      })();
    }
  }, [show]);
  function onClickOk() {
    const filterData = data.filter((f) => f.checked === true);
    getCustomerAdvance([...filterData]);
  }

  return (
    <Modal
      visible={show}
      title={"Advance List"}
      maskClosable={false}
      // okText="Continue with Selected"
      className={`row algaehNewModal`}
      onCancel={hide}
      // onOk={onClickOk}
      footer={[
        <button onClick={onClickOk} className="btn btn-primary">
          Continue
        </button>,
        <button onClick={hide} className="btn btn-default">
          Close
        </button>,
      ]}
    >
      <Spin spinning={loading}>
        <div className="col-12">
          <div className="portlet portlet-bordered margin-top-15  margin-bottom-15">
            <div className="portlet-body">
              <div className="row">
                <div className="col-12">
                  <AlgaehTable
                    columns={[
                      {
                        fieldName: "checked",
                        label: "Select",
                        sortable: false,
                        filterable: false,
                        displayTemplate: (row) => {
                          return (
                            <Checkbox
                              disabled={row.invoice_status === "closed"}
                              defaultChecked={row["checked"]}
                              onChange={(e) => {
                                const { checked } = e.target;
                                row["checked"] = checked;
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "payment_date",
                        label: "Payment Date",
                      },
                      {
                        fieldName: "voucher_no",
                        label: "Voucher No.",
                      },
                      {
                        fieldName: "amount",
                        label: "Amount",
                      },
                      {
                        fieldName: "narration",
                        label: "Narration",
                      },
                    ]}
                    data={data}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
});
