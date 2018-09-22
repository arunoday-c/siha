import Enumerable from "linq";

const getItems = $this => {
  $this.props.getItemMaster({
    uri: "/pharmacy/getItemMasterAndItemUom",
    method: "GET",
    redux: {
      type: "ITEMS_GET_DATA",
      mappingName: "itemlist"
    },
    afterSuccess: data => {
      debugger;
      let ItemList = Enumerable.from(data)
        .groupBy("$.hims_d_item_master_id", null, (k, g) => {
          let firstRecordSet = Enumerable.from(g).firstOrDefault();
          return {
            hims_d_item_master_id: firstRecordSet.hims_d_item_master_id,
            item_description: firstRecordSet.item_description,
            generic_id: firstRecordSet.generic_id,
            category_id: firstRecordSet.category_id,
            group_id: firstRecordSet.group_id,
            form_id: firstRecordSet.form_id,
            storage_id: firstRecordSet.storage_id,
            item_uom_id: firstRecordSet.item_uom_id,
            purchase_uom_id: firstRecordSet.purchase_uom_id,
            sales_uom_id: firstRecordSet.sales_uom_id,
            stocking_uom_id: firstRecordSet.stocking_uom_id,
            detail_item_uom: g.getSource()
          };
        })
        .toArray();

      $this.setState({ ItemList: ItemList });
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
