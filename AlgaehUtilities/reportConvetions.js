export function convertMilimetersToPixel(options) {
  if (options === undefined) return {};
  const onemm = 3.77; //Pixels
  const hasWidth = Object.keys(options).find(
    f => f === "width" || f === "height"
  );

  if (hasWidth !== undefined) {
    const width = options.width;
    const height = options.height;
    const wdth =
      width !== undefined && width !== ""
        ? typeof width === "string"
          ? parseFloat(width.replace("mm", "")) * onemm
          : width * onemm
        : null;
    const hgh =
      height !== undefined && height !== ""
        ? typeof height === "string"
          ? parseFloat(height.replace("mm", "")) * onemm
          : height * onemm
        : null;
    return { width: wdth, height: hgh };
  } else {
    return {};
  }
  //   } else {
  //     return {};
  //   }
}
