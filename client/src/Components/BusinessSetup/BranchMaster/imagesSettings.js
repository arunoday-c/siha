import { createUrl } from "../../../hooks/newAlgaehApi";
export function logoUrl(inputs = { uri: "", module: "" }) {
  inputs.module = "documentManagement";
  return createUrl(inputs);
}
export function LoadLogo(input = { image_id: "", logo_type: "" }) {
  const { image_id, logo_type } = input;
  if (image_id === undefined) {
    return "";
  }
  const { hostname, port, protocol } = window.location;
  const imageUrl = `${protocol}//${hostname}${
    port ? ":3006" : "/docserver"
  }/api/v1/Document/getLogo?image_id=${image_id}&logo_type=${logo_type}`;
  return imageUrl;
}
