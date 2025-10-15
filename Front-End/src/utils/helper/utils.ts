export const toPascalCase = (str: string) =>{
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (text: string): string => {
  return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
};

export const formatDOB = (dob: string): string => {
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