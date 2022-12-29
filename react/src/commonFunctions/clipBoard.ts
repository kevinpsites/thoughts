import { Thought } from "types/globalTypes";
import { convertThoughtFromRaw } from "./textFunctions";

export const copyContent = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const copyThoughtToClipBoard = (thought: Thought) => {
  let finalThought = convertThoughtFromRaw(thought);

  return copyContent(finalThought);
};

export const getDataLabel = <T>(e: any, dataLabel: string) => {
  return e.currentTarget.getAttribute(dataLabel) as T;
};
