import React, { Component } from "react";
import "./DiagramMaster.css";

import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup
} from "../Wrapper/algaehWrapper";

import AlgaehFileUploader from "../Wrapper/algaehFileUpload";
import MyContext from "../../utils/MyContext.js";
export default class DiagramMaster extends Component {
  render() {
    return (
      <div className="DiagramMasterScreen">
        <div className="row inner-top-search margin-bottom-15">
          <div className="col-lg-12">
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col-3 form-group" }}
                label={{ forceLabel: "Select Sub Department", isImp: false }}
                selector={{
                  name: "",
                  className: "select-fld",
                  dataSource: {},
                  others: {}
                }}
              />
              <div className="col form-group">
                {/* <AlgaehFileUploader
                  ref={patientImage => {
                    this.patientImage = patientImage;
                  }}
                  name="patientImage"
                  accept="image/*"
                  textAltMessage="Patient Image"
                  serviceParameters={{
                    //  uniqueID: this.state.patient_code,
                    //   destinationName: this.state.patient_code,
                    fileType: "Patients"
                    // processDelay: this.imageDetails.bind(
                    //   this,
                    //   context,
                    //   "patientImage"
                    // )
                  }}
                  renderPrevState={this.state.patientImage}
                  forceRefresh={this.state.forceRefresh}
                /> */}
                Upload Image comes Here
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Diagram List</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="DiagramListGrid_Cntr">
                    <AlgaehDataGrid
                      id="DiagramListGrid"
                      datavalidate="DiagramListGrid"
                      columns={[
                        {
                          fieldName: "SubDepartmentName",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Sub Department Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "Diagram_Name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "DiagramName" }}
                            />
                          )
                        },
                        {
                          fieldName: "Diagram_Image",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Diagram Preview" }}
                            />
                          )
                        }
                      ]}
                      keyId=""
                      dataSource={{ data: [] }}
                      isEditable={false}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 20 }}
                      events={{}}
                      others={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
