import React, { Component } from "react";
import "./ItemGeneric.scss";
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
  insertItemGeneric,
  updateItemGeneric,
  deleteItemGeneric,
  getItemGeneric
} from "./ItemGenericEvents";
import Options from "../../../Options.json";
import moment from "moment";

class ItemGeneric extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_item_generic_id: "",
      generic_name: ""
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });
    if (
      this.props.itemgeneric === undefined ||
      this.props.itemgeneric.length === 0
    ) {
      getItemGeneric(this, this);
    }
  }

  dateFormater(date) {
    if (date !== null) {
      return moment(date).format(Options.dateFormat);
    }
  }

  render() {
    return (
      <div className="">
        <div className="row inner-top-search">
          <AlagehFormGroup
            div={{ className: "col-3 form-group mandatory" }}
            label={{
              forceLabel: "Item Generic Description",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "generic_name",
              value: this.state.generic_name,
              events: {
                onChange: changeTexts.bind(this, this)
              }
            }}
          />

          <div className="col" style={{ paddingTop: 19 }}>
            <button
              onClick={insertItemGeneric.bind(this, this)}
              className="btn btn-primary"
            >
              <AlgaehLabel label={{ fieldName: "Addbutton" }} />
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered marginBottom-15">
              <div className="portlet-body" data-validate="itemGenDiv">
                <AlgaehDataGrid
                  datavalidate="data-validate='itemGenDiv'"
                  id="item_generic"
                  columns={[
                    {
                      fieldName: "generic_name",
                      label: <AlgaehLabel label={{ fieldName: "type_desc" }} />,
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              value: row.generic_name,
                              className: "txt-fld",
                              name: "generic_name",
                              events: {
                                onChange: onchangegridcol.bind(this, this, row)
                              },
                              others: {
                                errormessage: "Generic Name - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        );
                      }
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
                      }
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
                      }
                      //disabled: true
                    },
                    {
                      fieldName: "item_generic_status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "inv_status" }} />
                      ),
                      displayTemplate: row => {
                        return row.item_generic_status === "A"
                          ? "Active"
                          : "Inactive";
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              name: "item_generic_status",
                              className: "select-fld",
                              value: row.item_generic_status,
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
                  keyId="hims_d_item_generic_id"
                  dataSource={{
                    data:
                      this.props.itemgeneric === undefined
                        ? []
                        : this.props.itemgeneric
                  }}
                  isEditable={true}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onDelete: deleteItemGeneric.bind(this, this),
                    onEdit: row => {},

                    onDone: updateItemGeneric.bind(this, this)
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
    itemgeneric: state.itemgeneric,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemGeneric: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemGeneric)
);
