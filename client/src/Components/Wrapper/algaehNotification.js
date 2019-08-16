export default function Notification(options) {
  const settings = {
    position: "top-left",
    showConfirmButton: false,
    animation: false,
    customClass: 'animated slideInRight'
    timer: 5000,
    // toast: true,
    ...options
  };
  const toast = swal.mixin(settings);

  toast({ type: settings.type, title: "Notification" });
}