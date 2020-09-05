import React, { memo, useState } from "react";
import "./JournalAuthorization.scss";
import {
  AlgaehDataGrid,
  AlgaehMessagePop,
  AlgaehButton,
  AlgaehAutoComplete,
  AlgaehModal,
  AlgaehFormGroup,
  AlgaehDateHandler,
  Tooltip,
  Modal,
} from "algaeh-react-components";
import { algaehApiCall } from "../../utils/algaehApiCall";
import Details from "./details";
import {
  LoadVouchersToAuthorize,
  ApproveReject,
  LoadVoucherDetails,
} from "./event";
const { confirm } = Modal;
let rejectText = "";
let finance_voucher_header_id = "";
export default memo(function (props) {
  const [data, setData] = useState([]);
  const [visible, setVisibale] = useState(false);
  const [rowDetails, setRowDetails] = useState([]);
  const [voucherNo, setVoucherNo] = useState("");
  const [level, setLevel] = useState("1");
  const [rejectVisible, setRejectVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [dates, setDates] = useState(undefined);
  // const paymentTemplates = [
  //   { key: "payment_mode", title: "Payment Mode" },
  //   { key: "ref_no", title: "Reference No" },
  //   { key: "cheque_date", title: "Cheque Date" },
  // ];
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
        display: "Please select Level",
      });
      return;
    }
    let others = { auth_status: status };
    if (dates !== undefined && dates.length > 0) {
      others["from_date"] = dates[0];
      others["to_date"] = dates[1];
    }

    LoadVouchersToAuthorize({ auth_level: level, ...others })
      .then((result) => {
        setLoading(false);
        setData(result);
      })
      .catch((error) => {
        setLoading(false);
        AlgaehMessagePop({
          type: "error",
          display: error,
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
          display: "Level can not be blank",
        });
        return;
      }
      confirm({
        okText: "Approve",
        okType: "primary",
        icon: "",
        title: "Are You sure you want to confirm ?",
        // content: `This request is made for
        // Prepayment Type: ${row.prepayment_desc}`,

        maskClosable: true,
        onOk: async () => {
          ApproveReject({
            voucher_header_id: record.finance_voucher_header_id,
            auth_status: "A",
            auth_level: level,
          })
            .then((result) => {
              let others = { auth_status: status };
              if (dates !== undefined && dates.length > 0) {
                others["from_date"] = dates[0];
                others["to_date"] = dates[1];
              }
              LoadVouchersToAuthorize({
                auth_level: level,
                ...others,
              })
                .then((result) => {
                  setData(result);
                })
                .catch((error) => {
                  AlgaehMessagePop({
                    type: "error",
                    display: error,
                  });
                });

              AlgaehMessagePop({
                type: "success",
                display: "Successfully approved",
              });
            })
            .catch((error) => {
              AlgaehMessagePop({
                type: "error",
                display: error,
              });
            });
        },
      });
    }

    function reject(e) {
      if (level === undefined) {
        AlgaehMessagePop({
          type: "info",
          display: "Level can not be blank",
        });
        return;
      }
      confirm({
        okText: "Reject",
        okType: "primary",
        icon: "",
        title: "Are You sure you want to confirm ?",
        // content: `This request is made for
        // Prepayment Type: ${row.prepayment_desc}`,

        maskClosable: true,
        onOk: async () => {
          finance_voucher_header_id = record.finance_voucher_header_id;
          setVoucherNo(record.voucher_no);
          setRejectVisible(true);
        },
      });
    }

    function generateJVReport(e) {
      algaehApiCall({
        uri: "/report",
        method: "GET",
        module: "reports",
        headers: {
          Accept: "blob",
        },
        others: { responseType: "blob" },
        data: {
          report: {
            reportName: "JVReport",
            // pageOrentation: "landscape",
            reportParams: [
              {
                name: "voucher_header_id",
                value: record.finance_voucher_header_id,
              },
            ],
            outputFileType: "PDF",
          },
        },
        onSuccess: (res) => {
          const urlBlob = URL.createObjectURL(res.data);
          const documentName = "Journal Voucher Report";
          const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Journal Voucher Report`;
          window.open(origin);
        },
      });
    }

    return (
      <>
        {record.auth_status === "P" ? (
          <>
            <Tooltip title="Approve">
              <span onClick={approve}>
                <i className="fas fa-thumbs-up"></i>
              </span>
            </Tooltip>
            <Tooltip title="Reject">
              <span onClick={reject}>
                <i className="fas fa-thumbs-down"></i>
              </span>
            </Tooltip>
            {/* <i className="fas fa-thumbs-up" onClick={approve}></i>

            <i className="fas fa-thumbs-down" onClick={reject}></i> */}
          </>
        ) : record.auth_status === "A" ? (
          <span>
            <i className="fas fa-print" onClick={generateJVReport}></i>
          </span>
        ) : (
          "----"
        )}
      </>
    );
  };

  function modalOnOk() {
    if (rejectText === "") {
      AlgaehMessagePop({
        type: "info",
        display: "With out reason you con't save",
      });
      return;
    }
    ApproveReject({
      voucher_header_id: finance_voucher_header_id,
      auth_status: "R",
      auth_level: level,
      rejected_reason: rejectText,
    })
      .then((result) => {
        let others = { auth_status: status };
        if (dates !== undefined && dates.length > 0) {
          others["from_date"] = dates[0];
          others["to_date"] = dates[1];
        }
        LoadVouchersToAuthorize({ auth_level: level, ...others })
          .then((result) => {
            setData(result);
            setRejectVisible(false);
            finance_voucher_header_id = "";
            rejectText = "";
          })
          .catch((error) => {
            AlgaehMessagePop({
              type: "error",
              display: error,
            });
          });

        AlgaehMessagePop({
          type: "success",
          display: "Successfully approved",
        });
      })
      .catch((error) => {
        AlgaehMessagePop({
          type: "error",
          display: error,
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
      style={{
        border: "none",
        background: "none",
        padding: 0,
        color: "blue",
      }}
      // icon="search"
      onClick={() => {
        LoadVoucherDetails({
          finance_voucher_header_id: record["finance_voucher_header_id"],
        })
          .then((result) => {
            setVoucherNo(text);
            setRowDetails(result);
            setVisibale(true);
          })
          .catch((error) => {
            AlgaehMessagePop({
              type: "error",
              display: error,
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
            defaultValue: rejectText,
          }}
          events={{
            onChange: (e) => {
              rejectText = e.target.value;
            },
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
          <AlgaehAutoComplete
            div={{
              className: "col-2",
            }}
            label={{
              forceLabel: "Levels",
            }}
            selector={{
              dataSource: {
                data: [
                  { text: "Level 1", value: "1" },
                  { text: "Level 2", value: "2" },
                ],
                valueField: "value",
                textField: "text",
              },
              value: level,

              onChange: (selected) => {
                setLevel(selected.value);
              },
              onClear: () => {
                setLevel(undefined);
              },
            }}
          />
          <AlgaehAutoComplete
            div={{
              className: "col-2",
            }}
            label={{
              forceLabel: "Record Status",
            }}
            selector={{
              dataSource: {
                data: [
                  { text: "All Records", value: "" },
                  { text: "Pending", value: "P" },
                  { text: "Rejected", value: "R" },
                  { text: "Approved", value: "A" },
                ],
                valueField: "value",
                textField: "text",
              },
              value: status,
              onChange: (selected) => {
                setStatus(selected.value);
              },
              onClear: () => {
                setStatus(undefined);
              },
            }}
          />
          <AlgaehDateHandler
            div={{ className: "col-3" }}
            label={{ forceLabel: "Selected Range" }}
            type="range"
            textBox={{
              value: dates,
            }}
            events={{
              onChange: (selected) => {
                setDates(selected);
              },
            }}
          />
          <div className="col">
            {" "}
            {/* <AlgaehButton
              className="btn btn-primary"
              // type="primary"
              loading={loading}
              onClick={loadData}
              style={{ marginTop: 15 }}
            >
              Load
            </AlgaehButton> */}
            <button
              className="btn btn-primary"
              onClick={loadData}
              style={{ marginTop: 18 }}
              disabled={loading}
            >
              Load
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              {" "}
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12 customCheckboxGrid">
                    <AlgaehDataGrid
                      columns={[
                        {
                          fieldName: "id",
                          label: "Actions",
                          displayTemplate: actions,
                          others: {
                            width: 100,
                          },
                        },
                        {
                          fieldName: "auth_status",
                          label: "Record Status",
                          sortable: true,
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.auth_status === "P" ? (
                                  <span className="badge badge-warning">
                                    Pending
                                  </span>
                                ) : row.auth_status === "A" ? (
                                  <span className="badge badge-success">
                                    Approved
                                  </span>
                                ) : row.auth_status === "R" ? (
                                  <span className="badge badge-danger">
                                    Rejected
                                  </span>
                                ) : (
                                  "------"
                                )}
                              </span>
                            );
                          },
                        },
                        {
                          fieldName: "voucher_no",
                          label: "Voucher Number",
                          sortable: true,
                          displayTemplate: voucherCol,
                        },
                        { fieldName: "voucher_type", label: "Voucher Type" },
                        { fieldName: "payment_date", label: "Payment Date" },
                        // ...paymentTemplates,
                        /* Commented paymentTemplates there is no condition we can use directly   */
                        // {
                        //   fieldName: "payment_mode",
                        //   label: "Payment Mode",
                        //   displayTemplate: (row) => {
                        //     return row["payment_mode"] === "N"
                        //       ? "NONE"
                        //       : row["payment_mode"];
                        //   },
                        // },
                        // { fieldName: "ref_no", label: "Reference No" },
                        // { fieldName: "cheque_date", label: "Cheque Date" },
                        /* Commented End */
                        { fieldName: "amount", label: "Amount" },
                        { fieldName: "narration", label: "Narration" },
                        {
                          fieldName: "entered_by",
                          label: "Enterd By",
                          filtered: true,
                        },
                      ]}
                      height="40vh"
                      rowUnique="finance_voucher_header_id"
                      data={data}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
