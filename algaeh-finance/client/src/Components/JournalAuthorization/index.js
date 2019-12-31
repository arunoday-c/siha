import React, { memo, useEffect, useState } from "react";
import {
  AlgaehDataGrid,
  AlgaehMessagePop,
  AlgaehButton,
  AlgaehAutoComplete,
  AlgaehModal,
  AlgaehFormGroup
} from "algaeh-react-components";
import Details from "./details";
import {
  LoadVouchersToAuthorize,
  ApproveReject,
  LoadVoucherDetails
} from "./event";
let rejectText = "";
let finance_voucher_header_id = "";
export default memo(function(props) {
  const [data, setData] = useState([]);
  const [visible, setVisibale] = useState(false);
  const [rowDetails, setRowDetails] = useState([]);
  const [voucherNo, setVoucherNo] = useState("");
  const [level, setLevel] = useState(undefined);
  const [rejectVisible, setRejectVisible] = useState(false);

  useEffect(() => {
    LoadVouchersToAuthorize()
      .then(result => {
        setData(result);
      })
      .catch(error => {
        AlgaehMessagePop({
          type: "error",
          display: error
        });
      });
  }, []);
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="portlet portlet-bordered margin-bottom-15">
          <AlgaehModal
            title={`Reason -${voucherNo}`}
            visible={rejectVisible}
            destroyOnClose={true}
            okText="Save"
            onOk={() => {
              if (rejectText === "") {
                AlgaehMessagePop({
                  type: "info",
                  display: "With out reason you con't save"
                });
                return;
              }
              ApproveReject({
                voucher_header_id: finance_voucher_header_id,
                auth_status: "R",
                auth_level: level,
                rejected_reason: rejectText
              })
                .then(result => {
                  LoadVouchersToAuthorize()
                    .then(result => {
                      setData(result);
                      setRejectVisible(false);
                      finance_voucher_header_id = "";
                      rejectText = "";
                    })
                    .catch(error => {
                      AlgaehMessagePop({
                        type: "error",
                        display: error
                      });
                    });

                  AlgaehMessagePop({
                    type: "success",
                    display: "Successfully approved"
                  });
                })
                .catch(error => {
                  AlgaehMessagePop({
                    type: "error",
                    display: error
                  });
                });
            }}
            onCancel={() => {
              finance_voucher_header_id = "";
              rejectText = "";
              setRejectVisible(false);
            }}
          >
            <AlgaehFormGroup
              div={{ className: "col" }}
              label={{ forceLabel: "Reason for reject ?", isImp: true }}
              multiline={true}
              textBox={{
                row: 3,
                defaultValue: rejectText
              }}
              events={{
                onChange: e => {
                  rejectText = e.target.value;
                }
              }}
            />
          </AlgaehModal>
          <Details
            visible={visible}
            voucherNo={voucherNo}
            inVisible={() => {
              setRowDetails([]);
              setVoucherNo("");
              setVisibale(false);
            }}
            data={rowDetails}
          />
          <div className="col-lg-12 customCheckboxGrid">
            <AlgaehAutoComplete
              div={{
                className: "col-5"
              }}
              label={{
                forceLabel: "Levels"
              }}
              selector={{
                dataSource: {
                  data: [
                    { text: "Level1", value: "1" },
                    { text: "Level2", value: "2" }
                  ],
                  valueField: "value",
                  textField: "text"
                },
                value: level,
                onChange: selected => {
                  setLevel(selected.value);
                },
                onClear: () => {
                  setLevel(undefined);
                }
              }}
            />
            <AlgaehDataGrid
              columns={[
                {
                  key: "id",
                  title: "Actions",
                  displayTemplate: (text, record) => (
                    <>
                      <AlgaehButton
                        type="primary"
                        icon="like"
                        onClick={e => {
                          if (level === undefined) {
                            AlgaehMessagePop({
                              type: "info",
                              display: "Level can not be blank"
                            });
                            return;
                          }
                          ApproveReject({
                            voucher_header_id: record.finance_voucher_header_id,
                            auth_status: "A",
                            auth_level: level
                          })
                            .then(result => {
                              LoadVouchersToAuthorize()
                                .then(result => {
                                  setData(result);
                                })
                                .catch(error => {
                                  AlgaehMessagePop({
                                    type: "error",
                                    display: error
                                  });
                                });

                              AlgaehMessagePop({
                                type: "success",
                                display: "Successfully approved"
                              });
                            })
                            .catch(error => {
                              AlgaehMessagePop({
                                type: "error",
                                display: error
                              });
                            });
                        }}
                      ></AlgaehButton>
                      <AlgaehButton
                        type="danger"
                        icon="dislike"
                        onClick={e => {
                          if (level === undefined) {
                            AlgaehMessagePop({
                              type: "info",
                              display: "Level can not be blank"
                            });
                            return;
                          }
                          finance_voucher_header_id =
                            record.finance_voucher_header_id;
                          setVoucherNo(record.voucher_no);
                          setRejectVisible(true);
                        }}
                      ></AlgaehButton>
                    </>
                  ),
                  others: {
                    width: 100
                  }
                },
                {
                  key: "voucher_no",
                  title: "Vouher Number",
                  sortable: true,
                  displayTemplate: (text, record) => (
                    <AlgaehButton
                      style={{ border: "none" }}
                      icon="search"
                      onClick={() => {
                        LoadVoucherDetails({
                          finance_voucher_header_id:
                            record["finance_voucher_header_id"]
                        })
                          .then(result => {
                            setVoucherNo(text);
                            setRowDetails(result);
                            setVisibale(true);
                          })
                          .catch(error => {
                            AlgaehMessagePop({
                              type: "error",
                              display: error
                            });
                          });
                      }}
                    >
                      {text}
                    </AlgaehButton>
                  )
                },
                { key: "voucher_type", title: "Vouher Type" },
                { key: "payment_date", title: "Payment Date" },
                { key: "amount", title: "Amount" },
                { key: "narration", title: "Narration" }
              ]}
              height="40vh"
              rowUnique="finance_voucher_header_id"
              dataSource={{ data: data }}
            ></AlgaehDataGrid>
          </div>
        </div>
      </div>
    </div>
  );
});
