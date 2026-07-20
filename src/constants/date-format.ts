export const formatReadableDate = (isoString: string) => {
  if (!isoString) return "";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoString));
};
