import React, { memo, useRef, useState, useEffect } from "react";
import "./certificateMaster.scss";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
} from "../../../Wrapper/algaehWrapper";
import { Spin, AlgaehMessagePop, AlgaehButton } from "algaeh-react-components";
import { newAlgaehApi } from "../../../../hooks";
// import Editor from "./editor";
import JoditEditor from "jodit-react";

export default memo(function () {
  const [certificates, setCertificates] = useState([]);
  const [certificate_type, setCertificateType] = useState([]);
  const [xcolumns, setColumns] = useState([]);

  const [masterInput, setMasterInput] = useState({
    hims_d_certificate_master_id: "",
    certificate_type_id: "",
    certificate_name: "",
    certificate_template: "",
    certificate_status: "A",
    custom_header_req: "N",
  });
  const [buttonType, setButtonType] = useState("Add To List");
  const [loading, setLoading] = useState(false);
  const joditEditor = useRef(undefined);
  useEffect(() => {
    getCertificateMaster();
    getCertificateTypes();
  }, []);

  function getCertificateMaster() {
    newAlgaehApi({
      uri: "/hrsettings/getCertificateMaster",
      method: "GET",
      module: "hrManagement",
    })
      .then((response) => {
        const { data } = response;
        setCertificates(data["records"]);
      })
      .catch((error) => {
        AlgaehMessagePop({
          display: error.message,
          type: "error",
        });
      });
  }

  function getCertificateTypes() {
    newAlgaehApi({
      uri: "/hrsettings/getCertificateType",
      method: "GET",
      module: "hrManagement",
    })
      .then((response) => {
        const { data } = response;
        setCertificateType(data["records"]);
      })
      .catch((error) => {
        AlgaehMessagePop({
          display: error.message,
          type: "error",
        });
      });
  }

  function onEditHandler(row) {
    setMasterInput(row);
    joditEditor.current.value = row.certificate_template;

    const selected_cert = certificate_type.find(
      (f) => f.hims_d_certificate_type_id === row.certificate_type_id
    );
    const qry = selected_cert.sql_query.toLowerCase().split("from")[0];
    const columns = qry
      .split("select")[1]
      .split(",")
      .map((column) => {
        let col = column.trim();
        if (column.includes(" as ") === true) {
          col = column.split(" as ")[1].trim();
        }
        return col;
      });
    setColumns(columns);
    setButtonType("Update List");
  }

  function checkHandaler(e) {
    const { checked } = e.target;
    setMasterInput((result) => {
      return {
        ...result,
        custom_header_req: checked === true ? "Y" : "N",
      };
    });
  }

  function onMasterInputHnadler(e) {
    const { name, value } = e.target;
    setMasterInput((result) => {
      return { ...result, [name]: value };
    });
  }

  function onDropdownChangeHandler(e) {
    const { name, value, selected } = e;
    const sql_query = selected.sql_query;
    setMasterInput((result) => {
      return { ...result, [name]: value };
    });
    const qry = sql_query.toLowerCase().split("from")[0];
    const columns = qry
      .split("select")[1]
      .split(",")
      .map((column) => {
        let col = column.trim();
        if (column.includes(" as ") === true) {
          col = column.split(" as ")[1].trim();
        }
        return col;
      });
    setColumns(columns);
  }

  function onAddOrUpdate() {
    if (masterInput.certificate_name === "") {
      AlgaehMessagePop({
        display: "Certificate Name cannot be blank.",
        type: "error",
      });
    } else if (masterInput.certificate_type_id === "") {
      AlgaehMessagePop({
        display: "Select Certificate Type.",
        type: "error",
      });
    } else if (joditEditor.current.value === "") {
      AlgaehMessagePop({
        display: "Define template.",
        type: "error",
      });
    } else {
      setLoading(true);
      masterInput.certificate_template =
        `<head><style>body{margin:0;padding:0;} certificateContent{margin:0 15px;padding:0;} p{line-height:1.3rem;padding:0;margin:5px 0;} table,tr,td{border-style:solid;border-width: 1px 1px 1px 1px;border-collapse: collapse;padding:5px;border-color: rgb(255, 255, 255);}</style></head><body><div class="certificateContent">` +
        joditEditor.current.value +
        `</div></body>`;
      const settings = { header: undefined, footer: undefined };
      if (masterInput.hims_d_certificate_master_id === "") {
        newAlgaehApi({
          uri: "/hrsettings/addCertificateMaster",
          skipParse: true,
          data: Buffer.from(JSON.stringify(masterInput), "utf8"),
          module: "hrManagement",
          method: "POST",
          header: {
            "content-type": "application/octet-stream",
            ...settings,
          },
        })
          .then((res) => {
            if (res.data.success) {
              onClearHandler();
              getCertificateMaster();
              joditEditor.current.value = "";
              AlgaehMessagePop({
                display: "Record Added Successfully",
                type: "success",
              });
            }
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            AlgaehMessagePop({
              display: err.message,
              type: "error",
            });
          });
      } else {
        newAlgaehApi({
          uri: "/hrsettings/updateCertificateMaster",
          skipParse: true,
          data: Buffer.from(JSON.stringify(masterInput), "utf8"),
          module: "hrManagement",
          method: "PUT",
          header: {
            "content-type": "application/octet-stream",
            ...settings,
          },
        })
          .then((res) => {
            if (res.data.success) {
              onClearHandler();
              getCertificateMaster();
              joditEditor.current.value = "";
              AlgaehMessagePop({
                display: "Record Updated Successfully",
                type: "success",
              });
            }
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            AlgaehMessagePop({
              display: err.message,
              type: "error",
            });
          });
      }
    }
  }

  function onClearHandler() {
    setMasterInput({
      hims_d_certificate_master_id: "",
      certificate_type_id: "",
      certificate_name: "",
      certificate_template: "",
      certificate_status: "A",
      sql_query: "",
    });
    joditEditor.current.value = "";
    setColumns([]);
    setButtonType("Add To List");
  }

  return (
    <div className="row">
      <div className="col-8">
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Certificate Creator</h3>
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col form-group mandatory" }}
                label={{
                  forceLabel: "Certificate Name",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "certificate_name",
                  value: masterInput.certificate_name,
                  events: {
                    onChange: onMasterInputHnadler,
                  },
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-3 form-group mandatory" }}
                label={{
                  forceLabel: "Certificate Type",
                  isImp: true,
                }}
                selector={{
                  name: "certificate_type_id",
                  className: "select-fld",
                  value: masterInput.certificate_type_id,
                  dataSource: {
                    textField: "type_name",
                    valueField: "hims_d_certificate_type_id",
                    data: certificate_type,
                  },
                  onChange: onDropdownChangeHandler,
                  onClear: () => {
                    setMasterInput((result) => {
                      return {
                        ...result,
                        certificate_type_id: "",
                        sql_query: "",
                      };
                    });
                  },
                }}
              />
              <div className="col-3">
                <label>Custom Header Required</label>
                <div className="customCheckbox">
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      value="Y"
                      name="custom_header_req"
                      checked={
                        masterInput.custom_header_req === "Y" ? true : false
                      }
                      onChange={checkHandaler}
                    />
                    <span>Yes</span>
                  </label>
                </div>
              </div>
              {/* <AlagehFormGroup
              div={{ className: "col-6 form-group mandatory" }}
              label={{
                forceLabel: "Parameters",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "kpi_parameters",
                value: masterInput.kpi_parameters,
                events: {
                  onChange: onMasterInputHnadler,
                },
              }}
            /> */}
              {/* <div className="col-9 form-group mandatory">
              <label className="style_Label ">
                Query<span className="imp">&nbsp;*</span>
              </label>
              <div
                algaeh_required="true"
                row="5"
                className="ui input txt-fld"
              >
                <textarea
                  rows="2"
                  name="kpi_query"
                  value={masterInput.kpi_query}
                  onChange={onMasterInputHnadler}
                />
              </div>
            </div> */}
              {/* <Editor data={certificates} /> */}
              <div className="col-12 certificateEditor">
                <h6>Design Template</h6>
                <Spin
                  tip="Please wait document is publishing"
                  spinning={loading}
                >
                  <JoditEditor
                    ref={joditEditor}
                    config={{
                      readonly: loading,
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
                            default:
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
                      // controls: [
                      //   {
                      //     label: {
                      //       exec: function (editor) {
                      //         const lable = document.createElement("lable");
                      //         lable.setAttribute("data-label-field", "");
                      //         lable.innerText = "{{fieldName}}";
                      //         editor.selection.insertNode(lable);
                      //       },
                      //     },
                      //   },
                      // ],
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
                        "preview",
                      ],
                    }}
                  />
                </Spin>
              </div>
              <div
                className="col-12"
                style={{ textAlign: "right", marginTop: 10 }}
              >
                <AlgaehButton
                  className="btn btn"
                  onClick={onClearHandler}
                  loading={loading}
                >
                  Clear
                </AlgaehButton>{" "}
                <AlgaehButton
                  className="btn btn-primary"
                  style={{ marginLeft: 5 }}
                  onClick={onAddOrUpdate}
                  loading={loading}
                >
                  {buttonType}
                </AlgaehButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Certificate Lists</h3>
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-12" id="certificateMasterList">
                <AlgaehDataGrid
                  columns={[
                    {
                      fieldName: "eidtable",
                      label: (
                        <AlgaehLabel
                          label={{
                            forceLabel: "Action",
                          }}
                        />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <button
                            onClick={() => {
                              onEditHandler(row);
                            }}
                          >
                            Edit
                          </button>
                        );
                      },
                      others: {
                        maxWidth: 100,
                        filterable: false,
                      },
                    },
                    {
                      fieldName: "certificate_name",
                      label: (
                        <AlgaehLabel
                          label={{
                            forceLabel: "Certificate Name",
                          }}
                        />
                      ),
                    },
                  ]}
                  keyId="_id"
                  dataSource={{
                    data: certificates,
                  }}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 50 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
