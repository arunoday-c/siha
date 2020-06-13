import React, { useRef, useEffect, useState } from "react";
import moment from "moment";
import { getItem, tokenDecode } from "algaeh-react-components/storage";
import jwtDecode from "jwt-decode";
import { newAlgaehApi } from "../../../hooks";
import { AlgaehMessagePop } from "algaeh-react-components";

export function Cashflow({ dates, layout }) {
  const [organisation, setOrganisation] = useState({});
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { organization_name, address1, address2, full_name } = organisation;
  return (
    <div>
      <div>
        <div className="financeReportHeader">
          <div>
            {organization_name}

            {/* Twareat Medical Centre */}
          </div>
          <div>
            {address1 + address2}

            {/* Al Fanar Mall, 1 Street, Ar Rawabi, Al Khobar 34421, Saudi Arabia */}
          </div>
          <hr></hr>
          <h3>Cashflow Report</h3>
          <p>
            As on: <b>{moment(dates[1]).format("D/M/Y")}</b>
          </p>
        </div>
      </div>
    </div>
  );
}
