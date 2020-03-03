import React, { memo, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button } from "antd";
import {
  AlgaehDataGrid,
  AlgaehMessagePop,
  AlgaehButton,
  AlgaehAutoComplete,
  AlgaehModal,
  AlgaehFormGroup,
  AlgaehDateHandler
} from "algaeh-react-components";
import {
  LoadVouchersToAuthorize,
  ApproveReject,
  LoadVoucherDetails
} from "./SupPaymentEvents";
let rejectText = "";
let finance_voucher_header_id = "";
export default memo(function(props) {
  const history = useHistory();
  const location = useLocation();
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

  useEffect(() => {
    if (!location.state) {
      history.goBack(); // just boilerplate will be replaced
    }
  }, [location.state]);

  return (
    <div className="row">
      <div className="col-12">
        <div className="row inner-top-search" style={{ paddingBottom: 10 }}>
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
                  { text: "ABCD", value: "3" }
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
              // onClick={loadData}
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
                      {
                        key: "",
                        title: "Date",
                        sortable: true
                      },
                      {
                        key: "invoice_no",
                        title: "Invoice No",
                        sortable: true
                      },
                      {
                        key: "narration",
                        title: "Description"
                      },
                      {
                        title: "Due Date",
                        sortable: true
                      },
                      {
                        key: "invoice_amount",
                        title: "Amount",
                        sortable: true
                      },
                      {
                        key: "",
                        title: "Status",
                        sortable: true
                      },
                      {
                        title: "Last Modified Date",
                        sortable: true
                      },
                      {
                        title: "Action",
                        displayTemplate: (_, row) => {
                          return (
                            <Button
                              type="link"
                              onClick={() =>
                                history.push("/JournalVoucher", {
                                  data: row,
                                  type: "supplier"
                                })
                              }
                            >
                              Send Payment
                            </Button>
                          );
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
