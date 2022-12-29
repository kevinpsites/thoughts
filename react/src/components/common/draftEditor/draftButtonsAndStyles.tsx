import {
  EditorState,
  getDefaultKeyBinding,
  KeyBindingUtil,
  RichUtils,
} from "draft-js";
import { ReactComponent as HashTag } from "icons/hashTag.svg";

import { ReactComponent as BlockQuote } from "icons/blockQuote.svg";
import { ReactComponent as Bold } from "icons/bold.svg";
import { ReactComponent as BulletList } from "icons/bulletList.svg";
import { ReactComponent as Italic } from "icons/italic.svg";
import { ReactComponent as NumberedList } from "icons/numberedList.svg";
import { ReactComponent as Underline } from "icons/underline.svg";
import { MouseEventHandler, useState } from "react";
import {
  BlockStyleTypes,
  BlockTypes,
  StyleTypes,
} from "types/draftEditorTypes";

const BLOCK_TYPES: { label: BlockTypes; style: string; icon: any }[] = [
  {
    label: "H1",
    style: "header-one",
    icon: "",
  },
  {
    label: "H2",
    style: "header-two",
    icon: "",
  },
  {
    label: "H3",
    style: "header-three",
    icon: "",
  },
  {
    label: "H4",
    style: "header-four",
    icon: "",
  },
  {
    label: "Unordered List",
    style: "unordered-list-item",
    icon: <BulletList />,
  },
  {
    label: "Ordered List",
    style: "ordered-list-item",
    icon: <NumberedList />,
  },
  {
    label: "Blockquote",
    style: "blockquote",
    icon: <BlockQuote />,
  },
];

const STYLE_TYPES: { label: StyleTypes; style: string; icon: any }[] = [
  {
    label: "Bold",
    style: "BOLD",
    icon: <Bold />,
  },
  {
    label: "Italic",
    style: "ITALIC",
    icon: <Italic />,
  },
  {
    label: "Underline",
    style: "UNDERLINE",
    icon: <Underline />,
  },
];

const EditorButton: React.FC<{
  action: MouseEventHandler<HTMLButtonElement>;
  style: {
    label: StyleTypes | BlockTypes | "Hashtag";
    style: string;
    icon: any;
  };
}> = ({ style: { icon, style }, action }) => {
  const [active, setActive] = useState(false);
  const _onMouseDown = (e: any) => {
    setActive(!active);
    action(e);
  };
  return (
    <button
      type="button"
      key={style}
      onMouseDown={_onMouseDown}
      name={style}
      className={`editor-button-style ${active && "editor-button-active"}`}
    >
      {icon}
    </button>
  );
};

export const createBlockStyleButtons = (
  blockButtons: BlockTypes[],
  _toggleBlockType: MouseEventHandler<HTMLButtonElement>
): JSX.Element[] => {
  const blocksToUse = [
    ...new Set(BLOCK_TYPES.filter((type) => blockButtons.includes(type.label))),
  ];

  return blocksToUse.map((style, sIndex) => {
    return (
      <EditorButton key={style.style} style={style} action={_toggleBlockType} />
    );
  });
};

export const createTextStyleButtons = (
  blockButtons: StyleTypes[],
  _toggleStyleType: MouseEventHandler<HTMLButtonElement>
): JSX.Element[] => {
  const blocksToUse = [
    ...new Set(STYLE_TYPES.filter((type) => blockButtons.includes(type.label))),
  ];

  return blocksToUse.map((style) => {
    return (
      <EditorButton key={style.style} style={style} action={_toggleStyleType} />
    );
  });
};

export const createHashTagButton = (
  _action: MouseEventHandler<HTMLButtonElement>
): JSX.Element => {
  return (
    <EditorButton
      key={"hashtag"}
      style={{ style: "hastag", label: "Hashtag", icon: <HashTag /> }}
      action={_action}
    />
  );
};

export const handleKeyCommand = (
  command: BlockStyleTypes,
  editorState: EditorState
): EditorState | null => {
  let newState: EditorState | null = RichUtils.handleKeyCommand(
    editorState,
    command
  );

  // If RichUtils.handleKeyCommand didn't find anything, check for our custom strikethrough command and call `RichUtils.toggleInlineStyle` if we find it.
  if (!newState && command === "strikethrough") {
    newState = RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH");
  }
  if (!newState && command === "highlight") {
    newState = RichUtils.toggleInlineStyle(editorState, "HIGHLIGHT");
  }

  if (!newState && command === "blockquote") {
    newState = RichUtils.toggleBlockType(editorState, "blockquote");
  }

  if (!newState && command === "ordered-list") {
    newState = RichUtils.toggleBlockType(editorState, "ordered-list-item");
  }

  if (!newState && command === "unordered-list") {
    newState = RichUtils.toggleBlockType(editorState, "unordered-list-item");
  }

  if (!newState && command === "header-one") {
    newState = RichUtils.toggleBlockType(editorState, "header-one");
  }

  if (!newState && command === "header-two") {
    newState = RichUtils.toggleBlockType(editorState, "header-two");
  }

  if (!newState && command === "header-three") {
    newState = RichUtils.toggleBlockType(editorState, "header-three");
  }

  return newState;
};

export const getBlockStyle = (block: any) => {
  switch (block.getType()) {
    case "blockquote":
      return "richEditor-blockquote";
    default:
      return "";
  }
};

export const keyBindingFunction = (event: any) => {
  // Shortcuts for Inline Level styling
  if (
    KeyBindingUtil.hasCommandModifier(event) &&
    event.shiftKey &&
    event.key === "x"
  ) {
    return "strikethrough";
  }
  if (
    KeyBindingUtil.hasCommandModifier(event) &&
    event.shiftKey &&
    event.key === "h"
  ) {
    return "highlight";
  }

  // Shortcuts for Block Level styling
  if (
    KeyBindingUtil.hasCommandModifier(event) &&
    event.shiftKey &&
    event.key === "1"
  ) {
    return "header-one";
  }
  if (
    KeyBindingUtil.hasCommandModifier(event) &&
    event.shiftKey &&
    event.key === "2"
  ) {
    return "header-two";
  }
  if (
    KeyBindingUtil.hasCommandModifier(event) &&
    event.shiftKey &&
    event.key === "3"
  ) {
    return "header-three";
  }

  if (
    KeyBindingUtil.hasCommandModifier(event) &&
    event.shiftKey &&
    event.key === "7"
  ) {
    return "ordered-list";
  }

  if (
    KeyBindingUtil.hasCommandModifier(event) &&
    event.shiftKey &&
    event.key === "8"
  ) {
    return "unordered-list";
  }
  if (
    KeyBindingUtil.hasCommandModifier(event) &&
    event.shiftKey &&
    event.key === "9"
  ) {
    return "blockquote";
  }

  if (
    KeyBindingUtil.hasCommandModifier(event) &&
    event.shiftKey &&
    event.key === "-"
  ) {
    return "unordered-list";
  }

  if (event.key === "Backspace") {
    return "backspace";
  }

  // console.log("KEY", event.key);

  // if (
  //   KeyBindingUtil.hasCommandModifier(event) &&
  //   event.shiftKey &&
  //   event.key === "j"
  // ) {
  //   return "basic-text";
  // }

  return getDefaultKeyBinding(event);
};
