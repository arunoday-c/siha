import React, { Component } from "react";

import "./Equipment.scss";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel,
  Tooltip
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables";
import { AlgaehActions } from "../../../actions/algaehActions";

class Equipment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_lab_section_id: "",
      description: "",
      created_date: "",
      // created_by: getCookie("UserID"),

      description_error: false,
      description_error_txt: ""
    };
    this.baseState = this.state;
  }

  changeTexts(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div className="lab_section">
        {/* <LinearProgress id="myProg" style={{ display: "none" }} /> */}
        <div className="container-fluid">
          <form>
            <div
              className="row"
              style={{
                paddingTop: 20,
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
                  name: "description",
                  value: this.state.description,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />
            </div>

            <div
              className="row"
              style={{
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "machine_analyte_code",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "machine_analyte_code",
                  value: this.state.machine_analyte_code,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-2" }}
                label={{
                  fieldName: "lab_analyte",
                  isImp: true
                }}
                selector={{
                  name: "lab_analyte_id",
                  className: "select-fld",
                  value: this.state.lab_analyte_id,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.FORMAT_STORAGE_TYPE
                  },
                  onChange: this.changeTexts.bind(this)
                }}
              />
              <div className="col-lg-2 go-button">
                {/* <Tooltip id="tooltip-icon" title="Add To List">
                  <IconButton className="" color="primary">
                    <PlayCircleFilled
                    //   onClick={ProcessInsurance.bind(this, this, context)}
                    />
                  </IconButton>
                </Tooltip> */}
              </div>
            </div>
          </form>

          <div className="row form-details">
            <div className="col">
              <AlgaehDataGrid
                id="visa_grd"
                columns={[
                  {
                    fieldName: "description",
                    label: <AlgaehLabel label={{ fieldName: "type_desc" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.description,
                            className: "txt-fld",
                            name: "description",
                            events: {
                              onChange: this.onchangegridcol.bind(this, row)
                            }
                          }}
                        />
                      );
                    }
                  },

                  {
                    fieldName: "created_by",
                    label: <AlgaehLabel label={{ fieldName: "created_by" }} />,
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
                    fieldName: "section_status",
                    label: <AlgaehLabel label={{ fieldName: "inv_status" }} />,
                    displayTemplate: row => {
                      return row.visa_status === "A" ? "Active" : "Inactive";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "section_status",
                            className: "select-fld",
                            value: row.section_status,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_STATUS
                            },
                            onChange: this.onchangegridcol.bind(this, row)
                          }}
                        />
                      );
                    }
                  }
                ]}
                keyId="hims_d_lab_section_id"
                dataSource={{
                  data:
                    this.props.visatypes === undefined
                      ? []
                      : this.props.visatypes
                }}
                filter={true}
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 5 }}
                events={{
                  // onDelete: this.deleteLabSection.bind(this),
                  onEdit: row => {}
                  // onDone: row => {
                  //   alert(JSON.stringify(row));
                  // }
                  // onDone: this.updateLabSection.bind(this)
                }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                // onClick={this.SavePatientDetails.bind(this)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    visatypes: state.visatypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVisatypes: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Equipment)
);
