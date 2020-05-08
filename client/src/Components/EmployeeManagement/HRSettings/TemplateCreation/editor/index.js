import React, { memo, useRef, useState } from "react";
import {
  Spin,
  AlgaehAutoComplete,
  AlgaehMessagePop,
} from "algaeh-react-components";
import JoditEditor from "jodit-react";
import Jodit from "jodit";
import "jodit/build/jodit.min.css";
import { newAlgaehApi } from "../../../../../hooks";
export default memo(function (props = { data: [] }) {
  const { data } = props;
  const [id, setId] = useState("");
  const [html_id, setHtmlId] = useState("");
  const [xcolumns, setColumns] = useState([]);
  const [publishLoader, setPublishLoader] = useState(false);
  const joditEditor = useRef(undefined);
  function onPublish() {
    setPublishLoader(true);
    const document = joditEditor.current.value;
    newAlgaehApi({
      uri: "/Document/saveKPIMaster",
      method: "POST",
      module: "documentManagement",
      data: {
        kpi_id: id,
        kpi_html: document,
      },
    })
      .then((response) => {
        const { data } = response;
        setPublishLoader(false);
        AlgaehMessagePop({
          display: "Successfully inserted",
          type: "success",
        });
      })
      .catch((error) => {
        setPublishLoader(false);
        AlgaehMessagePop({
          display: error,
          type: "error",
        });
      });
  }
  function onAutoCompletChangeHandler(selected) {
    const { _id, columns } = selected;
    setId(_id);
    setColumns(columns);
    getTemplateMaster(_id);
  }
  function onClearAutoComplete() {
    setId("");
    setColumns([]);
  }
  function getTemplateMaster(kpid) {
    newAlgaehApi({
      uri: "/Document/getDocumentMasterById",
      method: "GET",
      module: "documentManagement",
      data: {
        kpi_id: kpid,
      },
    })
      .then((response) => {
        const { result } = response.data;
        const { _id, kpi_html } = result;
        setHtmlId(_id);
        joditEditor.current.value = kpi_html;
      })
      .catch((error) => {
        setPublishLoader(false);
        AlgaehMessagePop({
          display: error,
          type: "error",
        });
      });
  }
  return (
    <div className="row">
      <AlgaehAutoComplete
        div={{ className: "col-12 form-group mandatory" }}
        label={{ forceLabel: "Select a Certificate", isImp: true }}
        selector={{
          name: "_id",
          dataSource: {
            data: data,
            valueField: "_id",
            textField: "kpi_name",
          },
          value: id,
          onChange: onAutoCompletChangeHandler,
          onClear: onClearAutoComplete,
        }}
      />
      <div className="col-12">
        <Spin tip="Please wait document is publishing" spinning={publishLoader}>
          <JoditEditor
            ref={joditEditor}
            config={{
              readonly: publishLoader,
              enableDragAndDropFileToEditor: true,
              uploader: {
                imagesExtensions: ["jpg", "png", "jpeg", "gif"],
                insertImageAsBase64URI: true,
              },
              toolbarButtonSize: "small",
              inline: false,
              toolbar: true,
              toolbarInline: true,
              popup: {
                selection: [
                  "bold",
                  "underline",
                  "italic",
                  "font",
                  "fontsize",
                  "brush",
                  "cut",
                  "copy",
                  "paste",
                  "copyformat",
                ],
              },
              events: {
                getIcon: function (name, control, clearName) {
                  if (clearName === "checkbox") {
                    return "<i class='fa fa-square'/>";
                  } else if (clearName === "publish") {
                    return "<i class='fa fa-upload'/>";
                  } else if (clearName === "label") {
                    return "<i class='fa fa-tag'/>";
                  }
                },
                afterInsertNode: function (e) {
                  switch (e.nodeName) {
                    case "TABLE":
                      e.addEventListener("dblclick", (event) => {
                        const tbl = event.currentTarget;
                        const field = tbl.getAttribute("data-table-field");
                        const prot = prompt("Change array field name:", field);
                        tbl.setAttribute("data-table-field", prot);
                      });
                      break;
                  }
                },
              },
              extraButtons: [
                {
                  exec: function (editor) {
                    const value = prompt("Enter checkbox field name");
                    const check = document.createElement("input");
                    check.type = "checkbox";
                    check.setAttribute("data-checkbox-field", value);
                    check.title = value;
                    editor.selection.insertNode(check);
                  },
                  name: "checkbox",
                  tooltip: "Add dynamic checkbox",
                  icon: "square",
                },
                {
                  name: "label",
                  tooltip: "Label",
                  icon: "label",
                  popup: function (editor) {
                    const select = document.createElement("select");
                    let option = document.createElement("option");
                    option.innerHTML = "---Select field---";
                    select.options.add(option);
                    for (let i = 0; i < xcolumns.length; i++) {
                      option = document.createElement("option");
                      option.value = xcolumns[i];
                      option.innerHTML = xcolumns[i];
                      select.options.add(option);
                    }

                    select.addEventListener("change", (e) => {
                      const value = e.target.value;
                      const text =
                        e.target.options[e.target.selectedIndex].text;
                      const lable = document.createElement("span");
                      lable.setAttribute("data-label-field", value);
                      lable.innerHTML = `{{${text}}}`;
                      lable.title = `${value}`;
                      editor.selection.insertNode(lable);
                    });
                    return select;
                  },
                },
              ],
              controls: [
                {
                  label: {
                    exec: function (editor) {
                      const lable = document.createElement("lable");
                      lable.setAttribute("data-label-field", "");
                      lable.innerText = "{{fieldName}}";
                      editor.selection.insertNode(lable);
                    },
                  },
                },
              ],
              buttons: [
                "selectall",
                "undo",
                "redo",
                "cut",
                "copy",
                "paste",
                "copyformat",
                "|",
                "bold",
                "strikethrough",
                "underline",
                "italic",
                "eraser",
                "|",
                "superscript",
                "subscript",
                "|",
                "ul",
                "ol",
                "|",
                "outdent",
                "indent",
                "align",
                "|",
                "font",
                "fontsize",
                "brush",
                "paragraph",
                "|",
                "image",
                "table",
                "|",
                "hr",
                "source",
                "fullsize",
              ],
            }}
          />
        </Spin>
      </div>
      <div className="col-12" style={{ textAlign: "right" }}>
        <button
          style={{ marginTop: 19 }}
          className="btn btn-primary"
          onClick={onPublish}
        >
          Save / Update Template
        </button>
      </div>
    </div>
  );
});
