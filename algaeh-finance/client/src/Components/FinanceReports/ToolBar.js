import React from "react";
import { Button, Tooltip } from "antd";

export default function ToolBar({ selected, layoutDispatch, layout }) {
  return (
    <div className="col reportPreviewToolRight">
      <ul>
        <li>
          <Tooltip title="Change Layout" placement="left">
            <Button
              // icon="layout"
              icon={<i className="fas fa-object-ungroup"></i>}
              size="large"
              disabled={!selected}
              onClick={() => layoutDispatch({ type: "switchCol" })}
            />
          </Tooltip>
        </li>
        {!layout.expand ? (
          <li>
            <Tooltip title="Expand" placement="left">
              <Button
                // icon="arrows-alt"
                icon={<i className="fas fa-expand"></i>}
                size="large"
                disabled={!selected}
                onClick={() => layoutDispatch({ type: "expand" })}
              />
            </Tooltip>
          </li>
        ) : (
          <li>
            <Tooltip title="Shrink" placement="left">
              <Button
                // icon="shrink"
                icon={<i className="fas fa-compress"></i>}
                size="large"
                disabled={!selected}
                onClick={() => layoutDispatch({ type: "collapse" })}
              />
            </Tooltip>
          </li>
        )}
      </ul>
    </div>
  );
}
