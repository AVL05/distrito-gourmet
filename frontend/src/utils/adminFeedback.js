import Swal from "sweetalert2";
import { getApiErrorMessage } from "@/utils/apiErrors";

export const showAdminToast = (title, icon = "success") =>
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
    background: "#fdfaf6",
    color: "#2c302e",
  });

export const showAdminErrorToast = (
  error,
  fallback = "No se pudo completar la operación.",
) => showAdminToast(getApiErrorMessage(error, fallback), "error");

export const adminEditInputClass =
  "w-full border border-text-main/20 bg-white p-3 text-sm text-text-main shadow-sm outline-none transition placeholder:text-text-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/15";
