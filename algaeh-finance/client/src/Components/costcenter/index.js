import React, { useEffect, useState, forwardRef } from "react";
import "./costcenter.scss";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid
} from "algaeh-react-components";
import { algaehApiCall } from "../../utils/algaehApiCall";
export default forwardRef(function CostCenter(props, ref) {
  const { div, result, noborder } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadBranch, setLoadBranch] = useState(false);
  const [costCenter, setCostCenter] = useState(undefined);
  const [hims_d_hospital_id, setHims_d_hospital_id] = useState(undefined);
  const [branch, setBranch] = useState([]);
  useEffect(() => {
    setLoadBranch(true);
    algaehApiCall({
      uri: `/organization/getOrganizationByUser`,
      method: "GET",
      onSuccess: response => {
        setLoadBranch(false);
        if (response.data.success === true) {
          setBranch(response.data.records);
        }
      },
      onCatch: error => {
        setLoadBranch(false);
        console.log("error", error);
      }
    });
  }, []);

  function onChangeHospitalId(hospitalID) {
    setLoading(true);
    algaehApiCall({
      uri: `/finance_masters/getCostCenters`,
      data: { hims_d_hospital_id: hospitalID },
      method: "GET",
      module: "finance",
      onSuccess: response => {
        setLoading(false);
        if (response.data.success === true) {
          setData(response.data.result);
        }
      },
      onCatch: error => {
        setLoading(false);
        console.log("error", error);
      }
    });
  }

  return (
    <div ref={ref}>
      <div
        className="row inner-top-search margin-bottom-15"
        style={{ paddingBottom: 10 }}
      >
        <div className="col-3">
          <AlgaehAutoComplete
            div={{ ...div }}
            label={{ forceLabel: "Select a Project" }}
            selector={{
              dataSource: {
                data: branch,
                valueField: "hims_d_hospital_id",
                textField: "hospital_name"
              },
              value: hims_d_hospital_id,
              onChange: (details, value) => {
                setHims_d_hospital_id(value);
                result["hospital_id_label"] = details["hospital_name"];
                result["hospital_id"] = value;
                onChangeHospitalId(value);
              },
              others: {
                loading: loadBranch
              }
            }}
          />
        </div>
        <div className="col-3">
          <AlgaehAutoComplete
            div={{ ...div }}
            label={{ forceLabel: "Select a Cost Center" }}
            selector={{
              dataSource: {
                data: data,
                valueField: "cost_center_id",
                textField: "cost_center"
              },
              value: costCenter,
              onChange: (details, value) => {
                setCostCenter(value);
                result["cost_center_id_label"] = details["cost_center"];
                result["cost_center_id"] = value;
              },
              others: {
                loading: loading
              }
            }}
          />
        </div>
        <div className="col" style={{ paddingTop: 16 }}>
          <button className="btn btn-default">Clear</button>
          <button className="btn btn-primary" style={{ marginLeft: 10 }}>
            Add to List
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">List of Cost Center</h3>
              </div>{" "}
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <AlgaehDataGrid
                columns={[
                  {
                    key: "id",
                    title: "Sl No.",
                    sortable: true,
                    filtered: false
                  },
                  {
                    key: "desc",
                    title: "Branch",
                    filtered: true,
                    align: "left",
                    editorTemplate: (text, records) => {
                      return (
                        <input
                          type="text"
                          value={text}
                          onChange={e => {
                            console.log("text", text);
                            console.log("records", records);
                            records["title"] = "Hello";
                          }}
                        />
                      );
                    }
                  },
                  {
                    key: "debitAmt",
                    title: "Cost Center",
                    filtered: true,
                    align: "left",
                    editorTemplate: (text, records) => {
                      return (
                        <input
                          type="number"
                          value={text}
                          onChange={e => {
                            console.log("text", text);
                            console.log("records", records);
                            records["title"] = "Hello";
                          }}
                        />
                      );
                    }
                  }
                ]}
                loading={false}
                isEditable={false}
                filter={false}
                dataSource={{
                  data: []
                }}
                rowUnique="id"
                xaxis={1500}
                showCheckBox={{}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
