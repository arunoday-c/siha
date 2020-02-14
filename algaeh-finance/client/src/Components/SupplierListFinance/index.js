import React, { memo, useState } from "react";
import "../infobar.scss";
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
      <div className="col-12">
        <div className="row infoBar">
          <div className="col">
            <div className="text">
              <p>Overdue</p>
              0.00
            </div>
          </div>{" "}
          <div className="col">
            <div className="text">
              <p>Open Invoices</p>
              0.00
            </div>
          </div>{" "}
          <div className="col">
            <div className="text">
              <p>Paid Last 30 days</p>
              0.00
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Supplier List</h3>
                </div>
                <div className="actions">
                  <button className="btn btn-primary">
                    {" "}
                    <i className="fas fa-plus"></i>
                  </button>{" "}
                  <button className="btn btn-default">
                    {" "}
                    <i className="fas fa-print"></i>
                  </button>{" "}
                  <button className="btn btn-default">
                    {" "}
                    <i className="fas fa-share-square"></i>
                  </button>
                  <button className="btn btn-default">
                    {" "}
                    <i className="fas fa-cog"></i>
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 customCheckboxGrid">
                  <AlgaehDataGrid
                    columns={[
                      {
                        key: "",
                        title: "Customer/ Company",
                        sortable: true,
                        displayTemplate: voucherCol
                      },
                      {
                        key: "",
                        title: "Opening Balance",
                        sortable: true,
                        displayTemplate: voucherCol,
                        others: {
                          width: 200
                        }
                      },
                      {
                        key: "",
                        title: "Action",
                        sortable: true,
                        displayTemplate: voucherCol,
                        others: {
                          width: 250
                        }
                      }
                    ]}
                    height="80vh"
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
