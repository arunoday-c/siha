import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./NewInvestigation.css";
import "./../../../styles/site.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  Modal
} from "../../Wrapper/algaehWrapper";
import { texthandle } from "./NewInvestigationEvent";
import variableJson from "../../../utils/GlobalVariables.json";
import Typography from "@material-ui/core/Typography";
import { AlgaehActions } from "../../../actions/algaehActions";
// import { successfulMessage } from "../../../utils/GlobalFunctions";
// import { getCookie } from "../../../utils/algaehApiCall";

class NewInvestigation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "en"
    };
  }
  //   componentWillMount() {
  //     let IOputs = AdvRefunIOputs.inputParam();
  //     this.setState(IOputs);
  //   }

  //   componentWillReceiveProps() {
  //     this.setState({ selectedLang: Window.global.selectedLang });
  //   }
  componentDidMount() {
    this.props.getLabsection({
      uri: "/labmasters/selectSection",
      method: "GET",
      redux: {
        type: "SECTION_GET_DATA",
        mappingName: "labsection"
      }
    });

    this.props.getTestCategory({
      uri: "/labmasters/selectTestCategory",
      method: "GET",
      redux: {
        type: "TESTCATEGORY_GET_DATA",
        mappingName: "testcategory"
      }
    });
  }
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <Modal
            style={{
              margin: "0 auto",
              width: "120vh"
              // height: "80vh"
            }}
            open={this.props.open}
          >
            <div className="hptl-phase1-add-investigation-form">
              <div className="colorPrimary header">
                <Typography variant="title">Investigation</Typography>
              </div>

              {/* <div className="hptl-phase1-add-advance-form"> */}
              <div className="container-fluid">
                <div className="row form-details">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "investigation_type",
                      isImp: true
                    }}
                    selector={{
                      name: "investigation_type",
                      className: "select-fld",
                      value: this.state.investigation_type,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_LAB_RAD
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "test_name",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "description",
                      value: this.state.description,
                      events: {
                        onChange: texthandle.bind(this, this)
                      }
                    }}
                  />
                  {this.state.investigation_type === "L" ? (
                    <AlagehAutoComplete
                      div={{ className: "col-lg-3" }}
                      label={{
                        fieldName: "category_id",
                        isImp: true
                      }}
                      selector={{
                        name: "lab_section_id",
                        className: "select-fld",
                        value: this.state.lab_section_id,
                        dataSource: {
                          textField: "description",
                          valueField: "hims_d_lab_section_id",
                          data: this.props.labsection
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />
                  ) : (
                    <AlagehAutoComplete
                      div={{ className: "col-lg-3" }}
                      label={{
                        fieldName: "lab_section_id",
                        isImp: true
                      }}
                      selector={{
                        name: "category_id",
                        className: "select-fld",
                        value: this.state.category_id,
                        dataSource: {
                          textField: "category_name",
                          valueField: "hims_d_test_category_id",
                          data: this.props.testcategory
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />
                  )}

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "cpt_id",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "cpt_id",
                      value: this.state.cpt_id,
                      events: {
                        onChange: texthandle.bind(this, this)
                      }
                    }}
                  />
                </div>
                <div className="row form-details">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "send_out_test"
                    }}
                    selector={{
                      name: "send_out_test",
                      className: "select-fld",
                      value: this.state.send_out_test,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "available_in_house",
                      isImp: true
                    }}
                    selector={{
                      name: "available_in_house",
                      className: "select-fld",
                      value: this.state.available_in_house,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "restrict_order",
                      isImp: true
                    }}
                    selector={{
                      name: "restrict_order",
                      className: "select-fld",
                      value: this.state.restrict_order,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "restrict_by"
                    }}
                    selector={{
                      name: "restrict_by",
                      className: "select-fld",
                      value: this.state.restrict_by,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_RESTRICTBY
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                </div>

                <div className="row form-details">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "external_facility_required"
                    }}
                    selector={{
                      name: "external_facility_required",
                      className: "select-fld",
                      value: this.state.external_facility_required,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "priority"
                    }}
                    selector={{
                      name: "priority",
                      className: "select-fld",
                      value: this.state.priority,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_INVPRIORITY
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-lg-6" }}
                    label={{
                      fieldName: "facility_description"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "facility_description",
                      value: this.state.facility_description,
                      events: {
                        onChange: null
                      }
                    }}
                  />
                </div>

                <div className="row button">
                  <div className="col-lg-8"> &nbsp;</div>

                  <div className="col-lg-2">
                    <button
                      variant="contained"
                      className="htpl1-phase1-btn-secondary"
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="col-lg-2">
                    <button
                      className="htpl1-phase1-btn-primary"
                      //   onClick={this.SaveAdvance.bind(this)}
                      color="primary"
                      variant="contained"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* <AHSnackbar
                open={this.state.open}
                handleClose={this.handleClose}
                MandatoryMsg={this.state.MandatoryMsg}
              /> */}
            {/* </div> */}
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    testcategory: state.testcategory,
    labsection: state.labsection
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getTestCategory: AlgaehActions,
      getLabsection: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NewInvestigation)
);
