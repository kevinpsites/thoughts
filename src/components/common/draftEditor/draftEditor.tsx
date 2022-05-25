import {
  ReactChild,
  ReactFragment,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CompositeDecorator,
  convertFromRaw,
  convertToRaw,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
  SelectionState,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { RichUtils } from "draft-js";

import { ReactComponent as CheckCircle } from "icons/checkCircle.svg";
import { generateDecoratorTypes } from "./draftDecorators";
import {
  createBlockStyleButtons,
  createTextStyleButtons,
  handleKeyCommand,
  getBlockStyle,
  keyBindingFunction,
  createHashTagButton,
} from "./draftButtonsAndStyles";
import {
  BlockStyleTypes,
  BlockTypes,
  DecoratorTypes,
  StyleTypes,
} from "types/draftEditorTypes";

import { ReactComponent as HashTag } from "icons/hashTag.svg";
import { extractEditorStateText } from "commonFunctions/textFunctions";
import { ThoughtType } from "types/globalTypes";

const insertText = (oldEditorState: EditorState, textToInsert: string) => {
  let editorState = oldEditorState;

  // get current editor state
  const currentContent = editorState.getCurrentContent();

  // create new selection state where focus is at the end
  const blockMap = currentContent.getBlockMap();
  const key = blockMap.last().getKey();
  const length = blockMap.last().getLength();
  const selection = new SelectionState({
    anchorKey: key,
    anchorOffset: length,
    focusKey: key,
    focusOffset: length,
  });

  //insert text at the selection created above
  // @ts-ignore
  const textWithInsert = Modifier.insertText(
    currentContent,
    selection,
    textToInsert, //@ts-ignore
    null
  );
  const editorWithInsert = EditorState.push(
    editorState,
    textWithInsert,
    "insert-characters"
  );

  //also focuses cursor at the end of the editor
  // @ts-ignore
  const newEditorState = EditorState.moveSelectionToEnd(
    editorWithInsert, //@ts-ignore
    textWithInsert.getSelectionAfter()
  );
  //  setEditorState(newEditorState);

  return newEditorState;
};

interface DraftEditorProps {
  saveThought?: (thought: string, cancel?: boolean) => void;
  setEditingState?: (focus: boolean) => void;
  id: string;
  editing: boolean;
  placeholder?: string;
  startingThought?: string;
  thoughtType?: ThoughtType;
  className?: string;
  blockButtons?: BlockTypes[];
  styleButtons?: StyleTypes[];
  decoratorTypes?: DecoratorTypes[];
  extraDecoratorStyles?: {
    strategy: (contentBlock: any, callback: any, contentState: any) => void;
    component: (props: {
      offsetKey: any;
      children:
        | boolean
        | ReactChild
        | ReactFragment
        | ReactPortal
        | null
        | undefined;
    }) => JSX.Element;
  }[];
}

const DraftEditor = ({
  startingThought,
  setEditingState,
  id,
  saveThought,
  editing,
  placeholder,
  thoughtType = "Thought",
  className,
  blockButtons = [],
  styleButtons = [],
  decoratorTypes = [],
  extraDecoratorStyles = [],
}: DraftEditorProps) => {
  const editorRef = useRef<any>(null);
  let decorators = generateDecoratorTypes(decoratorTypes);
  const compositeDecorator = new CompositeDecorator([
    ...decorators,
    ...extraDecoratorStyles,
  ]);

  const [editorState, setEditorState] = useState<EditorState>(() =>
    startingThought
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(startingThought)),
          compositeDecorator
        )
      : EditorState.createEmpty(compositeDecorator)
  );

  const [focus, setFocus] = useState(false);

  useEffect(() => {
    if (startingThought) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(JSON.parse(startingThought)),
          compositeDecorator
        )
      );
    }
  }, [startingThought]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  const _undo = () => {
    setEditorState(EditorState.undo(editorState));
  };

  const _redo = () => {
    setEditorState(EditorState.redo(editorState));
  };

  const _onTab = (e: any) => {
    const maxDepth = 4;
    setEditorState(RichUtils.onTab(e, editorState, maxDepth));
  };

  const _toggleBlockType = (e: any) => {
    e.preventDefault();
    setEditorState(
      RichUtils.toggleBlockType(editorState, e.currentTarget.name)
    );
  };

  const _toggleInlineStyle = (e: any) => {
    e.preventDefault();
    setEditorState(
      RichUtils.toggleInlineStyle(editorState, e.currentTarget.name)
    );
  };

  const _handleKeyCommand = (
    command: BlockStyleTypes,
    editorState: EditorState
  ) => {
    let newState = handleKeyCommand(command, editorState);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const _insertHashTag = () => {
    let newState = insertText(editorState, "\n#");
    let focusedState = EditorState.moveFocusToEnd(newState);

    setEditorState(focusedState);
  };

  const handlePastedText = (text: string, html?: string) => {
    if (thoughtType === "Book" && text.indexOf("\nExcerpt From") != -1) {
      const realText = text.split("\nExcerpt From");
      console.log("TEXT", realText);

      const newContent = Modifier.insertText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        realText[0]
      );

      setEditorState(
        EditorState.push(editorState, newContent, "insert-characters")
      );
      return "handled";
    } else {
      return "not-handled";
    }
  };

  const exportAll = () => {
    let current = editorState.getCurrentContent();

    let rawState = convertToRaw(current);
    if (rawState.blocks.length <= 1) {
      let fullText = extractEditorStateText(rawState);
      if (!fullText) {
        console.log("dfd", fullText ? "e" : "no", current);
        return fullText;
      }
    }

    return JSON.stringify(rawState);
  };

  const cancelChanges = () => {
    if (startingThought) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(JSON.parse(startingThought))
        )
      );
    }

    if (saveThought) {
      saveThought("", true);
    }
  };

  const _handleSaveThought = () => {
    if (saveThought) {
      saveThought(exportAll());
    }
  };

  const showButtons = styleButtons.length > 0 || blockButtons.length > 0;

  const hashTagButton = createHashTagButton(_insertHashTag);
  const textStyleButtons = createTextStyleButtons(
    styleButtons,
    _toggleInlineStyle
  );
  const blockStyleButtons = createBlockStyleButtons(
    blockButtons,
    _toggleBlockType
  );

  return (
    <>
      <article
        className={`draft-editor-container ${className}`}
        id={`editor-${id}`}
      >
        <Editor
          ref={editorRef}
          autoComplete={"on"}
          autoCorrect={"on"}
          spellCheck={true}
          stripPastedStyles={true}
          editorState={editorState}
          onChange={setEditorState}
          handlePastedText={handlePastedText}
          // onTab={_onTab}
          handleKeyCommand={_handleKeyCommand}
          blockStyleFn={getBlockStyle}
          keyBindingFn={keyBindingFunction}
          readOnly={!editing}
          onFocus={() => {
            setFocus(true);
            setEditingState && setEditingState(true);
          }}
          onBlur={() => setFocus(false)}
          placeholder={placeholder ?? `Type a thought`}
        />

        {showButtons && (
          <section className={`draft-button-row`}>
            <div
              className={`draft-editory-buttons ${
                true
                // !focus && "draft-editory-buttons-hide"
              }`}
            >
              <button
                type="button"
                className="editor-button-style"
                onClick={_insertHashTag}
              >
                <HashTag />
              </button>{" "}
              | {textStyleButtons} | {blockStyleButtons}
            </div>
          </section>
        )}
      </article>
      {editing && (
        <button className={`save-button`} onClick={_handleSaveThought}>
          <CheckCircle />
        </button>
      )}
    </>
  );
};

export default DraftEditor;
