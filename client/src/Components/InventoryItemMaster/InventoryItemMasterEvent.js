import { algaehApiCall } from "../../utils/algaehApiCall";

export default function InvItemSetupEvent() {
  return {
    getItems: $this => {
      $this.props.getItemMaster({
        uri: "/inventory/getItemMasterAndItemUom",
        module: "inventory",
        method: "GET",
        redux: {
          type: "ITEMS_GET_DATA",
          mappingName: "inventoryitemlist"
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
        uri: "/inventory/getInvLocationReorder",
        method: "GET",
        module: "inventory",
        data: { item_id: row.hims_d_inventory_item_master_id },
        onSuccess: response => {
          if (response.data.success === true) {
            $this.setState({
              isReQtyOpen: !$this.state.isReQtyOpen,
              item_description: row.item_description,
              item_id: row.hims_d_inventory_item_master_id,
              reorder_locations: response.data.records
            });
          }

        }
      });

    }
  };
}
