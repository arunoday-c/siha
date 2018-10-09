import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import "./TestCategory.css";
import Button from "@material-ui/core/Button";

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
      // created_by: getCookie("UserID"),

      description_error: false,
      description_error_txt: ""
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
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

  dateFormater({ date }) {
    if (date !== null) {
      return moment(date).format(Options.dateFormat);
    }
  }

  render() {
    return (
      <div className="lab_section">
        <LinearProgress id="myProg" style={{ display: "none" }} />
        <Paper className="container-fluid">
          <form>
            <div
              className="row"
              style={{
                padding: 20,
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "category_name",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "category_name",
                  value: this.state.category_name,
                  error: this.state.description_error,
                  helperText: this.state.description_error_txt,
                  events: {
                    onChange: changeTexts.bind(this, this)
                  }
                }}
              />

              <div className="col-lg-3 align-middle">
                <br />
                <Button
                  onClick={insertTestCategory.bind(this, this)}
                  variant="raised"
                  color="primary"
                >
                  <AlgaehLabel label={{ fieldName: "Addbutton" }} />
                </Button>
              </div>
            </div>
          </form>

          <div className="row form-details">
            <div className="col">
              <AlgaehDataGrid
                id="visa_grd"
                columns={[
                  {
                    fieldName: "category_name",
                    label: (
                      <AlgaehLabel label={{ fieldName: "category_name" }} />
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
                            }
                          }}
                        />
                      );
                    }
                  },

                  {
                    fieldName: "created_by",
                    label: <AlgaehLabel label={{ fieldName: "created_by" }} />,
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
                            ? display[0].user_displayname
                            : ""}
                        </span>
                      );
                    },
                    disabled: true
                  },
                  {
                    fieldName: "created_date",
                    label: (
                      <AlgaehLabel label={{ fieldName: "created_date" }} />
                    ),
                    displayTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    },
                    disabled: true
                  },
                  {
                    fieldName: "category_status",
                    label: <AlgaehLabel label={{ fieldName: "inv_status" }} />,
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
                            onChange: onchangegridcol.bind(this, this, row)
                          }}
                        />
                      );
                    }
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
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onDelete: deleteTestCategory.bind(this, this),
                  onEdit: row => {},
                  onDone: updateTestCategory.bind(this, this)
                }}
              />
            </div>
          </div>
        </Paper>
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
