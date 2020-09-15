import React, { useState, useEffect } from "react";
import { Drawer } from "algaeh-react-components";
import "./helpDoc.scss";
import { getCookie } from "../../../utils/algaehApiCall";

export function HelpCenter({ visible, onClose }) {
  const [iFrame, setIframe] = useState(undefined);
  useEffect(() => {
    if (visible === true) {
      const screenName = getCookie("ScreenName");
      const tabName = getCookie("Tab");
      let url = screenName.toLowerCase();
      if (tabName) {
        url += `/${tabName.replaceAll(" ", "").toLowerCase()}`;
      }
      setIframe(
        `<iframe class='helpDocIframe' src = 'https://help.algaeh.com/#${url}' />`
      );
    }
  }, [visible]);

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
      <div
        className="helpDocCntr"
        dangerouslySetInnerHTML={{ __html: iFrame }}
      ></div>
    </Drawer>
  );
}
