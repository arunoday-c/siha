import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import _ from "lodash";
import {
  AlgaehValidation,
  AlgaehOpenContainer
} from "../../../utils/GlobalFunctions";

export default function FavouriteOrderEvent() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value
      });
    },

    itemchangeText: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value,
        item_category_id: e.selected.category_id,
        s_service: e.selected.service_id
      });
    },
    serviceHandeler: ($this, e) => {
      $this.setState({
        s_service: e.hims_d_services_id,
        s_service_type: e.service_type_id,
        insurance_service_name: e.service_name,
        service_name: e.service_name
      });
    },

    AddToList: $this => {
      // let isError = false;

      if (
        $this.state.s_service_type === null &&
        $this.state.s_service === null
      ) {
        swalMessage({
          title: "Please select Service Type and Service.",
          type: "warning"
        });
        return;
      }
      // let SelectedService = _.filter($this.state.favourite_details, f => {
      //   return f.item_id === $this.state.item_id;
      // });

      let SelectedService = _.find(
        $this.state.favourite_details,
        f =>
          f.service_type_id === $this.state.s_service_type &&
          f.services_id === $this.state.s_service
      );

      if (SelectedService !== undefined) {
        swalMessage({
          title: "Selected Item already exists.",
          type: "warning"
        });
        return;
      }
      let favourite_details = $this.state.favourite_details;
      let insert_favourite_details = $this.state.insert_favourite_details;

      let InputObj = {
        service_type_id: $this.state.s_service_type,
        services_id: $this.state.s_service
      };

      if ($this.state.hims_d_favourite_orders_header_id !== null) {
        let InsertObj = {
          favourite_orders_header_id:
            $this.state.hims_d_favourite_orders_header_id,
          service_type_id: $this.state.s_service_type,
          services_id: $this.state.s_service
        };
        insert_favourite_details.push(InsertObj);
      }

      favourite_details.push(InputObj);

      $this.setState({
        favourite_details: favourite_details,
        s_service: null,
        insert_favourite_details: insert_favourite_details
      });
    },
    DeleteService: ($this, row) => {
      let favourite_details = $this.state.favourite_details;
      let delete_favourite_details = $this.state.delete_favourite_details;
      let insert_favourite_details = $this.state.insert_favourite_details;

      if ($this.state.hims_d_favourite_orders_header_id !== null) {
        if (row.hims_d_favourite_orders_detail_id !== undefined) {
          delete_favourite_details.push({
            hims_d_favourite_orders_detail_id:
              row.hims_d_favourite_orders_detail_id
          });
        } else {
          for (let k = 0; k < insert_favourite_details.length; k++) {
            if (
              insert_favourite_details[k].hims_d_favourite_orders_detail_id ===
              row.hims_d_favourite_orders_detail_id
            ) {
              insert_favourite_details.splice(k, 1);
            }
          }
        }
      }

      for (let x = 0; x < favourite_details.length; x++) {
        if (favourite_details[x].services_id === row.services_id) {
          favourite_details.splice(x, 1);
        }
      }

      $this.setState({
        favourite_details: favourite_details,
        delete_favourite_details: delete_favourite_details,
        insert_favourite_details: insert_favourite_details
      });
    },

    serviceTypeHandeler: ($this, e) => {
      $this.setState(
        {
          [e.name]: e.value
        },
        () => {
          $this.props.getServices({
            uri: "/serviceType/getService",
            module: "masterSettings",
            method: "GET",
            data: { service_type_id: $this.state.s_service_type },
            redux: {
              type: "SERVICES_GET_DATA",
              mappingName: "opbilservices"
            }
          });
        }
      );
    },

    AddFavouriteOrder: ($this, e) => {
      e.preventDefault();

      AlgaehValidation({
        alertTypeIcon: "warning",
        onSuccess: () => {
          if ($this.state.hims_d_favourite_orders_header_id === null) {
            algaehApiCall({
              uri: "/favouriteOrders/addFavouriteOrder",
              module: "masterSettings",
              data: $this.state,
              onSuccess: response => {
                if (response.data.success === true) {
                  swalMessage({
                    type: "success",
                    title: "Saved Successfully . ."
                  });
                  $this.setState(
                    {
                      hims_d_favourite_orders_header_id: null,
                      favourite_description: null,
                      favourite_status: "A",
                      doctor_id: null,
                      favourite_details: [],
                      insert_favourite_details: [],
                      delete_favourite_details: [],
                      s_service_type: null,
                      s_service: null
                    },
                    () => {
                      $this.props.onClose && $this.props.onClose(true);
                    }
                  );
                }
              }
            });
          } else {
            algaehApiCall({
              uri: "/favouriteOrders/updateFavouriteOrder",
              module: "masterSettings",
              data: $this.state,
              method: "PUT",
              onSuccess: response => {
                if (response.data.success === true) {
                  swalMessage({
                    type: "success",
                    title: "Updated Successfully . ."
                  });
                  $this.setState(
                    {
                      hims_d_favourite_orders_header_id: null,
                      favourite_description: null,
                      favourite_status: "A",
                      doctor_id: null,
                      favourite_details: [],
                      insert_favourite_details: [],
                      delete_favourite_details: [],
                      s_service_type: null,
                      s_service: null
                    },
                    () => {
                      $this.props.onClose && $this.props.onClose(true);
                    }
                  );
                }
              }
            });
          }
        }
      });
    }
  };
}
