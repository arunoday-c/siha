import React, { useRef, useState, useEffect } from "react";
import { AlgaehTable, AlgaehMessagePop } from "algaeh-react-components";
import moment from "moment";
import { getItem, tokenDecode } from "algaeh-react-components/storage";
import jwtDecode from "jwt-decode";
import { dateFomater } from "../../../utils/algaehApiCall";
import { newAlgaehApi } from "../../../hooks";

export default function TrailBalaceReport({
  style,
  data,
  nonZero = true,
  layout,
}) {
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

  const { asset, expense, liability, capital, income } = data;
  const accounts = [asset, expense, liability, capital, income];
  if (data.asset) {
    return (
      <>
        <div>
          <div className="financeReportHeader">
            <div>
              {organization_name}
              {/* Twareat Medical Centre */}
            </div>
            <div>
              {address1}, {address2}
              {/* Al Fanar Mall، 1 Street, Ar Rawabi, Al Khobar 34421, Saudi Arabia */}
            </div>
            <hr></hr>
            <h3>Trail Balance</h3>
            <p>
              As on: <b>{moment().format("D/M/Y")}</b>
            </p>
          </div>
          <div className="reportTableStyle" style={{ border: "none" }}>
            <AlgaehTable
              className="reportGridPlain"
              data={accounts || []}
              columns={[
                {
                  fieldName: "label",
                  label: "Paticulars",
                  filterable: true,
                },
                {
                  fieldName: "op_amount",
                  label: "Opening Balance",
                },
                {
                  fieldName: "tr_debit_amount",
                  label: "Transactions Debit",
                },
                {
                  fieldName: "tr_credit_amount",
                  label: "Transaction Credit",
                },
                {
                  fieldName: "cb_amount",
                  label: "Closing Balance",
                },
              ]}
              isFilterable={true}
              row_unique_id="label"
              expandAll={layout.expand}
            />
          </div>
        </div>
      </>
    );
  }
  return null;
}
