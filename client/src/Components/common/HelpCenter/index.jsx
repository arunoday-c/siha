import React from "react";
import { Drawer, Empty } from "algaeh-react-components";
import emptyImage from "../Notifications/no_data.svg";

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
      <Empty image={emptyImage} description={"Page under construction"} />
    </Drawer>
  );
}
