import React, { useRef, useEffect, useState } from "react";
import moment from "moment";
import { getItem, tokenDecode } from "algaeh-react-components/storage";
import jwtDecode from "jwt-decode";

export function Cashflow({ dates, layout }) {
  const [hospitalDetails, setHospitalDeytails] = useState([]);
  useEffect(() => {
    getItem("token").then((result) => {
      const details = jwtDecode(result);
      setHospitalDeytails(details);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <div>
        <div className="financeReportHeader">
          <div>
            {hospitalDetails.organization_name}

            {/* Twareat Medical Centre */}
          </div>
          <div>
            {hospitalDetails.hospital_address}

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
