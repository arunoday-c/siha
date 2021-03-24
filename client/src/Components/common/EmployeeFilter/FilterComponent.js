import React, { useContext } from "react";
import "./FilterComponent.scss";
import { FilterContext } from ".";
import { MONTHS } from "../../../utils/GlobalVariables.json";
import { AlagehAutoComplete, AlgaehLabel } from "../../Wrapper/algaehWrapper";
import { getYears } from "../../../utils/GlobalFunctions";

export default function FilterComponent(props) {
  const allYears = getYears();
  const {
    inputs,
    hospitals,
    allDepartments,
    empGroups,
    subDepts,
    designations,
    handlers,
  } = useContext(FilterContext);
  return (
    <div className="row inner-top-search FilterCompnentDiv">
      {" "}
      <AlagehAutoComplete
        div={{ className: "col-2 form-group mandatory" }}
        label={{
          fieldName: "branch",
          isImp: true,
        }}
        selector={{
          sort: "off",
          name: "hospital_id",
          className: "select-fld",
          value: inputs.hospital_id,
          dataSource: {
            textField: "hospital_name",
            valueField: "hims_d_hospital_id",
            data: hospitals,
          },
          onChange: handlers.dropDownHandler,
          onClear: handlers.dropDownClear,
        }}
        showLoading={true}
      />
      <AlagehAutoComplete
        div={{ className: "col-1 mandatory" }}
        label={{
          fieldName: "year",
          isImp: true,
        }}
        selector={{
          name: "year",
          className: "select-fld",
          value: inputs.year,
          dataSource: {
            textField: "name",
            valueField: "value",
            data: allYears,
          },
          onChange: handlers.dropDownHandler,
        }}
      />
      <AlagehAutoComplete
        div={{ className: "col-2 mandatory" }}
        label={{
          fieldName: "select_month",
          isImp: true,
        }}
        selector={{
          sort: "off",
          name: "month",
          className: "select-fld",
          value: inputs.month,
          dataSource: {
            textField: "name",
            valueField: "value",
            data: MONTHS,
          },
          onChange: handlers.dropDownHandler,
        }}
      />
      <AlagehAutoComplete
        div={{ className: "col-2 form-group" }}
        label={{ fieldName: "employeeGroup" }}
        selector={{
          name: "group_id",
          value: inputs.group_id,
          className: "select-fld",
          dataSource: {
            textField: "group_description",
            valueField: "hims_d_employee_group_id",
            data: empGroups,
          },
          onChange: handlers.dropDownHandler,
          onClear: () => {
            handlers.clearInputState({
              group_id: "",
            });
          },
        }}
      />
      <AlagehAutoComplete
        div={{ className: "col-2 form-group" }}
        label={{ fieldName: "department", isImp: false }}
        selector={{
          name: "department_id",
          value: inputs.department_id,
          className: "select-fld",
          dataSource: {
            textField: "department_name",
            valueField: "hims_d_department_id",
            data: allDepartments,
          },
          onChange: handlers.dropDownHandler,
          onClear: () => {
            handlers.clearInputState({
              department_id: null,
              sub_department_id: null,
              designation_id: null,
              emp_name: null,
              hims_d_employee_id: null,
            });
          },
        }}
      />
      <AlagehAutoComplete
        div={{ className: "col-2 form-group" }}
        label={{ fieldName: "sub_department" }}
        selector={{
          name: "sub_department_id",
          value: inputs.sub_department_id,
          className: "select-fld",
          dataSource: {
            textField: "sub_department_name",
            valueField: "hims_d_sub_department_id",
            data: subDepts,
          },
          onChange: handlers.dropDownHandler,
          onClear: () => {
            handlers.clearInputState({
              sub_department_id: null,
              designation_id: null,
              emp_name: null,
              hims_d_employee_id: null,
            });
          },
        }}
      />
      <AlagehAutoComplete
        div={{ className: "col-2 form-group" }}
        label={{ fieldName: "designation" }}
        selector={{
          name: "designation_id",
          value: inputs.designation_id,
          className: "select-fld",
          dataSource: {
            textField: "designation",
            valueField: "hims_d_designation_id",
            data: designations,
          },
          onChange: handlers.dropDownHandler,
          onClear: () => {
            handlers.clearState({
              designation_id: null,
              emp_name: null,
              hims_d_employee_id: null,
            });
          },
        }}
      />
      <div className="col globalSearchCntr">
        <AlgaehLabel label={{ fieldName: "searchEmployee" }} />
        <h6 onClick={handlers.employeeSearch}>
          {inputs.emp_name ? inputs.emp_name : "Search Employee"}
          <i className="fas fa-search fa-lg"></i>
        </h6>
      </div>
      <div className="col-2 form-group" style={{ paddingTop: 19 }}>
        <button
          onClick={handlers.loadFunc}
          style={{ marginLeft: 10, float: "right" }}
          className="btn btn-primary"
        >
          {!inputs.loading ? (
            <AlgaehLabel label={{ fieldName: "loadData" }} />
          ) : (
            <i className="fas fa-spinner fa-spin" />
          )}
        </button>
        <button
          onClick={handlers.clearState}
          style={{ float: "right" }}
          className="btn btn-default"
        >
          <AlgaehLabel label={{ fieldName: "btn_clear" }} />
        </button>
      </div>
    </div>
  );
}
