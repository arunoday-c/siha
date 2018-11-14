export function printReport(data, options) {
  return `<div>
<img  src="${options.generateBarcode(data.patient_code)}" />
</div>`;
}
