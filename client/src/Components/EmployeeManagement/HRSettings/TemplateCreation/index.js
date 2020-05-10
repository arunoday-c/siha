import React, { memo, useState, useRef, useEffect } from "react";

import "./certificateMaster.scss";
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
  AlgaehButton,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../../hooks";
import Editor from "./editor";
export default memo(function () {
  const [kpi_types, setKpiTypes] = useState([]);
  const [input, setInput] = useState({
    _id: undefined,
  });
  const [masterInput, setMasterInput] = useState({
    kpi_type: "",
    kpi_name: "",
    kpi_parameters: "",
    kpi_query: "",
    kpi_status: "A",
  });
  const [buttonType, setButtonType] = useState("Add To List");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getKPI();
  }, []);
  function getKPI() {
    newAlgaehApi({
      uri: "/Document/getKPI",
      method: "GET",
      module: "documentManagement",
    })
      .then((response) => {
        const { data } = response;
        setKpiTypes(data["result"]);
      })
      .catch((error) => {
        AlgaehMessagePop({
          display: error,
          type: "error",
        });
      });
  }

  function onEditHandler(row) {
    setMasterInput(row);
    setButtonType("Update List");
  }
  function onMasterInputHnadler(e) {
    const { name, value } = e.target;
    setMasterInput((result) => {
      return { ...result, [name]: value };
    });
  }
  function onAddOrUpdate() {
    const { kpi_type, kpi_name, kpi_parameters, kpi_query } = masterInput;
    setLoading(true);

    newAlgaehApi({
      uri: "/Document/saveKPI",
      method: "POST",
      module: "documentManagement",
      data: {
        kpi_type:
          buttonType === "Update List"
            ? kpi_type
            : kpi_name.toLowerCase().replace(/ /g, "_"),
        kpi_query: kpi_query,
        kpi_status: "A",
        kpi_name: kpi_name,
        kpi_parameters: Array.isArray(kpi_parameters)
          ? kpi_parameters
          : kpi_parameters.split(","),
      },
    })
      .then((response) => {
        setLoading(false);
        getKPI();
        setButtonType("Add To List");
        AlgaehMessagePop({
          display: "Successfully inserted",
          type: "success",
        });
      })
      .catch((error) => {
        setLoading(false);
        AlgaehMessagePop({
          display: error,
          type: "error",
        });
      });
  }
  function onClearHandler() {
    setMasterInput({
      kpi_type: "",
      kpi_name: "",
      kpi_parameters: "",
      kpi_query: "",
      kpi_status: "A",
    });
    setButtonType("Add To List");
  }
  const { _id } = input;
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
                div={{ className: "col-6 form-group mandatory" }}
                label={{
                  forceLabel: "Certificate Name",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "kpi_name",
                  value: masterInput.kpi_name,
                  events: {
                    onChange: onMasterInputHnadler,
                  },
                }}
              />
              <AlagehFormGroup
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
              />
              <div className="col-9 form-group mandatory">
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
              </div>
              <div className="col">
                <AlgaehButton
                  style={{ marginTop: 42 }}
                  className="btn btn-primary"
                  onClick={onAddOrUpdate}
                  loading={loading}
                >
                  {buttonType}
                </AlgaehButton>
                <br />
                <AlgaehButton
                  style={{ marginTop: 4 }}
                  className="btn btn"
                  onClick={onClearHandler}
                  loading={loading}
                >
                  Clear
                </AlgaehButton>
              </div>

              <div className="col-12">
                <AlgaehDataGrid
                  id="certificateMasterList"
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
                      fieldName: "kpi_name",
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
                    data: kpi_types,
                  }}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 50 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-7">
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Template Preview</h3>
            </div>
          </div>
          <div className="portlet-body">
            <Editor data={kpi_types} />
          </div>
        </div>
      </div>
    </div>
  );
});
