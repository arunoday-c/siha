import React, { Component } from "react";
import "./ItemGroup.css";
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
      category_id: null
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });
    if (
      this.props.inventoryitemgroup === undefined ||
      this.props.inventoryitemgroup.length === 0
    ) {
      getItemGroup(this, this);
    }

    if (
      this.props.invitemcategory === undefined ||
      this.props.invitemcategory.length === 0
    ) {
      getItemCategory(this, this);
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
        <div className="container-fluid">
          <div className="row">
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
                events: {
                  onChange: changeTexts.bind(this, this)
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "category_id",
                isImp: true
              }}
              selector={{
                name: "category_id",
                className: "select-fld",
                value: this.state.category_id,
                dataSource: {
                  textField: "category_desc",
                  valueField: "hims_d_inventory_tem_category_id",
                  data: this.props.invitemcategory
                },
                onChange: changeTexts.bind(this, this)
              }}
            />

            <div className="col-lg-2 align-middle" style={{ paddingTop: 21 }}>
              <button
                onClick={insertItemGroup.bind(this, this)}
                className="btn btn-primary"
              >
                <AlgaehLabel label={{ fieldName: "Addbutton" }} />
              </button>
            </div>
          </div>

          <div className="row form-details">
            <div className="col" data-validate="itemGrpDiv">
              <AlgaehDataGrid
                datavalidate="data-validate='itemGrpDiv'"
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
                            },
                            others: {
                              errormessage: "Description - cannot be blank",
                              required: true
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
                        this.props.inventoryitemcategory === undefined
                          ? []
                          : this.props.inventoryitemcategory.filter(
                              f =>
                                f.hims_d_inventory_tem_category_id ===
                                row.category_id
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
                              valueField: "hims_d_inventory_tem_category_id",
                              data: this.props.inventoryitemcategory
                            },
                            onChange: onchangegridcol.bind(this, this, row),
                            others: {
                              errormessage: "Category - cannot be blank",
                              required: true
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
                    }
                  },
                  {
                    fieldName: "created_date",
                    label: (
                      <AlgaehLabel label={{ fieldName: "created_date" }} />
                    ),
                    displayTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    },
                    editorTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    }
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
                          selector={{
                            name: "group_status",
                            className: "select-fld",
                            value: row.group_status,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_STATUS
                            },
                            onChange: onchangegridcol.bind(this, this, row),
                            others: {
                              errormessage: "Status - cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  }
                ]}
                keyId="hims_d_item_group_id"
                dataSource={{
                  data:
                    this.props.inventoryitemgroup === undefined
                      ? []
                      : this.props.inventoryitemgroup
                }}
                filter={true}
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
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    inventoryitemgroup: state.inventoryitemgroup,
    invitemcategory: state.invitemcategory,
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
