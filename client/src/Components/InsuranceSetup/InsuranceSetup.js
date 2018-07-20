import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./insurancesetup.css";
import "../../styles/site.css";
import { AlgaehLabel, AlgaehDataGrid } from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";
import InsuranceAdd from "./InsuranceAdd/InsuranceAdd";

class InsuranceSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
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
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div className="insurancesetup">
        <div className="tab-container">
          <button className="tab-button active">
            Insurance Provider List{" "}
          </button>
        </div>
        <div className="insurance-section">
          <AlgaehDataGrid
            id="insurance_grid"
            columns={[
              {
                fieldName: "identity_document_code",
                label: "Actions",
                disabled: false
              },
              {
                fieldName: "identity_document_code",
                label: "#",
                disabled: true
              },
              {
                fieldName: "identity_document_code",
                label: "Type",
                disabled: true
              },
              {
                fieldName: "currency",
                label: "Currency",
                disabled: true
              },
              {
                fieldName: "insurance_provider_name",
                label: "Insurance Name",
                disabled: true
              },
              {
                fieldName: "insurance_provider_code",
                label: "Provider ID",
                disabled: true
              },
              {
                fieldName: "identity_document_code",
                label: "Payment Type",
                disabled: true
              },
              {
                fieldName: "identity_document_code",
                label: "Credit Period",
                disabled: true
              },
              {
                fieldName: "effective_start_date",
                label: "Active From",
                disabled: true
              },
              {
                fieldName: "effective_end_date",
                label: "Valid Upto",
                disabled: true
              }
            ]}
            keyId="identity_document_code"
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
        {/* Footer Start */}
        <div className="fixed-bottom insurance-footer">
          <div className="float-right">
            <button
              className="htpl1-phase1-btn-primary"
              style={{ margin: "10px" }}
              onClick={this.ShowModel.bind(this)}
            >
              ADD NEW
            </button>
          </div>
          <InsuranceAdd
            HeaderCaption={
              <AlgaehLabel
                label={{
                  fieldName: "add_insurance",
                  align: "ltr"
                }}
              />
            }
            open={this.state.isOpen}
            onClose={this.ShowModel.bind(this)}
          />
        </div>

        {/* Footer End */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    insProviders: state.insProviders
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getInsuranceProviders: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InsuranceSetup)
);
