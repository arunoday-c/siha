export function printReport(data, options) {
  debugger;
  return `<div>
  <img  src="${options.generateBarcode(data.patient_code)}" />
  </div>`;
}
