export const toPascalCase = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const slugify = (text: string): string =>
  text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");

export const formatDOB = (dob: string): string =>
  new Date(dob).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
