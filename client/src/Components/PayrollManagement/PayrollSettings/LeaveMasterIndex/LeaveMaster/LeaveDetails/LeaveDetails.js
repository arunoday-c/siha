import React from "react";
import "./leave_details.scss";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel,
} from "../../../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../../../utils/GlobalVariables.json";
import { AlgaehSecurityElement } from "algaeh-react-components";

function LeaveDetails(props) {
  let myParent = props.parent;

  return (
    <div className="popRightDiv leave_details">
      <div className="row">
        <AlagehAutoComplete
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Employee Type",
            isImp: true,
          }}
          selector={{
            name: "employee_type",
            value: myParent.state.employee_type,
            className: "select-fld",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: GlobalVariables.EMP_TYPE,
            },
            onChange: (value) => myParent.dropDownHandler(value),
            onClear: () => {
              myParent.setState({
                employee_type: null,
              });
            },
          }}
        />

        <AlagehAutoComplete
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Gender",
            isImp: true,
          }}
          selector={{
            name: "gender",
            value: myParent.state.gender,
            className: "select-fld",
            dataSource: {
              textField: "name",
              valueField: "value",
              data: GlobalVariables.LEAVE_GENDER,
            },
            onChange: (value) => myParent.dropDownHandler(value),
            onClear: () => {
              myParent.setState({
                gender: null,
              });
            },
          }}
        />

        <AlagehFormGroup
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Days of Eligibility",
            isImp: true,
          }}
          textBox={{
            className: "txt-fld",
            name: "eligible_days",
            value: myParent.state.eligible_days,
            events: {
              onChange: (e) => myParent.textHandler(e),
            },
            others: {
              type: "number",
            },
          }}
        />

        <AlagehFormGroup
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Maximum Limit",
            isImp: true,
          }}
          textBox={{
            className: "txt-fld",
            name: "max_number_days",
            value: myParent.state.max_number_days,
            events: {
              onChange: (e) => myParent.textHandler(e),
            },
            others: {
              type: "number",
            },
          }}
        />

        <div className="col-2">
          <label>Min. Service Required</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="min_service_required"
                checked={myParent.state.min_service_required}
                onChange={(e) => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>
        <AlagehFormGroup
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Service in Years",
            isImp: myParent.state.min_service_required,
          }}
          textBox={{
            className: "txt-fld",
            name: "service_years",
            value: myParent.state.service_years,
            events: {
              onChange: (e) => myParent.textHandler(e),
            },
            others: {
              type: "number",
              disabled: !myParent.state.min_service_required,
            },
          }}
        />

        <div className="col-2">
          <label>Once in Life Time</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="once_life_term"
                checked={myParent.state.once_life_term}
                onChange={(e) => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>

        <div className="col-2">
          <label>Allow during Probation</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                name="allow_probation"
                checked={myParent.state.allow_probation}
                onChange={(e) => myParent.changeChecks(e)}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>

        <AlagehFormGroup
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Mandatory Utlilize Days",
            isImp: true,
          }}
          textBox={{
            className: "txt-fld",
            name: "mandatory_utilize_days",
            value: myParent.state.mandatory_utilize_days,
            events: {
              onChange: (e) => myParent.textHandler(e),
            },
            others: {
              type: "number",
            },
          }}
        />

        <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
          <div className="col-2">
            <button
              onClick={myParent.addLeaveDetails.bind(myParent)}
              className="btn btn-primary"
              style={{ marginTop: 19 }}
            >
              Add to List
            </button>
          </div>
        </AlgaehSecurityElement>
      </div>

      <div className="row">
        <div className="col-12 margin-top-15" id="leaveDetails_grid_cntr">
          <AlgaehDataGrid
            id="leaveDetails_grid"
            columns={[
              {
                fieldName: "employee_type",
                label: <AlgaehLabel label={{ forceLabel: "Employee Type" }} />,
                displayTemplate: (row) => {
                  return (
                    <span>
                      {row.employee_type === "PE"
                        ? "Permanent"
                        : row.employee_type === "CO"
                        ? "Contract"
                        : row.employee_type === "PB"
                        ? "Probation"
                        : row.employee_type === "LC"
                        ? "Locum"
                        : row.employee_type === "VC"
                        ? "Visiting Consultant"
                        : null}
                    </span>
                  );
                },
                editorTemplate: (row) => {
                  return (
                    <AlagehAutoComplete
                      selector={{
                        name: "employee_type",
                        value: row.employee_type,
                        className: "select-fld",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.EMP_TYPE,
                        },
                        onChange: myParent.changeGridEditors.bind(
                          myParent,
                          row
                        ),
                      }}
                    />
                  );
                },
              },
              {
                fieldName: "gender",

                label: <AlgaehLabel label={{ forceLabel: "Gender" }} />,
                editorTemplate: (row) => {
                  return (
                    <AlagehAutoComplete
                      selector={{
                        name: "gender",
                        value: row.gender,
                        className: "select-fld",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.LEAVE_GENDER,
                        },
                        onChange: myParent.changeGridEditors.bind(
                          myParent,
                          row
                        ),
                      }}
                    />
                  );
                },
              },
              {
                fieldName: "eligible_days",

                label: (
                  <AlgaehLabel label={{ forceLabel: "Days of Eligibility" }} />
                ),
                editorTemplate: (row) => {
                  return (
                    <AlagehFormGroup
                      textBox={{
                        className: "txt-fld",
                        name: "eligible_days",
                        value: row.eligible_days,
                        events: {
                          onChange: myParent.changeGridEditors.bind(
                            myParent,
                            row
                          ),
                        },
                        others: {
                          type: "number",
                        },
                      }}
                    />
                  );
                },
              },
              {
                fieldName: "max_number_days",

                label: <AlgaehLabel label={{ forceLabel: "Maximum Limit" }} />,
                editorTemplate: (row) => {
                  return (
                    <AlagehFormGroup
                      textBox={{
                        className: "txt-fld",
                        name: "max_number_days",
                        value: row.max_number_days,
                        events: {
                          onChange: myParent.changeGridEditors.bind(
                            myParent,
                            row
                          ),
                        },
                        others: {
                          type: "number",
                        },
                      }}
                    />
                  );
                },
              },
              {
                fieldName: "min_service_required",
                label: (
                  <AlgaehLabel
                    label={{ forceLabel: "Min. Service Required" }}
                  />
                ),
                displayTemplate: (row) => {
                  return (
                    <span>
                      {row.min_service_required === "Y"
                        ? "Yes"
                        : row.min_service_required === "N"
                        ? "No"
                        : null}
                    </span>
                  );
                },
                editorTemplate: (row) => {
                  return (
                    <AlagehAutoComplete
                      selector={{
                        name: "min_service_required",
                        value: row.min_service_required,
                        className: "select-fld",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.FORMAT_YESNO,
                        },
                        onChange: myParent.changeGridEditors.bind(
                          myParent,
                          row
                        ),
                      }}
                    />
                  );
                },
              },
              {
                fieldName: "service_years",
                label: (
                  <AlgaehLabel label={{ forceLabel: "Service in Years" }} />
                ),
                displayTemplate: (row) => {
                  return (
                    <span>
                      {row.service_years ? row.service_years : "Not Applicable"}
                    </span>
                  );
                },
                editorTemplate: (row) => {
                  return (
                    <AlagehFormGroup
                      textBox={{
                        className: "txt-fld",
                        name: "service_years",
                        value: row.service_years,
                        events: {
                          onChange: myParent.changeGridEditors.bind(
                            myParent,
                            row
                          ),
                        },
                        others: {
                          type: "number",
                        },
                      }}
                    />
                  );
                },
              },
              {
                fieldName: "once_life_term",
                label: (
                  <AlgaehLabel label={{ forceLabel: "Once in Life Time" }} />
                ),
                displayTemplate: (row) => {
                  return (
                    <span>
                      {row.once_life_term === "Y"
                        ? "Yes"
                        : row.once_life_term === "N"
                        ? "No"
                        : null}
                    </span>
                  );
                },
                editorTemplate: (row) => {
                  return (
                    <AlagehAutoComplete
                      selector={{
                        name: "once_life_term",
                        value: row.once_life_term,
                        className: "select-fld",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.FORMAT_YESNO,
                        },
                        onChange: myParent.changeGridEditors.bind(
                          myParent,
                          row
                        ),
                      }}
                    />
                  );
                },
              },
              {
                fieldName: "allow_probation",
                label: (
                  <AlgaehLabel
                    label={{ forceLabel: "Allow during Probation" }}
                  />
                ),
                displayTemplate: (row) => {
                  return (
                    <span>
                      {row.allow_probation === "Y"
                        ? "Yes"
                        : row.allow_probation === "N"
                        ? "No"
                        : null}
                    </span>
                  );
                },
                editorTemplate: (row) => {
                  return (
                    <AlagehAutoComplete
                      selector={{
                        name: "allow_probation",
                        value: row.allow_probation,
                        className: "select-fld",
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.FORMAT_YESNO,
                        },
                        onChange: myParent.changeGridEditors.bind(
                          myParent,
                          row
                        ),
                      }}
                    />
                  );
                },
              },
              {
                fieldName: "mandatory_utilize_days",
                label: (
                  <AlgaehLabel
                    label={{ forceLabel: "Mandatory Utlilize Days" }}
                  />
                ),
                editorTemplate: (row) => {
                  return (
                    <AlagehFormGroup
                      textBox={{
                        className: "txt-fld",
                        name: "mandatory_utilize_days",
                        value: row.mandatory_utilize_days,
                        events: {
                          onChange: myParent.changeGridEditors.bind(
                            myParent,
                            row
                          ),
                        },
                        others: {
                          type: "number",
                        },
                      }}
                    />
                  );
                },
              },
            ]}
            keyId="hims_d_leave_detail_id"
            dataSource={{
              data: myParent.state.leaveDetails,
            }}
            isEditable={true}
            paging={{ page: 0, rowsPerPage: 10 }}
            events={{
              onEdit: () => {},
              onDelete: myParent.deleteLeaveDetail.bind(myParent),
              onDone: myParent.updateLeaveDetail.bind(myParent),
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LeaveDetails;
