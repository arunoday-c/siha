export const tested = (ctx, next) => {

    ctx.request.body = "12345677";
    next();
}
export const tested2 = (ctx) => {
    ctx.body = "Hey dude " + ctx.request.body;
}


