import React, { memo, useState } from "react";
import {
  AlgaehDataGrid,
  AlgaehMessagePop,
  AlgaehButton,
  AlgaehAutoComplete,
  AlgaehModal,
  AlgaehFormGroup,
  AlgaehDateHandler
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
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("P");
  const [dates, setDates] = useState(undefined);
  const paymentTemplates = [
    { key: "payment_mode", title: "Payment Mode" },
    { key: "ref_no", title: "Reference No" },
    { key: "cheque_date", title: "Cheque Date" }
  ];
  // useEffect(() => {
  //   LoadVouchersToAuthorize()
  //     .then(result => {
  //       setData(result);
  //     })
  //     .catch(error => {
  //       AlgaehMessagePop({
  //         type: "error",
  //         display: error
  //       });
  //     });
  // }, []);

  /**
   * To load the journal Authorization data
   */
  const loadData = () => {
    setLoading(true);
    if (level === undefined) {
      setLoading(false);
      AlgaehMessagePop({
        type: "info",
        display: "Please select Level"
      });
      return;
    }
    let others = { auth_status: status };
    if (dates !== undefined && dates.length > 0) {
      others["from_date"] = dates[0];
      others["to_date"] = dates[1];
    }

    LoadVouchersToAuthorize({ auth_level: level, ...others })
      .then(result => {
        setLoading(false);
        setData(result);
      })
      .catch(error => {
        setLoading(false);
        AlgaehMessagePop({
          type: "error",
          display: error
        });
      });
  };

  /**
   * Grid Action buttons
   * @param {*} text
   * @param {*} record
   */
  const actions = (text, record) => {
    function approve(e) {
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
          let others = { auth_status: status };
          if (dates !== undefined && dates.length > 0) {
            others["from_date"] = dates[0];
            others["to_date"] = dates[1];
          }
          LoadVouchersToAuthorize({
            auth_level: level,
            ...others
          })
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
    }

    function reject(e) {
      if (level === undefined) {
        AlgaehMessagePop({
          type: "info",
          display: "Level can not be blank"
        });
        return;
      }
      finance_voucher_header_id = record.finance_voucher_header_id;
      setVoucherNo(record.voucher_no);
      setRejectVisible(true);
    }

    return (
      <>
        {record.auth_status === "P" ? (
          <>
            <AlgaehButton
              type="primary"
              icon="like"
              onClick={approve}
            ></AlgaehButton>
            <AlgaehButton
              type="danger"
              icon="dislike"
              onClick={reject}
            ></AlgaehButton>
          </>
        ) : (
          <span>---</span>
        )}
      </>
    );
  };

  function modalOnOk() {
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
        let others = { auth_status: status };
        if (dates !== undefined && dates.length > 0) {
          others["from_date"] = dates[0];
          others["to_date"] = dates[1];
        }
        LoadVouchersToAuthorize({ auth_level: level, ...others })
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
  }

  /**
   * return Vocuvher number component on the grid
   * @param {string} text
   * @param {object} record
   */

  const voucherCol = (text, record) => (
    <AlgaehButton
      style={{ border: "none" }}
      icon="search"
      onClick={() => {
        LoadVoucherDetails({
          finance_voucher_header_id: record["finance_voucher_header_id"]
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
  );

  return (
    <div className="row">
      <AlgaehModal
        title={`Reason -${voucherNo}`}
        visible={rejectVisible}
        destroyOnClose={true}
        okText="Save"
        onOk={modalOnOk}
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
      <div className="col-12">
        <div className="row inner-top-search" style={{ paddingBottom: 10 }}>
          <div className="col-12 inner-top-search-hdg">
            <h3>Quick Search</h3>
          </div>
          <AlgaehAutoComplete
            div={{
              className: "col-2"
            }}
            label={{
              forceLabel: "Transaction Lines"
            }}
            selector={{
              dataSource: {
                data: [
                  { text: "Transaction No.", value: "1" },
                  { text: "Transaction Date", value: "2" },
                  { text: "Line Amount", value: "3" },
                  { text: "Line Description", value: "4" },
                  { text: "Transaction Date", value: "5" }
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
          <AlgaehAutoComplete
            div={{
              className: "col-2"
            }}
            label={{
              forceLabel: "Filter by"
            }}
            selector={{
              dataSource: {
                data: [
                  { text: "Contains", value: "1" },
                  { text: "Equals", value: "2" },
                  { text: "Greater Than", value: "3" },
                  { text: "Greater Than or Equal", value: "4" },
                  { text: "Less Than", value: "5" },
                  { text: "Greater Than or Equal", value: "6" }
                ],
                valueField: "value",
                textField: "text"
              },
              value: status,
              onChange: selected => {
                setStatus(selected.value);
              },
              onClear: () => {
                setStatus(undefined);
              }
            }}
          />
          <AlgaehDateHandler
            div={{ className: "col-3" }}
            label={{ forceLabel: "Transaction Date" }}
            //type="date"
            textBox={{
              value: dates
            }}
            events={{
              onChange: selected => {
                setDates(selected);
              }
            }}
          />
          <AlgaehFormGroup
            div={{
              className: "col form-group"
            }}
            label={{
              forceLabel: "Transaction Number",
              isImp: true
            }}
            textBox={{
              type: "text",
              value: "",
              className: "form-control",
              id: "name",
              placeholder: " Enter Transaction Name",
              autoComplete: false
            }}
          />
          <div className="col-2">
            {" "}
            <AlgaehButton
              type="primary"
              loading={loading}
              onClick={loadData}
              style={{ marginTop: 15 }}
            >
              Search
            </AlgaehButton>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="row">
                <div className="col-lg-12 customCheckboxGrid">
                  <AlgaehDataGrid
                    columns={[
                      // {
                      //   key: "id",
                      //   title: "Actions",
                      //   displayTemplate: actions,
                      //   others: {
                      //     width: 100
                      //   }
                      // },
                      {
                        key: "",
                        title: "Date",
                        sortable: true,
                        displayTemplate: voucherCol,
                        others: {
                          width: 130
                        }
                      },
                      {
                        key: "",
                        title: "Type",
                        sortable: true,
                        displayTemplate: voucherCol,
                        others: {
                          width: 130
                        }
                      },
                      {
                        key: "",
                        title: "Number",
                        sortable: true,
                        displayTemplate: voucherCol,
                        others: {
                          width: 130
                        }
                      },
                      {
                        key: "",
                        title: "Contact",
                        sortable: true,
                        displayTemplate: voucherCol
                      },
                      {
                        key: "",
                        title: "Amount",
                        sortable: true,
                        displayTemplate: voucherCol,
                        others: {
                          width: 130
                        }
                      },
                      {
                        key: "",
                        title: "Last Modified Date",
                        sortable: true,
                        displayTemplate: voucherCol,
                        others: {
                          width: 180
                        }
                      }
                    ]}
                    height="40vh"
                    rowUnique="finance_voucher_header_id"
                    dataSource={{ data: data }}
                  ></AlgaehDataGrid>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
