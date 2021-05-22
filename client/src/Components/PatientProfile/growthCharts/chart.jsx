import React from "react";
import { PChart, Dataset } from "pchart";
export default function GChart(props) {
  const dataset = new Dataset(props.percentileValue, props.percentile);
  function randomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i += 1) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  return (
    <PChart
      width={700}
      height={700}
      dataset={dataset}
      patients={{
        firstname: props.patient?.full_name,
        sex: props.patient?.gender,
        birthdate: props.patient?.date_of_birth,
        measures: props.measures,
        color: randomColor(),
      }}
      theme={props.theme}
      showtitle
      showlabels
      showlines
    />
  );
}
