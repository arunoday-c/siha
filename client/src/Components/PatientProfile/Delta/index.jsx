import React, { useEffect, useState } from "react";
import {
  AlgaehModal,
  AlgaehDateHandler,
  Spin,
  Checkbox,
  AlgaehAutoComplete,
} from "algaeh-react-components";
import { Line } from "@ant-design/charts";
import moment from "moment";
import "./DeltaCheckModal.scss";
import { useQuery } from "react-query";
import {
  getAnalytes,
  getVitalsMaster,
  getInvestigations,
  getPatientVitals,
  getPatientTestResults,
} from "./api";
// import AlgaehAutoSearch from "../../Wrapper/autoSearch";
// import spotlightSearch from "../../../Search/spotlightSearch.json";
import _ from "lodash";
// import AlgaehLoader from "../../Wrapper/fullPageLoader";

export default function DeltaCheck({ visible, onCancel }) {
  const [mode, setMode] = useState("vital");
  const [test_id, setTestId] = useState(null);
  const [dates, setDates] = useState([moment(), moment().subtract(1, "month")]);
  const [, setVitalData] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState([
    [
      { year: "1991", value: 3 },
      { year: "1992", value: 4 },
      { year: "1993", value: 3.5 },
      { year: "1994", value: 5 },
      { year: "1995", value: 4.9 },
      { year: "1996", value: 6 },
      { year: "1997", value: 7 },
      { year: "1998", value: 9 },
      { year: "1999", value: 13 },
    ],
  ]);
  const [selected, setSelected] = useState([]);
  const patient_id = Window?.global?.current_patient;

  const { data: vitals, isLoading: vLoading } = useQuery(
    "vital-master",
    getVitalsMaster,
    {
      initialData: [],
      initialStale: true,
      enabled: visible,
    }
  );

  const { data: patientVitals, isLoading: pvLoading } = useQuery(
    ["patient-vitals", { patient_id }],
    getPatientVitals,
    {
      initialData: [],
      initialStale: true,
      enabled: visible,
      onSuccess: (data) => {
        const grouped = _.groupBy(data, "vital_id");
        setVitalData(grouped);
        // setChartData(data);
      },
    }
  );

  const { data: invesgations, isLoading: inLoading } = useQuery(
    ["investagation", { patient_id }],
    getInvestigations,

    {
      initialData: [],
      initialStale: true,
      enabled: visible,
    }
  );

  const { data: analytes, isLoading: anLoading } = useQuery(
    ["analytes", { test_id }],
    getAnalytes,
    {
      enabled: !!test_id,
      initialData: [],
      initialStale: true,
    }
  );
  const { data: testResult, isLoading: testLoading } = useQuery(
    ["test-results", { test_id, patient_id }],
    getPatientTestResults,
    {
      enabled: !!test_id && !!patient_id && !!visible,
      initialData: [],
      initialStale: true,
    }
  );

  console.log(testResult);

  // const selectItem = (id) => {
  //   setSelected((state) => {
  //     const indx = state?.indexOf(id);
  //     debugger;
  //     if (indx > -1) {
  //       state.splice(indx, 1);
  //     } else {
  //       state.push(id);
  //     }
  //     return state;
  //   });
  // };

  function calculateVitalChart() {
    if (selected.length && patientVitals?.length) {
      const data = [];
      selected.forEach((id) => {
        let vit = patientVitals?.filter((item) => item.vital_id === id);
        vit = vit?.map((item) => ({
          date: item?.visit_date?.split(" ")[0],
          value: parseFloat(item?.vital_value),
          type: item?.vitals_name,
        }));
        vit = vit?.filter((item) =>
          moment(item?.date).isBetween(dates?.[0], dates?.[1])
        );
        data.push(...vit);
      });
      setChartData(data);
      setShowChart(true);
    }
  }

  useEffect(() => {
    if (!visible) {
      setChartData([]);
      setSelected([]);
      setShowChart(false);
      setDates([]);
    }
  }, [visible]);

  // useEffect(() => {
  //   if (selected.length && patientVitals?.length) {
  //     const data = [];
  //     selected.forEach((id) => {
  //       let vit = patientVitals?.filter((item) => item.vital_id === id);
  //       vit = vit?.map((item) => ({
  //         date: item?.visit_date?.split(" ")[0],
  //         value: parseFloat(item?.vital_value),
  //         type: item?.vitals_name,
  //       }));
  //       data.push(...vit);
  //     });
  //     setChartData(data);
  //   }
  // }, [selected, patientVitals]);

  const config = {
    data: chartData,
    title: {
      visible: true,
      text: "Delta Check",
    },
    xField: "date",
    yField: "value",
    padding: "auto",
    forceFit: true,
    responsive: true,
    // yAxis: {
    //   label: {
    //     formatter: (v) =>
    //       `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
    //   },
    // },
    legend: { position: "right-top" },
    seriesField: "type",
    color: ["#1979C9", "#D62A0D", "#FAA219"],
  };

  console.log(patientVitals, "vital");

  return (
    <AlgaehModal
      title="Delta Check"
      visible={visible}
      maskClosable={false}
      width={540}
      closable={true}
      cancelButtonProps={{
        className: "btn btn-default",
      }}
      onCancel={onCancel}
      // onOk={handleSubmit(onSubmit)}
      className={`algaehNewModal DeltaCheckModal`}
    >
      <Spin
        spinning={
          anLoading || vLoading || inLoading || pvLoading || testLoading
        }
      >
        <div className="row popupInner">
          <div className="col-5">
            <div className="popLeftDiv">
              <div className="row">
                <div className="col-12 form-group">
                  <label>View By</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="vital"
                        name="mode"
                        onChange={(e) => setMode(e.target.value)}
                        checked={mode === "vital"}
                      />
                      <span>Vital</span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="investigation"
                        name="mode"
                        onChange={(e) => setMode(e.target.value)}
                        checked={mode === "investigation"}
                      />
                      <span>Investigation</span>
                    </label>
                  </div>
                </div>

                {mode === "investigation" && (
                  <AlgaehAutoComplete
                    div={{ className: "col-12 form-group  " }}
                    label={{ forceLabel: "Select Test", isImp: true }}
                    selector={{
                      dataSource: {
                        data: invesgations,
                        valueField: "hims_d_investigation_test_id",
                        textField: "service_name",
                      },
                      value: test_id,
                      onChange: (_, selected) => setTestId(selected),
                      onClear: () => setTestId(null),
                    }}
                  />
                )}
                <AlgaehDateHandler
                  div={{ className: "col-12 form-group" }}
                  label={{ forceLabel: "From & To Date", isImp: false }}
                  textBox={{
                    className: "txt-fld",
                    name: "recorded_date",
                  }}
                  type="range"
                  // maxDate={}
                  events={{
                    onChange: (e) => setDates(e),
                  }}
                  value={dates}
                />
                <div className="col-12 ">
                  {mode === "vital" ? (
                    <Checkbox.Group
                      options={vitals?.map((item) => ({
                        label: item?.vitals_name,
                        value: item?.hims_d_vitals_header_id,
                      }))}
                      onChange={(e) => setSelected(e)}
                      value={selected}
                    />
                  ) : (
                    <Checkbox.Group
                      options={analytes?.map((item) => ({
                        label: item?.description,
                        value: item?.hims_d_lab_analytes_id,
                      }))}
                      onChange={(e) => setSelected(e)}
                      value={selected}
                    />
                  )}
                  {/* <ul className="dimensionList">
                  {mode === "vital"
                    ? vitals?.map((item) => (
                        <li
                          key={item?.hims_d_vitals_header_id}
                          onClick={(e) =>
                            selectItem(item?.hims_d_vitals_header_id)
                          }
                        >
                          <span className="checkBoxPhy">
                            <input
                              checked={selected?.some(
                                (i) => i === item?.hims_d_vitals_header_id
                              )}
                              type="checkbox"
                            />
                            {selected?.some(
                              (i) => i == item?.hims_d_vitals_header_id
                            ) ? (
                              "checked"
                            ) : (
                              <i className="fas fa-check" />
                            )}
                          </span>
                          <span className="dimensionListName">
                            {item?.vitals_name}
                          </span>
                        </li>
                      ))
                    : analytes?.map((item) => (
                        <li>
                          <span className="checkBoxPhy">
                            <input
                              value={item.hims_d_lab_analytes_id}
                              type="checkbox"
                            />
                            <i className="fas fa-check" />
                          </span>
                          <span className="dimensionListName">
                            {item.description}
                          </span>
                        </li>
                      ))}
                </ul> */}
                </div>
                <div className="col-12" style={{ textAlign: "right" }}>
                  <button className="btn btn-default">Clear</button>
                  <button
                    disabled={!selected.length || !dates?.length}
                    className="btn btn-primary"
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                      calculateVitalChart();
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-7 chartCntr">
            <div className="popRightDiv">
              {showChart ? (
                chartData?.length ? (
                  <div className="row">
                    <div className="col-12">
                      <Line {...config} />
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col">No Data available</div>
                  </div>
                )
              ) : (
                <div className="row">
                  <div className="col">Apply filter to view chart</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Spin>
    </AlgaehModal>
  );
}
