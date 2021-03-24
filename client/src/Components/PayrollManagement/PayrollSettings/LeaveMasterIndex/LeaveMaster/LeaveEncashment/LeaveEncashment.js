import React from "react";
import "./LeaveEncashment.scss";
import Enumerable from "linq";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  // AlgaehDataGrid,
  AlgaehLabel,
} from "../../../../../Wrapper/algaehWrapper";

import {
  AlgaehSecurityElement,
  AlgaehDataGrid,
  AlgaehAutoComplete,
  AlgaehFormGroup,
} from "algaeh-react-components";
function LeaveEncashment(props) {
  let myParent = props.parent;

  return (
    <div className="Leave_Encashment">
      <div className="row">
        <div className="row">
          <AlagehAutoComplete
            div={{ className: "col-3 form-group" }}
            label={{ forceLabel: "Encashment Type", isImp: true }}
            selector={{
              name: "earnings_id",
              value: myParent.state.earnings_id,
              className: "select-fld",
              dataSource: {
                textField: "earning_deduction_description",
                valueField: "hims_d_earning_deduction_id",
                data: myParent.state.earning_deductions,
              },
              onChange: (value) => myParent.dropDownHandler(value),
              onClear: () => {
                myParent.setState({
                  earnings_id: null,
                });
              },
            }}
          />

          <AlagehFormGroup
            div={{ className: "col-3 form-group" }}
            label={{
              forceLabel: "Value %",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "percent",
              value: myParent.state.percent,
              events: {
                onChange: (e) => myParent.textHandler(e),
              },
              option: {
                type: "number",
              },
            }}
          />
          <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
            <div className="col-2">
              <button
                onClick={myParent.addLeaveEncash.bind(myParent)}
                className="btn btn-primary"
                style={{ marginTop: 20 }}
              >
                Add to List
              </button>
            </div>
          </AlgaehSecurityElement>
        </div>

        <div className="row">
          <div className="col-12 margin-top-15" id="leaveEncashment_grid_cntr">
            <AlgaehDataGrid
              id="leaveRules_grid"
              columns={[
                {
                  fieldName: "earnings_id",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Encashment Type" }} />
                  ),
                  displayTemplate: (row) => {
                    let x = Enumerable.from(myParent.state.earning_deductions)
                      .where(
                        (w) => w.hims_d_earning_deduction_id === row.earnings_id
                      )
                      .firstOrDefault();

                    return (
                      <span>
                        {x !== undefined
                          ? x.earning_deduction_description
                          : null}
                      </span>
                    );
                  },
                  editorTemplate: (row) => {
                    return (
                      <AlgaehAutoComplete
                        div={{ className: "col " }}
                        selector={{
                          className: "select-fld",
                          name: "earnings_id",
                          value: row.earnings_id,
                          onChange: (e, value) => {
                            row.earnings_id = value;
                          },
                          // others: { defaultValue: row.bed_id },
                          dataSource: {
                            textField: "earning_deduction_description",
                            valueField: "hims_d_earning_deduction_id",
                            data: myParent.state.earning_deductions,
                          },
                          updateInternally: true,
                          // others: {
                          //   disabled:
                          //     current.request_status === "APR" &&
                          //     current.work_status === "COM",
                          //   tabIndex: "4",
                          // },
                        }}
                      />
                      // <AlagehAutoComplete
                      //   selector={{
                      //     name: "earnings_id",
                      //     value: row.earnings_id,
                      //     className: "select-fld",
                      //     dataSource: {
                      //       textField: "earning_deduction_description",
                      //       valueField: "hims_d_earning_deduction_id",
                      //       data: myParent.state.earning_deductions,
                      //     },
                      //     onChange: myParent.changeGridEditors.bind(
                      //       myParent,
                      //       row
                      //     ),
                      //   }}
                      // />
                    );
                  },
                },
                {
                  fieldName: "percent",
                  label: <AlgaehLabel label={{ forceLabel: "Value %" }} />,
                  editorTemplate: (row) => {
                    return (
                      <AlgaehFormGroup
                        div={{ className: "col noLabel" }}
                        label={{}}
                        textBox={{
                          type: "number",
                          value: row.percent,
                          className: "form-control",
                          name: "percent",
                          updateInternally: true,
                          onChange: (e) => {
                            row.percent = e.target.value;
                          },
                        }}
                      />
                      // <AlagehFormGroup
                      //   textBox={{
                      //     className: "txt-fld",
                      //     name: "percent",
                      //     value: row.percent,
                      //     events: {
                      //       onChange: myParent.changeGridEditors.bind(
                      //         myParent,
                      //         row
                      //       ),
                      //     },
                      //     others: {
                      //       type: "number",
                      //     },
                      //   }}
                      // />
                    );
                  },
                },
              ]}
              keyId="algaeh_d_module_id"
              // dataSource={{
              data={
                myParent.state.leaveEncash?.length > 0
                  ? myParent.state.leaveEncash
                  : []
              }
              // }}
              isEditable={true}
              // paging={{ page: 0, rowsPerPage: 10 }}
              pagination={true}
              events={{
                onEdit: () => {},
                onDelete: myParent.deleteLeaveEncash.bind(myParent, ""),
                onSave: myParent.updateLeaveEncash.bind(myParent, ""),
              }}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="row">
          <AlagehAutoComplete
            div={{ className: "col-3 form-group" }}
            label={{ forceLabel: "Encashment Type Final" }}
            selector={{
              name: "earnings_id_final",
              value: myParent.state.earnings_id_final,
              className: "select-fld",
              dataSource: {
                textField: "earning_deduction_description",
                valueField: "hims_d_earning_deduction_id",
                data: myParent.state.earning_deductions,
              },
              onChange: (value) => myParent.dropDownHandler(value),
              onClear: () => {
                myParent.setState({
                  earnings_id_final: null,
                });
              },
            }}
          />

          <AlagehFormGroup
            div={{ className: "col-3 form-group" }}
            label={{
              forceLabel: "Value %",
              // isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "percent_final",
              value: myParent.state.percent_final,
              events: {
                onChange: (e) => myParent.textHandler(e),
              },
              option: {
                type: "number",
              },
            }}
          />
          <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
            <div className="col-2">
              <button
                onClick={myParent.addLeaveEncash.bind(myParent, "final")}
                className="btn btn-primary"
                style={{ marginTop: 20 }}
              >
                Add to List
              </button>
            </div>
          </AlgaehSecurityElement>
        </div>

        <div className="row">
          <div className="col-12 margin-top-15" id="leaveEncashment_grid_cntr">
            <AlgaehDataGrid
              id="leaveRules_grid"
              columns={[
                {
                  fieldName: "earnings_id",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Encashment Type" }} />
                  ),
                  displayTemplate: (row) => {
                    let x = Enumerable.from(myParent.state.earning_deductions)
                      .where(
                        (w) => w.hims_d_earning_deduction_id === row.earnings_id
                      )
                      .firstOrDefault();

                    return (
                      <span>
                        {x !== undefined
                          ? x.earning_deduction_description
                          : null}
                      </span>
                    );
                  },
                  editorTemplate: (row) => {
                    return (
                      <AlgaehAutoComplete
                        // error={errors2}
                        // div={{ className: "col " }}
                        selector={{
                          className: "select-fld",
                          name: "earnings_id_final",
                          value: row.earnings_id,
                          onChange: (e, value) => {
                            row.earnings_id = value;
                          },
                          // others: { defaultValue: row.bed_id },
                          dataSource: {
                            textField: "earning_deduction_description",
                            valueField: "hims_d_earning_deduction_id",
                            data: myParent.state.earning_deductions,
                          },
                          updateInternally: true,
                          // others: {
                          //   disabled:
                          //     current.request_status === "APR" &&
                          //     current.work_status === "COM",
                          //   tabIndex: "4",
                          // },
                        }}
                      />
                      // <AlagehAutoComplete
                      //   selector={{
                      //     name: "earnings_id_final",
                      //     value: row.earnings_id,
                      //     className: "select-fld",
                      //     dataSource: {
                      //       textField: "earning_deduction_description",
                      //       valueField: "hims_d_earning_deduction_id",
                      //       data: myParent.state.earning_deductions,
                      //     },
                      //     onChange: myParent.changeGridEditors.bind(
                      //       myParent,
                      //       row
                      //     ),
                      //   }}
                      // />
                    );
                  },
                },
                {
                  fieldName: "percent",
                  label: <AlgaehLabel label={{ forceLabel: "Value %" }} />,
                  editorTemplate: (row) => {
                    return (
                      <AlgaehFormGroup
                        div={{ className: "col noLabel" }}
                        label={{}}
                        textBox={{
                          type: "number",
                          value: row.percent,
                          className: "form-control",
                          name: "percentFinal",
                          updateInternally: true,
                          onChange: (e) => {
                            row.percent = e.target.value;
                          },
                        }}
                      />
                      // <AlagehFormGroup
                      //   textBox={{
                      //     className: "txt-fld",
                      //     name: "percent",
                      //     value: row.percent,
                      //     events: {
                      //       onChange: myParent.changeGridEditors.bind(
                      //         myParent,
                      //         row
                      //       ),
                      //     },
                      //     others: {
                      //       type: "number",
                      //     },
                      //   }}
                      // />
                    );
                  },
                },
              ]}
              keyId="algaeh_d_module_id"
              // dataSource={{
              data={
                myParent.state.leaveEncashFinal?.length > 0
                  ? myParent.state.leaveEncashFinal
                  : []
              }
              // }}
              isEditable={true}
              // paging={{ page: 0, rowsPerPage: 10 }}
              pagination={true}
              events={{
                onEdit: () => {},
                onDelete: myParent.deleteLeaveEncash.bind(myParent, "final"),
                onSave: myParent.updateLeaveEncash.bind(myParent, "final"),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveEncashment;
