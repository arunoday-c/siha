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

export function resizeImage(options) {
  let settings = { maxWidth: 400, maxHeight: 400, ...options };
  let canvas = document.createElement("canvas");

  let imageControl = document.getElementById(settings.imgId);

  let MAX_WIDTH = settings.maxWidth;
  let MAX_HEIGHT = settings.maxHeight;
  let width = imageControl.width;
  let height = imageControl.height;
  if (width > height) {
    if (width > MAX_WIDTH) {
      height *= MAX_WIDTH / width;
      width = MAX_WIDTH;
    }
  } else {
    if (height > MAX_HEIGHT) {
      width *= MAX_HEIGHT / height;
      height = MAX_HEIGHT;
    }
  }
  canvas.width = width;
  canvas.height = height;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(imageControl, 0, 0, width, height);
  return canvas.toDataURL("image/png");
}
