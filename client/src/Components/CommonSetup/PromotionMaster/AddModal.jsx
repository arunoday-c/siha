import React, { useContext } from "react";
import {
  AlgaehModal,
  Button,
  MainContext,
  AlgaehFormGroup,
  AlgaehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
} from "algaeh-react-components";
import "./PromotionMaster.scss";
export function PromoAddModal({ visible, onClose }) {
  const { userLanguage } = useContext(MainContext);

  return (
    <AlgaehModal
      title={"Promo Price List"}
      visible={visible}
      mask={true}
      maskClosable={true}
      onCancel={onClose}
      footer={[
        <Button className="btn btn-default" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={720}
      // footer={null}
      className={`${userLanguage}_comp row algaehNewModal`}
      // class={this.state.lang_sets}
    >
      <div className="col popupInner">
        <div className="row inner-top-search margin-bottom-15">
          <AlgaehAutoComplete
            div={{ className: "col form-group mandatory" }}
            label={{
              forceLabel: "Service Type",
              isImp: true,
            }}
            selector={{
              name: "applicable",
              className: "select-fld",
              value: "",
              dataSource: {
                textField: "",
                valueField: "value",
                data: "",
              },
            }}
          />
          <AlgaehAutoComplete
            div={{ className: "col form-group mandatory" }}
            label={{
              forceLabel: "Offer by",
              isImp: true,
            }}
            selector={{
              name: "applicable",
              className: "select-fld",
              value: "",
              dataSource: {
                textField: "",
                valueField: "value",
                data: "",
              },
            }}
          />
          <AlgaehFormGroup
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Offer Value" }}
            textBox={{
              className: "txt-fld",
              name: "",
              others: { type: "number" },
            }}
          />
          <div className="col-2">
            <button
              type="submit"
              style={{ marginTop: 20 }}
              className="btn btn-primary"
            >
              Add to List
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">SMS Template Generator</h3>
                </div>
                <div className="actions"></div>
              </div>
              <div className="portlet-body">
                <div className="row">dfgfdgf</div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">SMS Recipient List</h3>
                </div>
                <div className="actions"></div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12">
                    <div id="">
                      <AlgaehDataGrid
                        className="offerPriceList"
                        columns={[
                          {
                            fieldName: "",
                            label: "Actions",
                            displayTemplate: (row) => {
                              return (
                                <>
                                  <i
                                    className="fas fa-pen"
                                    // onClick={() => setCurrentEdit(row)}
                                  ></i>
                                </>
                              );
                            },
                          },
                          {
                            fieldName: "",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Service type" }}
                              />
                            ),
                          },
                          {
                            fieldName: "",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Offer by" }} />
                            ),
                          },
                          {
                            fieldName: "",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Offer Value" }}
                              />
                            ),
                          },
                        ]}
                        rowUniqueId=""
                        data=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AlgaehModal>
  );
}
