import React, { Component } from "react";
import "./Notifications.scss";
import { notification } from "antd";
import { Header, Segment, Portal, Button } from "semantic-ui-react";
// import isEqual from "lodash/isEqual";
import alNotification from "../../Wrapper/algaehNotification.js";
import sockets from "../../../sockets";
import moment from "moment";

export default class Notifications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moduleList: [],
      notiList: []
    };
    this.socket = sockets;
  }

  formatTime(time) {
    return moment(time, "HH:mm:ss").format("hh:mm A");
  }

  formatDate(date) {
    const req_date = moment(date, "YYYY-MM-DD");
    if (req_date.isSame(moment(), "day")) {
      return "for today";
    } else {
      return `on ${req_date.format("D MMM")}`;
    }
  }

  componentDidMount() {
    // use fat arrow functions as callbacks to inherit "this"
    if (this.socket.connected) {
      this.socket.on("refresh_appointment", patient => {
        this.addToNotiList(
          `Patient ${patient.patient_name} added to ${this.formatTime(
            patient.appointment_from_time
          )} slot ${this.formatDate(patient.appointment_date)}`
        );
      });
      this.socket.on("patient_added", patient => {
        debugger;
        const time = this.formatTime(patient.appointment_from_time);
        const date = this.formatDate(patient.appointment_date);
        this.addToNotiList(
          `${patient.patient_name} booked an appointment on ${time}
          ${date}`
        );
      });
      this.socket.on("service_added", services => {
        let serStr = "";
        services.forEach(service => {
          serStr = serStr + service;
        });
        this.addToNotiList(`The following services are ordered: ${serStr}`);
      });

      this.socket.on("/success", text => {
        debugger;
        this.addToNotiList(text);
      });

      this.socket.on("/leave/requested", text => {
        this.addToNotiList(text);
      });

      this.socket.on("/leave/status", text => {
        this.addToNotiList(text);
      });

      this.socket.on("/loan/requested", text => {
        this.addToNotiList(text);
      });

      this.socket.on("/loan/status", text => {
        this.addToNotiList(text);
      });
    }
  }

  addToNotiList = text => {
    const { notiList } = this.state;
    notiList.push(text);
    // notification.open({
    //   message: "Notification",
    //   description: text,
    //   duration: 6
    // });
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
      <Portal open={this.props.open} onClose={this.props.handlePanel}>
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
              notiList.map((noti, index) => (
                <Segment className="notificationList" key={index}>
                  {noti}
                </Segment>
              ))
            ) : (
              <Segment style={{ textAlign: "center" }}>
                No notifications
              </Segment>
            )}
            {/*<Segment>No notifications to show</Segment>*/}
          </Segment.Group>
        </Segment.Group>
      </Portal>
    );
  }
}
