import React, { Component } from "react";
import "./Notifications.scss";
import { notification } from "antd";
import { Header, Segment, Portal, Button } from "semantic-ui-react";
// import isEqual from "lodash/isEqual";
import { MainContext } from "algaeh-react-components/context";
// import alNotification from "../../Wrapper/algaehNotification.js";
import sockets from "../../../sockets";
import moment from "moment";

export default class Notifications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notiList: []
    };
    this.socket = sockets;
  }

  static contextType = MainContext;

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
    const check = Array.isArray(this.context.userMenu);
    if (this.socket.connected) {
      this.socket.emit("authentication", {
        token: this.context.userToken,
        moduleList: check
          ? this.context.userMenu.map(item => item.module_name.toLowerCase())
          : []
      });

      this.socket.on("authenticated", data => {
        console.log(data, "after auth");
        this.socket.emit("getAll");
      });

      this.socket.on("receiveAll", data => {
        console.log(data);
        if (data && Array.isArray(data)) {
          const result = data.map(item => item.message);
          this.setState({
            notiList: result
          });
        }
      });

      this.socket.on("refresh_appointment", msg => {
        this.addToNotiList(msg);
      });
      this.socket.on("patient_added", msg => {
        this.addToNotiList(msg);
      });
      this.socket.on("service_added", services => {
        let serStr = "";
        services.forEach(service => {
          serStr = serStr + service;
        });
        this.addToNotiList(`The following services are ordered: ${serStr}`);
      });

      this.socket.on("/success", text => {
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
    debugger;
    const { notiList } = this.state;
    notiList.push(text);
    this.setState(
      {
        notiList
      },
      () => {
        this.socket.emit("save", {
          message: text,
          user_id: this.context.userToken.user_id
        });
        notification.open({
          message: "Notification",
          description: text,
          duration: 6
        });
      }
    );
  };

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
