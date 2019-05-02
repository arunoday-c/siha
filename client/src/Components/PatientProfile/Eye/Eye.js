import React, { Component } from "react";
import "./Eye.css";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehModalPopUp,
  AlgaehDateHandler,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import EyeModal from "./EyeModal";
export default class Eye extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openRefraction: false,
      openCyclo: false,
      openAddVision: false,
      openPMT: false,
      openAddIOP: false,
      openGlassPres: false
    };
  }

  showModal(openModal) {
    debugger;
    if (openModal === "Refraction") {
      this.setState({
        openRefraction: !this.state.openRefraction
      });
    } else if (openModal === "Cyclo") {
      this.setState({
        openCyclo: !this.state.openCyclo
      });
    } else if (openModal === "PMT") {
      this.setState({
        openPMT: !this.state.openPMT
      });
    } else if (openModal === "AddVision") {
      this.setState({
        openAddVision: !this.state.openAddVision
      });
    } else if (openModal === "AddIOP") {
      this.setState({
        openAddIOP: !this.state.openAddIOP
      });
    } else if (openModal === "GlassPres") {
      this.setState({
        openGlassPres: !this.state.openGlassPres
      });
    }
  }
  render() {
    return (
      <div className="EyeScreen">
        <div className="row margin-top-15">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Past Ophthalmic History</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="EnterGridIdHere_Cntr">
                    <label>Ophthalmic History</label>
                    <textarea className="textArea" style={{ height: 100 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Refraction</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i
                      className="fas fa-plus"
                      onClick={this.showModal.bind(this, "Refraction")}
                    />
                    <EyeModal
                      openRefraction={this.state.openRefraction}
                      onClose={this.showModal.bind(this, "Refraction")}
                      HeaderCaption="Refraction"
                    />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="EnterGridIdHere_Cntr">
                    No Data Available
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Cyclo</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i
                      className="fas fa-plus"
                      onClick={this.showModal.bind(this, "Cyclo")}
                    />
                    <EyeModal
                      openCyclo={this.state.openCyclo}
                      onClose={this.showModal.bind(this, "Cyclo")}
                      HeaderCaption="Cyclo"
                    />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="EnterGridIdHere_Cntr">
                    No Data Available
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">PMT</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i
                      className="fas fa-plus"
                      onClick={this.showModal.bind(this, "PMT")}
                    />
                    <EyeModal
                      openPMT={this.state.openPMT}
                      onClose={this.showModal.bind(this, "PMT")}
                      HeaderCaption="PMT"
                    />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="EnterGridIdHere_Cntr">
                    No Data Available
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Add Vision</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i
                      className="fas fa-plus"
                      onClick={this.showModal.bind(this, "AddVision")}
                    />
                    <EyeModal
                      openAddVision={this.state.openAddVision}
                      onClose={this.showModal.bind(this, "AddVision")}
                      HeaderCaption="Add Vision"
                    />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="EnterGridIdHere_Cntr">
                    No Data Available
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Intraocular Pressure (IOP) mm of Hg
                  </h3>
                </div>
                <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i
                      className="fas fa-plus"
                      onClick={this.showModal.bind(this, "AddIOP")}
                    />
                    <EyeModal
                      openAddIOP={this.state.openAddIOP}
                      onClose={this.showModal.bind(this, "AddIOP")}
                      HeaderCaption="Intraocular Pressure (IOP)"
                    />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="EnterGridIdHere_Cntr">
                    No Data Available
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Glass Prescription</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i
                      className="fas fa-plus"
                      onClick={this.showModal.bind(this, "GlassPres")}
                    />
                    <EyeModal
                      openGlassPres={this.state.openGlassPres}
                      onClose={this.showModal.bind(this, "GlassPres")}
                      HeaderCaption="Glass Prescription"
                    />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="EnterGridIdHere_Cntr">
                    No Data Available
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
