import React, { Component } from "react";
import ReactDataGrid from "react-data-grid";
import {
  getDepartments,
  getSubDepartments
} from "../actions/CommonSetup/Department.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "material-ui/Button";
import SuccessDialog from "../utils/SuccessDialog.js";

class Experiment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: true
    };
  }

  handleDialogClose() {
    debugger;
    //    this.setState({ openDialog: false });
    <SuccessDialog />;
  }

  handleConfirmDelete() {}

  render() {
    return (
      <div>
        {/* Dialog */}
        {/* <div>
          <Dialog
            open={this.state.openDialog}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              Are you Sure you want to delete this Department?
            </DialogTitle>

            <DialogActions>
              <Button
                onClick={this.handleDialogClose.bind(this)}
                color="primary"
              >
                NO
              </Button>
              <Button
                onClick={this.handleConfirmDelete.bind(this)}
                color="primary"
              >
                YES
              </Button>
            </DialogActions>
          </Dialog>
        </div> */}
        {/* Dialog End */}
      </div>
    );
  }
}
export default Experiment;
