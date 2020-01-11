import React from "react";
import { Drawer } from "antd";

function AccountDrawer({ show, onClose, content, title }) {
  return (
    <Drawer
      title={title}
      placement="right"
      closable={false}
      onClose={onClose}
      visible={show}
      width={720}
    >
      {content}
    </Drawer>
  );
}

export default AccountDrawer;
