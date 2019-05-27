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
    }
  };
}
