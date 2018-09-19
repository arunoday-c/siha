import React, { Component } from "react";
import "./examination.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import Modal from "@material-ui/core/Modal";
import {
  getPhysicalExaminations,
  getPhysicalExaminationsDetails,
  getPhysicalExaminationsSubDetails,
  getPatientPhysicalExamination
} from "./ExaminationHandlers";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";

class Examination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openExamnModal: false,
      hims_d_physical_examination_header_id: "",
      hims_d_physical_examination_details_id: "",
      hims_d_physical_examination_subdetails_id: "",
      examination_comment: ""
    };
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ openExamnModal: false });
  }

  texthandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  componentDidMount() {
    getPhysicalExaminations(this);
    getPatientPhysicalExamination(this);
  }

  deletePatientExamn(row) {
    swal({
      title: "Are you sure you want to delete this EXamination?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        algaehApiCall({
          uri: "/doctorsWorkBench/updatePatientPhysicalExam",
          method: "PUT",
          data: {
            patient_id: Window.global["current_patient"],
            episode_id: Window.global["episode_id"],
            exam_header_id: row.hims_d_physical_examination_header_id,
            exam_details_id: row.hims_d_physical_examination_details_id,
            exam_subdetails_id: row.hims_d_physical_examination_subdetails_id,
            comments: row.comments,
            record_status: "I",
            hims_f_episode_examination_id: row.hims_f_episode_examination_id
          },
          onSuccess: response => {
            if (response.data.success) {
              getPatientPhysicalExamination(this);
              swal("Examination deleted successfully . .", {
                icon: "success",
                buttons: false,
                timer: 2000
              });
            }
          },
          onFailure: error => {}
        });
      } else {
        swal("Delete request cancelled");
      }
    });
  }

  resetExmnState() {
    debugger;
    this.setState({
      hims_d_physical_examination_header_id: "",
      hims_d_physical_examination_details_id: "",
      hims_d_physical_examination_subdetails_id: "",
      examination_comment: ""
    });
  }

  addExaminationToPatient() {
    algaehApiCall({
      uri: "/doctorsWorkBench/addPatientPhysicalExamination",
      method: "POST",
      data: {
        patient_id: Window.global["current_patient"],
        episode_id: Window.global["episode_id"],
        exam_header_id: this.state.hims_d_physical_examination_header_id,
        exam_details_id: this.state.hims_d_physical_examination_details_id,
        exam_subdetails_id: this.state
          .hims_d_physical_examination_subdetails_id,
        comments: this.state.examination_comment
      },
      onSuccess: response => {
        if (response.data.success) {
          getPatientPhysicalExamination(this);
          this.resetExmnState();
          swal("Examination added successfully . .", {
            icon: "success",
            buttons: false,
            timer: 2000
          });
        }
      },
      onFailure: error => {}
    });
  }

  openExaminationModal() {
    this.setState({ openExamnModal: true });
  }

  headerDropDownHandle(value) {
    this.setState(
      { [value.name]: value.value },
      getPhysicalExaminationsDetails(this, value.value)
    );
  }

  detailDropDownHandle(value) {
    this.setState({ [value.name]: value.value }, () => {
      getPhysicalExaminationsSubDetails(
        this,
        this.state.hims_d_physical_examination_details_id
      );
    });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  render() {
    return (
      <React.Fragment>
        {/* Examination Modal Start*/}

        <Modal open={this.state.openExamnModal}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Add Examination</h4>
            </div>
            <div className="popupInner">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4 popLeftDiv">
                    <div className="complain-box">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-12" }}
                        label={{
                          forceLabel: "Examination Type"
                        }}
                        selector={{
                          name: "hims_d_physical_examination_header_id",
                          className: "select-fld",
                          value: this.state
                            .hims_d_physical_examination_header_id,
                          dataSource: {
                            textField: "header_description",
                            valueField: "hims_d_physical_examination_header_id",
                            data:
                              this.props.allexaminations !== undefined
                                ? this.props.allexaminations[0]
                                : []
                          },
                          onChange: this.headerDropDownHandle.bind(this)
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          forceLabel: "Examination Description"
                        }}
                        selector={{
                          name: "hims_d_physical_examination_details_id",
                          className: "select-fld",
                          value: this.state
                            .hims_d_physical_examination_details_id,
                          dataSource: {
                            textField: "detail_description",
                            valueField:
                              "hims_d_physical_examination_details_id",
                            data: this.props.allexaminationsdetails
                          },
                          onChange: this.detailDropDownHandle.bind(this)
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          forceLabel: "Examination"
                        }}
                        selector={{
                          name: "hims_d_physical_examination_subdetails_id",
                          className: "select-fld",
                          value: this.state
                            .hims_d_physical_examination_subdetails_id,
                          dataSource: {
                            textField: "sub_detail_description",
                            valueField:
                              "hims_d_physical_examination_subdetails_id",
                            data: this.props.allexaminationsubdetails
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          fieldName: "comments",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "examination_comment",
                          others: {
                            multiline: true,
                            rows: "4"
                          },
                          value: this.state.examination_comment,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-lg-8 popRightDiv">
                    <h6> List of Examinations</h6>
                    <hr />
                    <AlgaehDataGrid
                      id="patient-exam-grid"
                      columns={[
                        {
                          fieldName: "header_description",
                          label: "Examination Type"
                        },
                        {
                          fieldName: "detail_description",
                          label: "Examination Description"
                        },
                        {
                          fieldName: "subdetail_description",
                          label: "Examination"
                        },

                        {
                          fieldName: "comments",
                          label: "Comments"
                        }
                      ]}
                      keyId="hims_f_episode_examination_id"
                      dataSource={{
                        data: this.props.all_patient_examinations
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 5 }}
                      events={{
                        onDelete: this.deletePatientExamn.bind(this)
                        // onEdit: row => {},
                        // onDone: row => {
                        //   alert(JSON.stringify(row));
                        // }
                        // onDone: this.updateVisaTypes.bind(this)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row popupFooter">
              <div className="col-lg-4">
                <button
                  onClick={this.addExaminationToPatient.bind(this)}
                  type="button"
                  className="btn btn-primary"
                >
                  Add Examination
                </button>
                <button
                  onClick={this.resetExmnState.bind(this)}
                  type="button"
                  className="btn btn-other"
                >
                  Clear
                </button>
              </div>
              <div className="col-lg-8">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={this.handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Examination Modal End */}
        <div className="portlet portlet-bordered box-shadow-normal margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Physical Examination</h3>
            </div>

            <div className="actions">
              <a className="btn btn-primary btn-circle active">
                <i
                  onClick={this.openExaminationModal.bind(this)}
                  className="fas fa-edit"
                />
              </a>
            </div>
          </div>

          <div className="portlet-body">
            <div className="col-lg-12">
              <div className="row" style={{ marginBottom: "10px" }}>
                <div className="col-4">
                  {/* <div className="form-group">
                          <label>Search</label>
                          <div className="input-group">
                            <input type="text" className="form-control" />
                            <div className="input-group-append">
                              <span className="input-group-text">
                                <i className="fas fa-search" />
                              </span>
                            </div>
                          </div>
                        </div> */}
                </div>
              </div>
            </div>

            <AlgaehDataGrid
              id="patient-examn-grid"
              columns={[
                {
                  fieldName: "header_description",
                  label: "Examination Type"
                },
                {
                  fieldName: "detail_description",
                  label: "Examination Description"
                },
                {
                  fieldName: "subdetail_description",
                  label: "Examination"
                },

                {
                  fieldName: "comments",
                  label: "Comments"
                }
              ]}
              keyId="hims_f_episode_examination_id"
              dataSource={{
                data: this.props.all_patient_examinations
              }}
              isEditable={false}
              paging={{ page: 0, rowsPerPage: 5 }}
              events={
                {
                  // onDelete: this.deleteVisaType.bind(this),
                  // onEdit: row => {},
                  // onDone: row => {
                  //   alert(JSON.stringify(row));
                  // }
                  // onDone: this.updateVisaTypes.bind(this)
                }
              }
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    allexaminations: state.allexaminations,
    allexaminationsdetails: state.allexaminationsdetails,
    allexaminationsubdetails: state.allexaminationsubdetails,
    all_patient_examinations: state.all_patient_examinations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPhysicalExaminations: AlgaehActions,
      getPhysicalExaminationsDetails: AlgaehActions,
      getPatientPhysicalExamination: AlgaehActions,
      getPhysicalExaminationsSubDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Examination)
);
