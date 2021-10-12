import React, { memo, useEffect, useState } from "react";
import {
  Spin,
  AlgaehMessagePop,
  // AlgaehTable,
  // AlgaehTable,
  Empty,
} from "algaeh-react-components";
import moment from "moment";
import { newAlgaehApi } from "../../../hooks";
import PrintLayout from "../printlayout";
export default memo(function (props) {
  const { display_column_by, from_date, to_date } = props;
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (
      display_column_by !== undefined &&
      from_date !== undefined &&
      to_date !== undefined
    ) {
      setLoading(true);
      newAlgaehApi({
        uri: "/cashFlowStatement/getCashFlowStatement",
        module: "finance",
        data: {
          display_column_by,
          from_date: moment(from_date).format("YYYY-MM-DD"),
          to_date: moment(to_date).format("YYYY-MM-DD"),
        },
      })
        .then((response) => {
          const { success, records, message } = response.data;
          if (success === true) {
            // const {
            //   columns,
            //   O,
            //   I,
            //   F,
            //   net_operating,
            //   net_investing,
            //   net_financing,
            // } = records;

            // newColumns.unshift({
            //   fieldName: "name",
            //   label: "Name",
            //   freezable: true,
            // });
            // setColumns(newColumns);
            // let detailsData = [];
            // function getOtherObjects(netObject) {
            //   let columnObj = {};
            //   columns.forEach((column) => {
            //     const name = column["colum_id"];
            //     columnObj[name] = netObject[name];
            //   });
            //   return columnObj;
            // }
            // function getRecords(netObject, labelName, children) {
            //   const columnObj = getOtherObjects(netObject);
            //   detailsData.push({
            //     name: labelName,
            //     label: labelName,
            //     ...columnObj,
            //     children,
            //   });
            // }

            // //operating
            // if (O !== undefined) {
            //   getRecords(
            //     net_operating,
            //     "Cash flows from operating activities",
            //     O
            //   );
            // }
            // //investing
            // if (I !== undefined) {
            //   getRecords(
            //     net_investing,
            //     "Cash flows from investing activities",
            //     I
            //   );
            // }
            // //financing
            // if (F !== undefined) {
            //   let labelDef = "Cash flows from financing activities";
            //   if (net_financing["total"] < 0) {
            //     labelDef = "Cash flows in financing activities";
            //   }
            //   getRecords(net_financing, labelDef, F);
            // }
            const { columns, data } = records;
            let newColumns = columns.map((column) => {
              const freeze =
                column.colum_id === "name" ? { freezable: true } : {};
              return {
                fieldName: column.colum_id,
                label: column.label,
                ...freeze,
              };
            });
            setColumns(newColumns);
            setData(data);
            setLoading(false);
          } else {
            setLoading(false);
            AlgaehMessagePop({
              type: "warn",
              display: message,
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          AlgaehMessagePop({
            type: "error",
            display: error.message !== undefined ? error.message : error,
          });
        });
    }
  }, [display_column_by, from_date, to_date]);
  // console.log("columns===>", columns, data);
  return (
    <Spin
      spinning={loading}
      tip="Please wait report data is fetching.."
      delay={500}
    >
      {" "}
      {columns.length === 0 ? (
        <Empty description="No data to show." />
      ) : (
        <PrintLayout
          title="Cash Flow Statement"
          columns={columns}
          data={data}
        />
      )}
    </Spin>
  );
});
