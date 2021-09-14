import {
  algaehAxios,
  AlgaehMessagePop,
  message,
} from "algaeh-react-components";

export async function getWardHeaderData(data: any) {
  debugger;
  const { response, error } = await algaehAxios(
    "/bedManagement/getWardHeaderData",
    {
      module: "admission",
      method: "GET",
      data: { ...data },
    }
  );
  if (error) {
    if (error.show === true) {
      let extendedError: Error | any = error;
      AlgaehMessagePop({
        display: extendedError.response.data.message,
        type: "error",
      });
      throw error;
    }
  }
  if (response.data.success) {
    // setWardHeaderData(response.data.records);
  }
}
