export const getApiFieldErrors = (error) => {
  const errors = error?.response?.data?.errors;
  if (!errors || typeof errors !== "object") return {};

  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : String(messages),
    ]),
  );
};

export const getApiErrorMessage = (
  error,
  fallback = "No se pudo completar la operación.",
) => {
  const data = error?.response?.data;

  if (data?.message) return data.message;
  if (data?.mensaje) return data.mensaje;

  const fieldErrors = getApiFieldErrors(error);
  const firstFieldError = Object.values(fieldErrors)[0];
  if (firstFieldError) return firstFieldError;

  if (error?.response?.status === 403) {
    return "No tiene permisos para realizar esta acción.";
  }

  if (error?.response?.status === 404) {
    return "No se encontró el recurso solicitado.";
  }

  if (error?.response?.status >= 500) {
    return "El servidor no ha respondido correctamente. Inténtelo más tarde.";
  }

  return fallback;
};
