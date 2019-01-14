import React from "react";

import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";

import "./EOSGratuity.css";

function EOSGratuity(props) {
  let myParent = props.parent;

  return (
    <div>
      <div className="row  inner-top-search">
        <AlagehAutoComplete
          div={{ className: "col-3 form-group" }}
          label={{ forceLabel: "End of Service Type", isImp: false }}
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

        <div className="col form-group">
          <button style={{ marginTop: 21 }} className="btn btn-primary">
            Load
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Retairment Details</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="col-12" style={{ marginTop: 15 }}>
                <div className="row">
                  <div className="col-lg-8 algaehLabelFormGroup">
                    <label className="algaehLabelGroup">
                      Employee Information
                    </label>
                    <div className="row">
                      <div className="col-3">
                        <label className="style_Label ">Employee Code</label>
                        <h6>-------</h6>
                      </div>

                      <div className="col-3">
                        <label className="style_Label ">Employee Name</label>
                        <h6>-------</h6>
                      </div>

                      <div className="col-3">
                        <label className="style_Label ">Date of Birth</label>
                        <h6>-------</h6>
                      </div>

                      <div className="col-3">
                        <label className="style_Label ">Gender</label>
                        <h6>-------</h6>
                      </div>

                      <div className="col-3">
                        <label className="style_Label ">Grade</label>
                        <h6>-------</h6>
                      </div>

                      <div className="col-3">
                        <label className="style_Label ">Department</label>
                        <h6>-------</h6>
                      </div>

                      <div className="col-3">
                        <label className="style_Label ">Date of Joining</label>
                        <h6>DD/MM/YYYY</h6>
                      </div>

                      <div className="col-3">
                        <label className="style_Label ">Date of Leaving</label>
                        <h6>DD/MM/YYYY</h6>
                      </div>

                      <div className="col-3">
                        <label className="style_Label ">Year of Service</label>
                        <h6> 4 yrs</h6>
                      </div>
                      <div className="col-3">
                        <label className="style_Label ">Eligiable Days</label>
                        <h6> 4 yrs</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-4 algaehLabelFormGroup">
                    <label className="algaehLabelGroup">
                      Componenets Included
                    </label>
                    <div className="row">
                      <div className="col">COMPONENETS INCLUDED</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-body">
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col form-group" }}
                  label={{
                    forceLabel: "Opening Gratuity Amount",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "",
                    value: "",
                    events: {},
                    others: {
                      disabled: "disabled"
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col form-group" }}
                  label={{
                    forceLabel: "Computed Amount",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "",
                    value: "",
                    events: {},
                    others: {
                      disabled: "disabled"
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col form-group" }}
                  label={{
                    forceLabel: "Payable Amount",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "",
                    value: "",
                    events: {},
                    others: {}
                  }}
                />
                <div className="col">
                  <div className="customCheckbox" style={{ marginTop: 24 }}>
                    <label className="checkbox inline">
                      <input type="checkbox" value="" name="Forfeiture" />
                      <span>Forfeiture</span>
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <label>Remarks</label>
                  <textarea className="textArea" />
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

export default EOSGratuity;
