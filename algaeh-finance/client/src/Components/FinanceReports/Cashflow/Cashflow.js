import React, { useRef, useEffect, useState } from "react";
import moment from "moment";
import { getItem, tokenDecode } from "algaeh-react-components/storage";
import jwtDecode from "jwt-decode";
import { newAlgaehApi } from "../../../hooks";
import {
  AlgaehMessagePop,
  AlgaehAutoComplete,
  Button,
} from "algaeh-react-components";
import Details from "./detailreport";
export function Cashflow({ dates, layout }) {
  const [organisation, setOrganisation] = useState({});
  const [displayColumn, setDisplayColumn] = useState("T");
  useEffect(() => {
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
  }, []);

  const { organization_name, address1, address2, full_name } = organisation;
  return (
    <div className="row">
      <div className="col-12">
        <AlgaehAutoComplete
          div={{ className: "col-4" }}
          label={{
            forceLabel: "Display Columns by",
            isImp: true,
          }}
          selector={{
            name: "display_columnc_by",
            value: displayColumn,
            dataSource: {
              data: [
                { name: "Total Only", value: "T" },
                { name: "By Months", value: "M" },
                { name: "By Years", value: "Y" },
              ],
              valueField: "value",
              textField: "name",
            },
          }}
        />
        <Button type="primary">Generate Report</Button>
      </div>
      <div className="col-12">
        <div className="financeReportHeader">
          <div>{organization_name}</div>
          <div>
            {address1}, {address2}
          </div>
          <hr></hr>
          <h3>Cashflow Report</h3>
          <p>
            As on: <b>{moment(dates[1]).format("D/M/Y")}</b>
          </p>
        </div>
      </div>
      <div className="col-12">
        <Details />
      </div>
    </div>
  );
}
