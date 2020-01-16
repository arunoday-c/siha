import { newAlgaehApi } from "../../../hooks";

export function AddNewAccountDetails(data, error, result) {
  newAlgaehApi({
    uri: "/finance/addAccountHeads",
    method: "POST",
    data: data,
    module: "finance"
  })
    .then(res => {
      if (res.data.success) {
        console.log(res.data.result, "add result");
        result(res.data.result);
      }
    })
    .catch(e => {
      error(e.message);
    });
}
