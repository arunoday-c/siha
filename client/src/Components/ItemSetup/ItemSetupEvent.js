export default function ItemSetupEvent() {
  return {
    getItems: $this => {
      $this.props.getItemMaster({
        uri: "/pharmacy/getItemMasterAndItemUom",
        // module: "pharmacy",
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
    }
  };
}
