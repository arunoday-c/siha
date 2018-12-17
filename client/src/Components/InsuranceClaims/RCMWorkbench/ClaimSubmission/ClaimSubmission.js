import React, { Component } from "react";
import "./ClaimSubmission.css";
import {
  AlgaehModalPopUp,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";

class ClaimSubmission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "en"
    };
  }

  submitClaims() {}

  render() {
    let submit_invoices = [];

    return (
      <AlgaehModalPopUp
        title="Claim Submission"
        events={{
          onClose: this.props.closeSubmissionModal
        }}
        openPopup={this.props.claimSubmission}
      >
        <div className="col-lg-12 popupInner">
          <div className="row">
            <AlgaehDataGrid
              id="claim-submit-griid"
              columns={[{ fieldName: "status", label: "Status" }]}
              keyId=""
              dataSource={{
                data: submit_invoices
              }}
              isEditable={false}
              paging={{ page: 0, rowsPerPage: 5 }}
              events={{
                onDelete: row => {},
                onEdit: row => {},
                onDone: row => {}
              }}
            />
          </div>
        </div>
        <div className="popupFooter">
          <button
            onClick={this.submitClaims.bind(this)}
            className="btn btn-primary"
          >
            Submit
          </button>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

export default ClaimSubmission;
