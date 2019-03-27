import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import Enumerable from "linq";
import "./PackageSetup.css";
import "../../styles/site.css";
import { AlgaehLabel, AlgaehDataGrid } from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";

// import { getPackages, EditPackages } from "./PackageSetupEvent";

// import moment from "moment";
// import Options from "../../Options.json";
import NewPackage from "./NewPackage/NewPackage";

class PackageSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,

      PackagesName: [],
      test_id: null,
      Packages_type: null,
      category_id: null,
      lab_section_id: null,
      specimen_id: null,
      hims_d_Packages_test_id: null,
      PackagesPop: {}
    };
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
        isOpen: !this.state.isOpen
      },
      () => {
        // if (e === true) {
        //   getInvestigations(this, this);
        // }
      }
    );
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
                InvestigationPop={this.state.InvestigationPop}
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
                            <i className="fas fa-pen" />
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
                      fieldName: "total_service_amount",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "total_service_amount" }}
                        />
                      )
                    },
                    {
                      fieldName: "profit_loss",
                      label: (
                        <AlgaehLabel label={{ fieldName: "profit_loss" }} />
                      ),
                      displayTemplate: row => {
                        return row.profit_loss === "P" ? "Profit" : "Loss";
                      }
                    },
                    {
                      fieldName: "pl_amount",
                      label: <AlgaehLabel label={{ fieldName: "pl_amount" }} />
                    }
                  ]}
                  keyId="packages_code"
                  dataSource={{
                    data: []
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
