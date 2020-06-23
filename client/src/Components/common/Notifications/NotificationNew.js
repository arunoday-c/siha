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
  Icon,
  Switch,
  Tabs,
} from "antd";
import { MainContext } from "algaeh-react-components/context";
import emptyImage from "./no_data.svg";
const { TabPane } = Tabs;

export default function Notification({ open, handlePanel }) {
  const base = Array(5).fill({ loading: true, message: "", title: "" });
  // const base = [];
  const [list, setList] = useState(base);
  const [today, setToday] = useState(base);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [doNot, setDoNot] = useState(false);
  const context = useContext(MainContext);
  const { socket, userToken } = context;

  useEffect(() => {
    const check = Array.isArray(context.userMenu);
    const addToNotiList = (notobj) => {
      setToday((state) => {
        state.unshift(notobj);
        return [...state];
      });
      if (!doNot) {
        window.audio_feedback.play();
        notification.info({
          message: "Notification",
          description: notobj.message,
          duration: 6,
          className: "notifySlide",
        });
      }
    };

    if (socket.connected && Object.entries(userToken).length && !authed) {
      socket.emit("authentication", {
        token: userToken,
        moduleList: check
          ? context.userMenu.map((item) => item.module_code.toLowerCase())
          : [],
      });

      socket.once("authenticated", (data) => {
        setAuthed(true);
        console.log(data, "after auth");
        socket.emit("getAll");
      });

      socket.on("receiveAll", (data) => {
        console.log(data);
        if (data && Array.isArray(data)) {
          setList(data);
        } else {
          setList([]);
        }
        setLoading(false);
      });

      socket.on("today", (data) => {
        if (data && Array.isArray(data)) {
          setToday(data);
        } else {
          setToday([]);
        }
        setLoading(false);
      });

      socket.on("notification", (msg) => {
        addToNotiList(msg);
      });

      socket.on("refresh_appointment", (msg) => {
        addToNotiList(msg);
      });
      socket.on("patient_added", (msg) => {
        addToNotiList(msg);
      });
      socket.on("service_added", (services) => {
        let serStr = "";
        services.forEach((service) => {
          serStr = serStr + service;
        });
        addToNotiList(`The following services are ordered: ${serStr}`);
      });

      socket.on("removed", (removed) => {
        setList((state) => {
          const current = state.filter((item) => item._id !== removed._id);
          return current;
        });
      });
    }
  }, [socket, userToken]);

  function removeNotification(e) {
    const { dataset } = e.target;
    const active = JSON.parse(dataset.current);
    context.socket.emit("delete", active._id);
  }

  function changeDisturb() {
    setDoNot((state) => !state);
  }

  // function getTitle(item) {
  //   console.log(item)
  //   const result = context.userMenu.filter(
  //     (menu) => menu.module_code.toLowerCase() === item.module
  //   );
  //   console.log(result)
  //   return result[0].module_name;
  // }

  function NotiList({ content }) {
    return (
      <>
        {content.length ? (
          <List
            className="demo-loadmore-list"
            // loading={loading}
            bordered
            style={{ paddingBottom: "2.5rem", borderBottom: 0 }}
            itemLayout="horizontal"
            dataSource={content}
            renderItem={(item) => (
              <List.Item
                key={item._id}
                actions={[
                  <Button
                    type="ghost"
                    icon="close"
                    loading={item.loading}
                    data-current={JSON.stringify(item)}
                    onClick={removeNotification}
                  />,
                ]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={item.title || "Title"}
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
      </>
    );
  }

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
      <Tabs defaultActiveKey="1" type="line" size="default">
        <TabPane tab="Today" key="1">
          <NotiList content={today} />
        </TabPane>
        <TabPane tab="All Notifications" key="2">
          <NotiList content={list} />
        </TabPane>
      </Tabs>
      <div
        style={{
          position: "absolute",
          bottom: ".1rem",
          left: ".3rem",
          background: "white",
          padding: "0.7rem",
          width: "90%",
        }}
      >
        <Switch checked={doNot} onChange={changeDisturb} />
        <span>Do No Disturb</span>
      </div>
    </Drawer>
  );
}
