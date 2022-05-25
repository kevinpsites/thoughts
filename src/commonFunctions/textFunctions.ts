import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import { Thought, ThoughtState } from "types/globalTypes";

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

export const convertThoughtFromRaw = (thought: Thought): string => {
  let thoughtEditorState = EditorState.createWithContent(
    convertFromRaw(JSON.parse(thought.thought))
  );
  const blocks = convertToRaw(thoughtEditorState.getCurrentContent()).blocks;
  const thoughtContentText = blocks
    .map((block) => (!block.text.trim() && "\n") || block.text)
    .join("\n");

  let finalThought = `${
    thought.title ? `##${thought.title}\n` : ""
  }\n${thoughtContentText}`;

  return finalThought;
};

export const extractEditorStateText = (
  rawState: RawDraftContentState
): string => {
  const blocks = rawState.blocks;
  const thoughtContentText = blocks.map(
    (block) => (!block.text.trim() && "") || block.text
  );

  return thoughtContentText.join("");
};

export const extractCommonTags = (thoughtState: ThoughtState): string[] => {
  let tagDictionary: { [key: string]: number } = {};

  thoughtState.thoughts.forEach((thought) => {
    thought.tags.forEach((tag) => {
      const lowerTag = tag.toLowerCase();

      if (!tagDictionary[lowerTag]) {
        tagDictionary[lowerTag] = 0;
      }

      tagDictionary[lowerTag] += 1;
    });
  });

  let finalTagArray: string[] = [];
  Object.keys(tagDictionary)
    .sort((a, b) => tagDictionary[b] - tagDictionary[a])
    .forEach((tag) => finalTagArray.push(tag));

  return finalTagArray;
};
