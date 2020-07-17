import React, { useEffect, useState, useContext } from "react";
import {
  AlgaehMessagePop,
  AlgaehButton,
  AlgaehAutoComplete,
} from "algaeh-react-components";
import ByYear from "./pandLYear";
import ByCostCenter from "./pandLCostCenter";
import Comparision from "./comparision";
import PnLTree from "./PnLTree";
import { newAlgaehApi } from "../../../hooks";
import { getYears } from "../../../utils/GlobalFunctions";
import { handleFile } from "../FinanceReportEvents";
import Filter from "../filter";
import moment from "moment";
const yearList = getYears();
export default function PnLReport({
  layout,
  finOptions,
  organization,
  style,
  selectedFilter,
}) {
  const [columnType, setColumnType] = useState("by_year");
  const [year, setYear] = useState(new Date().getFullYear());
  const [previousYear, setPreviousYear] = useState([]);
  const [changeInPercentage, setChangeInPercentage] = useState("N");
  const [changeInAmount, setChangeInAmount] = useState("N");
  const [costCenters, setCostCenters] = useState([]);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [stopLoading, setStopLoading] = useState(undefined);
  const [isExcel, setExcel] = useState(false);
  const [branch_id, setBranchID] = useState(finOptions.default_branch_id);
  const [cost_center_id, setCostCenterId] = useState(
    finOptions.default_cost_center_id
  );
  const [preview, setPreview] = useState(false);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    let isMounted = true;

    if (branch_id) {
      const { filterKey } = selectedFilter;
      if (filterKey !== undefined) {
        if (isMounted) {
          setColumnType(filterKey);
          const newFilter = [];
          if (filterKey === "comparison") {
            newFilter.push({
              className: "col-3 form-group",
              type: "DH|RANGE",
              data: "PREVIOUS RANGE",
              maxDate: moment(),
            });
            newFilter.push({
              className: "col-2 formgroup finCusCheckBox",
              type: "CH",
              data: "Change in Amt.",
            });
            newFilter.push({
              className: "col-2 formgroup finCusCheckBox",
              type: "CH",
              data: "Change in %",
            });
            setFilter(newFilter);
          } else {
            setFilter([]);
          }

          setTriggerUpdate((result) => {
            return !result;
          });
        }
      }
      onChangingBranch(branch_id, isMounted);
    }
  }, [selectedFilter]);

  function onChangingBranch(branchId, isMounted) {
    const bId = branchId === undefined ? branch_id : branchId;

    const [required] = organization.filter(
      (el) => el.hims_d_hospital_id === parseInt(bId, 10)
    );
    if (isMounted) {
      const cstCenter = required.cost_centers;
      setCostCenters(cstCenter);
      const center = cstCenter.find(
        (f) => f.cost_center_id === finOptions.default_cost_center_id
      );
      if (center === undefined) {
        setCostCenterId(undefined);
      }
      // setTriggerUpdate((result) => {
      //   return !result;
      // });
    }
  }

  useEffect(() => {
    if (cost_center_id === undefined) {
      return;
    }
    onLoad();
  }, [preview]);

  function handleResponse(response, excel, dataType) {
    dataType = dataType || "result";
    if (excel) {
      handleFile(response.data, columnType);
    } else {
      setData(response.data[dataType]);
    }
  }

  function loadReportByYear(excel) {
    const input = {
      hospital_id: branch_id,
      cost_center_id,
      year,
    };
    let extraHeaders = {};
    let others = {};
    if (excel) {
      extraHeaders = {
        Accept: "blob",
      };
      others = { responseType: "blob" };
      input.excel = true;
    }
    newAlgaehApi({
      uri: "/financeReports/getProfitAndLossMonthWise",
      module: "finance",
      data: input,
      extraHeaders,
      options: others,
    })
      .then((response) => {
        handleResponse(response, excel);
        if (typeof stopLoading === "function") stopLoading();
      })
      .catch((error) => {
        if (typeof stopLoading === "function") stopLoading();
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });
  }

  function loadByCostCenter(excel) {
    let extraHeaders = {};
    let others = {};
    let input = {};
    if (excel) {
      extraHeaders = {
        Accept: "blob",
      };
      others = { responseType: "blob" };
      input.excel = true;
    }
    newAlgaehApi({
      uri: "/financeReports/getProfitAndLossCostCenterWise",
      module: "finance",
      data: input,

      extraHeaders,
      options: others,
    })
      .then((response) => {
        handleResponse(response, excel);
        if (typeof stopLoading === "function") stopLoading();
      })
      .catch((error) => {
        if (typeof stopLoading === "function") stopLoading();
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });
  }

  function loadByTotal(excel) {
    const input = {
      hospital_id: branch_id,
      cost_center_id,
    };
    let extraHeaders = {};
    let others = {};
    if (excel) {
      extraHeaders = {
        Accept: "blob",
      };
      others = { responseType: "blob" };
      input.excel = true;
    }
    newAlgaehApi({
      uri: "/financeReports/getProfitAndLoss",
      module: "finance",
      data: input,
      extraHeaders,
      options: others,
    })
      .then((response) => {
        handleResponse(response, excel);
        if (typeof stopLoading === "function") stopLoading();
        // setLoading(false);
      })
      .catch((error) => {
        // setLoading(false);
        if (typeof stopLoading === "function") stopLoading();
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });
  }
  function loadByComaprison(excel) {
    let extraHeaders = {};
    let others = {};
    if (excel) {
      extraHeaders = {
        Accept: "blob",
      };
      others = { responseType: "blob" };
      excel = true;
    }
    let from_date = undefined;
    let to_date = undefined;
    let prev_from_date = undefined;
    let prev_to_date = undefined;
    if (Array.isArray(year)) {
      if (year.length > 0) {
        from_date = year[0].format("YYYY-MM-DD");
        if (year.length === 1) to_date = year[1].format("YYYY-MM-DD");
      }
    }
    if (Array.isArray(previousYear)) {
      if (previousYear.length > 0) {
        prev_from_date = previousYear[0].format("YYYY-MM-DD");
        prev_to_date = previousYear[1].format("YYYY-MM-DD");
      }
    }

    newAlgaehApi({
      uri: "/pl_comparison/getPlComparison",
      module: "finance",
      data: {
        from_date,
        to_date,
        prev_from_date,
        prev_to_date,
        change_in_percent: changeInPercentage,
        change_in_amount: changeInAmount,
      },
      extraHeaders,
      options: others,
    })
      .then((response) => {
        handleResponse(response, excel, "records");
        if (typeof stopLoading === "function") stopLoading();
      })
      .catch((error) => {
        if (typeof stopLoading === "function") stopLoading();
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      });
  }
  function onLoad() {
    const { filterKey } = selectedFilter;
    console.log("columnType", columnType);
    console.log("filterKey", filterKey);
    if (columnType === "by_year") {
      loadReportByYear(isExcel);
    } else if (columnType === "by_center") {
      loadByCostCenter(isExcel);
    } else if (columnType === "total") {
      loadByTotal(isExcel);
    } else if (columnType === undefined && filterKey === "comparison") {
      loadByComaprison(isExcel);
    } else {
      return null;
    }
  }

  function Content() {
    let colType = columnType;
    const { filterKey } = selectedFilter;
    if (columnType === undefined && filterKey === "comparison") {
      colType = "comparison";
    }
    switch (colType) {
      case "by_year":
        return <ByYear data={data} layout={layout} />;
      case "by_center":
        return <ByCostCenter data={data} layout={layout} />;
      case "total":
        return <PnLTree data={data} layout={layout} style={style} />;
      case "comparison":
        return <Comparision data={data} layout={layout} />;
      default:
        return null;
        break;
    }
  }
  function onloadReport(inputs, cb) {
    const {
      BASEDON,
      BRANCH,
      COSTCENTER,
      PERIOD,
      YEAR,
      CHANGEINPERCENTAGE,
      CHANGEINAMOUNT,
      PREVIOUSRANGE,
    } = inputs;
    setBranchID(BRANCH);
    setColumnType(BASEDON);
    setCostCenterId(COSTCENTER);
    setYear(YEAR);
    setStopLoading(cb);
    setPreviousYear(PREVIOUSRANGE);
    setChangeInPercentage(CHANGEINPERCENTAGE);
    setChangeInAmount(CHANGEINAMOUNT);
    setPreview((result) => {
      return !result;
    });
  }
  function filterBuilder(existing, updated) {
    const newFilter = existing.concat(updated);
    return newFilter;
  }
  return (
    <>
      <div className="row inner-top-search">
        <Filter
          filters={filterBuilder(
            [
              {
                className: "col-2 form-group",
                type: "AC",
                data: {
                  dataSource: {
                    data: organization,
                    valueField: "hims_d_hospital_id",
                    textField: "hospital_name",
                  },
                },
                title: "Branch",
                initalStates: String(branch_id),
                onChange: (value) => {
                  onChangingBranch(value, true);
                },
              },
              {
                className: "col-2 form-group",
                type: "AC",
                data: "PERIOD",
                initalStates: "TMTD",
                dependent: ["RANGE"],
              },
              {
                className: "col-3 form-group",
                type: "DH|RANGE",
                data: "YEAR",
                title: "RANGE",
                maxDate: moment(),
                initalStates: [moment().startOf("month"), moment()],
              },
              {
                className: "col-2 form-group",
                type: "AC",
                data: {
                  dataSource: {
                    data: costCenters,
                    valueField: "cost_center_id",
                    textField: "cost_center",
                  },
                },
                title: "COST CENTER",
                initalStates:
                  cost_center_id !== undefined
                    ? String(cost_center_id)
                    : cost_center_id,
              },
              {
                className: "col-2 form-group",
                type: "AC",
                data: "BASEDON",
                title: "Based on",
                initalStates:
                  columnType === "comparison" ? undefined : columnType,
              },
            ],
            filter
          )}
          callBack={(inputs, cb) => {
            onloadReport(inputs, cb);
          }}
          triggerUpdate={triggerUpdate}
        />
      </div>

      {!data ? (
        <div style={{ textAlign: "center" }}>
          <i
            className="fas fa-filter"
            style={{
              fontSize: "4rem",
              margin: "50px 0 20px",
              color: "rgb(204, 204, 204)",
            }}
          ></i>
          <p
            style={{
              fontSize: "1rem",
            }}
          >
            Apply filter and click load
          </p>
        </div>
      ) : (
        <>
          <Content />
        </>
      )}
    </>
  );
}
