import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import "./ItemGroup.css";
import Button from "@material-ui/core/Button";
// import moment from "moment";
// import { algaehApiCall } from "../../../utils/algaehApiCall";

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
// import swal from "sweetalert";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall.js";
import {
  changeTexts,
  onchangegridcol,
  insertItemGroup,
  updateItemGroup,
  deleteItemGroup,
  getItemGroup,
  getItemCategory
} from "./ItemGroupEvents";
import Options from "../../../Options.json";
import moment from "moment";

class ItemGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_item_group_id: "",
      group_description: "",
      category_id: null,

      description_error: false,
      description_error_txt: "",
      category_error: false,
      category_error_txt: ""
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });
    getItemGroup(this, this);
    getItemCategory(this, this);
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
                  fieldName: "type_desc",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "group_description",
                  value: this.state.group_description,
                  error: this.state.description_error,
                  helperText: this.state.description_error_txt,
                  events: {
                    onChange: changeTexts.bind(this, this)
                  }
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-2" }}
                label={{
                  fieldName: "category_id",
                  isImp: true
                }}
                selector={{
                  name: "category_id",
                  className: "select-fld",
                  value: this.state.category_id,
                  error: this.state.category_error,
                  helperText: this.state.category_error_txt,
                  dataSource: {
                    textField: "category_desc",
                    valueField: "hims_d_item_category_id",
                    data: this.props.itemcategory
                  },
                  onChange: changeTexts.bind(this, this)
                }}
              />

              <div className="col-lg-3 align-middle">
                <br />
                <Button
                  onClick={insertItemGroup.bind(this, this)}
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
                id="item_group"
                columns={[
                  {
                    fieldName: "group_description",
                    label: <AlgaehLabel label={{ fieldName: "type_desc" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.group_description,
                            className: "txt-fld",
                            name: "group_description",
                            events: {
                              onChange: onchangegridcol.bind(this, this, row)
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "category_id",
                    label: <AlgaehLabel label={{ fieldName: "category_id" }} />,
                    displayTemplate: row => {
                      let display =
                        this.props.itemcategory === undefined
                          ? []
                          : this.props.itemcategory.filter(
                              f => f.hims_d_item_category_id === row.category_id
                            );

                      return (
                        <span>
                          {display !== null && display.length !== 0
                            ? display[0].category_desc
                            : ""}
                        </span>
                      );
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "category_id",
                            className: "select-fld",
                            value: row.category_id,
                            dataSource: {
                              textField: "category_desc",
                              valueField: "hims_d_item_category_id",
                              data: this.props.itemcategory
                            },
                            onChange: onchangegridcol.bind(this, this, row)
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
                    fieldName: "group_status",
                    label: <AlgaehLabel label={{ fieldName: "inv_status" }} />,
                    displayTemplate: row => {
                      return row.group_status === "A" ? "Active" : "Inactive";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "group_status",
                            className: "select-fld",
                            value: row.group_status,
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
                keyId="hims_d_item_group_id"
                dataSource={{
                  data:
                    this.props.itemgroup === undefined
                      ? []
                      : this.props.itemgroup
                }}
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onDelete: deleteItemGroup.bind(this, this),
                  onEdit: row => {},

                  onDone: updateItemGroup.bind(this, this)
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
    itemgroup: state.itemgroup,
    itemcategory: state.itemcategory,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemGroup: AlgaehActions,
      getItemCategory: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemGroup)
);
