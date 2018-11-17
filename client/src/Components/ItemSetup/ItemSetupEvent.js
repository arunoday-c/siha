const getItems = $this => {
  $this.props.getItemMaster({
    uri: "/pharmacy/getItemMasterAndItemUom",
    method: "GET",
    redux: {
      type: "ITEMS_GET_DATA",
      mappingName: "itemlist"
    },
    afterSuccess: data => {
      
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
