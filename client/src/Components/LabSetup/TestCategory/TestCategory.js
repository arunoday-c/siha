import React, { Component } from "react";
import "./TestCategory.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall";
import {
  changeTexts,
  onchangegridcol,
  insertTestCategory,
  deleteTestCategory,
  updateTestCategory
} from "./TestCategoryEvents";
import Options from "../../../Options.json";
import moment from "moment";

class TestCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_test_category_id: "",
      category_name: "",
      test_section: "O",
      investigation_type: null
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });
    if (
      this.props.testcategory === undefined ||
      this.props.testcategory.length === 0
    ) {
      this.props.getTestCategory({
        uri: "/labmasters/selectTestCategory",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "TESTCATEGORY_GET_DATA",
          mappingName: "testcategory"
        }
      });
    }
  }

  dateFormater(date) {
    if (date !== null) {
      return moment(date).format(Options.dateFormat);
    }
  }

  render() {
    return (
      <div className="lab_section">
        <div className="row inner-top-search margin-bottom-15">
          <AlagehFormGroup
            div={{ className: "col-4 form-group mandatory" }}
            label={{
              forceLabel: "Test Category Name",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "category_name",
              value: this.state.category_name,
              events: {
                onChange: changeTexts.bind(this, this)
              }
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-3 form-group mandatory" }}
            label={{ forceLabel: "Test Section", isImp: true }}
            selector={{
              name: "test_section",
              className: "select-fld",
              value: this.state.test_section,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.TEST_SECTION
              },

              onChange: changeTexts.bind(this, this),
              onClear: () => {
                this.setState({
                  test_section: null
                });
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col-3 form-group mandatory" }}
            label={{ forceLabel: "Investigation Type", isImp: true }}
            selector={{
              name: "investigation_type",
              className: "select-fld",
              value: this.state.investigation_type,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.FORMAT_LAB_RAD
              },

              onChange: changeTexts.bind(this, this),
              onClear: () => {
                this.setState({
                  investigation_type: null
                });
              }
            }}
          />

          <div className="col-lg-2 align-middle" style={{ paddingTop: 19 }}>
            <button
              onClick={insertTestCategory.bind(this, this)}
              className="btn btn-primary"
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row" data-validate="testCatDiv">
              <div className="col" id="testCategoryGrid_Cntr">
                <AlgaehDataGrid
                  datavalidate="data-validate='testCatDiv'"
                  id="testCategoryGrid"
                  columns={[
                    {
                      fieldName: "category_name",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Test Category Name" }}
                        />
                      ),
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              value: row.category_name,
                              className: "txt-fld",
                              name: "category_name",
                              events: {
                                onChange: onchangegridcol.bind(this, this, row)
                              },
                              others: {
                                errormessage: "Category Name - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "investigation_type",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Investigation Type" }}
                        />
                      ),
                      displayTemplate: row => {
                        let display = GlobalVariables.FORMAT_LAB_RAD.filter(
                          f => f.value === row.investigation_type
                        );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].name
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              name: "investigation_type",
                              className: "select-fld",
                              value: row.investigation_type,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_LAB_RAD
                              },
                              onChange: onchangegridcol.bind(this, this, row),
                              others: {
                                errormessage:
                                  "Investigation Type - cannot be blank",
                                required: true
                              },
                              onClear: () => {
                                this.setState({
                                  test_section: null
                                });
                              }
                            }}
                          />
                        );
                      },
                      others: { maxWidth: 100 }
                    },
                    {
                      fieldName: "test_section",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Test Section" }} />
                      ),
                      displayTemplate: row => {
                        let display = GlobalVariables.TEST_SECTION.filter(
                          f => f.value === row.test_section
                        );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].name
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              name: "test_section",
                              className: "select-fld",
                              value: row.test_section,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.TEST_SECTION
                              },
                              onChange: onchangegridcol.bind(this, this, row),
                              others: {
                                errormessage: "Test Section - cannot be blank",
                                required: true
                              },
                              onClear: () => {
                                this.setState({
                                  test_section: null
                                });
                              }
                            }}
                          />
                        );
                      },
                      others: { maxWidth: 200 }
                    },

                    {
                      fieldName: "created_by",
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_by" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.userdrtails === undefined
                            ? []
                            : this.props.userdrtails.filter(
                                f => f.algaeh_d_app_user_id === row.created_by
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].username
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        let display =
                          this.props.userdrtails === undefined
                            ? []
                            : this.props.userdrtails.filter(
                                f => f.algaeh_d_app_user_id === row.created_by
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].username
                              : ""}
                          </span>
                        );
                      },
                      others: { maxWidth: 150 }
                      //disabled: true
                    },
                    {
                      fieldName: "created_date",
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_date" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>{this.dateFormater(row.created_date)}</span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <span>{this.dateFormater(row.created_date)}</span>
                        );
                      },
                      others: { maxWidth: 100 }
                      //disabled: true
                    },
                    {
                      fieldName: "category_status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "inv_status" }} />
                      ),
                      displayTemplate: row => {
                        return row.category_status === "A"
                          ? "Active"
                          : "Inactive";
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              name: "category_status",
                              className: "select-fld",
                              value: row.category_status,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_STATUS
                              },
                              onChange: onchangegridcol.bind(this, this, row),
                              others: {
                                errormessage: "Status - cannot be blank",
                                required: true
                              },
                              onClear: () => {
                                this.setState({
                                  test_section: null
                                });
                              }
                            }}
                          />
                        );
                      },
                      others: { maxWidth: 100 }
                    }
                  ]}
                  keyId="hims_d_lab_container_id"
                  dataSource={{
                    data:
                      this.props.testcategory === undefined
                        ? []
                        : this.props.testcategory
                  }}
                  isEditable={true}
                  filter={true}
                  actions={{
                    allowDelete: false
                  }}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    //onDelete: deleteTestCategory.bind(this, this),
                    onEdit: row => {},
                    onDone: updateTestCategory.bind(this, this)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    testcategory: state.testcategory,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getTestCategory: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TestCategory)
);
