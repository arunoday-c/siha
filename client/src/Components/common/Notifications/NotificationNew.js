import React, { useState, useContext, useEffect } from "react";
import "./Notifications.scss";
import {
  notification,
  Drawer,
  // Button,
  // List,
  // Skeleton,
  // Empty,
  // Avatar,
  // Icon,
  Switch,
  Tabs,
} from "antd";
import { MainContext, AlgaehMessagePop } from "algaeh-react-components";
import newAlgaehApi from "../../../hooks/newAlgaehApi";
// import emptyImage from "./no_data.svg";
import NotificationList from "./notificationList";
const { TabPane } = Tabs;

export default function Notification({ open, handlePanel, count }) {
  // const base = Array(5).fill({
  //   loading: true,
  //   message: "",
  //   title: "",
  //   _id: "",
  // });
  // const base = [];
  // const [list, setList] = useState(base);
  // const [today, setToday] = useState(base);
  // const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [doNot, setDoNot] = useState(false);
  const context = useContext(MainContext);
  const { socket, userToken } = context;

  useEffect(() => {
    const check = Array.isArray(context.userMenu);
    const addToNotiList = (notobj) => {
      // setToday((state) => {
      //   state.unshift(notobj);
      //   return [...state];
      // });
      // console.log("Here inside ack====>", notobj);
      // socket.emit("count");
      socket.emit("acknowledge", notobj);
      if (!doNot) {
        //  notification sound here
        window.audio_feedback.play();

        notification.info({
          message: "Notification",
          description: (
            <span dangerouslySetInnerHTML={{ __html: notobj.message }}></span>
          ),
          // description: notobj.message,
          duration: 6,
          className: "notifySlide",
          onClick: () => {
            newAlgaehApi({
              uri: "/seenNotification",
              module: "documentManagement",
              method: "POST",
              data: {
                _id: notobj._id,
              },
            })
              .then(() => {
                socket.emit("getAll");
              })
              .catch((error) => {
                AlgaehMessagePop({ type: "error", display: error.message });
              });
            notification.destroy();
          },
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
        socket.emit("getAll");
      });

      // socket.on("receiveAll", (data) => {
      //   // console.log(data);
      //   if (data && Array.isArray(data)) {
      //     setList(data);
      //   } else {
      //     setList([]);
      //   }
      //   // setLoading(false);
      // });

      // socket.on("today", (data) => {
      //   if (data && Array.isArray(data)) {
      //     setToday(data);
      //   } else {
      //     setToday([]);
      //   }
      //   // setLoading(false);
      // });

      socket.on("notification", (msg) => {
        //console.log("Im executed", msg);
        addToNotiList(msg);
        socket.emit("getAll");
        // socket.emit("count");
      });

      socket.on("refresh_appointment", (msg) => {
        addToNotiList(msg);
      });
      socket.on("patient_added", (msg) => {
        addToNotiList(msg);
        socket.emit("getAll");
      });
      socket.on("service_added", (services) => {
        let serStr = "";
        services.forEach((service) => {
          serStr = serStr + service;
        });
        addToNotiList(`The following services are ordered: ${serStr}`);
      });

      // socket.on("removed", (removed) => {
      // setList((state) => {
      //   const current = state.filter((item) => item._id !== removed._id);
      //   return [...current];
      // });
      // setToday((state) => {
      //   const current = state.filter((item) => item._id !== removed._id);
      //   return [...current];
      // });
      // });
    }
  }, [socket, userToken]); // eslint-disable-line

  // function removeNotification(e) {
  //   const { dataset } = e.target;
  //   const active = JSON.parse(dataset.current);
  //   context.socket.emit("delete", active._id);
  // }

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

  // function NotiList({ content }) {
  //   return (
  //     <>
  //       {content.length ? (
  //         <List
  //           className="demo-loadmore-list"
  //           // loading={loading}
  //           bordered
  //           itemLayout="horizontal"
  //           dataSource={content}
  //           renderItem={(item) => (
  //             <List.Item
  //               key={item._id}
  //               actions={[
  //                 <Button
  //                   type="ghost"
  //                   icon={
  //                     <i
  //                       className="fas fa-times"
  //                       onClick={(e) => {
  //                         if (e.target.parentElement) {
  //                           e.target.parentElement.click();
  //                         }
  //                         // removeNotification
  //                       }}
  //                     />
  //                   }
  //                   loading={item.loading}
  //                   data-current={JSON.stringify(item)}
  //                   onClick={removeNotification}
  //                 />,
  //               ]}
  //             >
  //               <Skeleton avatar title={false} loading={item.loading} active>
  //                 <List.Item.Meta
  //                   title={item.title || "Title"}
  //                   avatar={<Avatar icon={<i className="envelope-square" />} />}
  //                   description={
  //                     <span
  //                       dangerouslySetInnerHTML={{
  //                         __html: item.message,
  //                       }}
  //                     ></span>
  //                   }
  //                 />
  //               </Skeleton>
  //             </List.Item>
  //           )}
  //           pagination={{
  //             total: 10,
  //             pageSize: 10,
  //           }}
  //         />
  //       ) : (
  //         <Empty
  //           image={emptyImage}
  //           description={"Nothing for you now, Come back later"}
  //         />
  //       )}
  //     </>
  //   );
  // }

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
      {/* <div className="row"> */}
      <div className="col-12">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Today" key="1">
            <NotificationList
              count={count}
              isToday={true}
              userToken={userToken}
              socket={socket}
            />
            {/* <NotiList content={today} /> */}
          </TabPane>
          <TabPane tab="All Notifications" key="2">
            <NotificationList
              count={count}
              isToday={false}
              userToken={userToken}
              socket={socket}
            />
            {/* <NotiList content={list} /> */}
          </TabPane>
        </Tabs>
      </div>
      <div className="col-12">
        <Switch checked={doNot} onChange={changeDisturb} />
        <span>Do No Disturb</span>
      </div>
      {/* <div className="col-12">
          <button
            type="button"
            className="btn btn-default btn-sm"
            style={{ margin: "10px 0 0 15px", float: "left" }}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-default btn-sm"
            style={{ margin: "10px 15px 0 0", float: "right" }}
          >
            Next
          </button>
        </div> */}
      {/* </div> */}
      {/* <div
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
      </div> */}
    </Drawer>
  );
}
