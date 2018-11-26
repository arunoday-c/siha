import React, { Component } from "react";
import "./examination.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import Modal from "@material-ui/core/Modal";
import {
  getAllDepartmentBased,
  getPatientPhysicalExamination
} from "./ExaminationHandlers";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
  algaehApiCall,
  cancelRequest,
  swalMessage
} from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import Enumerable from "linq";
class Examination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openExamnModal: false,
      hims_d_physical_examination_header_id: "",
      hims_d_physical_examination_details_id: "",
      hims_d_physical_examination_subdetails_id: "",
      examination_comment: "",
      patientPhysicalExamination: [],
      specilityDetail: [],
      specilitySubDetail: [],
      examination_type: "S"
    };
    this.handleClose = this.handleClose.bind(this);
    if (
      this.props.all_patient_examinations === undefined ||
      this.props.all_patient_examinations.length === 0
    ) {
      getPatientPhysicalExamination(this);
      getAllDepartmentBased({ that: this });
    }
  }

  handleClose() {
    this.setState({ openExamnModal: false });
  }

  texthandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  updateExamination(data) {
    data.record_status = "A";
    algaehApiCall({
      uri: "/doctorsWorkBench/updatePatientPhysicalExam",
      data: data,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully . .",
            type: "success"
          });

          getPatientPhysicalExamination(this);
        }
      }
    });
  }
  componentWillUnmount() {
    cancelRequest("getAllDepartmentBased");
    cancelRequest("getPatientPhysicalExamination");
  }

  refreshState() {
    this.setState({ ...this.state });
  }

  texthandler(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    this.refreshState();
  }

  deletePatientExamn(row) {
    swal({
      title: "Are you sure you want to delete this EXamination?",
      type: "warning",
      buttons: true,
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
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
              swalMessage({
                title: "Examination deleted successfully . .",
                type: "success"
              });
            }
          }
        });
      } else {
        swalMessage({
          title: "Delete request cancelled.",
          type: "success"
        });
      }
    });
  }

  resetExmnState(clear) {
    clear =
      clear === undefined ? { hims_d_physical_examination_header_id: "" } : {};
    this.setState({
      hims_d_physical_examination_details_id: "",
      hims_d_physical_examination_subdetails_id: "",
      examination_comment: "",
      ...clear
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
          this.resetExmnState(true);
          swalMessage({
            title: "Examination added successfully . .",
            type: "success"
          });
        }
      }
    });
  }

  openExaminationModal() {
    // getPhysicalExaminations(this);
    if (
      this.props.allexaminations === undefined ||
      this.props.allexaminations.length === 0
    )
      getAllDepartmentBased({
        that: this,
        afterSucces: () => {
          this.setState({
            openExamnModal: true
          });
        }
      });
    else {
      this.setState({
        openExamnModal: true
      });
    }
  }

  headerDropDownHandle(value) {
    this.setState(
      { [value.name]: value.value }
      //   getPhysicalExaminationsDetails(this, value.value)
    );
  }

  detailDropDownHandle(value) {
    this.setState({ [value.name]: value.value }, () => {
      // getPhysicalExaminationsSubDetails(
      //   this,
      //   this.state.hims_d_physical_examination_details_id
      // );
    });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  changeGeneralOrSpecific(e) {
    const _examination_type = e.target.checked ? "G" : "S";
    getAllDepartmentBased({
      that: this,
      inputData: { allDept: _examination_type }
    });
    this.setState({
      examination_type: _examination_type
    });
  }
  onChangePhysicalExamination(selected) {
    this.setState({
      specilityDetail: Enumerable.from(selected.selected.list)
        .groupBy("$.hims_d_physical_examination_details_id ", null, (k, g) => {
          const _firs = Enumerable.from(g.getSource()).firstOrDefault();
          return {
            hims_d_physical_examination_details_id: k,
            detail_description: _firs.dtl_description,
            list: g.getSource()
          };
        })
        .toArray(),
      hims_d_physical_examination_header_id: selected.value
    });
  }
  onChangePhysicalExamitionDetail(selected) {
    this.setState({
      specilitySubDetail: Enumerable.from(selected.selected.list)
        .groupBy(
          "$.hims_d_physical_examination_subdetails_id ",
          null,
          (k, g) => {
            const _firs = Enumerable.from(g.getSource()).firstOrDefault();
            return {
              hims_d_physical_examination_subdetails_id: k,
              sub_detail_description: _firs.sub_dtl_description
            };
          }
        )
        .toArray(),
      hims_d_physical_examination_details_id: selected.value
    });
  }
  onClearPhysicalExam() {
    this.setState({
      hims_d_physical_examination_header_id: null,
      hims_d_physical_examination_details_id: null,
      hims_d_physical_examination_subdetails_id: null,
      specilityDetail: [],
      specilitySubDetail: []
    });
  }
  onClearPhysicalExamDetail() {
    this.setState({
      hims_d_physical_examination_details_id: null,
      hims_d_physical_examination_subdetails_id: null,
      specilitySubDetail: []
    });
  }
  render() {
    const _specility =
      this.props.allexaminations !== undefined &&
      this.props.allexaminations.length !== 0
        ? Enumerable.from(this.props.allexaminations)
            //    .where(w => w.examination_type === this.state.examination_type)
            .groupBy(
              "$.hims_d_physical_examination_header_id",
              null,
              (k, g) => {
                return {
                  hims_d_physical_examination_header_id: k,
                  description: Enumerable.from(g.getSource()).firstOrDefault()
                    .description,
                  list: g.getSource()
                };
              }
            )
            .toArray()
        : [];
    return (
      <React.Fragment>
        {/* Examination Modal Start*/}

        <Modal open={this.state.openExamnModal}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>Add Examination</h4>
                </div>
                <div className="col-lg-4">
                  <button type="button" className="" onClick={this.handleClose}>
                    <i className="fas fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>

            <div className="popupInner">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-3 popLeftDiv">
                    <label className="switch">
                      <input
                        className="switch-input"
                        type="checkbox"
                        onChange={this.changeGeneralOrSpecific.bind(this)}
                      />
                      <span
                        className="switch-label"
                        data-off="Specific"
                        data-on="General"
                      />
                      <span className="switch-handle" />
                    </label>
                    <div className="row">
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
                            textField: "description",
                            valueField: "hims_d_physical_examination_header_id",
                            data: _specility
                          },
                          onChange: this.onChangePhysicalExamination.bind(this),
                          onClear: this.onClearPhysicalExam.bind(this)
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
                            data: this.state.specilityDetail
                          },
                          onChange: this.onChangePhysicalExamitionDetail.bind(
                            this
                          ),
                          onClear: this.onClearPhysicalExamDetail.bind(this)
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
                            data: this.state.specilitySubDetail
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

                  <div className="col-lg-9 popRightDiv">
                    <h6>List of Examinations</h6>
                    <hr />
                    <AlgaehDataGrid
                      id="patient-exam-grid"
                      columns={[
                        {
                          fieldName: "header_description",
                          label: "Examination Type",
                          disabled: true
                        },
                        {
                          fieldName: "detail_description",
                          label: "Examination Description",
                          disabled: true
                        },
                        {
                          fieldName: "subdetail_description",
                          label: "Examination",
                          disabled: true
                        },

                        {
                          fieldName: "comments",
                          label: "Comments",
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.comments,
                                  className: "txt-fld",
                                  name: "comments",
                                  events: {
                                    onChange: this.texthandler.bind(this, row)
                                  }
                                }}
                              />
                            );
                          }
                        }
                      ]}
                      keyId="hims_f_episode_examination_id"
                      dataSource={{
                        data: this.props.all_patient_examinations
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onDelete: this.deletePatientExamn.bind(this),
                        onEdit: row => {},
                        onDone: this.updateExamination.bind(this)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" popupFooter">
              <div className="col-lg-12">
                <div className="row">
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
                      className="btn btn-default"
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
              <a
                className="btn btn-primary btn-circle active"
                onClick={this.openExaminationModal.bind(this)}
              >
                <i className="fas fa-edit" />
              </a>
            </div>
          </div>

          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="physicalExamination-grid-cntr">
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
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{}}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    allexaminations: state.allexaminations,
    all_patient_examinations: state.all_patient_examinations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAllDepartmentBased: AlgaehActions,
      getPatientPhysicalExamination: AlgaehActions
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
