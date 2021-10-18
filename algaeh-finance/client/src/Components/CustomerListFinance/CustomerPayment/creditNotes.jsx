import React, { memo, useState, useEffect } from "react";
import { swalMessage } from "../../../utils/algaehApiCall";

import {
  Modal,
  Spin,
  // AlgaehMessagePop,
  AlgaehTable,
  Checkbox,
  AlgaehLabel,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks";
export default memo(function CreditNotes({
  show,
  child_id,
  hide,
  getAllCreditNotes,
  getCustomerAdvance,
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [adv_data, setAdvData] = useState([]);
  useEffect(() => {
    if (show === true) {
      setLoading(true);
      (async () => {
        const res = await newAlgaehApi({
          uri: "/finance_customer/getAllCreditNotes",
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

        const adv_res = await newAlgaehApi({
          uri: "/finance_customer/getCustomerAdvance",
          method: "GET",
          module: "finance",
          data: {
            child_id,
          },
        });
        setLoading(false);
        if (adv_res.data.success) {
          const { result } = adv_res.data;
          setAdvData(result);
        }
      })();
    }
  }, [show]);
  function onClickOk() {
    const filterData = data.filter((f) => f.checked === true);
    const adv_filterData = adv_data.filter((f) => f.checked === true);

    if (filterData.length > 0 || adv_filterData.length > 0) {
      getAllCreditNotes([...filterData]);
      getCustomerAdvance([...adv_filterData]);
    } else {
      swalMessage({
        type: "warning",
        title: "Please select at least one invoice",
      });
      return;
    }
  }
  return (
    <Modal
      visible={show}
      title={"Advance & Credit Note List"}
      maskClosable={false}
      okText="Continue with Selected"
      // className={`row algaehNewModal AdvCreNoteModal`}
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
      className={`row algaehNewModal AdvCreNoteModal`}
    >
      <Spin spinning={loading}>
        <div className="col-12">
          <div className="portlet portlet-bordered margin-top-15  margin-bottom-15">
            <div className="portlet-body">
              <div className="row">
                <div className="col-6">
                  <AlgaehTable
                    columns={[
                      {
                        fieldName: "checked",
                        label: <AlgaehLabel label={{ forceLabel: "select" }} />,
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
                        others: {
                          Width: 50,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "narration",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Narration" }} />
                        ),
                      },

                      {
                        fieldName: "invoice_no",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Invoice No." }} />
                        ),
                        others: {
                          Width: 120,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "payment_date",
                        label: <AlgaehLabel label={{ forceLabel: "Date" }} />,
                        others: {
                          Width: 120,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "amount",
                        label: <AlgaehLabel label={{ forceLabel: "Amount" }} />,
                        others: {
                          Width: 10,
                          style: { textAlign: "right" },
                        },
                      },
                    ]}
                    data={data}
                  />
                </div>
                <div className="col-6">
                  <AlgaehTable
                    columns={[
                      {
                        fieldName: "checked",
                        label: <AlgaehLabel label={{ forceLabel: "select" }} />,
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
                        others: {
                          Width: 50,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "narration",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Narration" }} />
                        ),
                      },

                      {
                        fieldName: "invoice_no",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Invoice No." }} />
                        ),
                        others: {
                          Width: 120,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "payment_date",
                        label: <AlgaehLabel label={{ forceLabel: "Date" }} />,
                        others: {
                          Width: 120,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "amount",
                        label: <AlgaehLabel label={{ forceLabel: "Amount" }} />,
                        others: {
                          Width: 10,
                          style: { textAlign: "right" },
                        },
                      },
                    ]}
                    data={adv_data}
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
