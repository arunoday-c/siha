import React, { Component } from "react";
import "./ItemStorage.scss";
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
  insertItemStorage,
  updateItemStorage,
  deleteItemStorage,
  getItemStorage
} from "./ItemStorageEvents";
import Options from "../../../Options.json";
import moment from "moment";

class ItemStorage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_item_form_id: "",
      form_description: ""
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });

    if (
      this.props.itemstorage === undefined ||
      this.props.itemstorage.length === 0
    ) {
      getItemStorage(this, this);
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
                name: "storage_description",
                value: this.state.storage_description,

                events: {
                  onChange: changeTexts.bind(this, this)
                }
              }}
            />

            <div className="col-lg-2 align-middle" style={{ paddingTop: 21 }}>
              <button
                onClick={insertItemStorage.bind(this, this)}
                className="btn btn-primary"
              >
                <AlgaehLabel label={{ fieldName: "Addbutton" }} />
              </button>
            </div>
          </div>

          <div className="row form-details">
            <div className="col" data-validate="itemStrgDiv">
              <AlgaehDataGrid
                datavalidate="data-validate='itemStrgDiv'"
                id="item_category"
                columns={[
                  {
                    fieldName: "storage_description",
                    label: <AlgaehLabel label={{ fieldName: "type_desc" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.storage_description,
                            className: "txt-fld",
                            name: "storage_description",
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
                    fieldName: "storage_status",
                    label: <AlgaehLabel label={{ fieldName: "inv_status" }} />,
                    displayTemplate: row => {
                      return row.storage_status === "A" ? "Active" : "Inactive";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "storage_status",
                            className: "select-fld",
                            value: row.storage_status,
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
                    this.props.itemstorage === undefined
                      ? []
                      : this.props.itemstorage
                }}
                filter={true}
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onDelete: deleteItemStorage.bind(this, this),
                  onEdit: row => {},
                  onDone: updateItemStorage.bind(this, this)
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
    itemstorage: state.itemstorage,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemStorage: AlgaehActions,
      getUserDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemStorage)
);
