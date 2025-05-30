import React, { useState } from "react";
// import { AlgaehAutoComplete } from "algaeh-react-components";
import { Spin } from "antd";
import { newAlgaehApi } from "../../../hooks";
// import ReactToPrint from "react-to-print";
import Filter from "../filter";
import TrailTable from "./TrailbalanceTable";
// import TrailTree from "./TrailBalanceTree";
import moment from "moment";

export default function TrailBalance({ layout, dates, finOptions }) {
  const [type] = useState("table");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [arabic, setArabic] = useState(false);
  const [nonZero, setNonZero] = useState("N");
  const [showLastrecord, setShowLastRecord] = useState("N");
  const [level, setLevel] = useState("ALL");
  const [showLedgerCode, setLedgerCode] = useState(false);
  // const createPrintObject = useRef(undefined);

  // useEffect(() => {
  //   async function getData() {
  //     const input = {
  //       hospital_id: finOptions.default_branch_id,
  //       cost_center_id: finOptions.default_cost_center_id,
  //       from_date: dates[0],
  //       to_date: dates[1],
  //     };
  //     if (type === "tree") {
  //       input.old = "Y";
  //     }
  //     const result = await newAlgaehApi({
  //       module: "finance",
  //       data: { ...input },
  //       uri: "/financeReports/getTrialBalance",
  //     });
  //     setData(result.data.result);
  //   }
  //   if (finOptions && dates.length) {
  //     setLoading(true);
  //     getData()
  //       .then(() => setLoading(false))
  //       .catch((e) => setLoading(false));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [type, dates]);

  async function getData(
    ACCOUNTS,
    drillDownLevel,
    dates,
    non_zero,
    last_record
  ) {
    const input = {
      hospital_id: finOptions.default_branch_id,
      cost_center_id: finOptions.default_cost_center_id,
      from_date: moment(dates[0]).format("YYYY-MM-DD"),
      to_date: moment(dates[1]).format("YYYY-MM-DD"),
      non_zero,
      ACCOUNTS,
      drillDownLevel,
      last_record,
    };
    if (type === "tree") {
      input.old = "Y";
    }
    const result = await newAlgaehApi({
      module: "finance",
      data: { ...input },
      uri: "/financeReports/getTrialBalance",
    });
    setData(result.data.result);
  }
  // if (finOptions && dates.length) {
  //   setLoading(true);
  //   getData()
  //     .then(() => setLoading(false))
  //     .catch((e) => setLoading(false));
  // }
  function renderReport() {
    function filterBuilder(existing, updated) {
      const newFilter = existing.concat(updated);
      return newFilter;
    }
    // if (data) {
    if (type === "table") {
      return (
        <>
          <div className="row inner-top-search trialBalance">
            <Filter
              filters={[
                filterBuilder(
                  [
                    {
                      className: "col-2 form-group",
                      type: "AC",
                      data: "ACCOUNTS",
                      initalStates: "1",
                    },
                    {
                      className: "col-2 form-group",
                      type: "AC",
                      data: "LEVELS",
                      initalStates: "2",
                    },

                    {
                      className: "col-3 form-group",
                      type: "DH|RANGE",
                      data: "YEAR",
                      title: "RANGE",
                      maxDate: moment(),
                      initalStates: [moment().startOf("month"), moment()],
                      onChange: (selected, val, cb) => {
                        if (filter.length > 0) {
                          const frdt = selected[0].clone();
                          const tdt = selected[1].clone();
                          const previousfrom = frdt.subtract(1, "years");
                          const previousto = tdt.subtract(1, "years");
                          cb({
                            PREVIOUSRANGE: [previousfrom, previousto],
                            RANGE: selected,
                          });
                        } else {
                          cb({ RANGE: selected });
                        }
                      },
                    },
                    {
                      className: "col-2 formgroup finCusCheckBox",
                      type: "CH",
                      data: "Non Zero amount",
                      checkText: "Yes",
                      labelText: "Hide Zero Account",
                    },
                    {
                      className: "col-2 formgroup finCusCheckBox",
                      type: "CH",
                      data: "Show Ledger Code",
                      checkText: "Yes",
                      labelText: "Show Ledger Code",
                    },
                    {
                      className: "col-2 formgroup finCusCheckBox",
                      type: "CH",
                      data: "Arabic",
                      checkText: "Yes",
                      labelText: "Show Account Name in Arabic",
                    },
                    {
                      className: "col-2 formgroup finCusCheckBox",
                      type: "CH",
                      data: "Show Last Record",
                      checkText: "Yes",
                      labelText: "Show Last Record",
                    },
                  ],
                  []
                ),
              ]}
              callBack={(inputs, cb) => {
                const {
                  ACCOUNTS,
                  LEVELS,
                  RANGE,
                  NONZEROAMOUNT,
                  ARABIC,
                  SHOWLEDGERCODE,
                  SHOWLASTRECORD,
                } = inputs;

                setSelectedDates(RANGE);
                setLoading(true);
                setNonZero(NONZEROAMOUNT);
                setShowLastRecord(SHOWLASTRECORD);
                setArabic(ARABIC === "Y" ? true : false);
                setLedgerCode(SHOWLEDGERCODE === "Y" ? true : false);
                setLevel(LEVELS);
                getData(ACCOUNTS, LEVELS, RANGE, NONZEROAMOUNT, SHOWLASTRECORD)
                  .then(() => {
                    setLoading(false);
                    cb();
                  })
                  .catch((e) => {
                    setLoading(false);
                    cb();
                  });
              }}
            ></Filter>
          </div>
          <TrailTable
            data={data}
            layout={layout}
            dates={selectedDates}
            showArabic={arabic}
            showLedgerCode={showLedgerCode}
            nonZero={nonZero}
            showLastrecord={showLastrecord}
            levels={level}
            showLastrecord={showLastrecord}
            // createPrintObject={createPrintObject}
          />
        </>
      );
    } else {
      return (
        <></>
        // <TrailTree
        //   data={data}
        //   layout={layout}
        //   createPrintObject={createPrintObject}
        // />
      );
    }
    // } else {
    //   return null;
    // }
  }

  return <Spin spinning={loading}>{renderReport()}</Spin>;
}
