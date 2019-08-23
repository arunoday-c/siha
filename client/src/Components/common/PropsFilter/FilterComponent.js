import React, { useContext } from "react";
import { FilterContext } from ".";
import { AlagehAutoComplete, AlgaehLabel } from "../../Wrapper/algaehWrapper";

export default function FilterComponent() {
  const {
    inputs,
    hospitals,
    allDepartments,
    subDepts,
    designations,
    handlers
  } = useContext(FilterContext);
  return (
    <div className="row  inner-top-search">
      <AlagehAutoComplete
        div={{ className: "col-2 form-group mandatory" }}
        label={{
          forceLabel: "Branch",
          isImp: true
        }}
        selector={{
          name: "hospital_id",
          className: "select-fld",
          value: inputs.hospital_id,
          dataSource: {
            textField: "hospital_name",
            valueField: "hims_d_hospital_id",
            data: hospitals
          },
          onChange: handlers.dropDownHandler
        }}
        showLoading={true}
      />

      <AlagehAutoComplete
        div={{ className: "col-2 form-group mandatory" }}
        label={{ forceLabel: "Department", isImp: true }}
        selector={{
          name: "department_id",
          value: inputs.department_id,
          className: "select-fld",
          dataSource: {
            textField: "department_name",
            valueField: "hims_d_department_id",
            data: allDepartments
          },
          onChange: handlers.dropDownHandler,
          onClear: () => {
            handlers.clearInputState({
              department_id: null,
              sub_department_id: null,
              designation_id: null,
              emp_name: null,
              hims_d_employee_id: null
            });
          }
        }}
      />

      <AlagehAutoComplete
        div={{ className: "col-2 form-group" }}
        label={{ forceLabel: "Sub Deptartment" }}
        selector={{
          name: "sub_department_id",
          value: inputs.sub_department_id,
          className: "select-fld",
          dataSource: {
            textField: "sub_department_name",
            valueField: "hims_d_sub_department_id",
            data: subDepts
          },
          onChange: handlers.dropDownHandler,
          onClear: () => {
            handlers.clearInputState({
              sub_department_id: null,
              designation_id: null,
              emp_name: null,
              hims_d_employee_id: null
            });
          }
        }}
      />

      <AlagehAutoComplete
        div={{ className: "col-2 form-group" }}
        label={{ forceLabel: "Designation" }}
        selector={{
          name: "designation_id",
          value: inputs.designation_id,
          className: "select-fld",
          dataSource: {
            textField: "designation",
            valueField: "hims_d_designation_id",
            data: designations
          },
          onChange: handlers.dropDownHandler,
          onClear: () => {
            handlers.clearState({
              designation_id: null,
              emp_name: null,
              hims_d_employee_id: null
            });
          }
        }}
      />

      <div className="col-2" style={{ margin: "5px 15px 0 0", paddingLeft: 0 }}>
        <div
          className="row"
          style={{
            border: " 1px solid #ced4d9",
            borderRadius: 5,
            marginLeft: 0
          }}
        >
          <div className="col">
            <AlgaehLabel label={{ forceLabel: "Search Employee." }} />
            <h6> {inputs.emp_name ? inputs.emp_name : "------"}</h6>
          </div>
          <div
            className="col-2"
            style={{ borderLeft: "1px solid #ced4d8", padding: "0 0 0 7px" }}
          >
            <i
              className="fas fa-search fa-lg"
              style={{
                paddingTop: 17,
                paddingLeft: 3,
                cursor: "pointer"
              }}
              onClick={handlers.employeeSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
