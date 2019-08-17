import swal from "sweetalert2";

export default function Notification(options) {
  const settings = {
    position: "top-right",
    toast: true,
    showConfirmButton: false,
    animation: false,
    customClass: "animated slideInRight",
    timer: 5000,
    ...options
  };
  const toast = swal.mixin(settings);

  toast({ type: settings.type });
}
