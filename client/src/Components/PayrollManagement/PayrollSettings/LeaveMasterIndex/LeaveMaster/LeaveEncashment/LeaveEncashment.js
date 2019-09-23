import React from "react";
import "./LeaveEncashment.scss";
import Enumerable from "linq";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../../../Wrapper/algaehWrapper";

function LeaveEncashment(props) {
  let myParent = props.parent;

  return (
    <div className="Leave_Encashment">
      <div className="popRightDiv">
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
                data: myParent.state.earning_deductions
              },
              onChange: value => myParent.dropDownHandler(value),
              onClear: () => {
                myParent.setState({
                  earnings_id: null
                });
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col-3 form-group" }}
            label={{
              forceLabel: "Value %",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "percent",
              value: myParent.state.percent,
              events: {
                onChange: e => myParent.textHandler(e)
              },
              option: {
                type: "number"
              }
            }}
          />
          <div className="col-2">
            <button
              onClick={myParent.addLeaveEncash.bind(myParent)}
              className="btn btn-primary"
              style={{ marginTop: 21 }}
            >
              Add to List
            </button>
          </div>
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
                  displayTemplate: row => {
                    let x = Enumerable.from(myParent.state.earning_deductions)
                      .where(
                        w => w.hims_d_earning_deduction_id === row.earnings_id
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
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        selector={{
                          name: "earnings_id",
                          value: row.earnings_id,
                          className: "select-fld",
                          dataSource: {
                            textField: "earning_deduction_description",
                            valueField: "hims_d_earning_deduction_id",
                            data: myParent.state.earning_deductions
                          },
                          onChange: myParent.changeGridEditors.bind(
                            myParent,
                            row
                          )
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "percent",
                  label: <AlgaehLabel label={{ forceLabel: "Value %" }} />,
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        textBox={{
                          className: "txt-fld",
                          name: "percent",
                          value: row.percent,
                          events: {
                            onChange: myParent.changeGridEditors.bind(
                              myParent,
                              row
                            )
                          },
                          others: {
                            type: "number"
                          }
                        }}
                      />
                    );
                  }
                }
              ]}
              keyId="algaeh_d_module_id"
              dataSource={{
                data: myParent.state.leaveEncash
              }}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: myParent.deleteLeaveEncash.bind(myParent),
                onDone: myParent.updateLeaveEncash.bind(myParent)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveEncashment;
