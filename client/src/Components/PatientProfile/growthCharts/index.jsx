import React, { useEffect, useState } from "react";
import { PChart, Dataset } from "pchart";
import { List, Empty } from "antd";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import { AlgaehAutoComplete } from "algaeh-react-components";
import "./growthCharts.scss";
const graphTheme = {
  backdropFill: "#B2EBF2",
  gridColor: "#00ACC1",
  areaColor: "rgba(0,172,193,.4)",
};
const percentiles = [3, 5, 25, 50, 75, 95, 97];
const listData = [
  { label: "Weight", value: "weight" },
  { label: "Height", value: "length" },
  {
    label: "Head Circumference",
    value: "headCircumference",
  },
  { label: "BMI", value: "bmi" },
];
export default function GrowthCharts(props) {
  const [theme, setTheme] = useState(graphTheme);
  const [patientData, setPatientData] = useState([]);
  const [dataSet, setDataSet] = useState(undefined);
  const [type, setType] = useState("");
  useEffect(() => {
    if (props?.patient && props?.patient?.gender !== "Male") {
      setTheme((state) => {
        return {
          ...state,
          gridColor: "#FF2093",
          backdropFill: "#FD94CA",
          areaColor: "#FE4CC5",
        };
      });
    }
  }, [props?.patient]);
  useEffect(() => {
    if (type !== "") {
      algaehApiCall({
        uri: "/vitals/growthChart",
        method: "get",
        module: "clicnicalDesk",
        data: {
          hims_d_patient_id: props.patient?.hims_d_patient_id,
          graphType: type,
          gender: props.patient?.gender === "Male" ? "1" : "2",
        },
        onSuccess: (response) => {
          const { data } = response;
          if (data.success === true) {
            const records = data?.records?.percentiles;
            const dataset = new Dataset(records, percentiles);
            setDataSet(dataset);
            setPatientData(data?.records?.result);
          }
        },
        onCatch: (error) => {
          console.error("Error===>", error);
        },
      });
    }
  }, [type]);
  function onHandleListClick(e) {
    const { dataset } = e.target;
    setType(dataset?.value);
  }

  return (
    <div className="row">
      <div className="col-2">
        <div className="row GrowthManageCntr">
          <p className="GrowthListHdg">
            <b>Select a Chart</b>
          </p>
          <List
            size="md"
            header={false}
            footer={false}
            dataSource={listData}
            bordered={true}
            renderItem={(item) => (
              <List.Item
                key={item.value}
                style={{
                  cursor: "pointer",
                  backgroundColor: `${type === item.value ? "#00a796" : ""}`,
                  color: `${type === item.value ? "#ffffff" : ""}`,
                }}
                onClick={onHandleListClick}
                data-value={item.value}
              >
                {item.label}
              </List.Item>
            )}
          />
        </div>
      </div>

      <div className="col-10">
        <div className="row" style={{ paddingTop: 15 }}>
          <AlgaehAutoComplete
            div={{ className: "col-4 form-group" }}
            label={{ forceLabel: "Select Age Range", isImp: true }}
            selector={{
              disabled: true,
              sort: "off",
              name: "salary_process_date",
              value: "",
              className: "select-fld",
              dataSource: {
                textField: "name",
                valueField: "value",
                data: [],
              },
              // onChange: this.dropDownHandler.bind(this)
            }}
          />

          <div className="col-12">
            {" "}
            {patientData?.length > 0 ? (
              <div className="growthChart">
                <PChart
                  width={900}
                  height={500}
                  dataset={dataSet}
                  patients={{
                    firstname: props.patient?.full_name,
                    sex: props.patient?.gender,
                    birthdate: props.patient?.date_of_birth,
                    measures: patientData,
                  }}
                  theme={theme}
                  showtitle
                  showlabels
                />
              </div>
            ) : (
              <Empty description="There is no vitals data to show" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
