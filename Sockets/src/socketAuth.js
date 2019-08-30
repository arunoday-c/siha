import utilities from "algaeh-utilities";

export function authenticate(socket, data, callback) {
  const token = data.token;
  // const userIdentity = data.userIdentity;
  const _verify = utilities.AlgaehUtilities().tokenVerify(token);
  // if (_verify) {
  //   let header = userIdentity;
  //   if (header != null && header != "" && header != "null") {
  //     header = utliites.AlgaehUtilities().decryption(header);
  //     req.userIdentity = { ...header, "x-branch": reqH["x-branch"] };
  //   }
  console.log(_verify);
  if (!_verify) {
    return callback(new Error("Permission Denied"));
  }
  return callback(null, _verify);
}
