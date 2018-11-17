const getItems = $this => {
  $this.props.getItemMaster({
    uri: "/inventory/getItemMasterAndItemUom",
    method: "GET",
    redux: {
      type: "ITEMS_GET_DATA",
      mappingName: "inventoryitemlist"
    }
  });
};

const EditItemMaster = ($this, row) => {
  
  row.addNew = false;
  $this.setState({
    isOpen: !$this.state.isOpen,
    itemPop: row,
    addNew: false
  });
};

export { getItems, EditItemMaster };
