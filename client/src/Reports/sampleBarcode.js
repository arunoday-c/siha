export function printReport(data, options) {
  return `<div>
<img  src="${options.generateBarcode(data.bar_code)}" />
</div>`;
}
