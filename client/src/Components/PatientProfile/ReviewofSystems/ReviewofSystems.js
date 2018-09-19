import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import {
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
  getReviewOfSystems,
  getReviewOfSystemsDetails,
  getPatientROS,
  texthandle,
  updatePatientROS
} from "./ReviewofSystemsHandlers";
import swal from "sweetalert";
import { algaehApiCall } from "../../../utils/algaehApiCall";

class ReviewofSystems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openROSModal: false
    };
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount() {
    getReviewOfSystems(this);
    getPatientROS(this);
  }

  texthandler = ($this, data, ctrl, e) => {
    e = e || ctrl;
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    data[name] = value;
  };

  handleClose() {
    this.setState({ openROSModal: false });
  }

  rosDropDownHandle(value) {
    this.setState({ [value.name]: value.value }, () => {
      getReviewOfSystemsDetails(
        this,
        this.state.hims_d_review_of_system_header_id
      );
    });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  texthandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  addROS() {
    this.setState({
      openROSModal: true
    });
  }

  changeRosCommentEdit(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    this.reloadState();
  }
  componentDidCatch(error, info) {
    swal("Did Catch:" + error + "Info:" + info, {
      icon: "error",
      buttons: false,
      timer: 2000
    });
  }

  addPatientROS() {
    algaehApiCall({
      uri: "/doctorsWorkBench/addPatientROS",
      method: "POST",
      data: {
        patient_id: Window.global["current_patient"],
        episode_id: Window.global["episode_id"],
        review_header_id: this.state.hims_d_review_of_system_header_id,
        review_details_id: this.state.hims_d_review_of_system_details_id,
        comment: this.state.ros_comment
      },
      onSuccess: response => {
        if (response.data.success) {
          getPatientROS(this);
          swal("Review of System Added successfully . .", {
            icon: "success",
            buttons: false,
            timer: 2000
          });
          this.resetPatientROS();
        }
      },
      onFailure: error => {}
    });
  }

  resetPatientROS() {
    this.setState({
      hims_d_review_of_system_header_id: "",
      hims_d_review_of_system_details_id: "",
      ros_comment: ""
    });
  }

  deleteROS(row) {
    // console.log("delete Allergy row:", row);

    swal({
      title: "Are you sure you want to delete this Review of System?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        let data = {
          patient_id: Window.global["current_patient"],
          episode_id: Window.global["episode_id"],
          review_header_id: row.hims_d_review_of_system_header_id,
          review_details_id: row.hims_d_review_of_system_details_id,
          comment: row.comment,
          record_status: "A",
          hims_f_encounter_review_id: row.hims_f_encounter_review_id
        };
        algaehApiCall({
          uri: "/doctorsWorkBench/updatePatientROS",
          data: data,
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swal("Record deleted successfully . .", {
                icon: "success",
                buttons: false,
                timer: 2000
              });
              getPatientROS(this);
            }
          },
          onFailure: error => {}
        });
      } else {
        swal("Delete request cancelled");
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        {/* ROS Modal Start */}
        <Modal open={this.state.openROSModal}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Add Review Systems</h4>
            </div>
            <div className="popupInner">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4 popLeftDiv">
                    <div className="complain-box">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-12" }}
                        label={{
                          forceLabel: "Review System",
                          fieldName: "sample"
                        }}
                        selector={{
                          name: "hims_d_review_of_system_header_id",
                          className: "select-fld",
                          value: this.state.hims_d_review_of_system_header_id,
                          dataSource: {
                            textField: "description",
                            valueField: "hims_d_review_of_system_header_id",
                            data: this.props.allros
                          },
                          onChange: this.rosDropDownHandle.bind(this)
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          forceLabel: "Symptoms",
                          fieldName: "sample"
                        }}
                        selector={{
                          name: "hims_d_review_of_system_details_id",
                          className: "select-fld",
                          value: this.state.hims_d_review_of_system_details_id,
                          dataSource: {
                            textField: "detail_description",
                            valueField: "hims_d_review_of_system_details_id",
                            data: this.props.allrosdetails
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          forceLabel: "Remarks",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "ros_comment",
                          others: {
                            multiline: true,
                            rows: "4"
                          },
                          value: this.state.ros_comment,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-8 popRightDiv">
                    <h6> List of Review Systems</h6>
                    <hr />
                    <AlgaehDataGrid
                      id="ros-grid"
                      columns={[
                        {
                          fieldName: "header_description",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "System" }} />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "detail_description",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Symptoms" }} />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "comment",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Remarks" }} />
                          )
                        }
                      ]}
                      keyId="ros"
                      dataSource={{
                        data: this.props.patientros
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 5 }}
                      events={{
                        onDelete: this.deleteROS.bind(this),
                        onEdit: row => {},
                        onDone: updatePatientROS.bind(this, this)
                      }}
                    />

                    <div>
                      <AlagehFormGroup
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          forceLabel: "Overall comments",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "comment",
                          others: {
                            multiline: true,
                            rows: "4"
                          },
                          value: this.state.comment,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row popupFooter">
              <div className="col-lg-4">
                <button
                  onClick={this.addPatientROS.bind(this)}
                  type="button"
                  className="btn btn-primary"
                >
                  Add to Review List
                </button>
                <button
                  onClick={this.resetPatientROS.bind(this)}
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

        {/* ROS Modal End */}

        {/* BEGIN Portlet PORTLET */}
        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-30">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Review of Systems</h3>
            </div>
            <div className="actions">
              <a
                className="btn btn-primary btn-circle active"
                onClick={this.addROS.bind(this)}
              >
                <i className="fas fa-edit" />
              </a>
            </div>
          </div>
          <div className="portlet-body">
            <table className="table table-sm table-bordered customTable">
              <thead className="table-primary">
                <tr>
                  <th>System</th>
                  <th>Symptoms</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {this.props.patientros !== undefined
                  ? this.props.patientros.map((data, index) => (
                      <tr key={index}>
                        <td>{data.header_description}</td>
                        <td>{data.detail_description}</td>
                        <td>{data.comment}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
        {/* END Portlet PORTLET */}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    allros: state.allros,
    patientros: state.patientros,
    allrosdetails: state.allrosdetails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getReviewOfSystems: AlgaehActions,
      getReviewOfSystemsDetails: AlgaehActions,
      getPatientROS: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ReviewofSystems)
);
