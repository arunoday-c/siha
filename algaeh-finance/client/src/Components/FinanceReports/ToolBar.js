import React from "react";
import { Button, Tooltip } from "antd";

export default function ToolBar({ selected, layoutDispatch, layout }) {
  return (
    <div className="col reportPreviewToolRight">
      <ul>
        <li>
          <Tooltip title="Change Layout" placement="left">
            <Button
              icon="layout"
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
                icon="arrows-alt"
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
                icon="shrink"
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
