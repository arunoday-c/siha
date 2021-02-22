import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { SetBulkState } from "../../../utils/GlobalFunctions";
import InventoryItem from "../../../Models/InventoryItem";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import _ from "lodash";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import { newAlgaehApi } from "../../../hooks";
import { Modal } from "antd";
import "./ItemMaster.scss";

// const { Dragger } = Upload;
const { confirm } = Modal;
const Validations = ($this) => {
  let isError = false;

  if ($this.state.detail_item_uom.length === 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Please enter Stocking UOM in the list.",
    });

    if ($this.state.uom_id === null) {
      document.querySelector("[name='uom_id']").focus();
    } else if ($this.state.stocking_uom === null) {
      document.querySelector("[name='stocking_uom']").focus();
    } else if (
      $this.state.conversion_factor === 0 ||
      $this.state.conversion_factor === null
    ) {
      document.querySelector("[name='conversion_factor']").focus();
    }
  } else {
    // else if (
    //       $this.state.purchase_cost === null ||
    //       $this.state.purchase_cost === "" ||
    //       parseFloat($this.state.purchase_cost) === 0
    //     ) {
    //       isError = true;
    //       swalMessage({
    //         type: "warning",
    //         title: "Please Enter Purchase Cost."
    //       });
    //       document.querySelector("[name='purchase_cost']").focus();
    //     }
    AlgaehValidation({
      querySelector: "data-validate='InvItemMaster'", //if require section level
      fetchFromFile: true, //if required arabic error
      alertTypeIcon: "warning", // error icon
      onSuccess: () => {
        const item_code_exit = _.filter(
          $this.props.inventoryitemlist,
          (f) => f.item_code === $this.state.item_code
        );

        if (
          $this.state.hims_d_inventory_item_master_id === null &&
          item_code_exit.length > 0
        ) {
          isError = true;
          swalMessage({
            type: "warning",
            title: "Item Code Already Exist.",
          });
        } else if (
          ($this.state.standard_fee === null ||
            $this.state.standard_fee === "" ||
            parseFloat($this.state.standard_fee) === 0) &&
          ($this.state.standard_fee === "STK" ||
            $this.state.standard_fee === "OITM")
        ) {
          isError = true;
          swalMessage({
            type: "warning",
            title: "Please Enter the Sales Price.",
          });
          document.querySelector("[name='standard_fee']").focus();
        } else if (
          $this.state.vat_applicable === "Y" &&
          ($this.state.vat_percent === null ||
            $this.state.vat_percent === "" ||
            parseFloat($this.state.vat_percent) === 0)
        ) {
          isError = true;
          swalMessage({
            type: "warning",
            title: "Enter the Vat Percentage.",
          });
          document.querySelector("[name='vat_percent']").focus();
        } else if (
          $this.state.reorder_qty === null ||
          $this.state.reorder_qty === "" ||
          parseFloat($this.state.reorder_qty) === 0
        ) {
          isError = true;
          swalMessage({
            type: "warning",
            title: "Enter Reorder Quantity.",
          });
          document.querySelector("[name='reorder_qty']").focus();
        }
      },
      onCatch: () => {
        isError = true;
      },
    });
  }
  return isError;
};

