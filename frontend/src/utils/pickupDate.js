export const getPickupDate = (pickupTime, now = new Date()) => {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(pickupTime)) return pickupTime.split("T")[0];
  const date = new Date(now);

  if (pickupTime.startsWith("tomorrow")) {
    date.setDate(date.getDate() + 1);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
