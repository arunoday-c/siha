import React from "react";
import "./leave_rules.scss";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel,
} from "../../../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../../../utils/GlobalVariables.json";
import Enumerable from "linq";

function LeaveRules(props) {
  let myParent = props.parent;
  return (
    <div className=" leave_rules">
      <div className="popRightDiv">
        {myParent.state.calculation_type === "CO" ? (
          <div>
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col-2" }}
                label={{
                  forceLabel: "Earnings Type",
                  isImp: true,
                }}
                selector={{
                  name: "rule_earning_id",
                  value: myParent.state.rule_earning_id,
                  className: "select-fld",
                  dataSource: {
                    textField: "earning_deduction_description",
                    valueField: "hims_d_earning_deduction_id",
                    data: myParent.state.earning_deductions,
                  },
                  onChange: (value) => myParent.dropDownHandler(value),
                  onClear: () => {
                    myParent.setState({
                      rule_earning_id: null,
                    });
                  },
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-2" }}
                label={{
                  forceLabel: "Pay Type",
                  isImp: true,
                }}
                selector={{
                  name: "paytype",
                  value: myParent.state.paytype,
                  className: "select-fld",
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.LEAVE_PAY_TYPE,
                  },
                  onChange: (value) => myParent.dropDownHandler(value),
                  onClear: () => {
                    myParent.setState({
                      paytype: null,
                    });
                  },
                }}
              />

              <div className="col-2">
                <button
                  onClick={myParent.addLeaveRules.bind(myParent)}
                  className="btn btn-primary"
                  style={{ marginTop: 19 }}
                >
                  Add to List
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-12 margin-top-15" id="leaveRules_grid_cntr">
                <AlgaehDataGrid
                  id="leaveRules_grid_comp"
                  columns={[
                    {
                      fieldName: "calculation_type",
                      label: "Calculation Type",
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.calculation_type === "CO"
                              ? "Component"
                              : row.calculation_type === "SL"
                              ? "Slab"
                              : null}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        return (
                          // <AlagehAutoComplete
                          //   selector={{
                          //     name: "calculation_type",
                          //     value: row.calculation_type,
                          //     className: "select-fld",
                          //     dataSource: {
                          //       textField: "name",
                          //       valueField: "value",
                          //       data: GlobalVariables.LEAVE_CALC_TYPE
                          //     },
                          //     onChange: myParent.changeGridEditors.bind(
                          //       myParent,
                          //       row
                          //     )
                          //   }}
                          // />
                          <span>
                            {row.calculation_type === "CO"
                              ? "Component"
                              : row.calculation_type === "SL"
                              ? "Slab"
                              : null}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "earning_id",
                      label: "Earning Type",
                      displayTemplate: (row) => {
                        let x = Enumerable.from(
                          myParent.state.earning_deductions
                        )
                          .where(
                            (w) =>
                              w.hims_d_earning_deduction_id === row.earning_id
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
                          <AlagehAutoComplete
                            selector={{
                              name: "earning_id",
                              value: row.earning_id,
                              className: "select-fld",
                              dataSource: {
                                textField: "earning_deduction_description",
                                valueField: "hims_d_earning_deduction_id",
                                data: myParent.state.earning_deductions,
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
                      fieldName: "paytype",
                      label: "Pay Type",
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.paytype === "NO"
                              ? "None"
                              : row.paytype === "FD"
                              ? "Full Day (1)"
                              : row.paytype === "HD"
                              ? "Half Day (1/2)"
                              : row.paytype === "UN"
                              ? "Unpaid"
                              : row.paytype === "QD"
                              ? "Quarter (1/4)"
                              : row.paytype === "TQ"
                              ? "Three Quarter Day (3/4)"
                              : null}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        return (
                          <AlagehAutoComplete
                            selector={{
                              name: "paytype",
                              value: row.paytype,
                              className: "select-fld",
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.LEAVE_PAY_TYPE,
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
                  ]}
                  keyId="hims_d_leave_rule_id"
                  dataSource={{
                    data: myParent.state.leaveRules,
                  }}
                  isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onEdit: () => {},
                    onDelete: myParent.deleteLeaveRule.bind(myParent),
                    onDone: myParent.updateLeaveRule.bind(myParent),
                  }}
                />
              </div>
            </div>
          </div>
        ) : myParent.state.calculation_type === "SL" ? (
          <div>
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col-2" }}
                label={{
                  forceLabel: "Pay Type",
                  isImp: true,
                }}
                selector={{
                  name: "paytype",
                  value: myParent.state.paytype,
                  className: "select-fld",
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.LEAVE_PAY_TYPE,
                  },
                  onChange: (value) => myParent.dropDownHandler(value),
                  onClear: () => {
                    myParent.setState({
                      paytype: null,
                    });
                  },
                }}
              />

              <AlagehFormGroup
                div={{ className: "col form-group" }}
                label={{
                  forceLabel: "From Value",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "from_value",
                  value: myParent.state.from_value,
                  events: {
                    onChange: (e) => myParent.textHandler(e),
                  },
                  others: {
                    type: "number",
                    // disabled: true,
                  },
                }}
              />

              <AlagehFormGroup
                div={{ className: "col form-group" }}
                label={{
                  forceLabel: "To Value",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "to_value",
                  value: myParent.state.to_value,
                  events: {
                    onChange: (e) => myParent.textHandler(e),
                  },
                  others: {
                    type: "number",
                  },
                }}
              />
              <AlagehFormGroup
                div={{ className: "col form-group" }}
                label={{
                  forceLabel: "Total Days",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "total_days",
                  value: myParent.state.total_days,
                  events: {
                    onChange: (e) => myParent.textHandler(e),
                  },
                  others: {
                    type: "number",
                  },
                }}
              />

              <div className="col">
                <button
                  onClick={myParent.addLeaveRules.bind(myParent)}
                  className="btn btn-primary"
                  style={{ marginTop: 19 }}
                >
                  Add to List
                </button>
              </div>
            </div>
            {/* <div className="row">
              <AlagehAutoComplete
                div={{ className: "col-2" }}
                label={{
                  forceLabel: "Value Type",
                  isImp: true
                }}
                selector={{
                  name: "value_type",
                  value: myParent.state.value_type,
                  className: "select-fld",
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.LEAVE_VALUE_TYP
                  },
                  onChange: value => myParent.dropDownHandler(value),
                  onClear: () => {
                    myParent.setState({
                      value_type: null
                    });
                  }
                }}
              />


            </div> */}
            <div className="row">
              <div className="col-12 margin-top-15" id="leaveRules_grid_cntr">
                <AlgaehDataGrid
                  id="leaveRules_grid"
                  columns={[
                    {
                      fieldName: "calculation_type",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Calculation Type" }}
                        />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.calculation_type === "CO"
                              ? "Component"
                              : row.calculation_type === "SL"
                              ? "Slab"
                              : null}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        return (
                          // <AlagehAutoComplete
                          //   selector={{
                          //     name: "calculation_type",
                          //     value: row.calculation_type,
                          //     className: "select-fld",
                          //     dataSource: {
                          //       textField: "name",
                          //       valueField: "value",
                          //       data: GlobalVariables.LEAVE_CALC_TYPE
                          //     },
                          //     onChange: myParent.changeGridEditors.bind(
                          //       myParent,
                          //       row
                          //     )
                          //   }}
                          // />
                          <span>
                            {row.calculation_type === "CO"
                              ? "Component"
                              : row.calculation_type === "SL"
                              ? "Slab"
                              : null}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "paytype",
                      label: <AlgaehLabel label={{ forceLabel: "Pay Type" }} />,
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.paytype === "NO"
                              ? "None"
                              : row.paytype === "FD"
                              ? "Full Day (1)"
                              : row.paytype === "HD"
                              ? "Half Day (1/2)"
                              : row.paytype === "UN"
                              ? "Unpaid"
                              : row.paytype === "QD"
                              ? "Quarter (1/4)"
                              : row.paytype === "TQ"
                              ? "Three Quarter Day (3/4)"
                              : null}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        return (
                          <AlagehAutoComplete
                            selector={{
                              name: "paytype",
                              value: row.paytype,
                              className: "select-fld",
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.LEAVE_PAY_TYPE,
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
                      fieldName: "from_value",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "From Value" }} />
                      ),
                      // editorTemplate: row => {
                      //   return (
                      //     <AlagehFormGroup
                      //       textBox={{
                      //         className: "txt-fld",
                      //         name: "from_value",
                      //         value: row.from_value,
                      //         events: {
                      //           onChange: myParent.changeGridEditors.bind(
                      //             myParent,
                      //             row
                      //           )
                      //         },
                      //         others: {
                      //           type: "number"
                      //         }
                      //       }}
                      //     />
                      //   );
                      // }
                    },
                    {
                      fieldName: "to_value",
                      label: <AlgaehLabel label={{ forceLabel: "To Value" }} />,
                      editorTemplate: (row) => {
                        return (
                          <AlagehFormGroup
                            textBox={{
                              className: "txt-fld",
                              name: "to_value",
                              value: row.to_value,
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
                    // {
                    //   fieldName: "value_type",
                    //   label: (
                    //     <AlgaehLabel label={{ forceLabel: " Value Type" }} />
                    //   ),
                    //   displayTemplate: row => {
                    //     return (
                    //       <span>
                    //         {row.value_type === "OV"
                    //           ? "Over This Value"
                    //           : row.value_type === "RA"
                    //             ? "Between the From and To"
                    //             : null}
                    //       </span>
                    //     );
                    //   },
                    //   editorTemplate: row => {
                    //     return (
                    //       <AlagehAutoComplete
                    //         selector={{
                    //           name: "value_type",
                    //           value: row.value_type,
                    //           className: "select-fld",
                    //           dataSource: {
                    //             textField: "name",
                    //             valueField: "value",
                    //             data: GlobalVariables.LEAVE_VALUE_TYP
                    //           },
                    //           onChange: myParent.changeGridEditors.bind(
                    //             myParent,
                    //             row
                    //           )
                    //         }}
                    //       />
                    //     );
                    //   }
                    // },
                    {
                      fieldName: "total_days",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Total Days" }} />
                      ),
                      editorTemplate: (row) => {
                        return (
                          <AlagehFormGroup
                            textBox={{
                              className: "txt-fld",
                              name: "total_days",
                              value: row.total_days,
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
                  keyId="hims_d_leave_rule_id"
                  dataSource={{
                    data: myParent.state.leaveRules,
                  }}
                  isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onEdit: () => {},
                    onDelete: myParent.deleteLeaveRule.bind(myParent),
                    onDone: myParent.updateLeaveRule.bind(myParent),
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default LeaveRules;
