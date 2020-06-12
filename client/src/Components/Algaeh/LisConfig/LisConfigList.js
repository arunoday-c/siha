import React, { useState, useEffect } from "react";
import "./LisConfig.scss";
import { AlgaehDataGrid, AlgaehLabel } from "../../Wrapper/algaehWrapper";
import { getLisMachineConfiguration } from "./LisConfigEvent";
import LisConfig from "./LisConfig";

export default function LisConfigList() {
  const [lisMachineConfigList, setLisMachineConfigList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLisMachine, setSelectedLisMachine] = useState({});

  function CloseModel(e) {
    setIsOpen(false);
  }

  useEffect(() => {
    getLisMachineConfiguration(data => {
      setLisMachineConfigList(data);
    });
  }, []);

  function ShowModel() {
    setSelectedLisMachine({});
    setIsOpen(true);
  }
  function EditLisConfigModel(row) {
    setSelectedLisMachine(row);
    setIsOpen(true);
  }

  return (
    <div className="LisConfig">
      <div className="row">
        <div className="col-12" style={{ marginTop: 15 }}>
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Lists of Machine</h3>
              </div>
              <div className="actions">
                <button
                  className="btn btn-primary active"
                  style={{ lineHeight: "22px" }}
                  onClick={ShowModel}
                >
                  Add New Machine
                </button>
              </div>
            </div>

            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="lis_configurationGrid_Cntr">
                  <AlgaehDataGrid
                    id="lis_configuration_id"
                    columns={[
                      {
                        fieldName: "action",

                        label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                className="fas fa-pen"
                                onClick={() => {
                                  EditLisConfigModel(row);
                                }}
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 65,
                          resizable: false,
                          filterable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "machine_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Machine Name" }} />
                        )
                      },
                      {
                        fieldName: "hospital_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Branch Name" }} />
                        )
                      },
                      {
                        fieldName: "communication_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Communication Type" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.communication_type === "0"
                                ? "Unidirectional"
                                : row.communication_type === "1"
                                  ? "Bidirectional"
                                  : "Not Supported"}
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 150
                        }
                      },
                      {
                        fieldName: "hl7_supported",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "IS HL7 SUPPORTED" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.hl7_supported === "0" ? "No" : "Yes"}
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 150
                        }
                      },
                      {
                        fieldName: "check_sum",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "CHECKSUM REQUIRED" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.hl7_supported === "0" ? "No" : "Yes"}
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 150
                        }
                      },
                      {
                        fieldName: "connection_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "CONNECTION TYPE" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.connection_type === "0"
                                ? "Serial Port Mode"
                                : "TCP Mode"}
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 150
                        }
                      },

                      {
                        fieldName: "order_mode",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "ORDER MODE" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.order_mode === "0"
                                ? "Query Mode"
                                : row.order_mode === "1"
                                  ? "Download Mode"
                                  : "File Mode"}
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 150
                        }
                      }
                    ]}
                    keyId="hims_d_lis_configuration_id"
                    dataSource={{ data: lisMachineConfigList }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 20 }}
                    events={{
                      // onEdit: row => { ShowModel(row) },
                      onEdit: EditLisConfigModel,
                      onDelete: "",
                      onDone: ""
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LisConfig
        HeaderCaption={
          <AlgaehLabel
            label={{
              fieldName: "LIS Machine Configuration",
              align: "ltr"
            }}
          />
        }
        open={isOpen}
        onClose={CloseModel}
        selectedLisMachine={selectedLisMachine}
      />
    </div>
  );
}
