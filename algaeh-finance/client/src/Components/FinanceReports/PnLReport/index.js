import React, { useEffect, useState } from "react";
import {
  AlgaehMessagePop,
  AlgaehButton,
  AlgaehAutoComplete
} from "algaeh-react-components";
import ByYear from "./pandLYear";
import ByCostCenter from "./pandLCostCenter";
import PnLTree from "./PnLTree";
import { newAlgaehApi } from "../../../hooks";
import { getYears } from "../../../utils/GlobalFunctions";
import { handleFile } from "../FinanceReportEvents";
import { Button } from "antd/es/radio";
const yearList = getYears();

export default function PnLReport({ layout, finOptions, organization, style }) {
  const [columnType, setColumnType] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [costCenters, setCostCenters] = useState([]);
  const [branch_id, setBranchID] = useState(finOptions.default_branch_id);
  const [cost_center_id, setCostCenterId] = useState(
    finOptions.default_cost_center_id
  );
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (branch_id) {
      const [required] = organization.filter(
        el => el.hims_d_hospital_id === parseInt(branch_id, 10)
      );
      setCostCenters(required.cost_centers);
    }
  }, [branch_id]);

  function handleDropDown(_, value, name) {
    switch (name) {
      case "branch_id":
        setBranchID(value);
        break;
      case "cost_center_id":
        setCostCenterId(value);
        break;
      case "year":
        setYear(value);
        break;
      case "columnType":
        setData(null);
        setColumnType(value);
        break;
      default:
        break;
    }
  }

  function handleResponse(response, excel) {
    if (excel) {
      handleFile(response.data, columnType);
    } else {
      setData(response.data.result);
    }
  }

  function loadReportByYear(excel) {
    const input = {
      hospital_id: branch_id,
      cost_center_id,
      year
    };
    let extraHeaders = {};
    let others = {};
    if (excel) {
      extraHeaders = {
        Accept: "blob"
      };
      others = { responseType: "blob" };
      input.excel = true;
    }
    newAlgaehApi({
      uri: "/financeReports/getProfitAndLossMonthWise",
      module: "finance",
      data: input,
      extraHeaders,
      options: others
    })
      .then(response => {
        handleResponse(response, excel);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        AlgaehMessagePop({
          type: "error",
          display: error
        });
      });
  }

  function loadByCostCenter(excel) {
    let extraHeaders = {};
    let others = {};
    let input = {};
    if (excel) {
      extraHeaders = {
        Accept: "blob"
      };
      others = { responseType: "blob" };
      input.excel = true;
    }
    newAlgaehApi({
      uri: "/financeReports/getProfitAndLossCostCenterWise",
      module: "finance",
      data: input,

      extraHeaders,
      options: others
    })
      .then(response => {
        handleResponse(response, excel);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        AlgaehMessagePop({
          type: "error",
          display: error
        });
      });
  }

  function loadByTotal(excel) {
    const input = {
      hospital_id: branch_id,
      cost_center_id
    };
    let extraHeaders = {};
    let others = {};
    if (excel) {
      extraHeaders = {
        Accept: "blob"
      };
      others = { responseType: "blob" };
      input.excel = true;
    }
    newAlgaehApi({
      uri: "/financeReports/getProfitAndLoss",
      module: "finance",
      data: input,
      extraHeaders,
      options: others
    })
      .then(response => {
        handleResponse(response, excel);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        AlgaehMessagePop({
          type: "error",
          display: error
        });
      });
  }

  function onLoad(e) {
    const name = e.target.getAttribute("data-name");
    const isExcel = name === "excel";
    setLoading(true);
    if (columnType === "by_year") {
      loadReportByYear(isExcel);
    } else if (columnType === "by_center") {
      loadByCostCenter(isExcel);
    } else if (columnType === "total") {
      loadByTotal(isExcel);
    } else {
      return;
    }
  }

  // function loadExcel() {
  //   if (columnType) {
  //     downloadExcel({
  //       selected: columnType,
  //       inputParam: {
  //         hospital_id: branch_id,
  //         cost_center_id: cost_center_id,
  //         year: year
  //       }
  //     })
  //       .then(response => {
  //         handleFile(response.data, columnType);
  //       })
  //       .catch(error => {
  //         const { message } = error;
  //         AlgaehMessagePop({
  //           type: "error",
  //           display: message !== "" ? message : error.data.message
  //         });
  //       });
  //   }
  // }

  function Content() {
    switch (columnType) {
      case "by_year":
        return <ByYear data={data} />;
      case "by_center":
        return <ByCostCenter data={data} />;
      case "total":
        return <PnLTree data={data} layout={layout} style={style} />;
    }
  }

  return (
    <>
      {/* <Button onClick={loadExcel}>Excel</Button> */}
      <div className="row">
        <AlgaehAutoComplete
          div={{ className: "col-3" }}
          label={{
            forceLabel: "Based on",
            isImp: true
          }}
          selector={{
            name: "columnType",
            value: columnType,
            dataSource: {
              data: [
                {
                  name: "Year",
                  value: "by_year"
                },
                {
                  name: "Cost Center",
                  value: "by_center"
                },
                {
                  name: "Total",
                  value: "total"
                }
              ],
              valueField: "value",
              textField: "name"
            },
            onChange: handleDropDown
          }}
        />
      </div>
      <div className="row inner-top-search" style={{ paddingBottom: 20 }}>
        <i
          className="fas fa-file-download"
          onClick={onLoad}
          disabled={!columnType}
          data-name="excel"
        />
        <AlgaehAutoComplete
          div={{ className: "col-3" }}
          label={{
            forceLabel: "Branch",
            isImp: true
          }}
          selector={{
            value: String(branch_id),
            name: "branch_id",
            dataSource: {
              data: organization,
              valueField: "hims_d_hospital_id",
              textField: "hospital_name"
            },
            onChange: handleDropDown
          }}
        />
        <AlgaehAutoComplete
          div={{ className: "col-3" }}
          label={{
            forceLabel: "Cost Center",
            isImp: true
          }}
          selector={{
            name: "cost_center_id",
            value: String(cost_center_id),
            dataSource: {
              data: costCenters,
              valueField: "cost_center_id",
              textField: "cost_center"
            },
            onChange: handleDropDown
          }}
        />
        <AlgaehAutoComplete
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Year",
            isImp: true
          }}
          selector={{
            name: "year",
            value: year,
            dataSource: {
              data: yearList,
              valueField: "value",
              textField: "name"
            },
            onChange: handleDropDown
          }}
        />
        <AlgaehButton
          className="btn btn-primary"
          onClick={onLoad}
          disabled={!columnType}
          data-name="preview"
          style={{ marginTop: 15 }}
        >
          Preview
        </AlgaehButton>
        {/* <AlgaehButton
          className="btn btn-default"
       
          name="excel"
          style={{ marginTop: 15 }}
        >
          Download Excel
        </AlgaehButton> */}
      </div>
      {!data ? (
        <div style={{ textAlign: "center" }}>
          <i
            className="fas fa-filter"
            style={{
              fontSize: "4rem",
              margin: "50px 0 20px",
              color: "rgb(204, 204, 204)"
            }}
          ></i>
          <p
            style={{
              fontSize: "1rem"
            }}
          >
            Apply filter and click load
          </p>
        </div>
      ) : (
        <>
          {" "}
          <Content />
        </>
      )}
    </>
  );
}
