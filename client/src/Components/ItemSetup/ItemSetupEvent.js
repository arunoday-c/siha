const getItems = $this => {
  $this.props.getItemMaster({
    uri: "/pharmacy/getItemMasterAndItemUom",
    method: "GET",
    redux: {
      type: "ITEMS_GET_DATA",
      mappingName: "itemlist"
    }
  });
};

const EditItemMaster = ($this, row) => {
  debugger;
  row.addNew = false;
  $this.setState({
    isOpen: !$this.state.isOpen,
    itemPop: row,
    addNew: false
  });
};

export { getItems, EditItemMaster };
