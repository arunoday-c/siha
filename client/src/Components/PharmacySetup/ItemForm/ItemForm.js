import React, { Component } from "react";
import "./ItemForm.scss";
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
  insertItemForm,
  updateItemForm,
  deleteItemForm,
  getItemForm
} from "./ItemFormEvents";
import Options from "../../../Options.json";
import moment from "moment";

class ItemForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_item_form_id: "",
      form_description: "",

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

    if (this.props.itemform === undefined || this.props.itemform.length === 0) {
      getItemForm(this, this);
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
              forceLabel: "Form Description",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "form_description",
              value: this.state.form_description,
              error: this.state.description_error,
              helperText: this.state.description_error_txt,
              events: {
                onChange: changeTexts.bind(this, this)
              }
            }}
          />

          <div className="col" style={{ paddingTop: 19 }}>
            <button
              onClick={insertItemForm.bind(this, this)}
              className="btn btn-primary"
            >
              <AlgaehLabel label={{ fieldName: "Addbutton" }} />
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered marginBottom-15">
              <div className="portlet-body" data-validate="itemFormDiv">
                <AlgaehDataGrid
                  datavalidate="data-validate='itemFormDiv'"
                  id="item_category"
                  columns={[
                    {
                      fieldName: "form_description",
                      label: <AlgaehLabel label={{ fieldName: "type_desc" }} />,
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              value: row.form_description,
                              className: "txt-fld",
                              name: "form_description",
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
                    },
                    {
                      fieldName: "item_form_status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "inv_status" }} />
                      ),
                      displayTemplate: row => {
                        return row.item_form_status === "A"
                          ? "Active"
                          : "Inactive";
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              name: "item_form_status",
                              className: "select-fld",
                              value: row.item_form_status,
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
                  keyId="hims_d_item_category_id"
                  dataSource={{
                    data:
                      this.props.itemform === undefined
                        ? []
                        : this.props.itemform
                  }}
                  filter={true}
                  isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onDelete: deleteItemForm.bind(this, this),
                    onEdit: row => {},

                    onDone: updateItemForm.bind(this, this)
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
    itemform: state.itemform,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemForm: AlgaehActions,
      getUserDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemForm)
);
