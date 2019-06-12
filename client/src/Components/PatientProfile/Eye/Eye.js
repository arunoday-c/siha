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
import GlassPrescription from "./GlassPrescription";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

export default class Eye extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openRefraction: false,
      openCyclo: false,
      openAddVision: false,
      openPMT: false,
      openAddIOP: false,
      openGlassPres: false,
      PrescriptionData:[]
    };
    this.getGlassPrescription()
  }

  getGlassPrescription(){
    algaehApiCall({
      uri: "/opthometry/getGlassPrescription",
      data: {
        patient_id: Window.global["current_patient"],
        encounter_id:Window.global["encounter_id"],
        episode_id:Window.global["episode_id"]
      },
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          debugger
          let data = response.data.records
          for (let i = 0; i < data.length; i++) {

            data[i].multi_coated=data[i].multi_coated === "Y"?true:false
            data[i].varilux=data[i].varilux === "Y"?true:false
            data[i].light=data[i].light === "Y"?true:false
            data[i].aspheric=data[i].aspheric === "Y"?true:false
            data[i].bifocal=data[i].bifocal === "Y"?true:false
            data[i].medium=data[i].medium === "Y"?true:false
            data[i].lenticular=data[i].lenticular === "Y"?true:false
            data[i].single_vision=data[i].single_vision === "Y"?true:false
            data[i].dark=data[i].dark === "Y"?true:false
            data[i].safety_thickness=data[i].safety_thickness === "Y"?true:false
            data[i].anti_reflecting_coating=data[i].anti_reflecting_coating === "Y"?true:false
            data[i].photosensitive=data[i].photosensitive === "Y"?true:false
            data[i].high_index=data[i].high_index === "Y"?true:false
            data[i].colored=data[i].colored === "Y"?true:false
            data[i].anti_scratch=data[i].anti_scratch === "Y"?true:false
            // data[i].multi_coated = data[i].multi_coated === "Y"?true:false
            // data[i].varilux = data[i].varilux === "Y"?true:false
            // data[i].cr_39 = data[i].cr_39 === "Y"?true:false
            // data[i].unifocal = data[i].unifocal === "Y"?true:false
            // data[i].d_bifocal = data[i].d_bifocal === "Y"?true:false
            // data[i].kryptok = data[i].kryptok === "Y"?true:false
            // data[i].progressive = data[i].progressive === "Y"?true:false
            // data[i].office_lense = data[i].office_lense === "Y"?true:false
            // data[i].tint = data[i].tint === "Y"?true:false
            // data[i].photochromic = data[i].photochromic === "Y"?true:false
            // data[i].advice_arc = data[i].advice_arc === "Y"?true:false
            // data[i].advice_src = data[i].advice_src === "Y"?true:false
            // data[i].polarised = data[i].polarised === "Y"?true:false
            // data[i].advice_csl = data[i].advice_csl === "Y"?true:false
          }

          this.setState({
            PrescriptionData:data
          })
        }
      },
      onFailure: error => {
        // AlgaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  showModal(openModal) {
    
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
                    <GlassPrescription
                      openGlassPres={this.state.openGlassPres}
                      onClose={this.showModal.bind(this, "GlassPres")}
                      HeaderCaption="Glass Prescription"
                      PrescriptionData={this.state.PrescriptionData}
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
