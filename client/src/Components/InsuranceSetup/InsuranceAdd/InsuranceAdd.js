import React, { PureComponent } from "react";
import "./../../../styles/site.css";
import { Button, Modal } from "../../Wrapper/algaehWrapper";

import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import InsuranceProvider from "../InsuranceProvider/InsuranceProvider";
import SubInsurance from "../SubInsurance/SubInsurance";

export default class InsuranceAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    return (
      <React.Fragment>
        <Modal
          style={{ alignItems: "center", justifyContent: "center" }}
          open={this.props.open}
        >
          <div
            style={{
              backgroundColor: "#fff",
              // width: "150vh",
              height: "60vh",
              padding: "10px"
            }}
          >
            <div className="colorPrimary">
              <AppBar position="static" style={{ boxShadow: "none" }}>
                <Toolbar>
                  <Typography variant="title">Add Insurance</Typography>
                </Toolbar>
              </AppBar>
            </div>

            <SubInsurance />
            <br />

            <div className="float-right">
              <Button
                onClick={e => {
                  this.onClose(e);
                }}
                color="primary"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}
