export function authenticate(socket, data, callback) {
  const { token } = data;
  if (token && token.user_id) {
    return callback(null, true);
  } else {
    return callback(new Error("You are not allowed to access"));
  }
}

export function postAuthenticate(socket, data) {
  const { token, moduleList } = data;
  socket.client.user = token.employee_id;
  socket.client.details = token;
  socket.join(token.employee_id, (err) => {
    console.log(err);
  });
  socket.join(moduleList, (err) => console.log(err));
}

export function disconnect(socket) {
  console.log(socket.id + " disconnected");
}
