import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Upload, Modal } from "antd";
import { AlgaehActions } from "../../../actions/algaehActions";
import { newAlgaehApi } from "../../../hooks";
import "./ContractManagement.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlgaehDataGrid,
} from "../../Wrapper/algaehWrapper";
import AlgaehAutoSearch from "../../Wrapper/autoSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import _ from "lodash";
import GlobalVariables from "../../../utils/GlobalVariables.json";

import {
  texthandle,
  datehandle,
  dateValidate,
  deleteContarctServices,
  AddSerices,
  servicechangeText,
  generateContractReport,
  SaveContract,
  ClearData,
  addToTermCondition,
  deleteComment,
  getCtrlCode,
  employeeSearch,
  getCostCenters,
  updateContract,
} from "./ContractManagementEvents";
import Options from "../../../Options.json";
import moment from "moment";
import { MainContext } from "algaeh-react-components/context";

const { Dragger } = Upload;
const { confirm } = Modal;
class ContractManagement extends Component {
  constructor(props) {
    super(props);

    this.HRMNGMT_Active = false;

    this.state = {
      hims_f_contract_management_id: null,
      contract_number: null,
      contract_code: null,
      contract_date: new Date(),
      customer_id: null,
      contract_files: [],
      contract_docs: [],
      start_date: null,
      end_date: null,
      contract_services: [],

      quotation_ref_numb: null,
      saveEnable: true,

      service_name: "",
      services_id: null,
      service_frequency: null,
      service_price: 0,
      addItemButton: true,

      hims_f_terms_condition_id: null,
      selected_terms_conditions: "",
      comment_list: [],

      dataExists: false,
      editMode: false,
      hospital_id: null,

      employee_name: null,
      incharge_employee_id: null,
      notification_days1: null,
      notification_days2: null,
      comments: "",
      cost_projects: [],
      project_id: null,

      organizations: [],
    };
    getCostCenters(this);
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    // this.setState({
    //   hospital_id: userToken.hims_d_hospital_id,
    // });

    this.HRMNGMT_Active =
      userToken.product_type === "HIMS_ERP" ||
      userToken.product_type === "HRMS" ||
      userToken.product_type === "HRMS_ERP" ||
      userToken.product_type === "FINANCE_ERP" ||
      userToken.product_type === "NO_FINANCE";

    this.props.getCustomerMaster({
      uri: "/customer/getCustomerMaster",
      module: "masterSettings",
      data: { customer_status: "A" },
      method: "GET",
      redux: {
        type: "CUSTOMER_GET_DATA",
        mappingName: "customer_data",
      },
    });

    this.props.getTermsConditions({
      uri: "/salseSetup/getTermsConditions",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "TERMS_COND_GET_DATA",
        mappingName: "terms_conditions",
      },
    });
  }

  downloadDoc = (doc) => {
    const link = document.createElement("a");
    link.download = doc.filename;
    link.href = `data:${doc.filetype};base64,${doc.document}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  deleteDoc = (doc) => {
    const self = this;
    confirm({
      title: `Are you sure you want to delete this file?`,
      content: `${doc.filename}`,
      icon: <i className="fa fa-trash"></i>,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        self.onDelete(doc);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  onDelete = (doc) => {
    newAlgaehApi({
      uri: "/deleteContractDoc",
      method: "DELETE",
      module: "documentManagement",
      data: { id: doc._id },
    }).then((res) => {
      if (res.data.success) {
        this.setState((state) => {
          const contract_docs = state.contract_docs.filter(
            (item) => item._id !== doc._id
          );
          return { contract_docs };
        });
      }
    });
  };

  render() {
    const class_finder = this.state.dataExists === true ? " disableFinder" : "";
    return (
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Contract Management", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Home",
                    align: "ltr",
                  }}
                />
              ),
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ forceLabel: "Contract Management", align: "ltr" }}
                />
              ),
            },
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "Contract Number", returnText: true }}
              />
            ),
            value: this.state.contract_number,
            selectValue: "contract_number",
            events: {
              onChange: getCtrlCode.bind(this, this),
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Sales.ContractMang",
            },
            searchName: "ContractMang",
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Contract Date",
                  }}
                />
                <h6>
                  {this.state.contract_date
                    ? moment(this.state.contract_date).format(
                        Options.dateFormat
                      )
                    : Options.dateFormat}
                </h6>
              </div>
            </div>
          }
          printArea={
            this.state.contract_number !== null
              ? {
                  menuitems: [
                    {
                      label: "Contract Report",
                      events: {
                        onClick: () => {
                          generateContractReport(this.state);
                        },
                      },
                    },
                  ],
                }
              : ""
          }
          selectedLang={this.state.selectedLang}
        />
        <div
          className="row  inner-top-search"
          style={{ marginTop: 76, paddingBottom: 10 }}
        >
          {/* Patient code */}
          <div className="col-lg-12">
            <div className="row" data-validate="HeaderDiv">
              <AlagehAutoComplete
                div={{ className: "col form-group mandatory" }}
                label={{ forceLabel: "Customer", isImp: true }}
                selector={{
                  name: "customer_id",
                  className: "select-fld",
                  value: this.state.customer_id,
                  dataSource: {
                    textField: "customer_name",
                    valueField: "hims_d_customer_id",
                    data: this.props.customer_data,
                  },
                  onChange: texthandle.bind(this, this),
                  onClear: () => {
                    this.setState({
                      customer_id: null,
                    });
                  },
                  autoComplete: "off",
                  others: {
                    disabled: this.state.dataExists,
                  },
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-3 mandatory" }}
                label={{
                  forceLabel: "Enter Contract Code",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "contract_code",
                  events: {
                    onChange: texthandle.bind(this, this),
                  },
                  value: this.state.contract_code,
                  others: {
                    disabled: this.state.dataExists && !this.state.editMode,
                  },
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-3 mandatory" }}
                label={{
                  forceLabel: "Enter Quotation Ref. Number",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "quotation_ref_numb",
                  events: {
                    onChange: texthandle.bind(this, this),
                  },
                  value: this.state.quotation_ref_numb,
                  others: {
                    disabled: this.state.dataExists && !this.state.editMode,
                  },
                }}
              />

              <AlgaehDateHandler
                div={{ className: "col mandatory" }}
                label={{ forceLabel: "Start Date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "start_date",
                }}
                // minDate={new Date()}
                events={{
                  onChange: datehandle.bind(this, this),
                  // onBlur: dateValidate.bind(this, this),
                }}
                disabled={this.state.dataExists && !this.state.editMode}
                value={this.state.start_date}
              />

              <AlgaehDateHandler
                div={{ className: "col mandatory" }}
                label={{ forceLabel: "End Date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "end_date",
                }}
                minDate={new Date()}
                events={{
                  onChange: datehandle.bind(this, this),
                  onBlur: dateValidate.bind(this, this),
                }}
                disabled={this.state.dataExists && !this.state.editMode}
                value={this.state.end_date}
              />

              {this.HRMNGMT_Active ? (
                <>
                  <div
                    className={
                      "col-3 globalSearchCntr form-group mandatory" +
                      class_finder
                    }
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Incharge Employee", isImp: true }}
                    />
                    <h6 onClick={employeeSearch.bind(this, this)}>
                      {this.state.employee_name
                        ? this.state.employee_name
                        : "Search Employee"}
                      <i className="fas fa-search fa-lg" />
                    </h6>
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-2 form-group" }}
                    label={{
                      forceLabel: "Notify 1st before (Days)",
                    }}
                    textBox={{
                      number: {
                        allowNegative: false,
                        thousandSeparator: ",",
                      },
                      className: "txt-fld",
                      name: "notification_days1",
                      value: this.state.notification_days1,
                      dontAllowKeys: ["-", "e", "."],
                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                      others: {
                        disabled: this.state.dataExists && !this.state.editMode,
                        placeholder: "30",
                      },
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-2 form-group" }}
                    label={{
                      forceLabel: "Notify 2nd before (Days)",
                    }}
                    textBox={{
                      number: {
                        allowNegative: false,
                        thousandSeparator: ",",
                      },
                      className: "txt-fld",
                      name: "notification_days2",
                      value: this.state.notification_days2,
                      dontAllowKeys: ["-", "e", "."],
                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                      others: {
                        disabled: this.state.dataExists && !this.state.editMode,
                        placeholder: "60",
                      },
                    }}
                  />
                </>
              ) : null}
              <AlagehAutoComplete
                div={{ className: "col-2 form-group mandatory" }}
                label={{
                  forceLabel: "Select Project",
                  isImp: true,
                }}
                selector={{
                  name: "project_id",
                  className: "select-fld",
                  value: this.state.project_id,
                  dataSource: {
                    textField: "cost_center",
                    valueField: "cost_center_id",
                    data: this.state.cost_projects,
                  },
                  onChange: texthandle.bind(this, this),
                  others: {
                    disabled: this.state.dataExists && !this.state.editMode,
                  },
                  onClear: () => {
                    this.setState({
                      project_id: null,
                      hospital_id: null,
                      organizations: [],
                    });
                  },
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-2 mandatory" }}
                label={{
                  forceLabel: "Select Branch",
                  isImp: true,
                }}
                selector={{
                  name: "hospital_id",
                  className: "select-fld",
                  value: this.state.hospital_id,
                  dataSource: {
                    textField: "hospital_name",
                    valueField: "hims_d_hospital_id",
                    data: this.state.organizations,
                  },
                  onChange: texthandle.bind(this, this),
                  others: {
                    disabled: this.state.dataExists && !this.state.editMode,
                  },
                  onClear: () => {
                    this.setState({
                      hospital_id: null,
                    });
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-9">
            <div className="portlet portlet-bordered ">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Contract Items</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row" data-validate="ServiceDiv">
                  <div className="col-3">
                    <div className="row">
                      {" "}
                      <AlgaehAutoSearch
                        div={{ className: "col-12 form-group mandatory" }}
                        label={{ forceLabel: "Service Name" }}
                        title="Search Service"
                        id="item_id_search"
                        template={({ service_name, service_type }) => {
                          return (
                            <section className="resultSecStyles">
                              <div className="row">
                                <div className="col">
                                  <h4 className="title">
                                    {_.startCase(_.toLower(service_name))}
                                  </h4>
                                  <p className="searchMoreDetails">
                                    <span>
                                      Service Type:
                                      <b>
                                        {_.startCase(_.toLower(service_type))}
                                      </b>
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </section>
                          );
                        }}
                        name="services_id"
                        columns={spotlightSearch.Services.servicemaster}
                        displayField="service_name"
                        value={this.state.service_name}
                        searchName="servicemaster"
                        onClick={servicechangeText.bind(this, this)}
                        extraParameters={{
                          service_type_id: 7,
                        }}
                        ref={(attReg) => {
                          this.attReg = attReg;
                        }}
                        onClear={() => {
                          this.setState({
                            service_name: "",
                            services_id: null,
                            service_frequency: null,
                            service_price: 0,
                            addItemButton: true,
                          });
                        }}
                        others={{
                          disabled:
                            this.state.dataExists && !this.state.editMode,
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-12 form-group mandatory" }}
                        label={{ forceLabel: "Frequency", isImp: true }}
                        selector={{
                          sort: "off",
                          name: "service_frequency",
                          className: "select-fld",
                          value: this.state.service_frequency,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.SERVICE_FREQUENCY,
                          },
                          onChange: texthandle.bind(this, this),
                          others: {
                            disabled:
                              this.state.dataExists && !this.state.editMode,
                            tabIndex: "4",
                          },
                          onClear: () => {
                            this.setState({
                              service_frequency: null,
                            });
                          },
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-12 form-group mandatory" }}
                        label={{
                          forceLabel: "Service Price",
                          isImp: false,
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          className: "txt-fld",
                          name: "service_price",
                          value: this.state.service_price,
                          events: {
                            onChange: texthandle.bind(this, this),
                          },
                          others: {
                            tabIndex: "6",
                          },
                        }}
                      />
                      <div className="col-12">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Comments",
                          }}
                        />

                        <textarea
                          value={this.state.comments}
                          name="comments"
                          onChange={texthandle.bind(this, this)}
                        >
                          {this.state.comments}
                        </textarea>
                      </div>
                      <div className="col-12">
                        <button
                          className="btn btn-primary"
                          onClick={AddSerices.bind(this, this)}
                          disabled={this.state.addItemButton}
                          tabIndex="5"
                          style={{ marginTop: 19 }}
                        >
                          Add Service
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-9">
                    <div className="row">
                      {" "}
                      <div className="col-12">
                        <AlgaehDataGrid
                          id="SaleQuotationGrid"
                          columns={[
                            {
                              fieldName: "actions",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Action" }} />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span
                                    onClick={deleteContarctServices.bind(
                                      this,
                                      this,
                                      row
                                    )}
                                  >
                                    <i
                                      style={{
                                        pointerEvents:
                                          this.state.dataExists &&
                                          !this.state.editMode
                                            ? "none"
                                            : "",
                                        opacity:
                                          this.state.dataExists &&
                                          !this.state.editMode
                                            ? "0.1"
                                            : "",
                                      }}
                                      className="fas fa-trash-alt"
                                    />
                                  </span>
                                );
                              },
                              others: {
                                minWidth: 50,
                              },
                            },
                            {
                              fieldName: "service_name",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Service Name" }}
                                />
                              ),
                              disabled: true,
                              others: {
                                minWidth: 150,
                              },
                            },

                            {
                              fieldName: "service_frequency",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Frequency" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                let display = GlobalVariables.SERVICE_FREQUENCY.filter(
                                  (f) => f.value === row.service_frequency
                                );

                                return (
                                  <span>
                                    {display !== undefined &&
                                    display.length !== 0
                                      ? display[0].name
                                      : ""}
                                  </span>
                                );
                              },
                              disabled: true,
                            },
                            {
                              fieldName: "service_price",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Service Price" }}
                                />
                              ),
                              disabled: true,
                              others: {
                                minWidth: 90,
                              },
                            },
                            {
                              fieldName: "comments",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Comments",
                                  }}
                                />
                              ),
                              disabled: true,
                              others: {
                                minWidth: 200,
                              },
                            },
                          ]}
                          keyId="service_type_id"
                          dataSource={{
                            data: this.state.editMode
                              ? this.state.contract_services.filter(
                                  (item) => item.record_status === "A"
                                )
                              : this.state.contract_services,
                          }}
                          paging={{ page: 0, rowsPerPage: 10 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="portlet portlet-bordered margin-top-15"
              style={{ marginBottom: 50 }}
            >
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Contract Attachments</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-4">
                    {" "}
                    <Dragger
                      accept=".doc,.docx,application/msword,.pdf"
                      name="contract_file"
                      onRemove={(file) => {
                        this.setState((state) => {
                          const index = state.fileList.indexOf(file);
                          const newFileList = state.fileList.slice();
                          newFileList.splice(index, 1);
                          return {
                            contract_files: newFileList,
                            saveEnable: state.dataExists && !newFileList.length,
                          };
                        });
                      }}
                      beforeUpload={(file) => {
                        this.setState((state) => ({
                          contract_files: [...state.contract_files, file],
                          saveEnable: false,
                        }));
                        return false;
                      }}
                      fileList={this.state.contract_files}
                    >
                      <p className="upload-drag-icon">
                        <i className="fas fa-file-upload"></i>
                      </p>
                      <p className="ant-upload-text">
                        {this.state.contract_file
                          ? `Click or Drag a file to replace the current file`
                          : `Click or Drag a file to this area to upload`}
                      </p>
                    </Dragger>
                  </div>
                  <div className="col-8">
                    <div className="row">
                      <div className="col-12">
                        <ul className="contractAttachmentList">
                          {this.state.contract_docs.length ? (
                            this.state.contract_docs.map((doc) => (
                              <li>
                                <b> {doc.filename} </b>
                                <span>
                                  <i
                                    className="fas fa-download"
                                    onClick={() => this.downloadDoc(doc)}
                                  ></i>
                                  <i
                                    className="fas fa-trash"
                                    onClick={() => this.deleteDoc(doc)}
                                  ></i>
                                </span>
                              </li>
                            ))
                          ) : (
                            <div className="col-12" key={1}>
                              <p>No Attachments Available</p>
                            </div>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Contract Terms & Conditions
                  </h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-12  form-group mandatory" }}
                    label={{ forceLabel: "Select T&C", isImp: true }}
                    selector={{
                      name: "hims_f_terms_condition_id",
                      className: "select-fld",
                      value: this.state.hims_f_terms_condition_id,
                      dataSource: {
                        textField: "short_name",
                        valueField: "hims_f_terms_condition_id",
                        data: this.props.terms_conditions,
                      },
                      onChange: texthandle.bind(this, this),
                      onClear: () => {
                        this.setState({
                          hims_f_terms_condition_id: null,
                          selected_terms_conditions: "",
                        });
                      },
                      autoComplete: "off",
                      others: {
                        disabled: this.state.dataExists && !this.state.editMode,
                      },
                    }}
                  />

                  <div className="col-12 form-group">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Enter T&C",
                      }}
                    />

                    <textarea
                      value={this.state.selected_terms_conditions}
                      name="selected_terms_conditions"
                      onChange={texthandle.bind(this, this)}
                      disabled={this.state.dataExists && !this.state.editMode}
                    />
                  </div>
                  {this.state.dataExists && !this.state.editMode ? null : (
                    <div className="col" style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addToTermCondition.bind(this, this)}
                      >
                        Add
                      </button>
                    </div>
                  )}

                  <div className="col-12  form-group finalCommentsSection">
                    <h6>View T&C</h6>
                    <ol>
                      {this.state.comment_list.length > 0
                        ? this.state.comment_list.map((row, index) => {
                            return (
                              <React.Fragment key={index}>
                                <li key={index}>
                                  <span>{row}</span>
                                  {this.state.dataExists &&
                                  !this.state.editMode ? null : (
                                    <i
                                      className="fas fa-times"
                                      onClick={deleteComment.bind(
                                        this,
                                        this,
                                        row
                                      )}
                                    ></i>
                                  )}
                                </li>
                              </React.Fragment>
                            );
                          })
                        : null}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              {this.state.editMode ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={updateContract.bind(this)}
                  disabled={this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Update Contract",
                      returnText: true,
                    }}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={SaveContract.bind(this, this)}
                  disabled={this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Save Contract",
                      returnText: true,
                    }}
                  />
                </button>
              )}

              <button
                type="button"
                className="btn btn-default"
                disabled={this.state.ClearDisable}
                onClick={ClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>
              {this.state.dataExists && (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => this.setState({ editMode: true })}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Edit Contract", returnText: true }}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    customer_data: state.customer_data,
    terms_conditions: state.terms_conditions,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getCustomerMaster: AlgaehActions,
      getTermsConditions: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ContractManagement)
);
