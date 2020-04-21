import { algaehApiCall } from "../../utils/algaehApiCall";

export default function ItemSetupEvent() {
  return {
    getItems: $this => {
      $this.props.getItemMaster({
        uri: "/pharmacy/getItemMasterAndItemUom",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEMS_GET_DATA",
          mappingName: "itemlist"
        }
      });
    },
    EditItemMaster: ($this, row) => {
      row.addNew = false;
      $this.setState({
        isOpen: !$this.state.isOpen,
        itemPop: row,
        addNew: false
      });
    },
    OpenReQtyLocation: ($this, row) => {

      algaehApiCall({
        uri: "/pharmacy/getLocationReorder",
        method: "GET",
        module: "pharmacy",
        data: { item_id: row.hims_d_item_master_id },
        onSuccess: response => {
          if (response.data.success === true) {
            $this.setState({
              isReQtyOpen: !$this.state.isReQtyOpen,
              item_description: row.item_description,
              item_id: row.hims_d_item_master_id,
              reorder_locations: response.data.records
            });
          }

        }
      });

    }
  };
}
