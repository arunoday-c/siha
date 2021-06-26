import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import MyContext from "../../../utils/MyContext.js";
import "./SampleCollections.scss";
import "../../../styles/site.scss";
import {
  CollectSample,
  printBarcode,
  onchangegridcol,
  updateLabOrderServiceStatus,
  updateLabOrderServiceMultiple,
  onchangegridcoldatehandle,
} from "./SampleCollectionEvent";
import { Tooltip } from "antd";
import {
  AlgaehLabel,
  // AlgaehDataGrid,
  AlgaehModalPopUp,
  AlagehAutoComplete,
  AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";
import { AlgaehDataGrid } from "algaeh-react-components";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
  AlgaehAutoComplete,
  MainContext,
  AlgaehSecurityComponent,
  RawSecurityComponent,
} from "algaeh-react-components";
import variableJson from "../../../utils/GlobalVariables.json";

class SampleCollectionPatient extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collected: true,
      hospital_id: null,
      send_out_test: "N",
      editableGrid: false,
    };
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.setState({
      hospital_id: userToken.hims_d_hospital_id,
      portal_exists: userToken.portal_exists,
    });
    if (
      this.props.deptanddoctors === undefined ||
      this.props.deptanddoctors.length === 0
    ) {
      this.props.getDepartmentsandDoctors({
        uri: "/department/get/get_All_Doctors_DepartmentWise",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "DEPT_DOCTOR_GET_DATA",
          mappingName: "deptanddoctors",
        },
      });
    }
    if (
      this.props.labspecimen === undefined ||
      this.props.labspecimen.length === 0
    ) {
      this.props.getLabSpecimen({
        uri: "/labmasters/selectSpecimen",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "SPECIMEN_GET_DATA",
          mappingName: "labspecimen",
        },
      });
    }

    if (
      this.props.labcontainer === undefined ||
      this.props.labcontainer.length === 0
    ) {
      this.props.getLabContainer({
        uri: "/labmasters/selectContainer",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "CONTAINER_GET_DATA",
          mappingName: "labcontainer",
        },
      });
    }

    if (
      this.props.userdrtails === undefined ||
      this.props.userdrtails.length === 0
    ) {
      this.props.getUserDetails({
        uri: "/algaehappuser/selectAppUsers",
        method: "GET",
        redux: {
          type: "USER_DETAILS_GET_DATA",
          mappingName: "userdrtails",
        },
      });
    }
    RawSecurityComponent({ componentCode: "SPEC_COLL_STATUS_CHANGE" }).then(
      (result) => {
        if (result === "hide") {
          this.setState({ editableGrid: false });
        } else {
          this.setState({
            editableGrid: "editOnly",
          });
        }
      }
    );
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.selected_patient !== null) {
      let InputOutput = nextProps.selected_patient;
      this.setState({ ...this.state, ...InputOutput });
    }
  }

  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this),
            }}
            title="Specimen Collections"
            openPopup={this.props.open}
          >
            <MyContext.Consumer>
              {(context) => (
                <div>
                  <div className="col-lg-12 popupInner">
                    <div className="row form-details">
                      <div className="col-lg-2">
                        <AlgaehLabel
                          label={{
                            fieldName: "patient_code",
                          }}
                        />
                        <h6>
                          {this.state.patient_code
                            ? this.state.patient_code
                            : "Patient Code"}
                        </h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "patient_name",
                          }}
                        />
                        <h6>
                          {this.state.full_name
                            ? this.state.full_name
                            : "Patient Name"}
                        </h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "ordered_by",
                          }}
                        />
                        <h6>
                          {this.state.doctor_name
                            ? this.state.doctor_name
                            : "------"}
                        </h6>
                      </div>
                      <div className="col-lg-3">
                        <AlgaehLabel
                          label={{
                            fieldName: "ordered_date",
                          }}
                        />
                        <h6>
                          {this.state.ordered_date
                            ? this.state.ordered_date
                            : "Ordered Date"}
                        </h6>
                      </div>
                    </div>

                    <div className="row grid-details">
                      <div className="col-lg-12" id="sampleCollectionGrid_Cntr">
                        <div className="margin-bottom-15">
                          <AlgaehDataGrid
                            id="update_order_grid"
                            columns={[
                              {
                                fieldName: "action",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "action" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <>
                                      {row.collected !== "Y" ? (
                                        <Tooltip
                                          title="Collect Specimen"
                                          zIndex={9999}
                                        >
                                          <i
                                            style={{
                                              pointerEvents:
                                                row.billed === "N"
                                                  ? "none"
                                                  : "",
                                              opacity:
                                                row.billed === "N" ? "0.1" : "",
                                            }}
                                            className="fas fa-check"
                                            onClick={CollectSample.bind(
                                              this,
                                              this,
                                              context,
                                              row
                                            )}
                                          />
                                        </Tooltip>
                                      ) : (
                                        <Tooltip
                                          title="Generate Barcode"
                                          zIndex={9999}
                                        >
                                          <i
                                            style={{
                                              pointerEvents:
                                                row.billed === "N"
                                                  ? "none"
                                                  : "",
                                              opacity:
                                                row.billed === "N" ? "0.1" : "",
                                            }}
                                            className="fas fa-barcode"
                                            onClick={printBarcode.bind(
                                              this,
                                              this,
                                              row
                                            )}
                                          />
                                        </Tooltip>
                                      )}
                                    </>
                                  );
                                },
                                editorTemplate: (row) => {
                                  return (
                                    <span>
                                      {row.collected !== "Y" ? (
                                        <Tooltip title="Collect Specimen">
                                          <i
                                            style={{
                                              pointerEvents:
                                                row.billed === "N"
                                                  ? "none"
                                                  : "",
                                              opacity:
                                                row.billed === "N" ? "0.1" : "",
                                            }}
                                            className="fas fa-check"
                                            onClick={CollectSample.bind(
                                              this,
                                              this,
                                              context,
                                              row
                                            )}
                                          />
                                        </Tooltip>
                                      ) : (
                                        <Tooltip title="Generate Barcode">
                                          <i
                                            style={{
                                              pointerEvents:
                                                row.billed === "N"
                                                  ? "none"
                                                  : "",
                                              opacity:
                                                row.billed === "N" ? "0.1" : "",
                                            }}
                                            className="fas fa-barcode"
                                            onClick={printBarcode.bind(
                                              this,
                                              this,
                                              row
                                            )}
                                          />
                                        </Tooltip>
                                      )}
                                    </span>
                                  );
                                },
                                others: {
                                  maxWidth: 100,
                                  resizable: false,
                                  style: { textAlign: "center" },
                                },
                              },

                              {
                                fieldName: "billed",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "billed" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return row.billed === "N"
                                    ? "Not Billed"
                                    : "Billed";
                                },
                                editorTemplate: (row) => {
                                  return row.billed === "N"
                                    ? "Not Billed"
                                    : "Billed";
                                },
                                others: {
                                  resizable: false,
                                  style: { textAlign: "center" },
                                },
                              },
                              {
                                fieldName: "test_type",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "proiorty" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {row.test_type === "S"
                                        ? "Stat"
                                        : "Routine"}
                                    </span>
                                  );
                                },
                                editorTemplate: (row) => {
                                  return (
                                    <span>
                                      {row.test_type === "S"
                                        ? "Stat"
                                        : "Routine"}
                                    </span>
                                  );
                                },
                                disabled: true,
                                others: {
                                  resizable: false,
                                  style: { textAlign: "center" },
                                },
                              },
                              {
                                fieldName: "service_code",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "investigation_code" }}
                                  />
                                ),
                                editorTemplate: (row) => {
                                  return row.service_code;
                                },
                                others: {
                                  resizable: false,
                                  style: { textAlign: "center" },
                                },
                              },
                              {
                                fieldName: "service_name",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "investigation_name" }}
                                  />
                                ),
                                editorTemplate: (row) => {
                                  return row.service_name;
                                },
                                others: {
                                  minWidth: 250,
                                  resizable: false,
                                  style: { textAlign: "center" },
                                },
                              },
                              {
                                fieldName: "sample_id",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "specimen_name" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  let display =
                                    this.props.labspecimen === undefined
                                      ? []
                                      : this.props.labspecimen.filter(
                                          (f) =>
                                            f.hims_d_lab_specimen_id ===
                                            row.sample_id
                                        );
                                  return row.collected === "Y" ||
                                    row.billed === "N" ? (
                                    <span>
                                      {display !== null && display.length !== 0
                                        ? display[0].SpeDescription
                                        : ""}
                                    </span>
                                  ) : (
                                    <AlagehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "sample_id",
                                        className: "select-fld",
                                        value: row.sample_id,
                                        dataSource: {
                                          textField: "SpeDescription",
                                          valueField: "hims_d_lab_specimen_id",
                                          data: this.props.labspecimen,
                                        },
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        ),
                                      }}
                                    />
                                  );
                                },
                                editorTemplate: (row) => {
                                  let display =
                                    this.props.labspecimen === undefined
                                      ? []
                                      : this.props.labspecimen.filter(
                                          (f) =>
                                            f.hims_d_lab_specimen_id ===
                                            row.sample_id
                                        );
                                  return row.collected === "Y" ||
                                    row.billed === "N" ? (
                                    <span>
                                      {display !== null && display.length !== 0
                                        ? display[0].SpeDescription
                                        : ""}
                                    </span>
                                  ) : (
                                    <AlagehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "sample_id",
                                        className: "select-fld",
                                        value: row.sample_id,
                                        dataSource: {
                                          textField: "SpeDescription",
                                          valueField: "hims_d_lab_specimen_id",
                                          data: this.props.labspecimen,
                                        },
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        ),
                                      }}
                                    />
                                  );
                                },
                                others: {
                                  maxWidth: 200,
                                  resizable: false,
                                  style: { textAlign: "center" },
                                },
                              },
                              {
                                fieldName: "container_id",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "Container" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  let display =
                                    this.props.labcontainer === undefined
                                      ? []
                                      : this.props.labcontainer.filter(
                                          (f) =>
                                            f.hims_d_lab_container_id ===
                                            row.container_id
                                        );
                                  return row.collected === "Y" ||
                                    row.billed === "N" ? (
                                    <span>
                                      {display !== null && display.length !== 0
                                        ? display[0].ConDescription
                                        : ""}
                                    </span>
                                  ) : (
                                    <AlagehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "container_id",
                                        className: "select-fld",
                                        value: row.container_id,
                                        dataSource: {
                                          textField: "ConDescription",
                                          valueField: "hims_d_lab_container_id",
                                          data: this.props.labcontainer,
                                        },
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        ),
                                      }}
                                    />
                                  );
                                },
                                editorTemplate: (row) => {
                                  let display =
                                    this.props.labcontainer === undefined
                                      ? []
                                      : this.props.labcontainer.filter(
                                          (f) =>
                                            f.hims_d_lab_container_id ===
                                            row.container_id
                                        );
                                  return row.collected === "Y" ||
                                    row.billed === "N" ? (
                                    <span>
                                      {display !== null && display.length !== 0
                                        ? display[0].ConDescription
                                        : ""}
                                    </span>
                                  ) : (
                                    <AlagehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "container_id",
                                        className: "select-fld",
                                        value: row.container_id,
                                        dataSource: {
                                          textField: "ConDescription",
                                          valueField: "hims_d_lab_container_id",
                                          data: this.props.labcontainer,
                                        },
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        ),
                                      }}
                                    />
                                  );
                                },
                                others: {
                                  maxWidth: 200,
                                  resizable: false,
                                  style: { textAlign: "center" },
                                },
                              },
                              {
                                fieldName: "send_out_test",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Send Out" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return row.collected === "Y" ||
                                    row.billed === "N" ? (
                                    row.send_out_test === "Y" ? (
                                      <span className="badge badge-success">
                                        Yes
                                      </span>
                                    ) : (
                                      <span className="badge badge-danger">
                                        No
                                      </span>
                                    )
                                  ) : (
                                    <AlagehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "send_out_test",
                                        className: "select-fld",
                                        value: row.send_out_test,
                                        dataSource: {
                                          textField: "name",
                                          valueField: "value",
                                          data: variableJson.FORMAT_YESNO,
                                        },
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        ),
                                      }}
                                    />
                                  );
                                },
                                editorTemplate: (row) => {
                                  return row.collected === "Y" ||
                                    row.billed === "N" ? (
                                    row.send_out_test === "Y" ? (
                                      <span className="badge badge-success">
                                        Yes
                                      </span>
                                    ) : (
                                      <span className="badge badge-danger">
                                        No
                                      </span>
                                    )
                                  ) : (
                                    <AlagehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "send_out_test",
                                        className: "select-fld",
                                        value: row.send_out_test,
                                        dataSource: {
                                          textField: "name",
                                          valueField: "value",
                                          data: variableJson.FORMAT_YESNO,
                                        },
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        ),
                                      }}
                                    />
                                  );
                                },
                                others: {
                                  maxWidth: 200,
                                  resizable: false,
                                  style: { textAlign: "center" },
                                },
                              },
                              {
                                fieldName: "send_in_test",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Send In Test" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return row.collected === "Y" ||
                                    row.billed === "N" ? (
                                    row.send_in_test === "Y" ? (
                                      <span className="badge badge-success">
                                        Yes
                                      </span>
                                    ) : (
                                      <span className="badge badge-danger">
                                        No
                                      </span>
                                    )
                                  ) : (
                                    <AlagehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "send_in_test",
                                        className: "select-fld",
                                        value: row.send_in_test,
                                        dataSource: {
                                          textField: "name",
                                          valueField: "value",
                                          data: variableJson.FORMAT_YESNO,
                                        },
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        ),
                                      }}
                                    />
                                  );
                                },
                                editorTemplate: (row) => {
                                  return row.collected === "Y" ||
                                    row.billed === "N" ? (
                                    row.send_in_test === "Y" ? (
                                      <span className="badge badge-success">
                                        Yes
                                      </span>
                                    ) : (
                                      <span className="badge badge-danger">
                                        No
                                      </span>
                                    )
                                  ) : (
                                    <AlagehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "send_in_test",
                                        className: "select-fld",
                                        value: row.send_in_test,
                                        dataSource: {
                                          textField: "name",
                                          valueField: "value",
                                          data: variableJson.FORMAT_YESNO,
                                        },
                                        updateInternally: true,
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        ),
                                      }}
                                    />
                                  );
                                },
                                others: {
                                  maxWidth: 200,
                                  resizable: false,
                                  style: { textAlign: "center" },
                                },
                              },
                              {
                                fieldName: "collected",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "collected" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return row.collected === "Y" ? (
                                    <span className="badge badge-success">
                                      Yes
                                    </span>
                                  ) : (
                                    <span className="badge badge-danger">
                                      No
                                    </span>
                                  );
                                },
                                editorTemplate: (row) => {
                                  return row.collected === "Y" ? (
                                    <span className="badge badge-success">
                                      Yes
                                    </span>
                                  ) : (
                                    <span className="badge badge-danger">
                                      No
                                    </span>
                                  );
                                },
                              },
                              {
                                fieldName: "collected_date",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "collected_date" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {moment(row.collected_date).isValid()
                                        ? moment(row.collected_date).format(
                                            "DD-MM-YYYY hh:mm"
                                          )
                                        : "------"}
                                    </span>
                                  );
                                },
                                editorTemplate: (row) => {
                                  if (row.send_in_test === "Y") {
                                    return (
                                      <AlgaehDateHandler
                                        div={{}}
                                        textBox={{
                                          className: "txt-fld hidden",
                                          name: "collected_date",
                                        }}
                                        minDate={new Date()}
                                        disabled={
                                          this.state.posted === "Y"
                                            ? true
                                            : false
                                        }
                                        events={{
                                          onChange:
                                            onchangegridcoldatehandle.bind(
                                              this,
                                              this,
                                              row
                                            ),
                                        }}
                                        value={row.collected_date}
                                      />
                                    );
                                  } else {
                                    return (
                                      <span>
                                        {moment(row.collected_date).isValid()
                                          ? moment(row.collected_date).format(
                                              "DD-MM-YYYY hh:mm"
                                            )
                                          : "------"}
                                      </span>
                                    );
                                  }
                                },
                                others: {
                                  resizable: false,
                                  style: { textAlign: "center" },
                                },
                              },
                              {
                                fieldName: "status",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "Status" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return row.status === "O"
                                    ? "ordered"
                                    : row.status === "CL"
                                    ? "Collected"
                                    : row.status === "CN"
                                    ? "Test Canceled"
                                    : row.status === "CF"
                                    ? "Result Confirmed"
                                    : "Result Validated";
                                },
                                editorTemplate: (row) => {
                                  return (
                                    <AlgaehAutoComplete
                                      // error={errors2}
                                      div={{ className: "col " }}
                                      selector={{
                                        className: "select-fld",
                                        name: "status",
                                        value: row.status,
                                        onChange: (e, value) => {
                                          row.status = value;
                                        },
                                        // others: { defaultValue: row.bed_id },
                                        dataSource: {
                                          textField: "name",
                                          valueField: "value",
                                          data: [
                                            {
                                              name: "Ordered",
                                              value: "O",
                                            },
                                            {
                                              name: "Collected",
                                              value: "CL",
                                            },
                                            {
                                              name: "Canceled",
                                              value: "CN",
                                            },
                                            {
                                              name: "Result Confirmed",
                                              value: "CF",
                                            },
                                          ],
                                        },
                                        updateInternally: true,
                                        // others: {
                                        //   disabled:
                                        //     current.request_status === "APR" &&
                                        //     current.work_status === "COM",
                                        //   tabIndex: "4",
                                        // },
                                      }}
                                    />
                                  );
                                },
                                // others: {
                                //   resizable: false,
                                //   style: { textAlign: "center" }
                                // }
                              },

                              {
                                fieldName: "collected_by",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "collected_by" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  let display =
                                    this.props.userdrtails === undefined
                                      ? []
                                      : this.props.userdrtails.filter(
                                          (f) =>
                                            f.algaeh_d_app_user_id ===
                                            row.collected_by
                                        );

                                  return (
                                    <span>
                                      {display !== null && display.length !== 0
                                        ? display[0].username
                                        : ""}
                                    </span>
                                  );
                                },
                                editorTemplate: (row) => {
                                  let display =
                                    this.props.userdrtails === undefined
                                      ? []
                                      : this.props.userdrtails.filter(
                                          (f) =>
                                            f.algaeh_d_app_user_id ===
                                            row.collected_by
                                        );

                                  return (
                                    <span>
                                      {display !== null && display.length !== 0
                                        ? display[0].username
                                        : ""}
                                    </span>
                                  );
                                },
                                others: {
                                  resizable: false,
                                  style: { textAlign: "center" },
                                },
                              },

                              {
                                fieldName: "barcode_gen",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Barcode Gen Date" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {moment(row.barcode_gen).isValid()
                                        ? moment(row.barcode_gen).format(
                                            "DD-MM-YYYY hh:mm"
                                          )
                                        : "------"}
                                    </span>
                                  );
                                },
                                editorTemplate: (row) => {
                                  return (
                                    <span>
                                      {moment(row.barcode_gen).isValid()
                                        ? moment(row.barcode_gen).format(
                                            "DD-MM-YYYY hh:mm"
                                          )
                                        : "------"}
                                    </span>
                                  );
                                },
                                others: {
                                  resizable: false,
                                  style: { textAlign: "center" },
                                },
                              },
                              {
                                fieldName: "remarks",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Rejection Remarks" }}
                                  />
                                ),
                                editorTemplate: (row) => {
                                  return row.remarks;
                                },
                                others: {
                                  maxWidth: 200,
                                  resizable: false,
                                  style: { textAlign: "center" },
                                },
                              },
                            ]}
                            keyId="service_code"
                            data={this.state.test_details}
                            events={{
                              onSave: updateLabOrderServiceStatus.bind(
                                this,
                                this
                              ),
                            }}
                            noDataText="No sample for collection"
                            isEditable={this.state.editableGrid}
                            pageOptions={{ rows: 20, page: 1 }}
                            isFilterable={true}
                            pagination={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* PAT-21-14323 */}

                  <div className=" popupFooter">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-12">
                          <button
                            className="btn btn-default"
                            onClick={(e) => {
                              this.onClose(e);
                            }}
                          >
                            <AlgaehLabel label={{ fieldName: "btnclose" }} />
                          </button>
                          <AlgaehSecurityComponent componentCode="SPEC_COLL_STATUS_CHANGE">
                            <button
                              className="btn btn-other"
                              onClick={updateLabOrderServiceMultiple.bind(
                                this,
                                this
                              )}
                            >
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Mark as not collected",
                                }}
                              />
                            </button>
                          </AlgaehSecurityComponent>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </MyContext.Consumer>
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    deptanddoctors: state.deptanddoctors,
    labspecimen: state.labspecimen,
    userdrtails: state.userdrtails,
    labcontainer: state.labcontainer,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDepartmentsandDoctors: AlgaehActions,
      getLabSpecimen: AlgaehActions,
      getUserDetails: AlgaehActions,
      getLabContainer: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SampleCollectionPatient)
);
