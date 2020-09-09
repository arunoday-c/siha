import React from "react";
import { Drawer } from "algaeh-react-components";
// import emptyImage from "../Notifications/no_data.svg";
import { getCookie } from "../../../utils/algaehApiCall";

export function HelpCenter({ visible, onClose }) {
  return (
    <Drawer
      title="Help Center"
      placement="right"
      closable={true}
      width={540}
      onClose={onClose}
      visible={visible}
      className="notifyDrawer"
    >
      <iframe
        className="helpDocIframe"
        src={`http://localhost:8888/algaeh-docs/templates/#${getCookie(
          "ScreenName"
        )}`}
      ></iframe>
      {/* <Empty image={emptyImage} description={"Page under construction"} /> */}
    </Drawer>
  );
}
