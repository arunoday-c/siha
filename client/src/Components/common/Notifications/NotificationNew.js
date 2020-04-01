import React, { useState, useContext, useEffect } from "react";
import "./Notifications.scss";
import {
  notification,
  Drawer,
  Button,
  List,
  Skeleton,
  Empty,
  Avatar,
  Icon
} from "antd";
import { MainContext } from "algaeh-react-components/context";
import emptyImage from "./no_data.svg";

export default function Notification({ open, handlePanel }) {
  const base = Array(5).fill({ loading: true, message: "", title: "" });
  const [list, setList] = useState(base);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const context = useContext(MainContext);
  const { socket, userToken } = context;

  useEffect(() => {
    const check = Array.isArray(context.userMenu);
    console.log(socket, "socket");
    const addToNotiList = text => {
      setList(state => {
        state.push({ message: text });
        return [...state];
      });
      notification.info({
        message: "Notification",
        description: text,
        duration: 6,
        className: "notifySlide"
      });
    };

    if (socket.connected && Object.entries(userToken).length && !authed) {
      socket.emit("authentication", {
        token: userToken,
        moduleList: check
          ? context.userMenu.map(item => item.module_name.toLowerCase())
          : []
      });

      socket.on("authenticated", data => {
        setAuthed(true);
        console.log(data, "after auth");
        socket.emit("getAll");
      });

      socket.on("receiveAll", data => {
        console.log(data);
        if (data && Array.isArray(data)) {
          //   const result = data.map(item => item.message);
          setList(state => {
            return [...data];
          });
        }
        setLoading(false);
      });

      socket.on("refresh_appointment", msg => {
        addToNotiList(msg);
      });
      socket.on("patient_added", msg => {
        addToNotiList(msg);
      });
      socket.on("service_added", services => {
        let serStr = "";
        services.forEach(service => {
          serStr = serStr + service;
        });
        addToNotiList(`The following services are ordered: ${serStr}`);
      });

      socket.on("/success", text => {
        addToNotiList(text);
      });

      socket.on("/leave/requested", text => {
        addToNotiList(text);
      });

      socket.on("/leave/status", text => {
        addToNotiList(text);
      });

      socket.on("/loan/requested", text => {
        addToNotiList(text);
      });

      socket.on("/loan/status", text => {
        addToNotiList(text);
      });
    }
  }, [socket, userToken]);

  return (
    <Drawer
      title="Notifications"
      placement="right"
      closable={true}
      width={540}
      onClose={handlePanel}
      visible={open}
      className="notifyDrawer"
    >
      {list.length ? (
        <List
          className="demo-loadmore-list"
          loading={loading}
          bordered
          itemLayout="horizontal"
          header="Notifications"
          dataSource={list}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={[<Button type="ghost">Clear</Button>]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={<Avatar icon={<Icon type="message" />} />}
                  description={item.message}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      ) : (
        <Empty
          image={emptyImage}
          description={"Nothing for you now, Come back later"}
        />
      )}
    </Drawer>
  );
}
