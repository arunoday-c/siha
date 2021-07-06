import React, { memo, useState } from "react";
import { Button } from "antd";
import SideDrawer from "./sideDrawer";
export default memo(function QuickRegistration(props) {
  const [visible, setVisible] = useState(false);
  //   const { data } = useQuery("nationality", nationality);
  function onClose() {
    setVisible(false);
  }
  function onOpen() {
    setVisible(true);
  }

  return (
    <div>
      <Button type="primary" size="middle" onClick={onOpen}>
        Quick Registration
      </Button>
      <SideDrawer {...props} onClose={onClose} visible={visible} />
    </div>
  );
});
