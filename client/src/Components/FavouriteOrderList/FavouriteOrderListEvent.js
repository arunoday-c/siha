import { algaehApiCall } from "../../utils/algaehApiCall";
import Enumerable from "linq";

export default function FavouriteOrderListEvent() {
  return {
    getFavouriteOrderList: $this => {
      algaehApiCall({
        uri: "/favouriteOrders/getFavouriteOrder",
        module: "masterSettings",
        method: "GET",
        onSuccess: response => {
          if (response.data.success) {
            let ItemList = Enumerable.from(response.data.records)
              .groupBy("$.hims_d_favourite_orders_header_id", null, (k, g) => {
                let firstRecordSet = Enumerable.from(g).firstOrDefault();

                return {
                  hims_d_favourite_orders_header_id:
                    firstRecordSet.hims_d_favourite_orders_header_id,
                  favourite_description: firstRecordSet.favourite_description,

                  favourite_status: firstRecordSet.favourite_status,
                  doctor_id: firstRecordSet.doctor_id,

                  favourite_details: g.getSource()
                };
              })
              .toArray();

            $this.setState({
              all_favourites: ItemList
            });
          }
        }
      });
    },
    OpenFavouriteOrder: ($this, row) => {
      $this.setState({
        isOpen: !$this.state.isOpen,
        favouriteData: row
      });
    }
  };
}
