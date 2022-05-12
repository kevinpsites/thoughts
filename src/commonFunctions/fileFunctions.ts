export const downloadFile = async (
  jsonData: any,
  fileType: "json" | "text" = "json"
) => {
  const json = fileType === "json" ? JSON.stringify(jsonData) : jsonData;
  const blob = new Blob([json], {
    type: fileType === "json" ? "application/json" : "text/text",
  });
  const href = await URL.createObjectURL(blob);
  return href;
};
