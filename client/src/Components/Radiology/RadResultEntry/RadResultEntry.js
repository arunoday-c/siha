import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import RichTextEditor from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./RadResultEntry.scss";
import "./../../../styles/site.scss";
import {
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlgaehLabel,
  AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";
import {
  FORMAT_RAD_STATUS,
  RAD_REPORT_TYPE,
} from "../../../utils/GlobalVariables.json";
import {
  texthandle,
  templatehandle,
  rtehandle,
  handleExamStatus,
} from "./RadResultEntryEvents";
import { MainContext } from "algaeh-react-components";
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
      comments: "",
      portal_exists: "N",
    };
  }
  static contextType = MainContext;
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
          mappingName: "radiologyusers",
        },
      });
      const { portal_exists } = this.context.userToken;
      this.setState({ portal_exists });
    }
  }
  UNSAFE_componentWillReceiveProps(newProps) {
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
  onClose = (e) => {
    this.props.getRadiologyTestList({
      redux: {
        type: "RAD_LIST_GET_DATA",
        mappingName: "radschlist",
        data: [],
      },
    });
    this.setState(
      {
        template_id: null,
        result_html: null,
        pre_exam_status: null,
        exam_start_date_time: null,
        exam_end_date_time: null,
        changesDone: false,
        comments: "",
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
      [name]: value,
    });
  }

  completeDeactived = (message) => (
    <div className="col-lg-6">
      <button className="btn btn-primary" disabled={true}>
        {message}
      </button>
    </div>
  );

  renderAction = () => {
    let message;
    const startAndCancel = (
      <Fragment>
        <div className="col">
          <button
            className="btn btn-primary"
            style={{ marginTop: 21 }}
            onClick={handleExamStatus.bind(this, this, "start")}
          >
            Start
          </button>
        </div>
        <div className="col">
          <button
            className="btn"
            style={{ marginTop: 21 }}
            onClick={handleExamStatus.bind(this, this, "cancel")}
          >
            Cancel
          </button>
        </div>
      </Fragment>
    );
    const completeActived = (
      <div className="col">
        <button
          className="btn btn-primary"
          style={{ marginTop: 21 }}
          onClick={handleExamStatus.bind(this, this, "completed")}
        >
          Complete
        </button>
      </div>
    );

    if (
      this.state.pre_exam_status === "CO" ||
      this.state.exam_status === "CO"
    ) {
      message = "Test Completed";
      return this.completeDeactived(message);
    } else if (
      this.state.pre_exam_status === "CN" ||
      this.state.exam_status === "CN"
    ) {
      message = "Test Canceled";
      return this.completeDeactived(message);
    } else if (
      this.state.pre_exam_status === "ST" ||
      this.state.exam_status === "ST"
    ) {
      return completeActived;
    } else {
      return startAndCancel;
    }
  };

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
            onClose: this.onClose.bind(this),
          }}
          title="Result Entry"
          openPopup={this.props.open}
        >
          <div className="popupInner RadResultEntryPopupInner">
            <div className="col-12 topbarPatientDetails">
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Patient Name",
                    }}
                  />

                  <h6>
                    {this.state.full_name ? this.state.full_name : "------"}
                    <small style={{ display: "block", fontStyle: "italic" }}>
                      {this.state.patient_code}
                    </small>
                  </h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Investigation Name",
                    }}
                  />

                  <h6>
                    {this.state.service_name
                      ? this.state.service_name
                      : "------"}
                    <small style={{ display: "block", fontStyle: "italic" }}>
                      {this.state.service_code}
                    </small>
                  </h6>
                </div>

                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Ordered By",
                    }}
                  />
                  <h6>
                    {this.state.ordered_by_name
                      ? this.state.ordered_by_name
                      : "------"}

                    {this.state.ordered_by_name ? (
                      <small style={{ display: "block", fontStyle: "italic" }}>
                        On{" "}
                        {moment(this.state.ordered_date).format(
                          `${Options.dateFormat} ${Options.timeFormat}`
                        )}
                      </small>
                    ) : (
                      <small style={{ display: "block", fontStyle: "italic" }}>
                        -------
                      </small>
                    )}
                  </h6>
                </div>
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Scheduled By",
                    }}
                  />

                  <h6>
                    {this.state.entered_by_name
                      ? this.state.entered_by_name
                      : "------"}

                    {this.state.entered_by_name ? (
                      <small style={{ display: "block", fontStyle: "italic" }}>
                        On{" "}
                        {moment(this.state.entered_date).format(
                          `${Options.dateFormat} ${Options.timeFormat}`
                        )}
                      </small>
                    ) : (
                      <small style={{ display: "block", fontStyle: "italic" }}>
                        -------
                      </small>
                    )}
                  </h6>
                </div>
                {/* 
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Confirmed By",
                    }}
                  />

                  <h6>
                    {this.state.confirm_by_name
                      ? this.state.confirm_by_name
                      : "------"}

                    {this.state.confirm_by_name ? (
                      <small style={{ display: "block", fontStyle: "italic" }}>
                        On{" "}
                        {moment(this.state.confirmed_date).format(
                          `${Options.dateFormat} ${Options.timeFormat}`
                        )}
                      </small>
                    ) : (
                      <small style={{ display: "block", fontStyle: "italic" }}>
                        -------
                      </small>
                    )}
                  </h6>
                </div> */}

                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Validated By",
                    }}
                  />

                  <h6>
                    {this.state.validate_by_name
                      ? this.state.validate_by_name
                      : "------"}

                    {this.state.validate_by_name ? (
                      <small style={{ display: "block", fontStyle: "italic" }}>
                        On{" "}
                        {moment(this.state.validated_date).format(
                          `${Options.dateFormat} ${Options.timeFormat}`
                        )}
                      </small>
                    ) : (
                      <small style={{ display: "block", fontStyle: "italic" }}>
                        -------
                      </small>
                    )}
                  </h6>
                </div>
                {/* <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Critical Result",
                        }}
                      />

                      <h6>
                        <small
                          className={`badge ${
                            isCritical ? "badge-danger" : "badge-primary"
                          }`}
                        >
                          {" "}
                          {isCritical ? "Yes" : "No"}
                        </small>
                      </h6>
                    </div> */}
              </div>
            </div>

            {/* <div className="patientInfo-Top box-shadow-normal">
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
            </div> */}
            <div className="col-12">
              <div className="row">
                <div className="col-12 popRightDiv">
                  {/* <div className="row form-row-gap">{this.renderAction()}</div> */}
                  <div className="row">
                    <AlgaehDateHandler
                      div={{ className: "col" }}
                      label={{ forceLabel: "Start Date" }}
                      textBox={{ className: "txt-fld" }}
                      events={{
                        onChange: null,
                      }}
                      disabled={true}
                      value={this.state.exam_start_date_time}
                    />

                    <div className="col-1">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Start Time",
                          align: "",
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
                    <AlgaehDateHandler
                      div={{ className: "col" }}
                      label={{ forceLabel: "End Date" }}
                      textBox={{ className: "txt-fld" }}
                      events={{
                        onChange: null,
                      }}
                      disabled={true}
                      value={this.state.exam_end_date_time}
                    />

                    <div className="col-1">
                      <AlgaehLabel
                        label={{
                          forceLabel: "End Time    ",
                          align: "",
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

                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Technician",
                      }}
                      selector={{
                        name: "technician_id",
                        className: "select-fld",
                        value: this.state.technician_id,
                        dataSource: {
                          textField: "username",
                          valueField: "algaeh_d_app_user_id",
                          data: this.props.radiologyusers,
                        },
                        // onChange: examhandle.bind(this, this),
                        others: {
                          disabled: true,
                        },
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Work Status",
                      }}
                      selector={{
                        name: "status",
                        className: "select-fld",
                        value: this.state.status,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: FORMAT_RAD_STATUS,
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          disabled: true,
                        },
                      }}
                    />
                    {/* </div>
                  <div className="row form-row-gap">
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Attended By",
                      }}
                      selector={{
                        name: "attended_by",
                        className: "select-fld",
                        value: this.state.attended_by,
                        dataSource: {
                          textField: "username",
                          valueField: "algaeh_d_app_user_id",
                          data: this.props.radiologyusers,
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          disabled: true,
                        },
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Validate By",
                      }}
                      selector={{
                        name: "validate_by",
                        className: "select-fld",
                        value: this.state.validate_by,
                        dataSource: {
                          textField: "username",
                          valueField: "algaeh_d_app_user_id",
                          data: this.props.radiologyusers,
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          disabled: true,
                        },
                      }}
                    /> */}
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Report Type",
                      }}
                      selector={{
                        name: "report_type",
                        className: "select-fld",
                        value: this.state.report_type,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: RAD_REPORT_TYPE,
                        },
                        onChange: texthandle.bind(this, this),
                      }}
                    />
                    {this.renderAction()}
                  </div>
                  <hr></hr>
                  <div className="row">
                    <div className="col-4">
                      <div className="row">
                        <AlagehAutoComplete
                          div={{ className: "col-lg-12" }}
                          label={{
                            forceLabel: "Select Template",
                          }}
                          selector={{
                            name: "template_id",
                            className: "select-fld",
                            value: this.state.template_id,
                            dataSource: {
                              textField: "template_name",
                              valueField: "hims_d_rad_template_detail_id",
                              data: this.state.Templatelist,
                            },
                            onChange: templatehandle.bind(this, this),
                          }}
                        />
                        <div className="col-12" style={{ marginTop: 10 }}>
                          <AlgaehLabel
                            label={{
                              forceLabel: "General Comments/Feedback",
                            }}
                          />
                          <textarea
                            className="radExtraComment"
                            value={this.state.comments}
                            name="comments"
                            onChange={this.textAreaEvent.bind(this)}
                            rows="11"
                          >
                            {this.state.comments}
                          </textarea>
                        </div>
                      </div>{" "}
                    </div>
                    <div className="col-8 editor">
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
                              { background: [] },
                            ],
                          ],
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
                    onClick={handleExamStatus.bind(this, this, "validate")}
                    disabled={validateDisable}
                  >
                    Validate
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
    radschlist: state.radschlist,
    radiologyusers: state.radiologyusers,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getRadiologyTestList: AlgaehActions,
      getUserDetails: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RadResultEntry)
);
