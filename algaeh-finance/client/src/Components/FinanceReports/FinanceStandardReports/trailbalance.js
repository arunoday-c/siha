import React, { useRef, useState, useEffect } from "react";
import { AlgaehTable } from "algaeh-react-components";
import moment from "moment";
import { getItem, tokenDecode } from "algaeh-react-components/storage";
import jwtDecode from "jwt-decode";
import { dateFomater } from "../../../utils/algaehApiCall";

export default function TrailBalaceReport({
  style,
  data,
  nonZero = true,
  layout,
}) {
  const [hospitalDetails, setHospitalDeytails] = useState([]);
  useEffect(() => {
    getItem("token").then((result) => {
      const details = jwtDecode(result);
      setHospitalDeytails(details);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { asset, expense, liability, capital, income } = data;
  const accounts = [asset, expense, liability, capital, income];
  if (data.asset) {
    return (
      <>
        <div>
          <div className="financeReportHeader">
            <div>
              {hospitalDetails.organization_name}
              {/* Twareat Medical Centre */}
            </div>
            <div>
              {hospitalDetails.hospital_address}

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
