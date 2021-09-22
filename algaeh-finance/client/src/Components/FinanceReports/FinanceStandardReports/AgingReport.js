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
import {
  AlgaehDateHandler,
  AlgaehButton,
  AlgaehFormGroup,
} from "algaeh-react-components";
// import ReportHeader from "../header";
import PrintLayout from "../printlayout";
import { getAmountFormart } from "../../../utils/GlobalFunctions";
import moment from "moment";

export default function AgingReport({ style, result, layout, type, dates }) {
  const DIFF = {
    payable: { url: "getAccountPayableAging", title: "Payable" },
    receivable: { url: "getAccountReceivableAging", title: "Receivable" },
  };

  // const createPrintObject = useRef(undefined);
  const [data, setData] = useState([]);
  const [till_date, setTillDate] = useState(undefined);
  const [date_wise, setDateWise] = useState("N");
  const [footerData, setFooterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [interval, setInterval] = useState(5);
  const [period, setPeriod] = useState(30);
  const [period_list, setPeriodList] = useState([]);

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
    debugger;
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
              fieldName: "0",
              label: "Current",
              filterable: true,
              displayTemplate: (row) => {
                return getAmountFormart(row["0"], {
                  appendSymbol: false,
                });
              },
            },
            {
              fieldName: "1-" + period,
              label: "1-" + period + "Days",
              filterable: true,
              displayTemplate: (row) => {
                return getAmountFormart(row["thirty_days_amount"], {
                  appendSymbol: false,
                });
              },
            },
          ];
          debugger;
          let p_period = period;
          for (let i = 0; i < interval - 3; i++) {
            const before_period = parseInt(p_period) + 1;
            const after_period = parseInt(p_period) + parseInt(period);
            const field_name =
              p_period.toString() + "-" + after_period.toString();
            display_array.push({
              fieldName: field_name,
              label: before_period + "-" + after_period + " Days",
              filterable: true,
              displayTemplate: (row) => {
                return getAmountFormart(row["thirty_days_amount"], {
                  appendSymbol: false,
                });
              },
            });
            p_period = after_period;
          }

          display_array.push(
            {
              fieldName: "OVER-" + p_period,
              label: "Over " + p_period + " Days",
              filterable: true,
              displayTemplate: (row) => {
                return getAmountFormart(row["above_ninety_days_amount"], {
                  appendSymbol: false,
                });
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

  return (
    <>
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

        <AlgaehFormGroup
          div={{
            className: "col-12 form-group  mandatory",
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
            className: "col-12 form-group  mandatory",
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

      {date_wise === "Y" ? (
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
              if (footerData) {
                if (fieldName !== "customer") {
                  return getAmountFormart(footerData[fieldName], {
                    appendSymbol: false,
                  });
                } else {
                  return "";
                }
              }
            },
            footer: true,
          }}
        />
      ) : (
        <PrintLayout
          title={`Account ${
            type === "receivable" ? "Receivable" : "Payable"
          } Aging Report`}
          columns={period_list}
          data={data}
          tableprops={{
            aggregate: (fieldName) => {
              if (footerData) {
                if (fieldName !== "customer") {
                  return getAmountFormart(footerData[fieldName], {
                    appendSymbol: false,
                  });
                } else {
                  return "";
                }
              }
            },
            footer: true,
          }}
        />
      )}
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
