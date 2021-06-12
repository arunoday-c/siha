import React, { memo, useState, useEffect, useContext } from "react";
import "./labSMS.scss";
import {
  AlgaehDataGrid,
  Spin,
  AlgaehLabel,
  Checkbox,
} from "algaeh-react-components";
import Records from "./records";
// import _ from "lodash";
import { useQuery } from "react-query";
import { swalMessage } from "../../../utils/algaehApiCall";
import { getValidatedResult } from "./events";
import { LabContext } from "./";
export default memo(function ValidateList(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setLabState, TRIGGER_LOAD } = useContext(LabContext);
  useEffect(() => {
    if (props.from_date && props.to_date && props.status) {
      setLoading(true);
    }
  }, [props.from_date, props.to_date, props.status]);
  useEffect(() => {
    setLoading(false);
    setLabState({
      TOTAL_RECORDS: data.length,
    });
  }, [data]);

  const { refetch } = useQuery(
    [
      "validateList",
      { from_date: props.from_date, to_date: props.to_date, status: "V" },
    ],
    getValidatedResult,
    {
      onError: (error) => {
        setLoading(false);
        setLabState({ TRIGGER_LOAD: undefined });
        swalMessage({ type: "error", title: error });
      },
      onSuccess: (result) => {
        // let dataSet = [];

        // _.chain(result)
        //   .groupBy((g) => g.patient_id)
        //   .forEach((detail) => {
        //     const nonPCR = _.chain(detail)
        //       .filter((f) => f.isPCR === "N")
        //       .maxBy((m) => m.validated_date)
        //       .value();
        //     const PCR = _.chain(detail)
        //       .filter((f) => f.isPCR === "Y")
        //       .maxBy((m) => m.validated_date)
        //       .value();
        //     if (nonPCR) {
        //       dataSet.push(nonPCR);
        //     }
        //     if (PCR) {
        //       dataSet.push(PCR);
        //     }
        //   })
        //   .value();
        setLabState({ TRIGGER_LOAD: undefined });
        setData(result);
      },
    }
  );
  useEffect(() => {
    if (TRIGGER_LOAD) {
      refetch();
    }
  }, [TRIGGER_LOAD]);
  function onSelectAll(e) {
    const check_state = e.target.checked;
    setLoading(true);
    const _data = data.map((item) => {
      return { ...item, selected: check_state };
    });
    setData(_data);
    setLabState({
      SELECTED_RECORDS: check_state === true ? _data.length : 0,
    });
  }

  return (
    <Spin tip="Please Wait..." spinning={loading}>
      <div className="row">
        <div className="col-lg-12">
          <div
            className="portlet portlet-bordered margin-bottom-15"
            id="labSMSGrid"
          >
            <AlgaehDataGrid
              columns={[
                {
                  fieldName: "selected",
                  label: <Checkbox onChange={onSelectAll} />,
                  displayTemplate: (row) => <CheckCol row={row} />,
                  others: {
                    width: 40,
                    style: { textAlign: "center" },
                  },
                },
                {
                  fieldName: "ordered_date",
                  label: <AlgaehLabel label={{ fieldName: "ordered_date" }} />,
                  filterable: true,
                  others: {
                    width: 150,
                    style: { textAlign: "center" },
                  },
                },
                {
                  fieldName: "primary_id_no",
                  label: <AlgaehLabel label={{ fieldName: "primary_id_no" }} />,
                  filterable: true,
                  others: {
                    width: 150,
                    style: { textAlign: "center" },
                  },
                },
                {
                  fieldName: "patient_code",
                  label: <AlgaehLabel label={{ fieldName: "patient_code" }} />,
                  filterable: true,
                  others: {
                    width: 150,
                    style: { textAlign: "center" },
                  },
                },
                {
                  fieldName: "full_name",
                  label: <AlgaehLabel label={{ fieldName: "patient_name" }} />,
                  filterable: true,
                  others: {
                    style: { textAlign: "left" },
                  },
                },
                {
                  fieldName: "contact_no",
                  label: <AlgaehLabel label={{ fieldName: "contact_no" }} />,
                  filterable: true,
                  others: {
                    style: { textAlign: "center" },
                  },
                },
                // {
                //   fieldName: "years",
                //   label: <AlgaehLabel label={{ fieldName: "Age" }} />,
                // },
                // {
                //   fieldName: "gender",
                //   label: <AlgaehLabel label={{ fieldName: "Gender" }} />,
                // },
                {
                  fieldName: "service_name",
                  label: <AlgaehLabel label={{ fieldName: "service_name" }} />,
                  filterable: true,
                  others: {
                    style: { textAlign: "left" },
                  },
                },
                {
                  fieldName: "isPCR",
                  label: <AlgaehLabel label={{ fieldName: "IS PCR" }} />,
                  displayTemplate: (row) => {
                    return row.isPCR === "Y" ? "YES" : "NO";
                  },
                  filterable: true,
                  filterType: "choices",
                  choices: [
                    {
                      name: "Yes",
                      value: "Y",
                    },
                    {
                      name: "No",
                      value: "N",
                    },
                  ],
                  others: {
                    width: 100,
                    style: { textAlign: "center" },
                  },
                },

                {
                  fieldName: "critical_status",
                  label: <AlgaehLabel label={{ forceLabel: "Is Critical" }} />,
                  displayTemplate: (row) => {
                    return row.critical_status === "Y" ? "YES" : "NO";
                  },
                  filterable: true,
                  filterType: "choices",
                  choices: [
                    {
                      name: "Yes",
                      value: "Y",
                    },
                    {
                      name: "No",
                      value: "N",
                    },
                  ],
                  others: {
                    width: 100,
                    style: { textAlign: "center" },
                  },
                },
              ]}
              data={data}
              isFilterable={true}
              pagination={true}
              pageOptions={{ rows: 100, page: 1 }}
            />
          </div>
        </div>{" "}
      </div>
      <Records {...props} data={data} />
    </Spin>
  );
});

function CheckCol(props) {
  const [checked, setChecked] = useState(props.row?.selected);
  const { setLabState, SELECTED_RECORDS } = useContext(LabContext);
  useEffect(() => {
    setChecked(props.row?.selected);
  }, [props.row?.selected]);
  return (
    <Checkbox
      checked={checked}
      onChange={(e) => {
        const _checked = e.target.checked;
        setChecked(_checked);
        if (_checked === false) {
          const rec = SELECTED_RECORDS - 1;
          setLabState({ SELECTED_RECORDS: rec < 0 ? 0 : rec });
        } else {
          setLabState({ SELECTED_RECORDS: SELECTED_RECORDS + 1 });
        }

        props.row.selected = _checked;
      }}
    />
  );
}
