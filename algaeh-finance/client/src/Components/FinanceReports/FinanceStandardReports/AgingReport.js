import React, { useEffect, useState } from "react";
// import { Row, Col } from "antd";
// import "./antTableCustomStyle.scss";

// import ReactToPrint from "react-to-print";
// import { newAlgaehApi } from "../../../hooks";

import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { handleFile } from "../FinanceReportEvents";
import Filter from "../filter";
// import { getItem, tokenDecode } from "algaeh-react-components/storage";
// import moment from "moment";
// import jwtDecode from "jwt-decode";
import DrillDown from "../drillDown";
import {
  AlgaehDateHandler,
  AlgaehButton,
  AlgaehFormGroup,
} from "algaeh-react-components";
// import ReportHeader from "../header";
import PrintLayout from "../printlayout";
import { getAmountFormart } from "../../../utils/GlobalFunctions";
import moment from "moment";
import _ from "lodash";

export default function AgingReport({ style, result, layout, type, dates }) {
  const DIFF = {
    payable: { url: "getAccountPayableAging", title: "Payable" },
    receivable: { url: "getAccountReceivableAging", title: "Receivable" },
  };

  // const createPrintObject = useRef(undefined);
  const [data, setData] = useState([]);
  const [till_date, setTillDate] = useState(new Date());
  const [date_wise, setDateWise] = useState("N");
  const [footerData, setFooterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [interval, setInterval] = useState(30);
  const [period, setPeriod] = useState(5);
  const [period_list, setPeriodList] = useState([]);
  const [trans_type, setTransType] = useState("S");
  const [showDrillDown, setShowDrillDown] = useState(false);
  const [row, setRow] = useState(undefined);
  const [_dates, setDates] = useState([]);

  // const [organisation, setOrganisation] = useState({});

  useEffect(() => {
    loadReport();
    // newAlgaehApi({
    //   uri: "/organization/getMainOrganization",
    //   method: "GET",
    // })
    //   .then((result) => {
    //     const { records, success, message } = result.data;
    //     if (success === true) {
    //       setOrganisation(records);
    //     } else {
    //       AlgaehMessagePop({
    //         display: message,
    //         type: "error",
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     AlgaehMessagePop({
    //       display: error.message,
    //       type: "error",
    //     });
    //   });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, dates]);

  // const { organization_name, address1, address2, full_name } = organisation;

  function onPreviewClick() {
    if (date_wise === "Y" && till_date === undefined) {
      swalMessage({
        type: "warning",
        title: "Select Upto Date.",
      });
    } else {
      setLoading(true);
      loadReport();
    }
  }

  function loadReport(excel) {
    let extraHeaders = {};
    if (excel === true) {
      extraHeaders = {
        headers: {
          Accept: "blob",
        },
        others: { responseType: "blob" },
      };
    }
    algaehApiCall({
      uri: `/financeReports/${DIFF[type].url}`,
      method: "GET",
      module: "finance",
      data: {
        from_date: dates[0],
        to_date: dates[1],
        excel,
        date_wise,
        till_date,
        interval: interval,
        period: period,
      },
      ...extraHeaders,
      onSuccess: (response) => {
        setLoading(false);
        if (excel) {
          handleFile(response.data, type);
        } else {
          let display_array = [
            {
              fieldName: "customer",
              label: type === "receivable" ? "Customer Name" : "Vendor Name",
              filterable: true,
              sortable: true,
            },
            {
              fieldName: "Current",
              label: "Current",
              filterable: true,
              displayTemplate: (row) => {
                // const opamt = String(row["cb_amount"]).trim(); //.replace(/[^0-9./]+/g, "");

                return (
                  <a
                    className="underLine"
                    href="void(0);"
                    onClick={(e) => {
                      e.preventDefault();
                      setDates([moment(new Date()), moment(new Date())]);
                      OpenDrillDown(row);
                    }}
                  >
                    {getAmountFormart(row["Current"], {
                      appendSymbol: false,
                    })}
                  </a>
                );

                // return row["Current"];
                // getAmountFormart(row["Current"], {
                //   appendSymbol: false,
                // });
              },
            },
            {
              fieldName: "1-" + interval,
              label: "1-" + interval + " Days",
              filterable: true,
              displayTemplate: (row) => {
                // const opamt = String(row["cb_amount"]).trim(); //.replace(/[^0-9./]+/g, "");

                return (
                  <a
                    className="underLine"
                    href="void(0);"
                    name={"1-" + interval}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("row", row);
                      const Name = e.target.name;

                      const _before = Name.split("-")[0];
                      const _after = Name.split("-")[1];

                      setDates([
                        moment(new Date()).add(-[parseInt(_after) + 1], "days"),
                        moment(new Date()).add(-1, "days"),
                      ]);
                      OpenDrillDown(row);
                    }}
                  >
                    {getAmountFormart(row["1-" + interval], {
                      appendSymbol: false,
                    })}
                  </a>
                );
                // return getAmountFormart(row["1-" + interval], {
                //   appendSymbol: false,
                // });
              },
            },
          ];

          let p_interval = interval;
          for (let i = 0; i < period - 3; i++) {
            let before_interval = parseInt(p_interval) + 1;
            let after_interval = parseInt(p_interval) + parseInt(interval);
            const field_name =
              p_interval.toString() + "-" + after_interval.toString();
            display_array.push({
              fieldName: field_name,
              label: before_interval + "-" + after_interval + " Days",
              filterable: true,
              displayTemplate: (row) => {
                // const opamt = String(row["cb_amount"]).trim(); //.replace(/[^0-9./]+/g, "");

                const na_before_interval = before_interval + i + 1;
                const na_after_interval = after_interval + i + 2;
                return (
                  <a
                    className="underLine"
                    href="void(0);"
                    name={na_before_interval + "-" + na_after_interval}
                    onClick={(e) => {
                      e.preventDefault();

                      const Name = e.target.name;

                      const _before = Name.split("-")[0];
                      const _after = Name.split("-")[1];

                      setDates([
                        moment(new Date()).add(-[parseInt(_after)], "days"),
                        moment(new Date()).add(-[parseInt(_before)], "days"),
                      ]);

                      OpenDrillDown(row);
                    }}
                  >
                    {getAmountFormart(row[field_name], {
                      appendSymbol: false,
                    })}
                  </a>
                );
                // return getAmountFormart(row[field_name], {
                //   appendSymbol: false,
                // });
              },
            });
            p_interval = after_interval;
          }

          display_array.push(
            {
              fieldName: "OVER-" + p_interval,
              label: "Over " + p_interval + " Days",
              filterable: true,
              displayTemplate: (row) => {
                // const opamt = String(row["cb_amount"]).trim(); //.replace(/[^0-9./]+/g, "");

                return (
                  <a
                    className="underLine"
                    href="void(0);"
                    name={p_interval}
                    onClick={(e) => {
                      e.preventDefault();
                      const Name = e.target.name;

                      setDates([
                        moment(new Date()).add(-[parseInt(Name)], "days"),
                        0,
                      ]);
                      OpenDrillDown(row);
                    }}
                  >
                    {getAmountFormart(row["OVER-" + p_interval], {
                      appendSymbol: false,
                    })}
                  </a>
                );
                // return getAmountFormart(row["OVER-" + p_interval], {
                //   appendSymbol: false,
                // });
              },
            },
            {
              fieldName: "balance",
              label: "Balance",
              filterable: true,
              displayTemplate: (row) => {
                return getAmountFormart(row["balance"], {
                  appendSymbol: false,
                });
              },
            }
          );
          setPeriodList(display_array);
          if (response.data.success === true) {
            setData(response.data.result.data);
            const footer = response.data.result;
            setFooterData({
              todays_amount: footer.todays_total,
              thirty_days_amount: footer.thirty_days_total,
              sixty_days_amount: footer.sixty_days_total,
              ninety_days_amount: footer.ninety_days_total,
              above_ninety_days_amount: footer.above_ninety_days_total,
              balance: footer.grand_total,
              customer: "",
            });
          }
        }
      },
      onFailure: (error) => {
        setLoading(false);
        swalMessage({
          type: "error",
          title: error.response.data.message || error.message,
        });
      },
    });
  }

  function OpenDrillDown(rec) {
    setShowDrillDown(true);
    setRow(rec);
  }
  function OnCloseDrillDown() {
    setShowDrillDown(false);
  }

  return (
    <>
      <DrillDown
        visible={showDrillDown}
        onClose={OnCloseDrillDown}
        row={row}
        dates={_dates}
        aging={true}
        screen_type={type}
      />
      <div className="row inner-top-search">
        <div className="col-2">
          <label>Date Wise</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                checked={date_wise === "Y" ? true : false}
                onChange={(e) => {
                  const checked = e.target.checked ? "Y" : "N";
                  setDateWise(checked);
                  setTillDate(undefined);
                  setData([]);
                  setFooterData({});
                }}
              />
              <span> Yes</span>
            </label>
          </div>
        </div>

        <AlgaehDateHandler
          div={{
            className: "col-2 algaeh-date-fld",
          }}
          label={{
            fieldName: "Upto Date",
          }}
          textBox={{
            className: "form-control",
            value: till_date,
          }}
          maxDate={moment().add(1, "days")}
          events={{
            onChange: (momentDate) => {
              if (momentDate) {
                setTillDate(momentDate._d);
              } else {
                setTillDate(undefined);
              }
            },
          }}
          others={{
            disabled: date_wise === "N" ? true : false,
          }}
        />

        <div className="col">
          <label>Show Transaction By</label>
          <div className="customRadio">
            <label className="radio inline">
              <input
                type="radio"
                value="S"
                checked={trans_type === "S" ? true : false}
                onChange={(e) => {
                  setTransType(e.target.value);
                  setInterval(30);
                  setPeriod(5);
                }}
              />
              <span>Standard</span>
            </label>
            <label className="radio inline">
              <input
                type="radio"
                value="C"
                checked={trans_type === "C" ? true : false}
                onChange={(e) => {
                  setTransType(e.target.value);
                  setInterval(30);
                  setPeriod(5);
                }}
              />
              <span>Custom</span>
            </label>
          </div>
        </div>
        {trans_type === "C" ? (
          <>
            <AlgaehFormGroup
              div={{
                className: "col-2 form-group  mandatory",
              }}
              label={{
                forceLabel: "Interval",
                isImp: true,
              }}
              textBox={{
                type: "text",
                value: interval,
                className: "form-control",
                id: "name",
                onChange: (e) => {
                  setInterval(e.target.value);
                },
                placeholder: "Interval",
                autoComplete: false,
              }}
            />

            <AlgaehFormGroup
              div={{
                className: "col-2 form-group  mandatory",
              }}
              label={{
                forceLabel: "Period",
                isImp: true,
              }}
              textBox={{
                type: "text",
                value: period,
                className: "form-control",
                id: "name",
                onChange: (e) => {
                  setPeriod(e.target.value);
                },
                placeholder: "Period",
                autoComplete: false,
              }}
            />
          </>
        ) : null}
      </div>

      <div className="col previewReportBtn">
        <AlgaehButton
          className="btn btn-primary"
          onClick={onPreviewClick}
          loading={loading}
        >
          Preview
        </AlgaehButton>
      </div>

      {/* {date_wise === "Y" ? (
        <PrintLayout
          title={`Account ${
            type === "receivable" ? "Receivable" : "Payable"
          } Aging Report`}
          columns={[
            {
              fieldName: "customer",
              label: type === "receivable" ? "Customer Name" : "Vendor Name",
              filterable: true,
              sortable: true,
            },
            {
              fieldName: "balance",
              label: "Balance",
              filterable: true,
              displayTemplate: (row) => {
                return getAmountFormart(row["balance"], {
                  appendSymbol: false,
                });
              },
            },
          ]}
          data={data}
          tableprops={{
            aggregate: (fieldName) => {
              if (fieldName !== "customer") {
                return getAmountFormart(footerData[fieldName], {
                  appendSymbol: false,
                });
              } else {
                return "";
              }
            },
            footer: true,
          }}
        />
      ) : ( */}
      <PrintLayout
        title={`Account ${
          type === "receivable" ? "Receivable" : "Payable"
        } Aging Report`}
        columns={period_list}
        data={data}
        tableprops={{
          aggregate: (fieldName) => {
            if (fieldName !== "customer") {
              const _data = _.sumBy(data, (s) =>
                s[fieldName] !== undefined ? parseFloat(s[fieldName]) : 0
              );
              return getAmountFormart(_data, {
                appendSymbol: false,
              });
            } else {
              return "";
            }
          },
          footer: true,
        }}
      />
      {/* )} */}
    </>
    // <>
    //   <div className="row">
    //     <div className="col-12 reportHeaderAction">
    //       <span>
    //         <ReactToPrint
    //           trigger={() => <i className="fas fa-print" />}
    //           content={() => createPrintObject.current}
    //           removeAfterPrint={true}
    //           bodyClass="reportPreviewSecLeft"
    //           pageStyle="printing"
    //         />
    //       </span>
    //       <span>
    //         <i
    //           className="fas fa-file-download"
    //           onClick={() => loadReport(true)}
    //         />
    //       </span>
    //     </div>
    //   </div>
    //   <div ref={createPrintObject}>

    //     <ReportHeader
    //       title={`Account ${
    //         type === "receivable" ? "Receivable" : "Payable"
    //       } Aging Report`}
    //     />
    //     <AlgaehTable
    //       className="reportGridPlain"
    //       columns={[
    //         {
    //           fieldName: "customer",
    //           label: "Vendor Name",
    //           filterable: true,
    //           sortable: true,
    //           // style: {
    //           //   textStyle:"bold"
    //           // }
    //         },
    //         {
    //           fieldName: "todays_amount",
    //           label: "Current",
    //           filterable: true,
    //           // alignColumn:"right",
    //         },
    //         {
    //           fieldName: "thirty_days_amount",
    //           label: "1-30 Days",
    //           filterable: true,
    //           // alignColumn:"right",
    //         },
    //         {
    //           fieldName: "sixty_days_amount",
    //           label: "31-60 Days",
    //           filterable: true,
    //           // alignColumn:"right",
    //         },
    //         {
    //           fieldName: "ninety_days_amount",
    //           label: "61-90 Days",
    //           filterable: true,
    //           // alignColumn:"right",
    //         },
    //         {
    //           fieldName: "above_ninety_days_amount",
    //           label: "Over 90 Days",
    //           filterable: true,
    //           // alignColumn:"right",
    //         },
    //         {
    //           fieldName: "balance",
    //           label: "Balance",
    //           filterable: true,
    //           // alignColumn:"right",
    //         },
    //       ]}
    //       isFilterable={true}
    //       data={data}
    //       footer={true}
    //       aggregate={(fieldName) => {
    //         if (footerData) {
    //           return footerData[fieldName];
    //         }
    //       }}
    //       pagination={false}
    //     />
    //   </div>
    // </>
  );
}

// [
//   {
//     fieldName: "customer",
//     label: type === "receivable" ? "Customer Name" : "Vendor Name",
//     filterable: true,
//     sortable: true,
//   },
//   {
//     fieldName: "todays_amount",
//     label: "Current",
//     filterable: true,
//     displayTemplate: (row) => {
//       return getAmountFormart(row["todays_amount"], {
//         appendSymbol: false,
//       });
//     },
//   },
//   {
//     fieldName: "thirty_days_amount",
//     label: "1-30 Days",
//     filterable: true,
//     displayTemplate: (row) => {
//       return getAmountFormart(row["thirty_days_amount"], {
//         appendSymbol: false,
//       });
//     },
//   },
//   {
//     fieldName: "sixty_days_amount",
//     label: "31-60 Days",
//     filterable: true,
//     displayTemplate: (row) => {
//       return getAmountFormart(row["sixty_days_amount"], {
//         appendSymbol: false,
//       });
//     },
//   },
//   {
//     fieldName: "ninety_days_amount",
//     label: "61-90 Days",
//     filterable: true,
//     displayTemplate: (row) => {
//       return getAmountFormart(row["ninety_days_amount"], {
//         appendSymbol: false,
//       });
//     },
//   },
//   {
//     fieldName: "above_ninety_days_amount",
//     label: "Over 90 Days",
//     filterable: true,
//     displayTemplate: (row) => {
//       return getAmountFormart(row["above_ninety_days_amount"], {
//         appendSymbol: false,
//       });
//     },
//   },
//   {
//     fieldName: "balance",
//     label: "Balance",
//     filterable: true,
//     displayTemplate: (row) => {
//       return getAmountFormart(row["balance"], {
//         appendSymbol: false,
//       });
//     },
//   },
// ]
