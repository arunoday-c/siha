import React, { PureComponent } from "react";

import "./NewPackage.scss";
import "./../../../styles/site.scss";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";
import NewPackageEvent from "./NewPackageEvent";

import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import {
  MainContext,
  AlgaehDateHandler,
  RawSecurityElement,
} from "algaeh-react-components";
import GlobalVariables from "../../../utils/GlobalVariables";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehAutoSearch from "../../Wrapper/autoSearch";
import _ from "lodash";

export default class NewPackage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hims_d_package_header_id: null,
      package_code: null,
      package_name: null,
      package_amount: 0,
      total_service_amount: 0,
      profit_loss: null,
      pl_amount: 0,

      PakageDetail: [],
      deletePackage: [],
      insertPackage: [],
      s_service_amount: null,
      s_service_type: null,
      s_service: null,
      s_service_name: null,
      package_type: "S",
      package_visit_type: "S",
      advance_percentage: 0,
      advance_amount: 0,
      advance_type: "P",
      qty: 1,
      approveEnable: true,
      approvedPack: false,
      radioActive: true,
      radioInactive: false,
      package_status: "A",
      cancellation_policy: "AC",
      cancellation_per: 0,
      cancellation_amount: 0,
      cancellation_type: "P",
      hospital_id: null,
      vat_applicable: "N",
      vat_percent: 0,
      showPackageSection: "none",
    };
    this.baseState = this.state;
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    const FIN_Active =
      userToken.product_type === "HIMS_ERP" ||
      userToken.product_type === "FINANCE_ERP" ||
      userToken.product_type === "HRMS_ERP"
        ? true
        : false;

    if (FIN_Active === true) {
      this.getFinanceAccountsMaping();
    }

    this.setState({
      hospital_id: userToken.hims_d_hospital_id,
      decimal_places: userToken.decimal_places,
    });
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.from !== undefined && newProps.from === "doctor") {
      this.setState({ from: newProps.from, package_type: "D" });
    } else {
      if (newProps.PackagesPop.hims_d_package_header_id !== undefined) {
        let IOputs = newProps.PackagesPop;
        IOputs.approvedPack =
          IOputs.approved === "Y"
            ? true
            : IOputs.package_status === "I"
            ? true
            : false;
        IOputs.approveEnable = false;
        IOputs.radioActive = IOputs.package_status === "A" ? true : false;
        IOputs.radioInactive = IOputs.package_status === "I" ? true : false;

        this.setState({ ...this.state, ...IOputs });
      }
    }
    RawSecurityElement({ elementCode: "Enable_Multi_Package" }).then(
      (result) => {
        if (result === "show") {
          this.setState({ showPackageSection: "" });
        }
      }
    );
  }

  onClose = (e) => {
    this.setState(
      {
        hims_d_package_header_id: null,
        package_code: null,
        package_name: null,
        package_amount: 0,
        total_service_amount: 0,
        profit_loss: null,
        pl_amount: 0,

        PakageDetail: [],
        deletePackage: [],
        insertPackage: [],
        s_service_amount: null,
        s_service_type: null,
        s_service: null,
        package_type: "S",
        package_visit_type: "S",
        advance_percentage: 0,
        advance_amount: 0,
        advance_type: "P",
        qty: 1,
        approveEnable: true,
        approvedPack: false,
        radioActive: true,
        radioInactive: false,
        package_status: "A",
        cancellation_policy: "AC",
        cancellation_per: 0,
        cancellation_amount: 0,
        cancellation_type: "P",
        vat_applicable: "N",
        vat_percent: 0,
      },
      () => {
        this.props.onClose && this.props.onClose(false);
      }
    );
  };

  eventHandaler(e) {
    debugger;
    NewPackageEvent().texthandle(this, e);
  }
  getFinanceAccountsMaping() {
    NewPackageEvent().getFinanceAccountsMaping(this);
  }
  serviceHandeler(e) {
    NewPackageEvent().serviceHandeler(this, e);
  }

  pakageamtHandaler(e) {
    NewPackageEvent().pakageamtHandaler(this, e);
  }
  AddToList() {
    NewPackageEvent().AddToList(this);
  }

  DeleteService(row) {
    NewPackageEvent().DeleteService(this, row);
  }

  InsertPackages(e) {
    NewPackageEvent().AddPackages(this, e);
  }

  texthandle(e) {
    NewPackageEvent().texthandle(this, e);
  }

  discounthandle(e) {
    NewPackageEvent().discounthandle(this, e);
  }
  candiscounthandle(e) {
    NewPackageEvent().candiscounthandle(this, e);
  }

  gridtexthandel(row, e) {
    NewPackageEvent().gridtexthandel(this, row, e);
  }
  makeZeroIngrid(row, e) {
    NewPackageEvent().makeZeroIngrid(this, row, e);
  }
  ApprovePackages(e) {
    NewPackageEvent().ApprovePackages(this, e);
  }
  radioChange(e) {
    NewPackageEvent().radioChange(this, e);
  }

  datehandle(ctrl, e) {
    NewPackageEvent().datehandle(this, ctrl, e);
  }

  dateValidate(value, event) {
    NewPackageEvent().dateValidate(this, value, event);
  }

  CopyCreatePackage() {
    NewPackageEvent().CopyCreatePackage(this);
  }

  numberEventHandaler(e) {
    NewPackageEvent().numberEventHandaler(this, e);
  }

  VatAppilicable(e) {
    NewPackageEvent().VatAppilicable(this, e);
  }
  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-investigation-form">
          <form>
            <AlgaehModalPopUp
              events={{
                onClose: this.onClose.bind(this),
              }}
              title={
                <AlgaehLabel
                  label={{
                    fieldName: "screen_name",
                    align: "ltr",
                  }}
                />
              }
              openPopup={this.props.open}
            >
              <div className="popupInner">
                <div
                  className="col-12 popRightDiv"
                  style={{ maxHeight: "76vh" }}
                >
                  <div className="" data-validate="packagedata">
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col-2 form-group mandatory" }}
                        label={{
                          fieldName: "package_code",
                          isImp: true,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "package_code",
                          value: this.state.package_code,
                          events: {
                            onChange: this.eventHandaler.bind(this),
                          },
                          others: {
                            disabled: this.state.approvedPack,
                          },
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col form-group mandatory" }}
                        label={{
                          fieldName: "package_name",
                          isImp: true,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "package_name",
                          value: this.state.package_name,
                          events: {
                            onChange: this.eventHandaler.bind(this),
                          },
                          // others: {
                          //   disabled: this.state.approvedPack
                          // }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-2 form-group mandatory" }}
                        label={{
                          fieldName: "package_amount",
                          isImp: true,
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.package_amount,
                          className: "txt-fld",
                          name: "package_amount",
                          events: {
                            onChange: this.pakageamtHandaler.bind(this),
                          },
                          others: {
                            placeholder: "0.00",
                            // disabled: this.state.approvedPack
                          },
                        }}
                      />
                      <div className="col-2 form-group">
                        <AlgaehLabel
                          label={{
                            fieldName: "total_service_amount",
                          }}
                        />
                        <h6>
                          {GetAmountFormart(this.state.total_service_amount)}
                        </h6>
                      </div>

                      <div className="col-2 form-group">
                        <AlgaehLabel
                          label={{
                            fieldName: "pl_amount",
                          }}
                        />
                        <h6>
                          {this.state.profit_loss === null ? (
                            " "
                          ) : this.state.profit_loss === "P" ? (
                            <span className="badge badge-success">
                              {GetAmountFormart(this.state.pl_amount)} (Profit)
                            </span>
                          ) : (
                            <span className="badge badge-danger">
                              {" "}
                              {GetAmountFormart(this.state.pl_amount)} (Loss)
                            </span>
                          )}
                        </h6>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="row">
                        <div className="col-3">
                          <label>Vat Applicable</label>
                          <div className="customCheckbox">
                            <label className="checkbox inline">
                              <input
                                type="checkbox"
                                name="vat_applicable"
                                checked={
                                  this.state.vat_applicable === "Y"
                                    ? true
                                    : false
                                }
                                onChange={this.VatAppilicable.bind(this)}
                              />
                              <span>Yes</span>
                            </label>
                          </div>
                        </div>

                        <AlagehFormGroup
                          div={{
                            className:
                              this.state.vat_applicable === "Y"
                                ? "col-3 mandatory form-group"
                                : "col-3 form-group",
                          }}
                          label={{
                            fieldName: "vat_percent",
                            isImp:
                              this.state.vat_applicable === "Y" ? true : false,
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            className: "txt-fld",
                            name: "vat_percent",
                            value: this.state.vat_percent,
                            events: {
                              onChange: this.numberEventHandaler.bind(this),
                            },
                            others: {
                              disabled:
                                this.state.vat_applicable === "Y"
                                  ? false
                                  : true,
                            },
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className="row"
                      style={{ display: this.state.showPackageSection }}
                    >
                      {/* <AlgaehSecurityElement elementCode="Enable_Multi_Package"> */}
                      {this.state.from !== "doctor" ? (
                        <div className="col-5">
                          <div className="row">
                            <div className="col">
                              <label>Package Type</label>

                              <div className="customRadio form-group">
                                <label className="radio block">
                                  <input
                                    type="radio"
                                    name="package_type"
                                    value="S"
                                    checked={
                                      this.state.package_type === "S"
                                        ? true
                                        : false
                                    }
                                    onChange={this.texthandle.bind(this)}
                                    disabled={this.state.approvedPack}
                                  />
                                  <span>Static</span>
                                </label>

                                <label className="radio block">
                                  <input
                                    type="radio"
                                    name="package_type"
                                    value="D"
                                    checked={
                                      this.state.package_type === "D"
                                        ? true
                                        : false
                                    }
                                    onChange={this.texthandle.bind(this)}
                                    disabled={this.state.approvedPack}
                                  />
                                  <span>Dynamic</span>
                                </label>
                              </div>
                            </div>

                            <div className="col">
                              <label>Package Status</label>
                              <div className="customRadio form-group">
                                <label className="radio block">
                                  <input
                                    type="radio"
                                    value="Active"
                                    checked={this.state.radioActive}
                                    onChange={this.radioChange.bind(this)}
                                  />
                                  <span>Active</span>
                                </label>
                                <label className="radio block">
                                  <input
                                    type="radio"
                                    value="Inactive"
                                    checked={this.state.radioInactive}
                                    onChange={this.radioChange.bind(this)}
                                  />
                                  <span>Inactive</span>
                                </label>
                              </div>
                            </div>
                            <AlgaehDateHandler
                              div={{ className: "col-5 form-group" }}
                              label={{
                                forceLabel: "Package Valid Upto",
                              }}
                              minDate={new Date()}
                              textBox={{
                                className: "txt-fld",
                                name: "validated_date",
                              }}
                              events={{
                                onChange: this.datehandle.bind(this),
                                onBlur: this.dateValidate.bind(this),
                              }}
                              value={this.state.validated_date}
                            />
                          </div>
                        </div>
                      ) : null}
                      <div className="col-2">
                        <label>Visit Type</label>
                        <div className="customRadio form-group">
                          <label className="radio block">
                            <input
                              type="radio"
                              name="package_visit_type"
                              value="S"
                              checked={
                                this.state.package_visit_type === "S"
                                  ? true
                                  : false
                              }
                              onChange={this.texthandle.bind(this)}
                              disabled={this.state.approvedPack}
                            />
                            <span>Single Visit</span>
                          </label>

                          <label className="radio block">
                            <input
                              type="radio"
                              name="package_visit_type"
                              value="M"
                              checked={
                                this.state.package_visit_type === "M"
                                  ? true
                                  : false
                              }
                              onChange={this.texthandle.bind(this)}
                              disabled={this.state.approvedPack}
                            />
                            <span>Multi Visit</span>
                          </label>
                        </div>
                      </div>
                      {/* </AlgaehSecurityElement> */}

                      {this.state.package_visit_type === "M" ? (
                        <div className="col-5">
                          <div className="row">
                            <AlagehFormGroup
                              div={{ className: "col-4 form-group  mandatory" }}
                              label={{
                                fieldName: "expiry_days",
                                isImp:
                                  this.state.package_visit_type === "M"
                                    ? true
                                    : false,
                              }}
                              textBox={{
                                className: "txt-fld",
                                name: "expiry_days",
                                value: this.state.expiry_days,
                                events: {
                                  onChange: this.texthandle.bind(this),
                                },
                                others: {
                                  type: "number",
                                  // disabled: this.state.approvedPack
                                },
                              }}
                            />
                            <AlagehAutoComplete
                              div={{ className: "col-4 form-group  mandatory" }}
                              label={{
                                forceLabel: "Adv. Type",
                                isImp:
                                  this.state.package_visit_type === "M"
                                    ? true
                                    : false,
                              }}
                              selector={{
                                name: "advance_type",
                                className: "select-fld",
                                value: this.state.advance_type,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_DISCOUNT,
                                },
                                onChange: this.texthandle.bind(this),
                                onClear: () => {
                                  this.setState({
                                    advance_type: null,
                                  });
                                },
                                others: {
                                  // disabled: this.state.approvedPack
                                },
                              }}
                            />
                            {this.state.advance_type === "P" ? (
                              <AlagehFormGroup
                                div={{
                                  className: "col-4 form-group  mandatory",
                                }}
                                label={{
                                  forceLabel: "Adv. Percent",
                                  isImp: false,
                                  // isImp:
                                  //   this.state.package_visit_type === "M"
                                  //     ? true
                                  //     : false,
                                }}
                                textBox={{
                                  decimal: { allowNegative: false },
                                  value: this.state.advance_percentage,
                                  className: "txt-fld",
                                  name: "advance_percentage",
                                  events: {
                                    onChange: this.discounthandle.bind(this),
                                  },
                                  others: {
                                    min: 0,
                                    max: 100,
                                    // disabled: this.state.approvedPack
                                  },
                                }}
                              />
                            ) : (
                              <AlagehFormGroup
                                div={{
                                  className: "col-4 form-group  mandatory",
                                }}
                                label={{
                                  forceLabel: "Adv. Amount",
                                  isImp:
                                    this.state.package_visit_type === "M"
                                      ? true
                                      : false,
                                }}
                                textBox={{
                                  decimal: { allowNegative: false },
                                  value: this.state.advance_amount,
                                  className: "txt-fld",
                                  name: "advance_amount",
                                  events: {
                                    onChange: this.texthandle.bind(this),
                                  },
                                  others: {
                                    min: 0,
                                    max: 100,
                                    // disabled: this.state.approvedPack
                                  },
                                }}
                              />
                            )}
                            <AlagehAutoComplete
                              div={{ className: "col-4 form-group  mandatory" }}
                              label={{
                                forceLabel: "Cancel Policy",
                                isImp:
                                  this.state.package_visit_type === "M"
                                    ? true
                                    : false,
                              }}
                              selector={{
                                name: "cancellation_policy",
                                className: "select-fld",
                                value: this.state.cancellation_policy,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_PACK_CAL_POLICY,
                                },
                                onChange: this.texthandle.bind(this),
                                onClear: () => {
                                  this.setState({
                                    cancellation_policy: null,
                                  });
                                },
                                // others: {
                                //   disabled: this.state.approvedPack
                                // }
                              }}
                            />

                            <AlagehAutoComplete
                              div={{ className: "col-4 form-group" }}
                              label={{
                                forceLabel: "Cancel Type",
                              }}
                              selector={{
                                name: "cancellation_type",
                                className: "select-fld",
                                value: this.state.cancellation_type,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_DISCOUNT,
                                },
                                onChange: this.texthandle.bind(this),
                                onClear: () => {
                                  this.setState({
                                    cancellation_type: null,
                                  });
                                },
                                others: {
                                  // disabled: this.state.approvedPack
                                },
                              }}
                            />
                            {this.state.cancellation_type === "P" ? (
                              <AlagehFormGroup
                                div={{ className: "col-4 form-group" }}
                                label={{
                                  forceLabel: "Cancel Percent",
                                }}
                                textBox={{
                                  decimal: { allowNegative: false },
                                  value: this.state.cancellation_per,
                                  className: "txt-fld",
                                  name: "cancellation_per",
                                  events: {
                                    onChange: this.candiscounthandle.bind(this),
                                  },
                                  others: {
                                    min: 0,
                                    max: 100,
                                    // disabled: this.state.approvedPack
                                  },
                                }}
                              />
                            ) : (
                              <AlagehFormGroup
                                div={{ className: "col form-group" }}
                                label={{
                                  forceLabel: "Cancel Amount",
                                }}
                                textBox={{
                                  decimal: { allowNegative: false },
                                  value: this.state.cancellation_amount,
                                  className: "txt-fld",
                                  name: "cancellation_amount",
                                  events: {
                                    onChange: this.texthandle.bind(this),
                                  },
                                  others: {
                                    min: 0,
                                    max: 100,
                                    // disabled: this.state.approvedPack
                                  },
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <AlgaehAutoSearch
                      div={{
                        className: "col customServiceSearch AlgaehAutoSearch",
                      }}
                      label={{ forceLabel: "Search Services" }}
                      title="Search Services"
                      id="service_id_search"
                      template={({ service_name, service_type }) => {
                        return (
                          <div className={`row resultSecStyles`}>
                            <div className="col-12 padd-10">
                              <h4 className="title">
                                {_.startCase(_.toLower(service_name))}
                              </h4>
                              <p className="searchMoreDetails">
                                <span>
                                  Service Type:
                                  <b>{_.startCase(_.toLower(service_type))}</b>
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      }}
                      name="s_service"
                      columns={spotlightSearch.Services.servicemaster}
                      displayField="s_service_name"
                      value={this.state.s_service_name}
                      searchName="package_service"
                      onClick={this.serviceHandeler.bind(this)}
                      ref={(attReg) => {
                        this.attReg = attReg;
                      }}
                    />
                    {/* <AlagehAutoComplete
                      div={{ className: "col-3 form-group  mandatory" }}
                      label={{
                        fieldName: "select_service_type",
                        isImp: true,
                      }}
                      selector={{
                        name: "s_service_type",
                        className: "select-fld",
                        value: this.state.s_service_type,
                        dataSource: {
                          textField: "service_type",
                          valueField: "hims_d_service_type_id",
                          data: this.props.servicetype,
                        },
                        onChange: NewPackageEvent().serviceTypeHandeler.bind(
                          this,
                          this
                        ),
                        onClear: () => {
                          this.setState({
                            s_service_type: null,
                          });
                        },
                        others: {
                          // disabled: this.state.approvedPack
                        },
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col form-group  mandatory" }}
                      label={{
                        fieldName: "select_service",
                        isImp: true,
                      }}
                      selector={{
                        name: "s_service",
                        className: "select-fld",
                        value: this.state.s_service,
                        dataSource: {
                          textField: "service_name",
                          valueField: "hims_d_services_id",
                          data: this.props.services,
                        },
                        onChange: this.serviceHandeler.bind(this),
                        onClear: () => {
                          this.setState({
                            s_service: null,
                          });
                        },
                        others: {
                          // disabled: this.state.approvedPack
                        },
                      }}
                    /> */}

                    {this.state.package_visit_type === "M" ? (
                      <AlagehFormGroup
                        div={{ className: "col-2  mandatory" }}
                        label={{
                          forceLabel: "Quantity",
                          isImp: true,
                        }}
                        textBox={{
                          number: {
                            allowNegative: false,
                            thousandSeparator: ",",
                          },
                          className: "txt-fld",
                          name: "qty",
                          value: this.state.qty,
                          dontAllowKeys: ["-", "e", "."],
                          events: {
                            onChange: this.texthandle.bind(this),
                          },
                          others: {
                            step: "1",
                            // disabled: this.state.approvedPack
                          },
                        }}
                      />
                    ) : null}
                    <div className="col-2 form-group">
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: 20 }}
                        onClick={this.AddToList.bind(this)}
                        // disabled={this.state.approvedPack}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-lg-12" id="packagesGridCntr">
                        <AlgaehDataGrid
                          id="packages_detail_grid"
                          columns={[
                            {
                              fieldName: "action",
                              label: (
                                <AlgaehLabel label={{ fieldName: "action" }} />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    <i
                                      className="fas fa-trash-alt"
                                      onClick={this.DeleteService.bind(
                                        this,
                                        row
                                      )}
                                    />
                                  </span>
                                );
                              },
                              others: {
                                maxWidth: 65,
                                resizable: false,
                                filterable: false,
                                style: { textAlign: "center" },
                              },
                            },
                            {
                              fieldName: "service_type",
                              label: (
                                <AlgaehLabel
                                  label={{ fieldName: "service_type_id" }}
                                />
                              ),
                            },
                            {
                              fieldName: "service_name",
                              label: (
                                <AlgaehLabel
                                  label={{ fieldName: "service_id" }}
                                />
                              ),
                            },
                            {
                              fieldName: "qty",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Quantity" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return this.state.approvedPack === true ||
                                  this.state.package_visit_type === "S" ? (
                                  row.qty
                                ) : (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      number: {
                                        allowNegative: false,
                                        thousandSeparator: ",",
                                      },
                                      dontAllowKeys: ["-", "e", "."],
                                      value: row.qty,
                                      className: "txt-fld",
                                      name: "qty",
                                      events: {
                                        onChange: this.gridtexthandel.bind(
                                          this,
                                          row
                                        ),
                                      },
                                      others: {
                                        disabled: this.state.approvedPack,
                                        onBlur: this.makeZeroIngrid.bind(
                                          this,
                                          row
                                        ),
                                      },
                                    }}
                                  />
                                );
                              },
                              others: {
                                style: { textAlign: "center" },
                              },
                            },
                            {
                              fieldName: "service_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ fieldName: "service_amount" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {GetAmountFormart(row.service_amount, {
                                      appendSymbol: false,
                                    })}
                                  </span>
                                );
                              },
                            },
                            {
                              fieldName: "tot_service_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Total Service Amount" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {GetAmountFormart(row.tot_service_amount, {
                                      appendSymbol: false,
                                    })}
                                  </span>
                                );
                              },
                            },
                            {
                              fieldName: "appropriate_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Appropriate Amount" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {GetAmountFormart(row.appropriate_amount, {
                                      appendSymbol: false,
                                    })}
                                  </span>
                                );
                              },
                            },
                          ]}
                          keyId="packages_detail_grid"
                          dataSource={{
                            data: this.state.PakageDetail,
                          }}
                          // isEditable={true}
                          filter={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="popupFooter">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-4"> &nbsp;</div>

                    <div className="col-lg-8">
                      <button
                        onClick={this.InsertPackages.bind(this)}
                        type="button"
                        className="btn btn-primary"
                        disabled={this.state.button_enable}
                      >
                        {this.state.hims_d_package_header_id === null ? (
                          <AlgaehLabel label={{ fieldName: "btnSave" }} />
                        ) : (
                          <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
                        )}
                      </button>

                      {this.state.package_type === "S" ? (
                        <button
                          onClick={this.ApprovePackages.bind(this)}
                          type="button"
                          className="btn btn-primary"
                          disabled={
                            this.state.approved === "Y"
                              ? true
                              : this.state.approveEnable
                          }
                        >
                          Approve
                        </button>
                      ) : null}
                      <button
                        onClick={(e) => {
                          this.onClose(e);
                        }}
                        type="button"
                        className="btn btn-default"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={this.CopyCreatePackage.bind(this)}
                        type="button"
                        className="btn btn-primary"
                        disabled={
                          this.state.hims_d_package_header_id === null
                            ? true
                            : false
                        }
                      >
                        Copy & Create
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AlgaehModalPopUp>
          </form>
        </div>
      </React.Fragment>
    );
  }
}
