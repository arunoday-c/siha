import React, { memo, useState, useRef, useEffect } from "react";

import "./certificateMaster.scss";
import JoditEditor from "jodit-react";
import {
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel,
  AlagehFormGroup,
} from "../../../Wrapper/algaehWrapper";
import {
  Spin,
  AlgaehFormGroup,
  AlgaehAutoComplete,
  AlgaehMessagePop,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../../hooks";
import Jodit from "jodit";
import "jodit/build/jodit.min.css";

export default memo(function () {
  const [publishLoader, setPublishLoader] = useState(false);
  const [input, setInput] = useState({
    kpi_types: "",
    _id: undefined,
    columns: [],
  });
  useEffect(() => {
    newAlgaehApi({
      uri: "/Document/getKPI",
      method: "GET",
      module: "documentManagement",
    })
      .then((response) => {
        const { data } = response;
        setInput((result) => {
          return { ...result, kpi_types: data["result"] };
        });
      })
      .catch((error) => {
        AlgaehMessagePop({
          display: error,
          type: "error",
        });
      });
  }, []);
  const joditEditor = useRef(undefined);

  function onAutoCompletChangeHandler(selected) {
    const { _id, columns } = selected;
    setInput((result) => {
      return { ...result, _id, columns };
    });
  }
  function onClearAutoComplete() {
    setInput((result) => {
      return { ...result, _id: undefined, columns: [] };
    });
  }
  const { _id, kpi_types, columns } = input;
  return (
    <div className="row">
      <div className="col-5">
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Certificate List</h3>
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col-9 form-group mandatory" }}
                label={{
                  forceLabel: "Certificate Name",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "",
                  value: "",
                  events: {},
                }}
              />
              <div className="col">
                {" "}
                <button
                  style={{ marginTop: 19 }}
                  className="btn btn-primary"
                  id=""
                >
                  Add to List
                </button>
              </div>

              <div className="col-12">
                {" "}
                <AlgaehDataGrid
                  id="certificateMasterList"
                  columns={[
                    {
                      fieldName: "",
                      label: (
                        <AlgaehLabel
                          label={{
                            forceLabel: "Action",
                          }}
                        />
                      ),
                      others: {
                        maxWidth: 100,
                        filterable: false,
                      },
                    },
                    {
                      fieldName: "",
                      label: (
                        <AlgaehLabel
                          label={{
                            forceLabel: "Certificate Name",
                          }}
                        />
                      ),
                      others: {
                        filterable: false,
                      },
                    },
                    // {
                    //   fieldName: "",
                    //   label: (
                    //     <AlgaehLabel
                    //       label={{
                    //         forceLabel: "Create/Edit Template",
                    //       }}
                    //     />
                    //   ),
                    //   others: {
                    //     maxWidth: 100,
                    //     filterable: false,
                    //   },
                    // },
                  ]}
                  keyId=""
                  dataSource={{}}
                  // filter={true}
                  paging={{ page: 0, rowsPerPage: 50 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-7">
        {" "}
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Template Preview</h3>
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <AlgaehAutoComplete
                div={{ className: "col-12 form-group mandatory" }}
                label={{ forceLabel: "Select a Certificate", isImp: true }}
                selector={{
                  name: "_id",
                  dataSource: {
                    data: kpi_types,
                    valueField: "_id",
                    textField: "kpi_name",
                  },
                  value: _id,
                  onChange: onAutoCompletChangeHandler,
                  onClear: onClearAutoComplete,
                }}
              />{" "}
              <div className="col-12">
                <Spin
                  tip="Please wait document is publishing"
                  spinning={publishLoader}
                >
                  <JoditEditor
                    ref={joditEditor}
                    config={{
                      readonly: publishLoader,
                      autofocus: true,
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
                                const field = tbl.getAttribute(
                                  "data-table-field"
                                );
                                const prot = prompt(
                                  "Change array field name:",
                                  field
                                );
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
                            for (let i = 0; i < columns.length; i++) {
                              option = document.createElement("option");
                              option.value = columns[i];
                              option.innerHTML = columns[i];
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
                        {
                          exec: function (editor) {
                            setPublishLoader(true);
                            const document = joditEditor.current.value;
                            newAlgaehApi({
                              uri: "/Document/saveKPIMaster",
                              method: "POST",
                              module: "documentManagement",
                              data: {
                                kpi_id: _id,
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
                          },
                          name: "publish",
                          tooltip: "Publish this.",
                          icon: "upload",
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
                        "direction",
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
                        "print",
                      ],
                    }}
                  />
                </Spin>
              </div>
              <div className="col-12" style={{ textAlign: "right" }}>
                {" "}
                <button
                  style={{ marginTop: 19 }}
                  className="btn btn-primary"
                  id=""
                >
                  Save / Update Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
