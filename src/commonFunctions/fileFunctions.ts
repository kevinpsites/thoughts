import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { Thought } from "types/globalTypes";

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
