import React, { Component } from "react";
import PatientDetails from "./PatientDetails/PatientDetails.js";

import "./registration.scss";
import PatRegIOputs from "../../Models/UpdatePatientDetails";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import MyContext from "../../utils/MyContext.js";
import { Validations } from "./FrontdeskValidation.js";
import AlgaehLabel from "../Wrapper/label.js";

import {
  algaehApiCall,
  swalMessage,
  getCookie,
} from "../../utils/algaehApiCall.js";
import { AlgaehModalPopUp } from "../Wrapper/algaehWrapper";

import {
  imageToByteArray,
  // AlgaehValidation,
} from "../../utils/GlobalFunctions";
import { setGlobal } from "../../utils/GlobalFunctions";
import { AlgaehActions } from "../../actions/algaehActions";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import moment from "moment";
import { SetBulkState } from "../../utils/GlobalFunctions";
import extend from "extend";
import { MainContext } from "algaeh-react-components";

class UpdatePatientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AdvanceOpen: false,
      RefundOpen: false,
      visittypeselect: true,
      clearEnable: false,
    };
  }

  UNSAFE_componentWillMount() {
    let IOputs = PatRegIOputs.inputParam();
    this.setState(IOputs);
    setGlobal({ selectedLang: "en" });
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    let prevLang = getCookie("Language");
    setGlobal({ selectedLang: prevLang });

    let IOputs = PatRegIOputs.inputParam();
    IOputs.mrn_num_sep_cop_client = userToken.mrn_num_sep_cop_client;
    IOputs.selectedLang = prevLang;
    this.setState(IOputs);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.show === true) {
      if (newProps.patient_code !== undefined && newProps.patient_code !== "") {
        this.getCtrlCode(newProps.patient_code);
      }
    }
  }

  SavePatientDetails(e) {
    SetBulkState({
      state: this,
      callback: () => {
        // AlgaehValidation({
        //   alertTypeIcon: "warning",
        //   querySelector: "data-validate='demographicDetails'",
        //   onSuccess: () => {
        const err = Validations(this);

        if (!err) {
          AlgaehLoader({ show: true });

          let patientdata = {};

          if (this.state.filePreview !== null) {
            patientdata = {
              ...this.state,
              patient_Image: imageToByteArray(this.state.filePreview),
            };
          } else {
            patientdata = this.state;
          }
          const _patImage = this.state.patientImage;
          const _patientIdCard = this.state.patientIdCard;

          delete patientdata.patSecInsuranceFrontImg;
          delete patientdata.patientIdCard;
          delete patientdata.patInsuranceFrontImg;
          delete patientdata.patInsuranceBackImg;
          delete patientdata.patSecInsuranceBackImg;
          delete patientdata.patientImage;
          delete patientdata.countrystates;
          delete patientdata.cities;

          let strUri = "";
          let strMethod = "";
          if (patientdata.hims_d_patient_id === null) {
            strUri = "/patientRegistration/registerPatient";
            strMethod = "POST";
          } else {
            strUri = "/patientRegistration/updatePatientData";
            strMethod = "PUT";
          }

          algaehApiCall({
            uri: strUri,
            module: "frontDesk",
            data: patientdata,
            method: strMethod,
            onSuccess: (response) => {
              // AlgaehLoader({ show: false });
              if (response.data.success) {
                let _arrayImages = [];
                if (_patImage !== undefined) {
                  _arrayImages.push(
                    new Promise((resolve, reject) => {
                      _patImage.SavingImageOnServer(
                        undefined,
                        undefined,
                        undefined,
                        this.state.patient_code,
                        () => {
                          resolve();
                        }
                      );
                    })
                  );
                }
                if (_patientIdCard !== undefined) {
                  _arrayImages.push(
                    new Promise((resolve, reject) => {
                      _patientIdCard.SavingImageOnServer(
                        undefined,
                        undefined,
                        undefined,
                        this.state.primary_id_no,
                        () => {
                          resolve();
                        }
                      );
                    })
                  );
                }

                Promise.all(_arrayImages).then((result) => {
                  AlgaehLoader({ show: false });
                  let IOputs = PatRegIOputs.inputParam();

                  // let tes = response.data.records.patient_code;
                  const patient_code =
                    patientdata.hims_d_patient_id === null
                      ? response.data.records.patient_code
                      : this.state.patient_code;
                  this.setState(IOputs, () => {
                    this.props.onClose &&
                      this.props.onClose({
                        data: true,
                        patient_code: patient_code,
                      });
                  });

                  swalMessage({
                    title: "Done Successfully",
                    type: "success",
                  });
                });
              }
            },
            onFailure: (error) => {
              AlgaehLoader({ show: false });
              swalMessage({
                title: error.message,
                type: "error",
              });
            },
          });
        }
        // }
        // });
      },
    });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  getCtrlCode(patcode) {
    let $this = this;

    AlgaehLoader({ show: true });

    algaehApiCall({
      uri: "/frontDesk/get",
      module: "frontDesk",
      method: "GET",
      data: { patient_code: patcode },
      onSuccess: (response) => {
        if (response.data.success) {
          let data = response.data.records;

          //Appoinment End

          data.patientRegistration.filePreview =
            "data:image/png;base64, " + data.patient_Image;
          data.patientRegistration.arabic_name =
            data.patientRegistration.arabic_name || "No Name";

          data.patientRegistration.date_of_birth = moment(
            data.patientRegistration.date_of_birth
          )._d;
          data.patientRegistration.saveEnable = false;
          delete data.visitDetails;
          $this.setState(data.patientRegistration);
        }
        AlgaehLoader({ show: false });
      },
      onFailure: (error) => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  onClose = (e) => {
    let IOputs = PatRegIOputs.inputParam();
    const exits_state = extend({}, this.state);

    this.setState(IOputs, () => {
      this.props.onClose &&
        this.props.onClose({
          data: false,
          patient_code: exits_state.patient_code,
        });
    });
  };

  render() {
    return (
      <div>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this),
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.show}
          class={this.state.lang_sets + "advanceRefundModal"}
        >
          <div className="col-12">
            <AlgaehLabel
              label={{
                fieldName: "patient_code",
              }}
            />
            <h6>
              {this.state.patient_code ? this.state.patient_code : "--------"}
            </h6>
          </div>
          <div className="col-lg-12 popupInner">
            <MyContext.Provider
              value={{
                state: this.state,
                updateState: (obj) => {
                  this.setState({ ...obj });
                },
              }}
            >
              <div className="row">
                <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-8">
                  <PatientDetails
                    PatRegIOputs={this.state}
                    clearData={this.state.clearData}
                  />
                </div>
              </div>
            </MyContext.Provider>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.SavePatientDetails.bind(this)}
                    // disabled={this.state.saveEnable}
                  >
                    <AlgaehLabel
                      label={{ fieldName: "btn_save", returnText: true }}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={(e) => {
                      this.onClose(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patients: state.patients,
    countries: state.countries,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientDetails: AlgaehActions,
      getCountries: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UpdatePatientDetails)
);
