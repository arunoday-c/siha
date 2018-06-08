import React, { Component } from "react";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";
import Slide from "material-ui/transitions/Slide";
import { Button } from "material-ui";
function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class DeleteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: true
    };
  }

  handleDialogClose() {
    this.setState({ openDialog: false });
  }

  render() {
    return (
      <div>
        {/* Dialog */}
        <div>
          <Dialog
            open={this.props.openDialog}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              Are you Sure you want to delete this Department ({
                this.props.dept_name
              })?
            </DialogTitle>

            <DialogActions>
              <Button onClick={this.props.handleDialogClose}>NO</Button>
              <Button onClick={this.props.handleConfirmDelete} color="primary">
                YES
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        {/* Dialog End */}
      </div>
    );
  }
}

export default DeleteDialog;
