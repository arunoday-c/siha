import React from "react";
import "./helpDoc.scss";
import { Drawer } from "antd";
import { getCookie } from "../../../utils/algaehApiCall";

export default function HelpDoc({ open, handlePanel }) {
  return (
    <Drawer
      title="Online Help Document"
      placement="right"
      closable={true}
      width={540}
      onClose={handlePanel}
      visible={open}
      className="notifyDrawer"
    >
      <iframe
        className="helpDocIframe"
        style={{ height: "100%", width: "100%", border: "none" }}
        src={`http://localhost:8888/algaeh-docs/templates/#${getCookie(
          "ScreenName"
        )}`}
      ></iframe>
    </Drawer>
  );
}
