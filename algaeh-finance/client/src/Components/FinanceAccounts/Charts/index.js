import React, { memo } from "react";
import {
  ComposedChart,
  Line,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { Empty, Icon } from "algaeh-react-components";
export default memo(function(props) {
  const { data, xAxis, yAxisBar, yAxisLine } = props;
  return (
    <div style={{ width: "100%", height: 210 }}>
      {data.length === 0 ? (
        <Empty
          image={
            <Icon
              type="bar-chart"
              style={{ fontSize: "115px", color: "#08c" }}
            />
          }
        />
      ) : (
        <ResponsiveContainer>
          <ComposedChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxisBar} barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey={yAxisLine} stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      )}{" "}
    </div>
  );
});
