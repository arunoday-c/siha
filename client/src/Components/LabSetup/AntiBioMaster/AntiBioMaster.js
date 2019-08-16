import React, { Component } from "react";
import "./AntiBioMaster.css";
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
  insertAntibiotic,
  deleteAntibiotic,
  updateAntibiotic
} from "./AntiBioMasterEvents";
import Options from "../../../Options.json";
import moment from "moment";

class TestCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_test_category_id: "",
      category_name: ""
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });
    if (
      this.props.antibiotic === undefined ||
      this.props.antibiotic.length === 0
    ) {
      this.props.getAntibiotic({
        uri: "/labmasters/selectAntibiotic",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "ANTIBIOTIC_GET_DATA",
          mappingName: "antibiotic"
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
            div={{ className: "col-3 form-group mandatory" }}
            label={{
              forceLabel: "Antibiotic Code",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "antibiotic_code",
              value: this.state.antibiotic_code,
              events: {
                onChange: changeTexts.bind(this, this)
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col-3 form-group mandatory" }}
            label={{
              forceLabel: "Antibiotic Name",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "antibiotic_name",
              value: this.state.antibiotic_name,
              events: {
                onChange: changeTexts.bind(this, this)
              }
            }}
          />
          <div className="col-lg-2 align-middle" style={{ paddingTop: 19 }}>
            <button
              onClick={insertAntibiotic.bind(this, this)}
              className="btn btn-primary"
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body" />
          <div className="row" data-validate="testCatDiv">
            <div className="col-12" id="AntibioticGrid_Cntr">
              <AlgaehDataGrid
                datavalidate="data-validate='testCatDiv'"
                id="AntibioticGrid"
                columns={[
                  {
                    fieldName: "antibiotic_code",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Antibiotic Code" }} />
                    ),
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.antibiotic_code,
                            className: "txt-fld",
                            name: "antibiotic_code",
                            events: {
                              onChange: onchangegridcol.bind(this, this, row)
                            },
                            others: {
                              errormessage: "Antibiotic Code - cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "antibiotic_name",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Antibiotic Name" }} />
                    ),
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.antibiotic_name,
                            className: "txt-fld",
                            name: "antibiotic_name",
                            events: {
                              onChange: onchangegridcol.bind(this, this, row)
                            },
                            others: {
                              errormessage: "Antibiotic Name - cannot be blank",
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
                    },
                    others: {
                      maxWidth: 150
                    }
                    //disabled: true
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
                    },
                    others: {
                      maxWidth: 100
                    }

                    //disabled: true
                  },
                  {
                    fieldName: "antibiotic_status",
                    label: <AlgaehLabel label={{ fieldName: "inv_status" }} />,
                    displayTemplate: row => {
                      return row.antibiotic_status === "A"
                        ? "Active"
                        : "Inactive";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "antibiotic_status",
                            className: "select-fld",
                            value: row.antibiotic_status,
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
                    },
                    others: {
                      maxWidth: 100
                    }
                  }
                ]}
                keyId="hims_d_lab_container_id"
                dataSource={{
                  data:
                    this.props.antibiotic === undefined
                      ? []
                      : this.props.antibiotic
                }}
                isEditable={true}
                actions={{
                  allowDelete: false
                }}
                filter={true}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  //onDelete: deleteAntibiotic.bind(this, this),
                  onEdit: row => {},
                  onDone: updateAntibiotic.bind(this, this)
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
    antibiotic: state.antibiotic,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAntibiotic: AlgaehActions
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
