import React from "react";

import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";

import "./FinalSettlement.css";

function FinalSettlement(props) {
  let myParent = props.parent;

  return (
    <div className="FinalSettlementScreen">
      <div className="row  inner-top-search">
        <AlagehAutoComplete
          div={{ className: "col-3 form-group" }}
          label={{ forceLabel: "Search by Settlement No.", isImp: false }}
          selector={{
            name: "",
            className: "select-fld",
            dataSource: {},
            others: {}
          }}
        />
        <AlagehAutoComplete
          div={{ className: "col-3 form-group" }}
          label={{ forceLabel: "End of Service Type", isImp: true }}
          selector={{
            name: "",
            className: "select-fld",
            dataSource: {},
            others: {}
          }}
        />

        <div className="col-3" style={{ marginTop: 10 }}>
          <div
            className="row"
            style={{
              border: " 1px solid #ced4d9",
              borderRadius: 5,
              marginLeft: 0
            }}
          >
            <div className="col">
              <AlgaehLabel label={{ forceLabel: "Select a Employee." }} />
              <h6>-------</h6>
            </div>

            <div
              className="col-lg-3"
              style={{ borderLeft: "1px solid #ced4d8" }}
            >
              <i
                className="fas fa-search fa-lg"
                style={{
                  paddingTop: 17,
                  paddingLeft: 3,
                  cursor: "pointer"
                }}
              />
            </div>
          </div>
        </div>

        <div className="col">
          <div className="customCheckbox" style={{ marginTop: 24 }}>
            <label className="checkbox inline">
              <input type="checkbox" value="" name="Forfeiture" />
              <span>Forfeiture</span>
            </label>
          </div>
        </div>
        <div className="col form-group">
          <button style={{ marginTop: 21 }} className="btn btn-primary">
            Load
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-body">
              <div className="col-12" style={{ marginTop: 7 }}>
                <div className="row">
                  <div className="col-12 algaehLabelFormGroup">
                    <label className="algaehLabelGroup">
                      Employee Information
                    </label>
                    <div className="row">
                      <div className="col">
                        <label className="style_Label ">Employee Code</label>
                        <h6>-------</h6>
                      </div>

                      <div className="col">
                        <label className="style_Label ">Employee Name</label>
                        <h6>-------</h6>
                      </div>

                      <div className="col">
                        <label className="style_Label ">Department</label>
                        <h6>-------</h6>
                      </div>

                      <div className="col">
                        <label className="style_Label ">Designation</label>
                        <h6>-------</h6>
                      </div>

                      <div className="col">
                        <label className="style_Label ">Employee Status</label>
                        <h6>-------</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Earnings</h3>
              </div>
              <div className="actions">
                {/* <a className="btn btn-primary btn-circle active">
                        <i className="fas fa-calculator" /> 
                      </a>*/}
              </div>
            </div>

            <div className="portlet-body">
              <div className="row">
                <div className="col-lg-12" id="Salary_Earning_Cntr">
                  <AlgaehDataGrid
                    id="Salary_Earning_Cntr_grid"
                    columns={[
                      {
                        fieldName: "",
                        label: "Description"
                        //disabled: true
                      },
                      {
                        fieldName: "",
                        label: "Amount",
                        others: {
                          maxWidth: 100
                        }
                      }
                    ]}
                    //        keyId="algaeh_d_module_id"
                    dataSource={{
                      data: []
                    }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      onDelete: () => {},
                      onDone: () => {}
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Employee Deduction</h3>
              </div>
              <div className="actions">
                {/*    <a className="btn btn-primary btn-circle active">
                     <i className="fas fa-calculator" />
                      </a> */}
              </div>
            </div>

            <div className="portlet-body">
              <div className="row">
                <div className="col-lg-12" id="Employee_Deductions_Cntr">
                  <AlgaehDataGrid
                    id="Employee_Deductions_Cntr_grid"
                    columns={[
                      {
                        fieldName: "",
                        label: "Description"
                        //disabled: true
                      },
                      {
                        fieldName: "",
                        label: "Amount",
                        others: {
                          maxWidth: 100
                        }
                      }
                    ]}
                    //    keyId="algaeh_d_module_id"
                    dataSource={{
                      data: []
                    }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      onDelete: () => {},
                      onDone: () => {}
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Employer Contribution</h3>
              </div>
              <div className="actions">
                {/*    <a className="btn btn-primary btn-circle active">
                      <i className="fas fa-calculator" /> 
                      </a>*/}
              </div>
            </div>

            <div className="portlet-body">
              <div className="row">
                <div className="col-lg-12" id="Employer_Contribution_Cntr">
                  <AlgaehDataGrid
                    id="Employer_Contribution_Cntr_grid"
                    columns={[
                      {
                        fieldName: "",
                        label: "Description"
                        //disabled: true
                      },
                      {
                        fieldName: "",
                        label: "Amount",
                        others: {
                          maxWidth: 100
                        }
                      }
                    ]}
                    // keyId="algaeh_d_module_id"
                    dataSource={{
                      data: []
                    }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      onDelete: () => {},
                      onDone: () => {}
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <button
              type="button"
              className="btn btn-primary"
              //   onClick={SaveDoctorCommission.bind(this, this)}
              //disabled={this.state.saveEnable}
            >
              <AlgaehLabel label={{ forceLabel: "Save", returnText: true }} />
            </button>

            <button
              type="button"
              className="btn btn-default"
              //onClick={ClearData.bind(this, this)}
            >
              <AlgaehLabel label={{ forceLabel: "Clear", returnText: true }} />
            </button>

            <button type="button" className="btn btn-other">
              <AlgaehLabel
                label={{
                  forceLabel: "Delete"
                  //   returnText: true
                }}
              />
            </button>
            <button type="button" className="btn btn-other">
              <AlgaehLabel
                label={{
                  forceLabel: "Print"
                  //   returnText: true
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinalSettlement;
