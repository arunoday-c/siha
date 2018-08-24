import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import AddBox from "@material-ui/icons/AddBox";
import IconButton from "@material-ui/core/IconButton";
import AddCircle from "@material-ui/icons/AddCircle";
import Update from "@material-ui/icons/Update";

import "./InvestigationSetup.css";
import "../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";

import { texthandle } from "./InvestigationSetupEvent";

import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import { FORMAT_LAB_RAD } from "../../utils/GlobalVariables.json";
import moment from "moment";
import Options from "../../Options.json";
import NewInvestigation from "./NewInvestigation/NewInvestigation";

class InvestigationSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      opencomponent: 0,
      addfunctionality: true,
      buttonenable: false,
      category_id: null
    };
  }

  componentDidMount() {
    if (
      this.props.insProviders === undefined ||
      this.props.insProviders.length === 0
    ) {
      this.props.getInsuranceProviders({
        uri: "/insurance/getListOfInsuranceProvider",
        method: "GET",
        redux: {
          type: "INSURANCE_PROVIDER_GET_DATA",
          mappingName: "insProviders"
        }
      });
    }

    this.props.getTestCategory({
      uri: "/labmasters/selectTestCategory",
      method: "GET",
      redux: {
        type: "TESTCATEGORY_GET_DATA",
        mappingName: "testcategory"
      }
    });
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen
    });
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  setUpdateComponent(row, e) {
    this.setState({
      opencomponent: e.value,
      buttonenable: true,
      insurance_provider_id: row.hims_d_insurance_provider_id,
      insurance_provider_name: row.insurance_provider_name,
      isOpen: true,
      addfunctionality: false
    });
  }

  render() {
    return (
      <div className="hims_investigationsetup">
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ fieldName: "investigation_setup", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "investigation_settings",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ fieldName: "investigation_setup", align: "ltr" }}
                />
              )
            }
          ]}
        />
        <div className="container-fluid" style={{ marginTop: "85px" }}>
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "category_id"
              }}
              selector={{
                name: "category_id",
                className: "select-fld",
                value: this.state.category_id,
                dataSource: {
                  textField: "category_name",
                  valueField: "hims_d_test_category_id",
                  data: this.props.testcategory
                },
                onChange: texthandle.bind(this, this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "test_name"
              }}
              selector={{
                name: "test_name",
                className: "select-fld",
                value: this.state.test_name,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: FORMAT_LAB_RAD
                },
                onChange: texthandle.bind(this, this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "investigation_type"
              }}
              selector={{
                name: "investigation_type",
                className: "select-fld",
                value: this.state.investigation_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: FORMAT_LAB_RAD
                },
                onChange: texthandle.bind(this, this)
              }}
            />
            {/* <div className="col-lg-1">
                <IconButton className="go-button" color="primary">
                  <PlayCircleFilled
                    onClick={getSampleCollectionDetails.bind(this, this)}
                  />
                </IconButton>
              </div> */}
          </div>
          <div className="row hims_investigationsetup">
            <div className="col-lg-12">
              <div className="investigation-section">
                <AlgaehDataGrid
                  id="investigation_grid"
                  columns={[
                    {
                      fieldName: "category",
                      label: (
                        <AlgaehLabel label={{ fieldName: "category_id" }} />
                      )
                    },
                    {
                      fieldName: "description",
                      label: <AlgaehLabel label={{ fieldName: "test_name" }} />
                    },
                    {
                      fieldName: "investigation_type",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "investigation_type" }}
                        />
                      ),
                      displayTemplate: row => {
                        return row.investigation_type === "L"
                          ? "Lab"
                          : "Radiology";
                      }
                    },
                    {
                      fieldName: "created_date",
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_date" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>{this.changeDateFormat(row.created_date)}</span>
                        );
                      },
                      disabled: true
                    },
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: row => {
                        return row.investigation_type === "L" ? (
                          <span>
                            <IconButton color="primary" title="Add Specimen">
                              <AddCircle
                              //   onClick={this.ShowSubmitModel.bind(this, row)}
                              />
                            </IconButton>
                            <IconButton color="primary" title="Add Analytes">
                              <AddBox
                              //   onClick={this.ShowEditModel.bind(this, row)}
                              />
                            </IconButton>
                          </span>
                        ) : (
                          <span>
                            <IconButton color="primary" title="Add Template">
                              <Update
                              //   onClick={VerifyOrderModel.bind(this, this, row)}
                              />
                            </IconButton>
                          </span>
                        );
                      }
                    }
                  ]}
                  keyId="investigation_code"
                  dataSource={{
                    data:
                      this.props.insProviders === undefined
                        ? []
                        : this.props.insProviders
                  }}
                  // isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Footer Start */}
        <div className="fixed-bottom investigation-footer">
          <div className="float-right">
            <button
              className="htpl1-phase1-btn-primary"
              style={{ margin: "10px" }}
              onClick={this.ShowModel.bind(this)}
            >
              ADD NEW
            </button>
            <NewInvestigation
              open={this.state.isOpen}
              onClose={this.ShowModel.bind(this)}
            />
          </div>
        </div>
        {/* Footer End */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    insProviders: state.insProviders,
    testcategory: state.testcategory
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getInsuranceProviders: AlgaehActions,
      getTestCategory: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InvestigationSetup)
);
