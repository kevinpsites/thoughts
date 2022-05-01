export const findTextRegex = (searchTerm: string, searchBody: string) => {
  let reg = new RegExp(searchTerm, "g");
  return searchBody.match(reg);
};

export const threadDisplayName = (title?: string): string => {
  if (!title) {
    return "Thought";
  }

  let finalString = title;
  if (title.length > 15) {
    finalString = title[0].toUpperCase() + title.slice(1, 15) + "...";
  }

  return finalString;
};