const addDiagramFromMaster = (item_id, unique_id, $this) => {
  algaehApiCall({
    uri: "/inventory/addUniqueId",
    module: "inventory",
    method: "PUT",
    data: {
      hims_d_inventory_item_master_id: item_id,
      item_master_img_unique_id: unique_id,
    },
    onSuccess: (response) => {
      if (response.data.success) {
        let IOputs = InventoryItem.inputParam();
        $this.setState(
          { ...$this.state, ...IOputs, inv_item_image: [] },
          () => {
            $this.props.onClose && $this.props.onClose(true);
          }
        );
        swalMessage({
          type: "success",
          title: "Saved successfully . .",
        });
      }
    },
    onError: (error) => {
      swalMessage({
        title: error.message,
        type: "warning",
      });
    },
  });
};
const uploadOrUpdateImage = (files = [], item_id, $this) => {
  const formData = new FormData();
  formData.append("item_id", item_id);
  formData.append("invItemMasterFolder", "InvItemMasterImages");
  files.forEach((file, index) => {
    formData.append(`file_${index}`, file, file.name);
    formData.append("fileName", file.name);
  });
  newAlgaehApi({
    uri: "/uploadInvItemImg",
    data: formData,
    extraHeaders: { "Content-Type": "multipart/form-data" },
    method: "POST",
    module: "documentManagement",
  })
    .then((res) => {
      addDiagramFromMaster(item_id, res.data.records, $this);

      // return;
      // getDocuments(contract_no);
    })
    .catch((e) => console.log(e));
};
const deleteFromDataBaseDiagram = (doc, $this) => {
  algaehApiCall({
    uri: "/inventory/addUniqueId",
    module: "inventory",
    method: "PUT",
    data: {
      hims_d_inventory_item_master_id:
        $this.state.hims_d_inventory_item_master_id,
      item_master_img_unique_id: "",
    },

    onSuccess: (response) => {
      if (response.data.success) {
        let IOputs = InventoryItem.inputParam();
        $this.setState({ ...$this.state, ...IOputs }, () => {
          $this.props.onClose && $this.props.onClose(true);
        });
        swalMessage({
          title: "Record deleted successfully . .",
          type: "success",
        });
      } else if (!response.data.success) {
        swalMessage({
          title: response.data.message,
          type: "error",
        });
      }
    },
    onFailure: (error) => {
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
};
const deleteDoc = ($this, doc) => {
  const docSplit = doc.item_master_img_unique_id.split("__ALGAEH__");
  const fileName =
    docSplit.length === 0 ? docSplit.item_master_img_unique_id : docSplit[1];
  const uniqueID = docSplit[0];

  confirm({
    title: `Are you sure you want to delete this file?`,
    content: `${fileName}`,
    icon: "",
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk() {
      deleteSubDepartmentImg(
        {
          _id: uniqueID,
          fileName: fileName,

          // sub_department_id: self.props.currentRow.hims_d_sub_department_id,
        },
        $this
      );
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};
const deleteSubDepartmentImg = (doc, $this) => {
  newAlgaehApi({
    uri: "/deleteInvItemImg",
    method: "DELETE",
    module: "documentManagement",
    data: {
      ...doc,
    },
  }).then((res) => {
    if (res.data.success) {
      deleteFromDataBaseDiagram(doc, $this);
    }
  });
};

const InsertUpdateItems = ($this) => {
  SetBulkState({
    state: $this,
    callback: () => {
      const err = Validations($this);

      if (!err) {
        AlgaehLoader({ show: true });
        if ($this.state.hims_d_inventory_item_master_id === null) {
          $this.state.service_code = $this.state.item_code;
          $this.state.service_type_id = "4";
          $this.state.service_name = $this.state.item_description;

          algaehApiCall({
            uri: "/inventory/addItemMaster",
            module: "inventory",
            data: $this.state,
            onSuccess: (response) => {
              if (response.data.success === true) {
                if ($this.state.inv_item_image.length > 0) {
                  uploadOrUpdateImage(
                    $this.state.inv_item_image,

                    response.data.item_master_id,
                    $this
                  );
                } else {
                  let IOputs = InventoryItem.inputParam();
                  $this.setState({ ...$this.state, ...IOputs }, () => {
                    $this.props.onClose && $this.props.onClose(true);
                  });
                  swalMessage({
                    type: "success",
                    title: "Saved successfully . .",
                  });
                }
              }
              AlgaehLoader({ show: false });
            },
          });
        } else {
          $this.state.record_status = "A";
          $this.state.service_code = $this.state.item_code;
          $this.state.service_name = $this.state.item_description;
          algaehApiCall({
            uri: "/inventory/updateItemMasterAndUom",
            module: "inventory",
            data: $this.state,
            method: "PUT",
            onSuccess: (response) => {
              if (response.data.success === true) {
                if ($this.state.inv_item_image.length > 0) {
                  uploadOrUpdateImage(
                    $this.state.inv_item_image,
                    $this.state.hims_d_inventory_item_master_id,
                    $this
                  );
                } else {
                  let IOputs = InventoryItem.inputParam();
                  $this.setState({ ...$this.state, ...IOputs }, () => {
                    $this.props.onClose && $this.props.onClose(true);
                  });

                  swalMessage({
                    type: "success",
                    title: "Updated successfully . .",
                  });
                }
              }
              AlgaehLoader({ show: false });
            },
          });
        }
      }
    },
  });
};

export { InsertUpdateItems, deleteDoc };
