import {
  ReactChild,
  ReactFragment,
  ReactPortal,
  useEffect,
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
} from "draft-js";
import "draft-js/dist/Draft.css";
import { RichUtils } from "draft-js";

import { ReactComponent as CheckCircle } from "icons/checkCircle.svg";
import {
  handleStrategy,
  HandleSpan,
  hashtagStrategy,
  HashtagSpan,
  generateDecoratorTypes,
} from "./draftDecorators";
import {
  createBlockStyleButtons,
  createTextStyleButtons,
  handleKeyCommand,
  getBlockStyle,
  keyBindingFunction,
} from "./draftButtonsAndStyles";
import {
  BlockStyleTypes,
  BlockTypes,
  DecoratorTypes,
  StyleTypes,
} from "types/draftEditorTypes";

interface DraftEditorProps {
  saveThought?: (thought: string, cancel?: boolean) => void;
  setEditingState?: (focus: boolean) => void;
  id: string;
  editing: boolean;
  startingThought?: string;
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
  className,
  blockButtons = [],
  styleButtons = [],
  decoratorTypes = [],
  extraDecoratorStyles = [],
}: DraftEditorProps) => {
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
    setEditorState(RichUtils.toggleBlockType(editorState, e.target.name));
  };

  const _toggleInlineStyle = (e: any) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, e.target.name));
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

  const exportAll = () => {
    let current = editorState.getCurrentContent();

    let rawState = convertToRaw(current);
    console.log();

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
          autoComplete={"on"}
          autoCorrect={"on"}
          spellCheck={true}
          stripPastedStyles={true}
          editorState={editorState}
          onChange={setEditorState}
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
          placeholder={`Type a thought`}
        />

        {showButtons && (
          <section className={`draft-button-row`}>
            <div
              className={`draft-editory-buttons ${
                !focus && "draft-editory-buttons-hide"
              }`}
            >
              {textStyleButtons} | {blockStyleButtons}
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
