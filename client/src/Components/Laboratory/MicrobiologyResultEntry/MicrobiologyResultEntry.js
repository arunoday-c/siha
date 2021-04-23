import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "react-quill/dist/quill.snow.css";
import "./MicrobiologyResultEntry.scss";
import "./../../../styles/site.scss";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";
import {
  texthandle,
  onvalidate,
  onconfirm,
  resultEntryUpdate,
  onchangegridcol,
  generateLabResultReport,
  radioChange,
  getMicroResult,
  addComments,
  selectCommentEvent,
  deleteComment,
  ChangeHandel,
} from "./MicrobiologyResultEntryEvents";
import AlgaehReport from "../../Wrapper/printReports";
import {
  AlgaehDataGrid,
  AlgaehSecurityComponent,
  MainContext,
} from "algaeh-react-components";
class MicrobiologyResultEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: "",
      group_id: null,
      radioGrowth: false,
      radioNoGrowth: true,
      organism_type: null,
      microAntbiotic: [],
      data_exists: false,
      group_comments_id: null,
      comment_list: [],
      selcted_comments: "",
      contaminated_culture: "N",
      portal_exists: "N",
    };
  }

  textAreaEvent(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value,
    });
  }

  showReport(refBy) {
    // console.log("test_analytes:", this.state.test_analytes);

    AlgaehReport({
      report: {
        fileName: "haematologyReport",
      },
      data: {
        investigation_name: this.state.service_name,
        test_analytes: this.state.test_analytes,
        patient_code: this.state.patient_code,
        full_name: this.state.full_name,
        receipt_date: this.state.ordered_date,
        doctor_name: refBy,
        test_name: this.state.service_name,
        specimen: this.state.specimen,
      },
    });
  }
  static contextType = MainContext;
  componentDidMount() {
    if (
      this.props.labiologyusers === undefined ||
      this.props.labiologyusers.length === 0
    ) {
      this.props.getUserDetails({
        uri: "/algaehappuser/selectAppUsers",
        method: "GET",
        redux: {
          type: "LAB_EMP_GET_DATA",
          mappingName: "labiologyusers",
        },
      });
    }
    if (
      this.props.providers === undefined ||
      this.props.providers.length === 0
    ) {
      this.props.getProviderDetails({
        uri: "/employee/get",
        module: "hrManagement",
        method: "GET",
        redux: {
          type: "DOCTOR_GET_DATA",
          mappingName: "providers",
        },
      });
    }
    this.props.getMicroGroups({
      uri: "/labmasters/selectMicroGroup",
      module: "laboratory",
      method: "GET",
      data: { group_status: "A" },
      redux: {
        type: "MICROGROUPS_GET_DATA",
        mappingName: "microGroups",
      },
    });
    const { portal_exists } = this.context.userToken;
    this.setState({ portal_exists });
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.selectedPatient !== undefined && newProps.open === true) {
      // newProps.selectedPatient.microopen = false;
      newProps.selectedPatient.radioNoGrowth =
        newProps.selectedPatient.bacteria_type === "NG" ? true : false;
      newProps.selectedPatient.radioGrowth =
        newProps.selectedPatient.bacteria_type === "G" ? true : false;
      this.setState({ ...this.state, ...newProps.selectedPatient }, () => {
        getMicroResult(this, this);
      });
    }
  }

  onClose = (e) => {
    this.setState(
      {
        comments: "",
        group_id: null,
        radioGrowth: false,
        radioNoGrowth: true,
        organism_type: null,
        microAntbiotic: [],
      },
      () => {
        console.log(this.state);
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  dateFormater({ value }) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }
  render() {
    let display =
      this.props.providers === undefined
        ? []
        : this.props.providers.filter(
            (f) => f.hims_d_employee_id === this.state.provider_id
          );
    return (
      <div>
        <AlgaehModalPopUp
          class="labResultModalPopup"
          events={{
            onClose: this.onClose.bind(this),
          }}
          title="Result Entry"
          openPopup={this.props.open}
        >
          <div className="popupInner">
            <div className="popRightDiv">
              <div className="row">
                <div className="col-12 topbarPatientDetails">
                  {" "}
                  <div className="row">
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Patient Name",
                        }}
                      />

                      <h6>
                        {this.state.full_name ? this.state.full_name : "------"}
                        <small
                          style={{ display: "block", fontStyle: "italic" }}
                        >
                          {this.state.patient_code}
                        </small>
                      </h6>
                    </div>{" "}
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Test Name",
                        }}
                      />

                      <h6>
                        {this.state.service_name
                          ? this.state.service_name
                          : "------"}
                      </h6>
                    </div>{" "}
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Ordered By",
                        }}
                      />

                      <h6>
                        {display !== null && display.length !== 0
                          ? display[0].full_name
                          : "------"}

                        <small
                          style={{ display: "block", fontStyle: "italic" }}
                        >
                          On{" "}
                          {moment(this.state.ordered_date).format(
                            Options.dateFormat
                          )}
                        </small>
                      </h6>
                    </div>{" "}
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "ENTERED BY",
                        }}
                      />

                      <h6>
                        {this.state.entered_by_name
                          ? this.state.entered_by_name
                          : "------"}

                        {this.state.entered_by_name ? (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            On{" "}
                            {moment(this.state.entered_date).format(
                              `${Options.dateFormat} ${Options.timeFormat}`
                            )}
                          </small>
                        ) : (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            -------
                          </small>
                        )}
                      </h6>
                    </div>{" "}
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "CONFIRMED BY",
                        }}
                      />

                      <h6>
                        {this.state.confirm_by_name
                          ? this.state.confirm_by_name
                          : "------"}

                        {this.state.confirm_by_name ? (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            On{" "}
                            {moment(this.state.confirmed_date).format(
                              `${Options.dateFormat} ${Options.timeFormat}`
                            )}
                          </small>
                        ) : (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            -------
                          </small>
                        )}
                      </h6>
                    </div>{" "}
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
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            On{" "}
                            {moment(this.state.validated_date).format(
                              `${Options.dateFormat} ${Options.timeFormat}`
                            )}
                          </small>
                        ) : (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            -------
                          </small>
                        )}
                      </h6>
                    </div>{" "}
                  </div>
                </div>
              </div>
              <div
                className="row"
                style={{ borderBottom: "1px solid #e0e0e0", marginBottom: 10 }}
              >
                <div className="col-2">
                  <label>Growth Type</label>
                  <div className="customRadio" style={{ borderBottom: 0 }}>
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="NoGrowth"
                        checked={this.state.radioNoGrowth}
                        onChange={radioChange.bind(this, this)}
                        disabled={this.state.data_exists}
                      />
                      <span>
                        <AlgaehLabel
                          label={{
                            forceLabel: "No Growth",
                          }}
                        />
                      </span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="Growth"
                        checked={this.state.radioGrowth}
                        onChange={radioChange.bind(this, this)}
                        disabled={this.state.data_exists}
                      />
                      <span>
                        <AlgaehLabel
                          label={{
                            forceLabel: "growth",
                          }}
                        />
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col">
                  {" "}
                  {this.state.radioGrowth === true ? (
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col form-group mandatory" }}
                        label={{
                          forceLabel: "Bacteria Name",
                          isImp: this.state.radioGrowth,
                        }}
                        textBox={{
                          value: this.state.bacteria_name,
                          className: "form-control",
                          name: "bacteria_name",

                          events: {
                            onChange: texthandle.bind(this, this),
                          },
                          others: {
                            disabled: this.state.data_exists,
                          },
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col form-group mandatory" }}
                        label={{
                          forceLabel: "Select Group",
                          isImp: this.state.radioGrowth,
                        }}
                        selector={{
                          name: "group_id",
                          className: "select-fld",
                          value: this.state.group_id,
                          dataSource: {
                            textField: "group_name",
                            valueField: "hims_d_micro_group_id",
                            data: this.props.microGroups,
                          },
                          onChange: texthandle.bind(this, this),
                          others: {
                            disabled: this.state.data_exists,
                          },
                        }}
                      />
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Organism Type",
                          }}
                        />
                        <h6>
                          {this.state.organism_type
                            ? this.state.organism_type === "F"
                              ? "Fastidious"
                              : "Non-Fastidious"
                            : "------"}
                        </h6>
                      </div>
                    </div>
                  ) : null}{" "}
                </div>
                <div className="col-2">
                  <label>Contaminated Culture</label>
                  <div className="customRadio" style={{ borderBottom: 0 }}>
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="N"
                        name="contaminated_culture"
                        checked={
                          this.state.contaminated_culture === "N" ? true : false
                        }
                        onChange={ChangeHandel.bind(this, this)}
                        disabled={this.state.data_exists}
                      />
                      <span>
                        <AlgaehLabel
                          label={{
                            forceLabel: "No",
                          }}
                        />
                      </span>
                    </label>

                    <label className="radio inline">
                      <input
                        type="radio"
                        value="Y"
                        name="contaminated_culture"
                        checked={
                          this.state.contaminated_culture === "Y" ? true : false
                        }
                        onChange={ChangeHandel.bind(this, this)}
                        disabled={this.state.data_exists}
                      />
                      <span>
                        <AlgaehLabel
                          label={{
                            forceLabel: "Yes",
                          }}
                        />
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                  {" "}
                  <div
                    className="popLeftDiv"
                    style={{ padding: 0, paddingRight: 15, minHeight: "56vh " }}
                  >
                    {" "}
                    <div className="row">
                      <div className="col-12">
                        {this.state.radioGrowth === true ? (
                          <div className="row">
                            <div
                              className="col-lg-12"
                              id="microLabResultGrid_Cntr"
                            >
                              <AlgaehDataGrid
                                id="antibiotic_result"
                                columns={[
                                  {
                                    fieldName: "antibiotic_name",
                                    label: (
                                      <AlgaehLabel
                                        label={{ forceLabel: "Antibiotic" }}
                                      />
                                    ),

                                    others: {
                                      resizable: false,
                                      style: { textAlign: "left" },
                                    },
                                    filterable: true,
                                  },

                                  {
                                    fieldName: "susceptible",
                                    label: (
                                      <AlgaehLabel
                                        label={{
                                          forceLabel: "S",
                                        }}
                                      />
                                    ),
                                    displayTemplate: (row) => {
                                      return (
                                        <label className="checkbox inline">
                                          <input
                                            type="checkbox"
                                            name="susceptible"
                                            checked={
                                              row.susceptible === "Y"
                                                ? true
                                                : false
                                            }
                                            disabled={
                                              this.state.status === "V"
                                                ? true
                                                : false
                                            }
                                            onChange={onchangegridcol.bind(
                                              this,
                                              this,
                                              row
                                            )}
                                          />
                                        </label>
                                      );
                                    },
                                    others: {
                                      maxWidth: 100,
                                      resizable: false,
                                      filterable: false,
                                      style: { textAlign: "center" },
                                    },
                                  },

                                  {
                                    fieldName: "intermediate",
                                    label: (
                                      <AlgaehLabel
                                        label={{ forceLabel: "I" }}
                                      />
                                    ),
                                    displayTemplate: (row) => {
                                      return (
                                        <label className="checkbox inline">
                                          <input
                                            type="checkbox"
                                            name="intermediate"
                                            checked={
                                              row.intermediate === "Y"
                                                ? true
                                                : false
                                            }
                                            disabled={
                                              this.state.status === "V"
                                                ? true
                                                : false
                                            }
                                            onChange={onchangegridcol.bind(
                                              this,
                                              this,
                                              row
                                            )}
                                          />
                                        </label>
                                      );
                                    },
                                    others: {
                                      maxWidth: 100,
                                      resizable: false,
                                      filterable: false,
                                      style: { textAlign: "center" },
                                    },
                                  },
                                  {
                                    fieldName: "resistant",
                                    label: (
                                      <AlgaehLabel
                                        label={{ forceLabel: "R" }}
                                      />
                                    ),
                                    displayTemplate: (row) => {
                                      return (
                                        <label className="checkbox inline">
                                          <input
                                            type="checkbox"
                                            name="resistant"
                                            checked={
                                              row.resistant === "Y"
                                                ? true
                                                : false
                                            }
                                            disabled={
                                              this.state.status === "V"
                                                ? true
                                                : false
                                            }
                                            onChange={onchangegridcol.bind(
                                              this,
                                              this,
                                              row
                                            )}
                                          />
                                        </label>
                                      );
                                    },
                                    others: {
                                      maxWidth: 100,
                                      resizable: false,
                                      filterable: false,
                                      style: { textAlign: "center" },
                                    },
                                  },
                                ]}
                                keyId="microAntbiotic"
                                data={
                                  this.state.microAntbiotic === undefined
                                    ? []
                                    : this.state.microAntbiotic
                                }
                                pagination={true}
                                pageOptions={{ rows: 50, page: 1 }}
                                isFilterable={true}
                              />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="popRightDiv" style={{ padding: 0 }}>
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-12 form-group" }}
                        label={{
                          forceLabel: "Select Comment",
                        }}
                        selector={{
                          name: "group_comments_id",
                          className: "select-fld",
                          value: this.state.group_comments_id,
                          dataSource: {
                            textField: "commnet_name",
                            valueField: "hims_d_group_comment_id",
                            data: this.state.comments_data,
                          },
                          onChange: selectCommentEvent.bind(this, this),
                          onClear: () => {
                            this.setState({
                              group_comments_id: null,
                              selcted_comments: "",
                            });
                          },
                        }}
                      />
                      <div className="col-12">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Enter Comment",
                          }}
                        />

                        <textarea
                          value={this.state.selcted_comments}
                          name="selcted_comments"
                          onChange={this.textAreaEvent.bind(this)}
                        />
                      </div>
                      <div className="col-12" style={{ textAlign: "right" }}>
                        <button
                          onClick={addComments.bind(this, this)}
                          className="btn btn-default"
                        >
                          Add
                        </button>
                      </div>

                      <div
                        className="col-12 finalCommentsSection"
                        style={{ marginTop: 15, marginBottom: 15 }}
                      >
                        <h6>View Final Comments</h6>
                        <ol>
                          {this.state.comment_list.length > 0
                            ? this.state.comment_list.map((row, index) => {
                                return (
                                  <React.Fragment key={index}>
                                    <li key={index}>
                                      <span>{row}</span>
                                      <i
                                        className="fas fa-times"
                                        onClick={deleteComment.bind(
                                          this,
                                          this,
                                          row
                                        )}
                                      ></i>
                                    </li>
                                  </React.Fragment>
                                );
                              })
                            : null}
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="popupFooter">
            <div className="col-lg-12">
              <AlgaehSecurityComponent componentCode="PRI_LAB_RES">
                <button
                  className="btn btn-primary"
                  onClick={generateLabResultReport.bind(this, this.state)}
                  disabled={this.state.status === "V" ? false : true}
                >
                  Print
                </button>
              </AlgaehSecurityComponent>
              <AlgaehSecurityComponent componentCode="VAL_LAB_RES">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onvalidate.bind(this, this)}
                  disabled={
                    this.state.status === "V" ||
                    this.state.entered_by_name === "" ||
                    this.state.confirm_by_name === ""
                      ? true
                      : false
                  }
                >
                  Validate
                </button>
              </AlgaehSecurityComponent>

              <AlgaehSecurityComponent componentCode="CONF_LAB_RES">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onconfirm.bind(this, this)}
                  disabled={
                    this.state.status === "C" ||
                    this.state.entered_by_name === ""
                      ? true
                      : this.state.status === "V"
                      ? true
                      : false
                  }
                >
                  Confirm
                </button>
              </AlgaehSecurityComponent>

              <AlgaehSecurityComponent componentCode="SAVE_LAB_RES">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={resultEntryUpdate.bind(this, this)}
                  disabled={this.state.status !== "CL" ? true : false}
                >
                  Save
                </button>
              </AlgaehSecurityComponent>

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
        </AlgaehModalPopUp>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    labiologyusers: state.labiologyusers,
    providers: state.providers,
    testanalytes: state.testanalytes,
    labanalytes: state.labanalytes,
    microGroups: state.microGroups,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUserDetails: AlgaehActions,
      getProviderDetails: AlgaehActions,
      getTestAnalytes: AlgaehActions,
      getLabAnalytes: AlgaehActions,
      getMicroGroups: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MicrobiologyResultEntry)
);
