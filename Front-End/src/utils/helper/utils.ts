export const toPascalCase = (str: string) => {
  if (!str.trim()) return "N/A";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (text: string): string => {
  if (!text.trim()) return "N/A";
  return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
};

export const formatDOB = (dob: string): string => {
  if (!dob.trim()) return "N/A";
  return new Date(dob).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const shortBookingId = (bookingId: string): string => {
  const shortUUID = bookingId.replace(/-/g, "").slice(-5).toUpperCase();
  return `Bk_${shortUUID}`;
};

export const formatINRCurrency = (amount?: number | null): string => {
  if (amount == undefined || amount == null ) return "N/A";
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};