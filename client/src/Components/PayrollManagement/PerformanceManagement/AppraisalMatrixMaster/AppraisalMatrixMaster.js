import React, { useState, useEffect } from "react";
import "./AppraisalMatrixMaster.scss";
// import { AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import {
  AlgaehDataGrid,
  // AlgaehAutoComplete,
  AlgaehFormGroup,
} from "algaeh-react-components";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
// import swal from "sweetalert2";
export default function AppraisalMatrixMaster() {
  const [input, setInput] = useState({});
  const [result, setResult] = useState([]);
  const [kpiName, setKpiName] = useState("");
  const [kpiData, setKpiData] = useState([]);

  useEffect(() => {
    getApprisalMatrixRange();
    getKpiName();
  }, []);

  function getApprisalMatrixRange() {
    algaehApiCall({
      uri: "/performanceManagement/getApprisalMatrixRange",
      method: "GET",
      module: "hrManagement",
      onSuccess: (res) => {
        if (res.data.success) {
          setResult(res.data.records);
        }
      },
      onFailure: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }

  function getKpiName() {
    algaehApiCall({
      uri: "/performanceManagement/getKpiName",
      method: "GET",
      module: "hrManagement",
      onSuccess: (res) => {
        if (res.data.success) {
          setKpiData(res.data.records);
        }
      },
      onFailure: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }
  const addKpiName = () => {
    if (Object.keys(kpiName).length === 0) {
      swalMessage({
        type: "warning",
        title: "Field Cannot be Empty",
      });
      return;
    }

    algaehApiCall({
      uri: "/performanceManagement/addKpiName", //
      method: "POST",
      module: "hrManagement",
      data: {
        kpi_name: kpiName,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          swalMessage({
            title: "Record added successfully",
            type: "success",
          });
        }
        getKpiName();
        clearState();
      },
      onError: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  };

  const addApprisalMatrix = () => {
    if (Object.keys(input).length < 4) {
      swalMessage({
        type: "warning",
        title: "Field Cannot be Empty",
      });
      return;
    }

    algaehApiCall({
      uri: "/performanceManagement/insertApprisalMatrixRange", //
      method: "POST",
      module: "hrManagement",
      data: {
        from_range: input.fromRange,
        to_range: input.toRange,
        result: input.result,
        increment: input.increment,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          swalMessage({
            title: "Record added successfully",
            type: "success",
          });
        }
        getApprisalMatrixRange();
        clearState();
      },
      onError: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  };

  function changeTexts(e) {
    const { name, value } = e.target;

    setInput((result) => {
      return { ...result, [name]: value };
    });
  }
  function textHandler(e) {
    setKpiName(e.target.value);
  }
  const deleteGroups = (data) => {
    algaehApiCall({
      uri: "/performanceManagement/deleteApprisalMatrixRange",
      method: "PUT",
      module: "hrManagement",
      data: {
        hrms_d_apprisal_range_id: data.hrms_d_apprisal_range_id,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success",
          });

          setResult((state) => {
            const ans = state.filter(
              (item) =>
                item.hrms_d_apprisal_range_id !== data.hrms_d_apprisal_range_id
            );

            return ans;
          });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  const deleteKpiName = (data) => {
    algaehApiCall({
      uri: "/performanceManagement/deleteKpiName",
      method: "PUT",
      module: "hrManagement",
      data: {
        hrms_d_kpi_master_id: data.hrms_d_kpi_master_id,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success",
          });
          debugger;
          setKpiData((state) => {
            const ans = state.filter(
              (item) => item.hrms_d_kpi_master_id !== data.hrms_d_kpi_master_id
            );

            return ans;
          });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  function clearState() {
    setKpiName("");
    setInput("");
  }
  return (
    <div className="row AppraisalMatrixMaster">
      <div className="col-12">
        <div className="portlet portlet-bordered margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">KPI Master</h3>
            </div>
          </div>
          <div className="portlet-body">
            {/* <div className="row">
              <AlgaehAutoComplete
                div={{ className: "col-3 form-group mandatory" }}
                label={{ forceLabel: "Select Group", isImp: true }}
                selector={{
                  name: "",
                  value: "",
                  className: "select-fld",
                  dataSource: {
                    textField: "",
                    valueField: "",
                    // data: "",
                  },
                  //onChange: this.dropDownHandler.bind(this),
                }}
              /> */}
            <AlgaehFormGroup
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "KPI Name",
                isImp: true,
              }}
              textBox={{
                type: "text",
                className: "form-control",
                name: "kpi_name",
                value: kpiName,

                onChange: textHandler,
              }}
            />
            <div className="col-2 align-middle" style={{ paddingTop: 19 }}>
              <button className="btn btn-primary" onClick={addKpiName}>
                Add
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12" id="KpiMasterGrid_Cntr">
              <AlgaehDataGrid
                id="kpiMasterGrid"
                columns={[
                  {
                    key: "kpi_name",
                    title: "KPI Name",
                    filtered: true,
                  },
                ]}
                loading={false}
                filter={true}
                isEditable="onlyDelete"
                height="34vh"
                dataSource={{
                  data: kpiData,
                }}
                rowUnique="hrms_d_kpi_master_id"
                // xaxis={1500}
                events={{
                  onDelete: deleteKpiName,
                }}
                others={{
                  id: "hrms_d_kpi_master",
                }}
              />
            </div>
          </div>
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Appraisal Matrix Range</h3>
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <AlgaehFormGroup
                div={{ className: "col-2 form-group mandatory" }}
                label={{
                  forceLabel: "From Range",
                  isImp: true,
                }}
                textBox={{
                  type: "number",
                  className: "form-control",
                  name: "fromRange",
                  value: input.fromRange,
                  onChange: changeTexts,
                }}
              />

              <AlgaehFormGroup
                div={{ className: "col-2 form-group mandatory" }}
                label={{
                  forceLabel: "To Range",
                  isImp: true,
                }}
                textBox={{
                  className: "form-control",
                  type: "number",
                  name: "toRange",
                  value: input.toRange,
                  onChange: changeTexts,
                }}
              />

              <AlgaehFormGroup
                div={{ className: "col-2 form-group mandatory" }}
                label={{
                  forceLabel: "Results",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  className: "form-control",
                  name: "result",
                  value: input.result,

                  onChange: changeTexts,
                }}
              />
              <AlgaehFormGroup
                div={{ className: "col-2 form-group mandatory" }}
                label={{
                  forceLabel: "Increment %",
                  isImp: true,
                }}
                textBox={{
                  type: "number",
                  className: "form-control",
                  name: "increment",
                  value: input.increment,

                  onChange: changeTexts,
                }}
              />
              <div className="col-1 align-middle" style={{ paddingTop: 19 }}>
                <button className="btn btn-primary" onClick={addApprisalMatrix}>
                  Add to List
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-12" id="AppraisalMatrixMasterGrid_Cntr">
                <AlgaehDataGrid
                  id="AppraisalMatrixMasterGrid"
                  columns={[
                    {
                      key: "from_range",
                      title: "From Range",
                      filtered: true,
                      others: { width: 150 },
                    },
                    {
                      key: "to_range",
                      title: "To Range",
                      filtered: true,

                      others: { width: 150 },
                    },
                    {
                      key: "result",
                      title: "Results",
                      filtered: true,
                    },
                    {
                      key: "increment",
                      title: "Increment %",
                      filtered: true,
                      others: {
                        width: 250,
                        visibled: true, //this.state.org_country_id ===178?false:true
                      },
                    },
                  ]}
                  loading={false}
                  filter={true}
                  isEditable="onlyDelete"
                  height="34vh"
                  dataSource={{
                    data: result,
                  }}
                  rowUnique="hrms_d_apprisal_range_id"
                  // xaxis={1500}
                  events={{
                    onDelete: deleteGroups,
                  }}
                  others={{
                    id: "Appraisal_Matrix_Range_table",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
