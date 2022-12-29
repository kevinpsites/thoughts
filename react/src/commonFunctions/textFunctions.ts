import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import { RawThought, Thought, ThoughtState } from "types/globalTypes";

export const findTextRegex = (searchTerm: string, searchBody: string) => {
  let reg = new RegExp(searchTerm.toLowerCase(), "g");
  return searchBody.toLowerCase().match(reg);
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
  let parsed = JSON.parse(thought.thought);
  console.log("pa", parsed);
  let thoughtEditorState = EditorState.createWithContent(
    convertFromRaw(parsed)
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

export const extractCommonTagsAndCount = (
  thoughtState: ThoughtState
): {
  [key: string]: number;
} => {
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

  let finalTagCount: { [key: string]: number } = {};
  Object.keys(tagDictionary)
    .sort((a, b) => tagDictionary[b] - tagDictionary[a])
    .forEach((tag) => (finalTagCount[tag] = tagDictionary[tag]));

  return finalTagCount;
};

export const extractCommonTags = (thoughtState: ThoughtState): string[] => {
  let tagDictionary = extractCommonTagsAndCount(thoughtState);
  let finalTagArray: string[] = [];
  Object.keys(tagDictionary)
    .sort((a, b) => tagDictionary[b] - tagDictionary[a])
    .forEach((tag) => finalTagArray.push(tag));

  return finalTagArray;
};

export const convertRawApiThought = (
  rawThought: RawThought
): { id: string; thoughts: ThoughtState } => {
  return {
    id: rawThought.id,
    thoughts: JSON.parse(rawThought.fields.JSON),
  };
};
