import { createUrl } from "../../../hooks/newAlgaehApi";

export function logoUrl(inputs = { uri: "", module: "" }) {
  inputs.module = "documentManagement";
  return createUrl(inputs);
}
