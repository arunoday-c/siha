import React, { useRef, useEffect, useState } from "react";
import { Row, Col } from "antd";
import moment from "moment";
import ReactToPrint from "react-to-print";
import { PlotUI } from "./plotui";
import { newAlgaehApi } from "../../../hooks";
import { handleFile } from "../FinanceReportEvents";
import { AlgaehMessagePop } from "algaeh-react-components";
import { getItem, tokenDecode } from "algaeh-react-components";
import jwtDecode from "jwt-decode";
export default function BalanceSheet({
  style,
  footer,
  layout,
  dates,
  selectedFilter,
}) {
  const createPrintObject = useRef(undefined);
  const [data, setData] = useState([]);
  // const [hospitalDetails, setHospitalDeytails] = useState([]);
  const [organisation, setOrganisation] = useState({});
  useEffect(() => {
    loadBalanceSheet();
    // getItem("token").then((result) => {
    //   const details = jwtDecode(result);
    //   setHospitalDeytails(details);
    // });

    newAlgaehApi({
      uri: "/organization/getMainOrganization",
      method: "GET",
    })
      .then((result) => {
        const { records, success, message } = result.data;
        if (success === true) {
          setOrganisation(records);
        } else {
          AlgaehMessagePop({
            display: message,
            type: "error",
          });
        }
      })
      .catch((error) => {
        AlgaehMessagePop({
          display: error.message,
          type: "error",
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates]);

  const { organization_name, address1, address2, full_name } = organisation;
  // .then(([detailResult]) => {
  //   debugger;
  //   const headerToken = detailResult.length > 0 ? detailResult[0] : "";
  //   const userTokenDetails =
  //     headerToken !== "" ? tokenDecode(headerToken) : {};
  //   setHospitalDeytails(userTokenDetails);
  //   return;
  // });

  // // Promise.all([getItem("token")])
  //   .then((detailResult) => {
  //     // const myIP = getNewLocalIp();
  //     const headerToken = detailResult.length > 0 ? detailResult[0] : "";
  //     const userTokenDetails =
  //       headerToken !== "" ? tokenDecode(headerToken) : {};
  //     const x_branch = userTokenDetails.hims_d_hospital_id;
  //     setHospitalDeytails(userTokenDetails);

  //     return;
  // //   })
  //   .catch((error) => {
  //     console.error("error", error);
  //   });

  function loadBalanceSheet(excel) {
    let extraHeaders = {};
    let others = {};
    if (excel === true) {
      extraHeaders = {
        Accept: "blob",
      };
      others = { responseType: "blob" };
    }
    newAlgaehApi({
      uri: "/financeReports/getBalanceSheet",
      module: "finance",
      data: {
        from_date: dates[0],
        to_date: dates[1],
        excel,
      },
      extraHeaders,
      options: others,
    })
      .then((res) => {
        if (excel) {
          handleFile(res.data, "balance_sheet");
        } else {
          setData(res.data.result);
        }
      })
      .catch((e) => {
        AlgaehMessagePop({
          title: "error",
          display: e.message,
        });
      });
  }

  return (
    <>
      <div className="row">
        <div className="col-12 reportHeaderAction">
          <span>
            <i
              className="fas fa-file-download"
              onClick={() => loadBalanceSheet(true)}
            />
          </span>
          <span>
            <ReactToPrint
              trigger={() => <i className="fas fa-print" />}
              content={() => createPrintObject.current}
              removeAfterPrint={true}
              bodyClass="reportPreviewSecLeft"
              pageStyle="@media print {
              html, body {
                height: initial !important;
                overflow: initial !important;
                -webkit-print-color-adjust: exact;
              }
            }
            
            @page {
              size: auto;
              margin: 20mm;
            }"
            />
          </span>
        </div>
      </div>

      {/* <AlgaehButton
        onClick={() => loadBalanceSheet(true)}
        className="btn btn-default"
      >
        Download Excel
      </AlgaehButton> */}

      {/* <div className="row inner-top-search">
        <AlgaehDateHandler
          div={{
            className: "col-3 algaeh-date-fld"
          }}
          label={{
            forceLabel: "Select Date",
            isImp: true
          }}
          textBox={{
            name: "date",
            className: "form-control",
            value: date
          }}
          events={{
            onChange: momentDate => {
              if (momentDate) {
                setDate(momentDate._d);
              } else {
                setDate(undefined);
              }
            }
          }}
        />
      </div> */}
      <div ref={createPrintObject}>
        <div className="financeReportHeader">
          <div>
            {organization_name}
            {/* Twareat Medica.l Centre */}
          </div>
          <div>
            {address1}, {address2}
            {/* Al Fanar Mall، 1 Street, Ar Rawabi, Al Khobar 34421, Saudi Arabia */}
          </div>
          <hr></hr>

          <h3>Balance Sheet</h3>

          <p>
            As on: <b>{moment(dates[0]).format("D/M/Y")}</b> to{" "}
            <b>{moment(dates[1]).format("D/M/Y")}</b>
          </p>
        </div>
        <div className="reportBodyArea">
          <Row gutter={[8, 8]}>
            <Col span={layout.col}>
              <div className="reportTableStyle">
                <ul className="treeListUL">
                  {PlotUI(data["liabilities"], style, [0], layout.expand)}
                </ul>
              </div>
            </Col>{" "}
            <Col span={layout.col}>
              <div className="reportTableStyle">
                <ul className="treeListUL">
                  {PlotUI(data["asset"], style, [0], layout.expand)}
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="reportTotalArea">
          <table style={{ width: "100%" }}>
            <tbody>
              <tr className="footerTotalArea">
                <td style={{ width: "100%" }} valign="top">
                  <b> {null}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
