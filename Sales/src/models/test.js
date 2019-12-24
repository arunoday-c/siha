export const tested = (req, res, next) => {
  req.body = "12345677";
  next();
};
export const tested2 = (req, res, next) => {
  // ctx.body = "Hey dude " + ctx.request.body;
  res.status(200).json({
    message: "Can u here me"
  });
};
