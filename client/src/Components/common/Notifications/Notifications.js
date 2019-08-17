import React, { Component } from "react";
import { Header, Segment, Portal, Button } from "semantic-ui-react";
import isEqual from "lodash/isEqual";
import alNotification from "../../Wrapper/algaehNotification.js";
import { SocketContext } from "../../../sockets";

export default class Notifications extends Component {
  static contextType = SocketContext;
  constructor(props) {
    super(props);

    this.state = {
      moduleList: [],
      notiList: []
    };
  }

  componentDidMount() {
    this.context.ftdsk.on("refresh_appointment", patient => {
      this.addToNotiList(
        `Patient ${patient.patient_name} added to ${patient.appointment_from_time} slot on ${patient.appointment_date}`
      );
    });
  }

  addToNotiList = text => {
    const { notiList } = this.state;
    notiList.push(text);
    this.setState(
      {
        notiList
      },
      () => {
        alNotification({
          type: "info",
          text
        });
      }
    );
  };

  // componentDidUpdate(prevProps, prevState) {
  //   if (!isEqual(prevProps.modules, this.props.modules)) {
  //     this.setState({
  //       moduleList: this.props.modules
  //     });
  //   }
  // }

  render() {
    const { notiList } = this.state;
    return (
      <Portal open={this.props.open}>
        <Segment.Group
          style={{
            right: "2.5em",
            position: "fixed",
            top: "5%",
            zIndex: 1000,
            backgroundColor: "#fff",
            width: "35%"
          }}
          raised
        >
          <Segment>Notifications</Segment>
          <Segment.Group>
            {notiList.length !== 0 ? (
              notiList.map(noti => <Segment>{noti}</Segment>)
            ) : (
              <Segment>No notifications to show</Segment>
            )}
            {/*<Segment>No notifications to show</Segment>*/}
          </Segment.Group>
        </Segment.Group>
      </Portal>
    );
  }
}
