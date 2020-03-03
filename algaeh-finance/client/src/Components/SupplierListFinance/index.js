import React, { memo, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "antd";
import "../../infobar.scss";
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

function SupplierList(props) {
  const history = useHistory();

  const [data, setData] = useState([]);
  const [visible, setVisibale] = useState(false);
  const [rowDetails, setRowDetails] = useState([]);
  const [voucherNo, setVoucherNo] = useState("");
  const [level, setLevel] = useState(undefined);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [dates, setDates] = useState(undefined);
  const paymentTemplates = [
    { key: "payment_mode", title: "Payment Mode" },
    { key: "ref_no", title: "Reference No" },
    { key: "cheque_date", title: "Cheque Date" }
  ];

  return (
    <div className="row">
      <div className="col-12">
        <div className="row infoBar">
          <div className="col">
            <div className="text">
              <p>Overdue</p>
              0.00
            </div>
          </div>
          <div className="col">
            <div className="text">
              <p>Open Invoices</p>
              0.00
            </div>
          </div>
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
                  <button
                    className="btn btn-primary"
                    onClick={() => history.push("/CustomerSetup")}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <button className="btn btn-default">
                    <i className="fas fa-print"></i>
                  </button>
                  <button className="btn btn-default">
                    <i className="fas fa-share-square"></i>
                  </button>
                  <button className="btn btn-default">
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
                        displayTemplate: (text, record) => {
                          return (
                            <Button
                              type="link"
                              onClick={() =>
                                history.push("/SupplierPayment", {
                                  data: record
                                })
                              }
                            >
                              {text}
                            </Button>
                          );
                        }
                      },
                      {
                        key: "",
                        title: "Opening Balance",
                        sortable: true,
                        others: {
                          width: 200
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
}

export default memo(SupplierList);
