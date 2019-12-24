export function Response(ctx, records) {
  const status =
    typeof records === "object"
      ? records.status !== undefined
        ? records.status
        : 200
      : 200;
  ctx.status = status;
  console.log("Result", records);
  if (typeof records === "string") {
    ctx.body = {
      success: true,
      message: records
    };
  } else {
    ctx.body = {
      success: true,
      records: { ...records }
    };
  }
}
