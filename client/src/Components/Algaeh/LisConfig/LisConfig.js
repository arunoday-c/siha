import React, { useState, useEffect } from "react";
import "./LisConfig.scss";
import {
  AlagehFormGroup,
  AlgaehModalPopUp,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import ButtonType from "../../Wrapper/algaehButton";
import { AddLisMachineConfiguration } from "./LisConfigEvent";
import { swalMessage } from "../../../utils/algaehApiCall";

export default function LisConfig(props) {
  const baseState = {
    hims_d_lis_configuration_id: "",
    machine_name: "",
    communication_type: "0",
    hl7_supported: "0",
    check_sum: "0",
    connection_type: "0",
    stat_flag: "",
    rotine_flag: "",
    result_extension: "",
    order_mode: "0",
    file_upload: "",
    com_port_name: "",
    brud_rate: "",
    ser_result_part_loc: "",
    host_ip_address: "",
    port_no: "",
    tcp_result_part_loc: "",
    driver_name: "",
    description: ""
  };
  const [lis_config, setLisConfig] = useState({ ...baseState });
  const [lodingAddtoList, setLoadingAddtoList] = useState(false);

  useEffect(() => {
    debugger
    if (Object.keys(props.selectedLisMachine).length > 0) {
      debugger
      setLisConfig({ ...props.selectedLisMachine })
    } else {
      setLisConfig({ ...baseState });
    }
  }, [props]);

  function EventHandaler(e) {
    const { name, value } = e.target;
    setLisConfig(state => {
      return { ...state, [name]: value };
    });
  }

  function onClose(e) {
    setLisConfig({ ...baseState })
    props.onClose && props.onClose(e)

  };

  return (
    <div className="LisConfig">
      <AlgaehModalPopUp
        open={props.open}
        events={{
          onClose: onClose
        }}
        title="LIS Machine Configuration"
        openPopup={props.open}
      >
        <div className="popupInner" style={{ height: "75vh" }}>
          <div className="row">
            <div className="col-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Lab Machine Details</h3>
                  </div>
                  <div className="actions"></div>
                </div>

                <div className="portlet-body">
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-3" }}
                      label={{
                        forceLabel: "Machine Name",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "machine_name",
                        value: lis_config.machine_name,
                        events: {
                          onChange: EventHandaler
                        }
                      }}
                    />
                    {/* <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "Comunication Type"
                  }}
                  selector={{
                    className: "select-fld",
                    name: communication_type,
                    value: communication_type,
                    dataSource: {},
                    onChange: e => {
                      setCommunicationType(e.target.value);
                    }
                  }}
                /> */}
                    <div className="col">
                      <label>Checksum Required</label>
                      <div className="customRadio">
                        <label className="radio inline">
                          <input
                            type="radio"
                            value="0"
                            name="communication_type"
                            checked={
                              lis_config.communication_type === "0" ? true : false
                            }
                            onChange={EventHandaler}
                          />
                          <span>Unidirectional</span>
                        </label>

                        <label className="radio inline">
                          <input
                            type="radio"
                            value="1"
                            name="communication_type"
                            checked={
                              lis_config.communication_type === "1" ? true : false
                            }
                            onChange={EventHandaler}
                          />
                          <span>Bidirectional</span>
                        </label>
                        <label className="radio inline">
                          <input
                            type="radio"
                            value="2"
                            name="communication_type"
                            checked={
                              lis_config.communication_type === "2" ? true : false
                            }
                            onChange={EventHandaler}
                          />
                          <span>Not Supported</span>
                        </label>
                      </div>
                    </div>
                    <div className="col">
                      <label>Is HL7 Supported</label>
                      <div className="customRadio">
                        <label className="radio inline">
                          <input
                            type="radio"
                            value="1"
                            name="hl7_supported"
                            checked={
                              lis_config.hl7_supported === "1" ? true : false
                            }
                            onChange={EventHandaler}
                          />
                          <span>Yes</span>
                        </label>

                        <label className="radio inline">
                          <input
                            type="radio"
                            value="0"
                            name="hl7_supported"
                            checked={
                              lis_config.hl7_supported === "0" ? true : false
                            }
                            onChange={EventHandaler}
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>
                    <div className="col">
                      <label>Checksum Required</label>
                      <div className="customRadio">
                        <label className="radio inline">
                          <input
                            type="radio"
                            value="1"
                            name="check_sum"
                            checked={lis_config.check_sum === "1" ? true : false}
                            onChange={EventHandaler}
                          />
                          <span>Yes</span>
                        </label>

                        <label className="radio inline">
                          <input
                            type="radio"
                            value="0"
                            name="check_sum"
                            checked={lis_config.check_sum === "0" ? true : false}
                            onChange={EventHandaler}
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>
                    <div className="col">
                      <label>Connection Type</label>
                      <div className="customRadio">
                        <label className="radio inline">
                          <input
                            type="radio"
                            value="0"
                            name="connection_type"
                            checked={
                              lis_config.connection_type === "0" ? true : false
                            }
                            onChange={EventHandaler}
                          />
                          <span>Serial Port Mode</span>
                        </label>

                        <label className="radio inline">
                          <input
                            type="radio"
                            value="1"
                            name="connection_type"
                            checked={
                              lis_config.connection_type === "1" ? true : false
                            }
                            onChange={EventHandaler}
                          />
                          <span>TCP Mode</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <hr></hr>
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Stat Flag",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "stat_flag",
                        value: lis_config.stat_flag,
                        events: {
                          onChange: EventHandaler
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Routine Flag",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "rotine_flag",
                        value: lis_config.rotine_flag,
                        events: {
                          onChange: EventHandaler
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Result Extension",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "result_extension",
                        value: lis_config.result_extension,
                        events: {
                          onChange: EventHandaler
                        }
                      }}
                    />
                    <div className="col">
                      <label>Order Mode</label>
                      <div className="customRadio">
                        <label className="radio inline">
                          <input
                            type="radio"
                            value="0"
                            name="order_mode"
                            checked={lis_config.order_mode === "0" ? true : false}
                            onChange={EventHandaler}
                          />
                          <span>Query Mode</span>
                        </label>
                        <label className="radio inline">
                          <input
                            type="radio"
                            value="1"
                            name="order_mode"
                            checked={lis_config.order_mode === "1" ? true : false}
                            onChange={EventHandaler}
                          />
                          <span>Download Mode</span>
                        </label>
                        <label className="radio inline">
                          <input
                            type="radio"
                            value="2"
                            name="order_mode"
                            checked={lis_config.order_mode === "2" ? true : false}
                            onChange={EventHandaler}
                          />
                          <span>File Mode</span>
                        </label>
                      </div>
                    </div>
                    {lis_config.order_mode === "2" ? (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "File Upload",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "file_upload",
                          value: lis_config.file_upload,
                          events: {
                            onChange: EventHandaler
                          }
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            {lis_config.connection_type === "0" ?
              <div className="col-6">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Serial Port Mode</h3>
                    </div>
                    <div className="actions"></div>
                  </div>

                  <div className="portlet-body">
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "COM Port Name",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "com_port_name",
                          value: lis_config.com_port_name,
                          events: {
                            onChange: EventHandaler
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Baud Rate",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "brud_rate",
                          value: lis_config.brud_rate,
                          events: {
                            onChange: EventHandaler
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Result Path Location",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "ser_result_part_loc",
                          value: lis_config.ser_result_part_loc,
                          events: {
                            onChange: EventHandaler
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div> :
              <div className="col-6">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">TCP Port Mode</h3>
                    </div>
                    <div className="actions"></div>
                  </div>

                  <div className="portlet-body">
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Host IP Address",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "host_ip_address",
                          value: lis_config.host_ip_address,
                          events: {
                            onChange: EventHandaler
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Port No.",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "port_no",
                          value: lis_config.port_no,
                          events: {
                            onChange: EventHandaler
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Result Path Location",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "tcp_result_part_loc",
                          value: lis_config.tcp_result_part_loc,
                          events: {
                            onChange: EventHandaler
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>}
            <div className="col-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                {/* <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">TCP Port Mode</h3>
                </div>
                <div className="actions"></div>
              </div> */}

                <div className="portlet-body">
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-3" }}
                      label={{
                        forceLabel: "Driver Name",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "driver_name",
                        value: lis_config.driver_name,
                        events: {
                          onChange: EventHandaler
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Description",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "description",
                        value: lis_config.description,
                        events: {
                          onChange: EventHandaler
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="popupFooter">
          <div className="row">
            <div className="col-lg-12">
              <ButtonType
                classname="btn-primary"
                loading={lodingAddtoList}
                onClick={() => {
                  setLoadingAddtoList(true);
                  AddLisMachineConfiguration(
                    lis_config,
                    errorMessage => {
                      setLisConfig({ ...baseState });
                      setLoadingAddtoList(false);

                      swalMessage({
                        type: "error",
                        title: errorMessage
                      });
                    },
                    result => {
                      setLisConfig({ ...baseState });
                      setLoadingAddtoList(false);
                      swalMessage({
                        type: "success",
                        title: "Saved Successfully ..."
                      });
                    }
                  );
                }}
                label={{
                  forceLabel: "Save",
                  returnText: true
                }}
              />
              <button
                onClick={onClose}
                type="button"
                className="btn btn-default"
              >
                <AlgaehLabel label={{ forceLabel: "Cancel" }} />
              </button>
            </div>
          </div>
        </div>
      </AlgaehModalPopUp>
    </div >
  );
}
