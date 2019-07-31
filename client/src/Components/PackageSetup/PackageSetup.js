import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import Enumerable from "linq";
import "./PackageSetup.css";
import "../../styles/site.css";
import { AlgaehLabel, AlgaehDataGrid } from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";

import PackageSetupEvent from "./PackageSetupEvent";

// import moment from "moment";
// import Options from "../../Options.json";
import NewPackage from "./NewPackage/NewPackage";

class PackageSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,

      PackagesPop: {},
      all_packages: [],
      vat_applicable: "N",
      vat_percent: 0
    };
    PackageSetupEvent().getPackage(this);
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      PackagesPop: {}
    });
  }

  CloseModel(e) {
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen,
        PackagesPop: {}
      },
      () => {
        if (e === true) {
          PackageSetupEvent().getPackage(this);
        }
      }
    );
  }

  EditPackageMaster(row) {
    PackageSetupEvent().OpenPackageMaster(this, row);
  }

  render() {
    return (
      <div className="hims_packagesetup">
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Package Lists</h3>
            </div>
            <div className="actions">
              <a
                // href="javascript"
                className="btn btn-primary btn-circle active"
                onClick={this.ShowModel.bind(this)}
              >
                <i className="fas fa-plus" />
              </a>
              <NewPackage
                HeaderCaption={
                  <AlgaehLabel
                    label={{
                      fieldName: "investigation_setup",
                      align: "ltr"
                    }}
                  />
                }
                open={this.state.isOpen}
                onClose={this.CloseModel.bind(this)}
                PackagesPop={this.state.PackagesPop}
                all_Pakage_data={this.state.all_packages}
              />
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="packagesGridCntr">
                <AlgaehDataGrid
                  id="packagesGrid"
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <i
                              className="fas fa-pen"
                              onClick={this.EditPackageMaster.bind(this, row)}
                            />
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 65,
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "package_code",
                      label: (
                        <AlgaehLabel label={{ fieldName: "package_code" }} />
                      )
                    },
                    {
                      fieldName: "package_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "package_name" }} />
                      )
                    },
                    {
                      fieldName: "package_amount",
                      label: (
                        <AlgaehLabel label={{ fieldName: "package_amount" }} />
                      )
                    },

                    {
                      fieldName: "approved",
                      label: <AlgaehLabel label={{ forceLabel: "approved" }} />,
                      displayTemplate: row => {
                        return row.approved === "Y" ? "Yes" : "No";
                      }
                    },
                    {
                      fieldName: "package_status",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Package Status" }} />
                      ),
                      displayTemplate: row => {
                        return row.package_status === "A"
                          ? "Active"
                          : "Inactive";
                      }
                    }
                  ]}
                  keyId="packages_code"
                  dataSource={{
                    data: this.state.all_packages
                  }}
                  // isEditable={true}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 20 }}
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
    investigationdetails: state.investigationdetails,
    testcategory: state.testcategory,
    labspecimen: state.labspecimen,
    labsection: state.labsection
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getInvestigationDetails: AlgaehActions,
      getTestCategory: AlgaehActions,
      getLabSpecimen: AlgaehActions,
      getLabsection: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PackageSetup)
);
