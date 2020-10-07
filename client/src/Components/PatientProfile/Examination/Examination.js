import React, { Component } from "react";
import "./examination.scss";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";
import {
  getAllDepartmentBased,
  getPatientPhysicalExamination,
} from "./ExaminationHandlers";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
  algaehApiCall,
  cancelRequest,
  swalMessage,
} from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import Enumerable from "linq";
import NursesNotes from "./NursesNotes";
class Examination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openExamnModal: false,
      hims_d_physical_examination_header_id: null,
      hims_d_physical_examination_details_id: null,
      hims_d_physical_examination_subdetails_id: null,
      examination_comment: "",
      patientPhysicalExamination: [],
      specilityDetail: [],
      specilitySubDetail: [],
      examination_type: "S",
    };
    this.handleClose = this.handleClose.bind(this);
    if (
      this.props.all_patient_examinations === undefined ||
      this.props.all_patient_examinations.length === 0
    ) {
      getPatientPhysicalExamination(this);
      getAllDepartmentBased({ that: this, inputData: { allDept: "S" } });
    }
  }

  handleClose(e) {
    this.props.onClose && this.props.onClose(e);
  }

  texthandle(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  updateExamination(data) {
    data.record_status = "A";
    algaehApiCall({
      uri: "/doctorsWorkBench/updatePatientPhysicalExam",
      data: data,
      method: "PUT",
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully . .",
            type: "success",
          });

          getPatientPhysicalExamination(this);
        }
      },
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
      confirmButtonText: "Yes",
      confirmButtonColor: "#",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        const { current_patient, episode_id } = Window.global;
        algaehApiCall({
          uri: "/doctorsWorkBench/updatePatientPhysicalExam",
          method: "PUT",
          data: {
            patient_id: current_patient, //Window.global["current_patient"],
            episode_id: episode_id, //Window.global["episode_id"],
            exam_header_id: row.hims_d_physical_examination_header_id,
            exam_details_id: row.hims_d_physical_examination_details_id,
            exam_subdetails_id: row.hims_d_physical_examination_subdetails_id,
            comments: row.comments,
            record_status: "I",
            hims_f_episode_examination_id: row.hims_f_episode_examination_id,
          },
          onSuccess: (response) => {
            if (response.data.success) {
              getPatientPhysicalExamination(this);
              swalMessage({
                title: "Examination deleted successfully . .",
                type: "success",
              });
            }
          },
        });
      }
    });
  }

  resetExmnState(clear) {
    clear =
      clear === undefined ? { hims_d_physical_examination_header_id: "" } : {};
    this.setState({
      hims_d_physical_examination_header_id: null,

      hims_d_physical_examination_details_id: null,
      hims_d_physical_examination_subdetails_id: null,
      examination_comment: "",
      ...clear,
    });
  }

  addExaminationToPatient() {
    const { current_patient, episode_id } = Window.global;
    algaehApiCall({
      uri: "/doctorsWorkBench/addPatientPhysicalExamination",
      method: "POST",
      data: {
        patient_id: current_patient, //Window.global["current_patient"],
        episode_id: episode_id, //Window.global["episode_id"],
        exam_header_id: this.state.hims_d_physical_examination_header_id,
        exam_details_id: this.state.hims_d_physical_examination_details_id,
        exam_subdetails_id: this.state
          .hims_d_physical_examination_subdetails_id,
        comments: this.state.examination_comment,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          getPatientPhysicalExamination(this);
          this.resetExmnState(true);
          swalMessage({
            title: "Examination added successfully . .",
            type: "success",
          });
        }
      },
    });
  }

  headerDropDownHandle(value) {
    this.setState(
      { [value.name]: value.value }
      //   getPhysicalExaminationsDetails(this, value.value)
    );
  }

  detailDropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  changeGeneralOrSpecific(e) {
    const _examination_type = e.target.checked ? "G" : "S";
    getAllDepartmentBased({
      that: this,
      inputData: { allDept: _examination_type },
    });
    this.setState({
      examination_type: _examination_type,
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
            list: g.getSource(),
          };
        })
        .toArray(),
      hims_d_physical_examination_header_id: selected.value,
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
              sub_detail_description: _firs.sub_dtl_description,
            };
          }
        )
        .toArray(),
      hims_d_physical_examination_details_id: selected.value,
    });
  }
  onClearPhysicalExam() {
    this.setState({
      hims_d_physical_examination_header_id: null,
      hims_d_physical_examination_details_id: null,
      hims_d_physical_examination_subdetails_id: null,
      specilityDetail: [],
      specilitySubDetail: [],
    });
  }
  onClearPhysicalExamDetail() {
    this.setState({
      hims_d_physical_examination_details_id: null,
      hims_d_physical_examination_subdetails_id: null,
      specilitySubDetail: [],
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
                  list: g.getSource(),
                };
              }
            )
            .toArray()
        : [];
    return (
      <React.Fragment>
        {/* Examination Modal Start*/}

        <AlgaehModalPopUp
          events={{
            onClose: this.handleClose.bind(this),
          }}
          title="Add Examination"
          openPopup={this.props.openExamnModal}
        >
          <div className="popupInner">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-7 popLeftDiv">
                  <h6>Enter Examinations</h6>
                  <hr />
                  <div className="row">
                    <div className="col form-group">
                      <label>Examination Categotry</label>
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
                    </div>
                    <AlagehAutoComplete
                      div={{ className: "col form-group" }}
                      label={{
                        fieldName: "exmn_type",
                      }}
                      selector={{
                        name: "hims_d_physical_examination_header_id",
                        className: "select-fld",
                        value: this.state.hims_d_physical_examination_header_id,
                        dataSource: {
                          textField: "description",
                          valueField: "hims_d_physical_examination_header_id",
                          data: _specility,
                        },
                        onChange: this.onChangePhysicalExamination.bind(this),
                        onClear: this.onClearPhysicalExam.bind(this),
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col form-group" }}
                      label={{
                        fieldName: "exmn_desc",
                      }}
                      selector={{
                        name: "hims_d_physical_examination_details_id",
                        className: "select-fld",
                        value: this.state
                          .hims_d_physical_examination_details_id,
                        dataSource: {
                          textField: "detail_description",
                          valueField: "hims_d_physical_examination_details_id",
                          data: this.state.specilityDetail,
                        },
                        onChange: this.onChangePhysicalExamitionDetail.bind(
                          this
                        ),
                        onClear: this.onClearPhysicalExamDetail.bind(this),
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col form-group" }}
                      label={{
                        fieldName: "exmn",
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
                          data: this.state.specilitySubDetail,
                        },
                        onChange: this.dropDownHandle.bind(this),
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-12 form-group" }}
                      label={{
                        fieldName: "comments",
                        isImp: false,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "examination_comment",
                        others: {
                          multiline: true,
                          rows: "2",
                        },
                        value: this.state.examination_comment,
                        events: {
                          onChange: this.texthandle.bind(this),
                        },
                      }}
                    />
                    <div className="col-12" style={{ textAlign: "right" }}>
                      <button
                        onClick={this.resetExmnState.bind(this)}
                        type="button"
                        className="btn btn-default"
                      >
                        Clear
                      </button>
                      <button
                        onClick={this.addExaminationToPatient.bind(this)}
                        type="button"
                        style={{ marginLeft: 5 }}
                        className="btn btn-primary"
                        disabled={
                          this.state.hims_d_physical_examination_header_id
                            ? false
                            : true
                        }
                      >
                        Add Examination
                      </button>
                    </div>
                    <div className="col-12 patientExamGrid_Cntr">
                      <AlgaehDataGrid
                        className="patientExamGrid"
                        columns={[
                          {
                            fieldName: "header_description",
                            label: "Type",
                            disabled: true,
                          },
                          {
                            fieldName: "detail_description",
                            label: "Description",
                            disabled: true,
                          },
                          {
                            fieldName: "subdetail_description",
                            label: "Examination",
                            disabled: true,
                          },

                          {
                            fieldName: "comments",
                            label: "Comments",
                            editorTemplate: (row) => {
                              return (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.comments,
                                    className: "txt-fld",
                                    name: "comments",
                                    events: {
                                      onChange: this.texthandler.bind(
                                        this,
                                        row
                                      ),
                                    },
                                  }}
                                />
                              );
                            },
                          },
                        ]}
                        keyId="hims_f_episode_examination_id"
                        dataSource={{
                          data: this.props.all_patient_examinations,
                        }}
                        isEditable={true}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        events={{
                          onDelete: this.deletePatientExamn.bind(this),
                          onEdit: (row) => {},
                          onDone: this.updateExamination.bind(this),
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="col-5 popRightDiv"
                  style={{ maxHeight: "75vh" }}
                >
                  <NursesNotes
                    patient_id={Window?.global?.current_patient}
                    episode_id={Window?.global?.episode_id}
                    visit_id={Window?.global?.visit_id}
                  />
                </div>
                {/* <h6>Enter Nursing Notes</h6>
                  <hr />
                  <div className="row">
                    {" "}
                    <AlagehFormGroup
                      div={{ className: "col-12 form-group" }}
                      label={{
                        forceLabel: "Notes",
                        isImp: false,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "examination_comment",
                        others: {
                          multiline: true,
                          rows: "3",
                        },
                        value: this.state.examination_comment,
                        events: {
                          onChange: this.texthandle.bind(this),
                        },
                      }}
                    />
                    <div className="col-12" style={{ textAlign: "right" }}>
                      <button className="btn btn-primary">Add Notes</button>
                    </div>
                    <div className="col-12 patientNotesGrid_Cntr">
                      <AlgaehDataGrid
                        className="patientNotesGrid"
                        columns={[
                          {
                            fieldName: "",
                            label: "Notes",
                            disabled: true,
                          },
                          {
                            fieldName: "",
                            label: "Entered by & Date",
                            disabled: true,
                          },
                        ]}
                        keyId=""
                        dataSource=""
                        isEditable={true}
                        paging={{ page: 0, rowsPerPage: 10 }}
                      />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.handleClose.bind(this)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    allexaminations: state.allexaminations,
    all_patient_examinations: state.all_patient_examinations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAllDepartmentBased: AlgaehActions,
      getPatientPhysicalExamination: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Examination)
);
