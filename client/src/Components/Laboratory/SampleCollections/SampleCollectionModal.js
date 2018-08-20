import React, { PureComponent } from "react";
import Typography from "@material-ui/core/Typography";

import "../../../styles/site.css";
import { Modal } from "../../Wrapper/algaehWrapper";

import SampleCollections from "./SampleCollections";

export default class VerifyOrders extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      submission_type: null
    };
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  //   componentWillReceiveProps(nextProps) {
  //     if (nextProps.selected_services !== null) {
  //       let InputOutput = nextProps.selected_services;
  //       for (let i = 0; i < InputOutput.services_details.length; i++) {
  //         InputOutput.services_details[i].checkselect = 1;
  //       }
  //       this.setState({ ...this.state, ...InputOutput });
  //     }
  //   }

  render() {
    return (
      <React.Fragment>
        <div>
          <Modal
            style={{
              margin: "0 auto",
              width: "100vh"
            }}
            open={this.props.open}
          >
            <div className="colorPrimary header">
              {/* <Typography variant="title">{this.props.HeaderCaption}</Typography> */}
              <Typography variant="title">Sample Collection</Typography>
            </div>
            <SampleCollections />
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}
