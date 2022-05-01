import { uuidv4 } from "commonFunctions/indentity";
import React, { useState } from "react";
import { Thought, ThreadParent } from "types/globalTypes";
import { Link, useNavigate } from "react-router-dom";
import appSettings from "appSettings.json";
import { ReactComponent as Close } from "icons/close.svg";
import DraftEditor from "components/common/draftEditor/draftEditor";
import { useQuery } from "hooks/useQuery";

const createNewThought = (threadParent?: ThreadParent): Thought => ({
  thought: "",
  title: "",
  tags: [],
  thoughtId: uuidv4(),
  threadParent: threadParent,
  createdOn: new Date().toUTCString(),
  modifiedOn: new Date().toUTCString(),
});

const findTags = (threadId: string): string[] => {
  let specificEditor = document.getElementById(`editor-${threadId}`);

  let hashtags: HTMLCollectionOf<Element> | undefined =
    specificEditor?.getElementsByClassName("hashtag-span");
  let newTags: string[] = [];

  if (hashtags) {
    for (let hashtag of hashtags) {
      if (hashtag.textContent) {
        newTags.push(hashtag.textContent.split("#")[1]);
      }
    }
  }

  return newTags;
};

interface ThoughtEditBoxProps {
  existingThought?: Thought;
  saveThought: (thought: Thought, parentThreadId?: string | null) => void;
}

export default function ThoughtEditBox({
  existingThought,
  saveThought,
}: ThoughtEditBoxProps) {
  const query = useQuery();
  const navigate = useNavigate();

  //thread query params
  const threadId = query.get("thread");
  const threadTitle = query.get("threadTitle");

  const [thoughtState, setThoughtState] = useState<Thought>(
    createNewThought(
      existingThought
        ? existingThought.threadParent
        : threadId && threadTitle
        ? { id: threadId, title: threadTitle }
        : undefined
    )
  );

  const [saveError, setSaveError] = useState<string>("");

  const handleOnSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      title: { value: string };
    };

    let newTags = findTags(thoughtState.thoughtId);

    setThoughtState({
      ...thoughtState,
      title: target.title.value,
      tags: [...newTags],
    });

    // setEditingState(false);

    if (thoughtState.threadParent || target.title.value) {
      saveThought(
        {
          ...thoughtState,
          title: target.title.value,
          tags: [...newTags],
        },
        threadId
      );
    } else {
      setSaveError("Please enter a title or attach to a thread");
    }
  };

  const handleReset = () => {
    // setEditingState(false);
    navigate("/");
    // setThoughtState(
    //   existingThought
    //     ? JSON.parse(JSON.stringify(existingThought))
    //     : {
    //         ...thoughtState,
    //         thought: "",
    //         title: "",
    //         tags: []
    //       }
    // );
  };

  return (
    <form
      className={`thought-box`}
      onSubmit={handleOnSubmit}
      onKeyDown={(e: any) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
    >
      <label className={`thought-box-title`}>
        <input
          type="text"
          name="title"
          placeholder={`Add a title to create a Thread`}
          defaultValue={existingThought?.title}
          // onFocus={() => setEditingState(true)}
          autoFocus
        />
      </label>

      <button onClick={handleReset} className={`close-button`} tabIndex={3}>
        <Close />
      </button>

      <DraftEditor
        saveThought={(e: any) => {
          setThoughtState({
            ...thoughtState,
            thought: e,
          });
        }}
        editing={true}
        startingThought={existingThought?.thought}
        className={`thought-box-thought`}
        // setEditingState={(focus: boolean) => setEditingState(focus)}
        id={
          existingThought ? existingThought.thoughtId : thoughtState.thoughtId
        }
        decoratorTypes={["HashTag"]}
        styleButtons={["Bold", "Italic", "Underline"]}
        blockButtons={["Ordered List", "Unordered List", "Blockquote"]}
      />

      {thoughtState.threadParent && (
        <section>
          <Link
            to={`${appSettings.routes.thread}/${thoughtState.threadParent.id}`}
            className={`thread-link`}
          >
            {thoughtState.threadParent.title}
          </Link>
        </section>
      )}

      {saveError && <span className={`save-error-message`}>{saveError}</span>}
    </form>
  );
}
