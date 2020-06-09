import React, { useState, useEffect } from "react";

import "./PerfoParaMaster.scss";

import {
  AlgaehDataGrid,
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehLabel,
} from "algaeh-react-components";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
// import { addGroupName } from "../../../../../../HrManagement/src/models/performanceManagement";
export default function PerfoParaMaster() {
  const [result, setResult] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [inputs, setInputs] = useState([]);
  const [questionaries, setQuestionaries] = useState("");
  const [questionariesGroup, setQuestionariesGroup] = useState([]);

  useEffect(() => {
    getGroupName();
    getQuestionaries();
  }, []);
  function getGroupName() {
    algaehApiCall({
      uri: "/performanceManagement/getGroupName",
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
  function getQuestionaries() {
    algaehApiCall({
      uri: "/performanceManagement/getQuestionaries",
      method: "GET",
      module: "hrManagement",
      onSuccess: (res) => {
        if (res.data.success) {
          setQuestionariesGroup(res.data.records);
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
  const addGroupName = () => {
    if (Object.keys(groupName).length === 0) {
      swalMessage({
        type: "warning",
        title: "Field Cannot be Empty",
      });
      return;
    }

    algaehApiCall({
      uri: "/performanceManagement/addGroupName", //
      method: "POST",
      module: "hrManagement",
      data: {
        group_name: groupName,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          swalMessage({
            title: "Record added successfully",
            type: "success",
          });
        }
        getGroupName();
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

  const addQuestionaries = () => {
    if (Object.keys(questionaries).length === 0) {
      swalMessage({
        type: "warning",
        title: "Field Cannot be Empty",
      });
      return;
    }
    algaehApiCall({
      uri: "/performanceManagement/addQuestionaries", //
      method: "POST",
      module: "hrManagement",
      data: {
        hrms_d_questionnaire_group_id: inputs.hrms_d_questionnaire_group_id,
        questionaries: questionaries,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          swalMessage({
            title: "Record added successfully",
            type: "success",
          });
        }
        getQuestionaries();
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
    e.target.name = e.target.value;
    setGroupName(e.target.value);
  }
  function textHandler(e) {
    e.target.name = e.target.value;
    setQuestionaries(e.target.value);
  }
  const deleteGroups = (data) => {
    algaehApiCall({
      uri: "/performanceManagement/deleteGroupName",
      method: "PUT",
      module: "hrManagement",
      data: {
        hrms_d_questionnaire_group_id: data.hrms_d_questionnaire_group_id,
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
                item.hrms_d_questionnaire_group_id !==
                data.hrms_d_questionnaire_group_id
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
  const deleteQuestionaries = (data) => {
    algaehApiCall({
      uri: "/performanceManagement/deleteQuestionaries",
      method: "PUT",
      module: "hrManagement",
      data: {
        hrms_d_perfrmance_questionnaire_master_id:
          data.hrms_d_perfrmance_questionnaire_master_id,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success",
          });

          setQuestionariesGroup((state) => {
            const ans = state.filter(
              (item) =>
                item.hrms_d_perfrmance_questionnaire_master_id !==
                data.hrms_d_perfrmance_questionnaire_master_id
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
  function dropDownHandler(selected, value, name) {
    setInputs((result) => {
      return { ...result, [name]: value };
    });
  }
  function clearState() {
    setGroupName("");
    setInputs("");
    setQuestionaries("");
  }

  return (
    <div className="row">
      <div className="col-4">
        <div className="portlet portlet-bordered margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Questionnaire Group</h3>
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <AlgaehFormGroup
                div={{ className: "col form-group mandatory" }}
                label={{
                  forceLabel: "Group Name",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  className: "form-control",
                  name: "group_name",
                  value: groupName,
                  onChange: changeTexts,
                }}
              />
              <div className="col-2 align-middle" style={{ paddingTop: 19 }}>
                <button className="btn btn-primary" onClick={addGroupName}>
                  Add
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-12" id="ParamGroupGrid_Cntr">
                <AlgaehDataGrid
                  id="ParamGroupGrid"
                  columns={[
                    {
                      key: "group_name",
                      title: "GROUP NAME",
                      filtered: true,
                    },
                  ]}
                  isEditable="onlyDelete"
                  height="34vh"
                  dataSource={{
                    data: result,
                  }}
                  rowUnique="hrms_d_questionnaire_group_id"
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
      <div className="col-8">
        <div className="portlet portlet-bordered margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Questionnaire Master</h3>
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <AlgaehAutoComplete
                div={{ className: "col-3 form-group mandatory" }}
                label={{ forceLabel: "Select Group", isImp: true }}
                selector={{
                  name: "hrms_d_questionnaire_group_id",
                  className: "select-fld",
                  dataSource: {
                    textField: "group_name",
                    valueField: "hrms_d_questionnaire_group_id",
                    data: result,
                  },
                  value: inputs.hrms_d_questionnaire_group_id,
                  onChange: dropDownHandler,
                }}
              />
              <AlgaehFormGroup
                div={{ className: "col form-group mandatory" }}
                label={{
                  forceLabel: "Enter Questionnaire",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  className: "form-control",
                  name: "questionaries",
                  value: questionaries,

                  onChange: textHandler,
                }}
              />
              <div className="col-1 align-middle" style={{ paddingTop: 19 }}>
                <button className="btn btn-primary" onClick={addQuestionaries}>
                  Add
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-12" id="QuestionnaireMasterGrid_Cntr">
                <AlgaehDataGrid
                  id="QuestionnaireMasterGrid"
                  columns={[
                    {
                      key: "group_name",
                      title: "Group Name",
                      filtered: true,
                    },
                    {
                      key: "questionaries",
                      title: "Questionnaire",
                      filtered: true,
                    },
                  ]}
                  loading={false}
                  filter={true}
                  isEditable="onlyDelete"
                  height="34vh"
                  dataSource={{
                    data: questionariesGroup,
                  }}
                  rowUnique="hrms_d_perfrmance_questionnaire_master_id"
                  // xaxis={1500}
                  events={{
                    onDelete: deleteQuestionaries,
                  }}
                  others={{
                    id: "perfrmance_questionnaire_master_table",
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
