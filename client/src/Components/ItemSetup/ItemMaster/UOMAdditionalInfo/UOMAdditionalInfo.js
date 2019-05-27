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
import {
  texthandle,
  AddUom,
  deleteUOM,
  updateUOM,
  onchangegridcol,
  uomtexthandle,
  stockingtexthandle,
  stockonchangegridcol,
  additionaleInfo
} from "./UOMAdditionalInfoEvents";
import GlobalVariables from "../../../../utils/GlobalVariables.json";

class UOMAdditionalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uom_id: null,
      stocking_uom: null,
      conversion_factor: 0,
      convertEnable: false
    };
  }

  componentWillMount() {
    let InputOutput = this.props.itemPop;
    this.setState({ ...this.state, ...InputOutput });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-uom-Add-form">
              <div className="row card-deck panel-layout">
                {/* Patient code */}
                <div className="col-lg-8 card">
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col" }}
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
                        onChange: uomtexthandle.bind(this, this, context),
                        others: {
                          exclude: "true"
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-3" }}
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
                        onChange: stockingtexthandle.bind(this, this),
                        others: {
                          exclude: "true"
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-4" }}
                      label={{
                        fieldName: "conversion_factor"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "conversion_factor",
                        value: this.state.conversion_factor,
                        events: {
                          onChange: texthandle.bind(this, this)
                        },
                        others: {
                          disabled: this.state.convertEnable,
                          exclude: "true"
                        }
                      }}
                    />

                    <div className="col actions">
                      <a
                        onClick={AddUom.bind(this, this, context)}
                        style={{ marginTop: 23 }}
                        // href="javascript"
                        className="btn btn-primary btn-circle active"
                      >
                        <i className="fas fa-plus" />
                      </a>
                    </div>
                  </div>

                  <div className="row" style={{ marginTop: "10px" }}>
                    <div className="col-lg-12" id="itemSetupPopGrid">
                      <AlgaehDataGrid
                        id="UOM_stck"
                        columns={[
                          {
                            fieldName: "action",
                            label: (
                              <AlgaehLabel label={{ fieldName: "action" }} />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>
                                  <i
                                    className="fa fa-trash-alt"
                                    aria-hidden="true"
                                    onClick={deleteUOM.bind(
                                      this,
                                      this,
                                      context,
                                      row
                                    )}
                                  />
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 60,
                              style: {
                                textAlign: "center"
                              }
                            }
                          },
                          {
                            fieldName: "uom_id",
                            label: (
                              <AlgaehLabel label={{ fieldName: "uom_id" }} />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.itemuom === undefined
                                  ? []
                                  : this.props.itemuom.filter(
                                      f =>
                                        f.hims_d_pharmacy_uom_id === row.uom_id
                                    );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].uom_description
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
                                    onChange: onchangegridcol.bind(
                                      this,
                                      this,
                                      context,
                                      row
                                    )
                                  }}
                                />
                              );
                            },
                            others: {
                              style: {
                                textAlign: "center"
                              }
                            }
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
                                    others: {
                                      disabled: true
                                    },
                                    events: {
                                      onChange: onchangegridcol.bind(
                                        this,
                                        this,
                                        context,
                                        row
                                      )
                                    }
                                  }}
                                />
                              );
                            },
                            others: {
                              style: {
                                textAlign: "center"
                              }
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
                              return row.stocking_uom === "N" ? "No" : "Yes";
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
                                    onChange: stockonchangegridcol.bind(
                                      this,
                                      this,
                                      context,
                                      row
                                    )
                                  }}
                                />
                              );
                            },
                            others: {
                              style: {
                                textAlign: "center"
                              }
                            }
                          }
                        ]}
                        keyId="service_type_id"
                        dataSource={{
                          data: this.state.detail_item_uom
                        }}
                        paging={{ page: 0, rowsPerPage: 5 }}
                        events={{
                          onDelete: deleteUOM.bind(this, this, context),
                          onEdit: row => {},
                          onDone: updateUOM.bind(this, this, context)
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 card">
                  <div className="row">
                    <div className="container-fluid">
                      <AlgaehLabel
                        label={{ forceLabel: "Additional Information" }}
                      />
                      <textarea
                        value={this.state.addl_information}
                        name="addl_information"
                        onChange={additionaleInfo.bind(this, this, context)}
                      />
                    </div>
                  </div>
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
