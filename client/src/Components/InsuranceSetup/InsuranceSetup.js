import React, { Component } from "react";
import "./insurancesetup.css";
import "../../styles/site.css";
import { Button, AlgaehDataGrid } from "../Wrapper/algaehWrapper";

class InsuranceSetup extends Component {
  render() {
    return (
      <div className="insurancesetup">
        {/* Bread Crumb Start */}
        {/* <div
          className="container-fluid"
          style={{ height: "80px", backgroundColor: "#f8f8f8" }}
        /> */}
        {/* Bread Crumb end */}

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
                fieldName: "identity_document_code",
                label: "Currency",
                disabled: true
              },
              {
                fieldName: "identity_document_code",
                label: "Insurance Name",
                disabled: true
              },
              {
                fieldName: "identity_document_code",
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
                fieldName: "identity_document_code",
                label: "Active From",
                disabled: true
              },
              {
                fieldName: "identity_document_code",
                label: "Valid Upto",
                disabled: true
              }
            ]}
            keyId="identity_document_code"
            dataSource={{
              data: this.props.idtypes === undefined ? [] : this.props.idtypes
            }}
            isEditable={true}
            paging={{ page: 0, rowsPerPage: 5 }}
          />
        </div>

        {/* Footer Start */}
        <div className="fixed-bottom insurance-footer">
          <div className="float-right">
            <Button style={{ margin: "10px" }} variant="raised" color="primary">
              ADD NEW
            </Button>
          </div>
        </div>

        {/* Footer End */}
      </div>
    );
  }
}

export default InsuranceSetup;
