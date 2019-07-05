import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import RichTextEditor from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./RadResultEntry.css";
import "./../../../styles/site.css";
import {
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlgaehLabel,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";
import {
  RAD_EXAM_STATUS,
  FORMAT_RAD_STATUS,
  RAD_REPORT_TYPE
} from "../../../utils/GlobalVariables.json";
import {
  texthandle,
  examhandle,
  templatehandle,
  rtehandle,
  onvalidate
} from "./RadResultEntryEvents";
import AlgaehFileUploader from "../../Wrapper/algaehFileUpload";

class RadResultEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      template_id: null,
      result_html: null,
      pre_exam_status: null,
      exam_start_date_time: null,
      exam_end_date_time: null,
      changesDone: false,
      comments: ""
    };
  }

  componentDidMount() {
    if (
      this.props.radiologyusers === undefined ||
      this.props.radiologyusers.length === 0
    ) {
      this.props.getUserDetails({
        uri: "/algaehappuser/selectAppUsers",
        method: "GET",
        redux: {
          type: "RAD_EMP_GET_DATA",
          mappingName: "radiologyusers"
        }
      });
    }
  }
  componentWillReceiveProps(newProps) {
    if (
      newProps.selectedPatient !== undefined &&
      (newProps.radschlist === undefined || newProps.radschlist.length === 0)
    ) {
      if (this.state.changesDone === false) {
        newProps.selectedPatient.pre_exam_status =
          newProps.selectedPatient.exam_status;

        this.setState({ ...this.state, ...newProps.selectedPatient });
      }
    } else {
      this.setState({ ...this.state, ...newProps.radschlist[0] });
    }
  }
  onClose = e => {
    this.props.getRadiologyTestList({
      redux: {
        type: "RAD_LIST_GET_DATA",
        mappingName: "radschlist",
        data: []
      }
    });
    this.setState(
      {
        template_id: null,
        result_html: null,
        pre_exam_status: null,
        exam_start_date_time: null,
        exam_end_date_time: null,
        changesDone: false,
        comments: ""
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  dateFormater({ value }) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  textAreaEvent(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value
    });
  }

  render() {
    let validateDisable =
      this.state.exam_status === "CO"
        ? this.state.status === "RA"
          ? true
          : false
        : true;
    return (
      <div className="RadResultEntry">
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title="Result Entry"
          openPopup={this.props.open}
        >
          <div className="popupInner RadResultEntryPopupInner">
            <div className="patientInfo-Top box-shadow-normal">
              <div className="patientName">
                <h6>{this.state.full_name}</h6>
                <p>{this.state.gender}</p>
              </div>
              <div className="patientDemographic">
                <span>
                  DOB:
                  <b>
                    {moment(this.state.date_of_birth).format(
                      Options.dateFormat
                    )}
                  </b>
                </span>
                <span>
                  MRN: <b>{this.state.patient_code}</b>
                </span>
              </div>
              <div className="patientDemographic">
                <span>
                  Ref by:
                  <b>
                    {this.state.refered_name
                      ? this.state.refered_name
                      : "-----"}
                  </b>
                </span>
                <span>
                  Scheduled Date:
                  <b>
                    {moment(this.state.scheduled_date_time).format(
                      Options.dateFormat
                    )}
                  </b>
                </span>
              </div>
            </div>
            <div className="col-12">
              <div className="row">
                <div className="col-4 popLeftDiv">
                  <div className="row form-row-gap">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-12" }}
                      label={{
                        forceLabel: "Examination Status"
                      }}
                      selector={{
                        name: "exam_status",
                        className: "select-fld",
                        value: this.state.exam_status,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: RAD_EXAM_STATUS
                        },
                        onChange: examhandle.bind(this, this)
                        // others: {
                        //   disabled: this.state.existingPatient
                        // }
                      }}
                    />
                  </div>
                  <div className="row form-row-gap">
                    <AlgaehDateHandler
                      div={{ className: "col-lg-7" }}
                      label={{ forceLabel: "Start Date" }}
                      textBox={{ className: "txt-fld" }}
                      events={{
                        onChange: null
                      }}
                      disabled={true}
                      value={this.state.exam_start_date_time}
                    />

                    <div className="col-lg-5">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Start Time",
                          align: ""
                        }}
                      />
                      <br />
                      <time>
                        {this.state.exam_start_date_time !== null
                          ? moment(this.state.exam_start_date_time).format(
                              Options.timeFormat
                            )
                          : "00:00:00"}
                      </time>
                    </div>
                  </div>
                  <div className="row form-row-gap">
                    <AlgaehDateHandler
                      div={{ className: "col-lg-7" }}
                      label={{ forceLabel: "End Date" }}
                      textBox={{ className: "txt-fld" }}
                      events={{
                        onChange: null
                      }}
                      disabled={true}
                      value={this.state.exam_end_date_time}
                    />

                    <div className="col-lg-5">
                      <AlgaehLabel
                        label={{
                          forceLabel: "End Time    ",
                          align: ""
                        }}
                      />
                      <br />
                      <time>
                        {this.state.exam_end_date_time !== null
                          ? moment(this.state.exam_end_date_time).format(
                              Options.timeFormat
                            )
                          : "00:00:00"}
                      </time>
                    </div>
                  </div>

                  <div className="row form-row-gap">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-12" }}
                      label={{
                        forceLabel: "Technician"
                      }}
                      selector={{
                        name: "technician_id",
                        className: "select-fld",
                        value: this.state.technician_id,
                        dataSource: {
                          textField: "username",
                          valueField: "algaeh_d_app_user_id",
                          data: this.props.radiologyusers
                        },
                        onChange: examhandle.bind(this, this),
                        others: {
                          disabled: true
                        }
                      }}
                    />
                  </div>
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-12" }}
                      label={{
                        forceLabel: "Test Status"
                      }}
                      selector={{
                        name: "status",
                        className: "select-fld",
                        value: this.state.status,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: FORMAT_RAD_STATUS
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          disabled: true
                        }
                      }}
                    />
                  </div>

                  <div className="row form-row-gap">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-6" }}
                      label={{
                        forceLabel: "Attended By"
                      }}
                      selector={{
                        name: "attended_by",
                        className: "select-fld",
                        value: this.state.attended_by,
                        dataSource: {
                          textField: "username",
                          valueField: "algaeh_d_app_user_id",
                          data: this.props.radiologyusers
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          disabled: true
                        }
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-lg-6" }}
                      label={{
                        forceLabel: "Validate By"
                      }}
                      selector={{
                        name: "validate_by",
                        className: "select-fld",
                        value: this.state.validate_by,
                        dataSource: {
                          textField: "username",
                          valueField: "algaeh_d_app_user_id",
                          data: this.props.radiologyusers
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          disabled: true
                        }
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-12" }}
                      label={{
                        forceLabel: "Report Type"
                      }}
                      selector={{
                        name: "report_type",
                        className: "select-fld",
                        value: this.state.report_type,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: RAD_REPORT_TYPE
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />

                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Comments"
                        }}
                      />

                      <textarea
                        value={this.state.comments}
                        name="comments"
                        onChange={this.textAreaEvent.bind(this)}
                      >
                        {this.state.comments}
                      </textarea>
                    </div>
                  </div>
                </div>
                <div className="col-8 popRightDiv">
                  <h5 style={{ color: "gray" }}>
                    {this.state.service_code} - {this.state.service_name}
                  </h5>
                  <hr />
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-4" }}
                      label={{
                        forceLabel: "Select Template"
                      }}
                      selector={{
                        name: "template_id",
                        className: "select-fld",
                        value: this.state.template_id,
                        dataSource: {
                          textField: "template_name",
                          valueField: "hims_d_rad_template_detail_id",
                          data: this.state.Templatelist
                        },
                        onChange: templatehandle.bind(this, this)
                      }}
                    />
                  </div>

                  <div className="row">
                    <div className="col-lg-12 editor">
                      <RichTextEditor
                        value={this.state.result_html}
                        onChange={rtehandle.bind(this, this)}
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, false] }],
                            [
                              "bold",
                              "italic",
                              "underline",
                              "strike",
                              "blockquote",
                              { list: "ordered" },
                              { list: "bullet" },
                              { indent: "-1" },
                              { indent: "+1" },
                              "image",
                              { color: [] },
                              { background: [] }
                            ]
                          ]
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  {/*<AlgaehFileUploader
                    showControl={false}
                    onref={ref => {
                      this.radiologyValidateTemplate = ref;
                    }}
                    needConvertion={false}
                    addDataTag={false}
                    serviceParameters={{
                      uniqueID: {
                        templateID: this.state.template_id,
                        patient_code: this.state.patient_code
                      },
                      fileType: "Patients"
                    }}
                    events={{
                      onSuccess: data => {},
                      onFileFailure: () => {}
                    }}
                  />*/}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onvalidate.bind(this, this)}
                    disabled={validateDisable}
                  >
                    Validate
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={e => {
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
    radschlist: state.radschlist,
    radiologyusers: state.radiologyusers
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getRadiologyTestList: AlgaehActions,
      getUserDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RadResultEntry)
);
