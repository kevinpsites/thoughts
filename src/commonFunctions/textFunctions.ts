export const findTextRegex = (searchTerm: string, searchBody: string) => {
  let reg = new RegExp(searchTerm, "g");
  return searchBody.match(reg);
};
