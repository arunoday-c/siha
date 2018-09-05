import extend from "extend";
import swal from "sweetalert";
export function successfulMessage(options) {
  options.timer = options.timer || 2500;
  options.icon = options.icon || "error";
  options.title = options.title || "Error";
  options.button = options.button || true;

  swal({
    title: options.title,
    text: options.message,
    icon: options.icon,
    button: options.button,
    timer: options.timer
  });
}

export function setGlobal(obj) {
  let windglob = Window.global == null ? {} : Window.global;
  extend(windglob, obj);
  Window.global = windglob;
}

export function removeGlobal(name) {
  if (name !== undefined) delete Window.global[name];
}
