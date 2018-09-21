import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../../actions/algaehActions";
import "./UOMAdditionalInfo.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import MyContext from "../../../../utils/MyContext.js";
import { texthandle } from "./UOMAdditionalInfoEvents";
import GlobalVariables from "../../../../utils/GlobalVariables.json";

class UOMAdditionalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.itemPop;
    this.setState({ ...this.state, ...InputOutput });
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-display-patient-form">
              <div className="row card-deck panel-layout">
                {/* Patient code */}
                <div className="col-lg-6 card box-shadow-normal">
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-4" }}
                      label={{
                        fieldName: "uom_id"
                      }}
                      selector={{
                        name: "uom_id",
                        className: "select-fld",
                        value: this.state.uom_id,
                        dataSource: {
                          textField: "uom_description",
                          valueField: "hims_d_pharmacy_uom_id",
                          data: this.props.itemuom
                        },
                        onChange: texthandle.bind(this, this, context)
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-lg-4" }}
                      label={{
                        fieldName: "conversion_factor"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "conversion_factor",
                        value: this.state.conversion_factor,
                        events: {
                          onChange: texthandle.bind(this, this, context)
                        },
                        error: this.state.open,
                        helperText: this.state.userErrorText
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-lg-4" }}
                      label={{
                        fieldName: "stocking_uom"
                      }}
                      selector={{
                        name: "stocking_uom",
                        className: "select-fld",
                        value: this.state.stocking_uom,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.FORMAT_YESNO
                        },
                        onChange: texthandle.bind(this, this, context)
                      }}
                    />
                  </div>

                  <div className="row" style={{ marginTop: "10px" }}>
                    <div className="col-lg-12">
                      <AlgaehDataGrid
                        id="UOM_stck"
                        columns={[
                          {
                            fieldName: "uom_id",
                            label: (
                              <AlgaehLabel label={{ fieldName: "uom_id" }} />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.servicetype === undefined
                                  ? []
                                  : this.props.servicetype.filter(
                                      f =>
                                        f.hims_d_service_type_id === row.uom_id
                                    );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].arabic_service_type
                                    : ""}
                                </span>
                              );
                            },
                            editorTemplate: row => {
                              return (
                                <AlagehAutoComplete
                                  div={{}}
                                  selector={{
                                    name: "uom_id",
                                    className: "select-fld",
                                    value: row.uom_id,
                                    dataSource: {
                                      textField: "uom_description",
                                      valueField: "hims_d_pharmacy_uom_id",
                                      data: this.props.itemuom
                                    },
                                    others: {
                                      disabled: true
                                    },
                                    onChange: null
                                  }}
                                />
                              );
                            },
                            disabled: true
                          },

                          {
                            fieldName: "conversion_factor",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "conversion_factor" }}
                              />
                            ),
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.conversion_factor,
                                    className: "txt-fld",
                                    name: "conversion_factor",
                                    events: {
                                      onChange: null
                                    }
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "stocking_uom",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "stocking_uom" }}
                              />
                            ),
                            displayTemplate: row => {
                              return row.stocking_uom == "N" ? "No" : "Yes";
                            },
                            editorTemplate: row => {
                              return (
                                <AlagehAutoComplete
                                  div={{}}
                                  selector={{
                                    name: "stocking_uom",
                                    className: "select-fld",
                                    value: row.stocking_uom,
                                    dataSource: {
                                      textField: "name",
                                      valueField: "value",
                                      data: GlobalVariables.FORMAT_YESNO
                                    },
                                    others: {
                                      disabled: true
                                    },
                                    onChange: null
                                  }}
                                />
                              );
                            },
                            disabled: true
                          }
                        ]}
                        keyId="service_type_id"
                        dataSource={{
                          data: this.state.detail_item_uom
                        }}
                        isEditable={true}
                        paging={{ page: 0, rowsPerPage: 5 }}
                        events={
                          {
                            //   onDelete: this.deleteBillDetail.bind(this, context),
                            //   onEdit: row => {},
                            //   onDone: this.updateBillDetail.bind(this)
                          }
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 card box-shadow-normal">
                  <div className="row">Aditional Information</div>
                </div>
              </div>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    itemuom: state.itemuom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemUOM: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UOMAdditionalInfo)
);
