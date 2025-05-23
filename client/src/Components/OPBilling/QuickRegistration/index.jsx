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
    <div className="col-2">
      <Button
        className="btn btn-primary btn-small"
        style={{ marginTop: 10, float: "right" }}
        type="button"
        size="middle"
        onClick={onOpen}
      >
        Quick Registration
      </Button>
      <SideDrawer {...props} onClose={onClose} visible={visible} />
    </div>
  );
});
