import { uuidv4 } from "commonFunctions/indentity";
import React, { useEffect, useState } from "react";
import { Thought, ThoughtType, ThreadParent } from "types/globalTypes";
import { Link, useNavigate } from "react-router-dom";
import appSettings from "appSettings.json";
import { ReactComponent as Close } from "icons/close.svg";
import { ReactComponent as Book } from "icons/book.svg";
import { ReactComponent as Lightbulb } from "icons/lightbulb.svg";
import DraftEditor from "components/common/draftEditor/draftEditor";
import { useQuery } from "hooks/useQuery";

const createNewThought = (
  threadParent?: ThreadParent,
  favorite?: boolean
): Thought => ({
  thought: "",
  title: "",
  tags: [],
  thoughtId: uuidv4(),
  threadParent: threadParent,
  createdOn: new Date().toUTCString(),
  modifiedOn: new Date().toUTCString(),
  type: "Thought",
  favorite,
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
  const threadType: ThoughtType | null = query.get("threadType") as ThoughtType;

  const [thoughtState, setThoughtState] = useState<Thought>(
    createNewThought(
      existingThought
        ? existingThought.threadParent
        : threadId && threadTitle
        ? { id: threadId, title: threadTitle }
        : undefined,
      existingThought?.favorite
    )
  );

  const [thoughtType, setThoughtType] = useState<ThoughtType>(
    existingThought?.type ?? threadType ?? "Thought"
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
      type: thoughtType,
    });

    // setEditingState(false);

    if (thoughtState.threadParent || target.title.value) {
      saveThought(
        {
          ...thoughtState,
          title: target.title.value,
          tags: [...newTags],
          type: thoughtType,
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

  const handleToggleFavorite = () => {
    setThoughtState({
      ...thoughtState,
      favorite: !thoughtState.favorite,
    });
  };

  useEffect(() => {
    if (existingThought?.favorite) {
      setThoughtState({
        ...thoughtState,
        favorite: true,
      });
    }
  }, [existingThought?.favorite]);

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
        thoughtType={thoughtType}
        // setEditingState={(focus: boolean) => setEditingState(focus)}
        id={
          existingThought ? existingThought.thoughtId : thoughtState.thoughtId
        }
        favorite={thoughtState.favorite}
        toggleFavorite={handleToggleFavorite}
        decoratorTypes={["HashTag"]}
        styleButtons={["Bold", "Italic", "Underline"]}
        blockButtons={["Ordered List", "Unordered List", "Blockquote"]}
      />

      {(existingThought?.title ||
        (!existingThought && !thoughtState.threadParent)) && (
        <>
          <section className={`thought-type-row`}>
            Type:{" "}
            <button
              onClick={() => setThoughtType("Thought")}
              className={`${thoughtType === "Thought" && "active"}`}
              type={"button"}
            >
              <Lightbulb />
              Thought
            </button>
            <button
              onClick={() => setThoughtType("Book")}
              className={`${thoughtType === "Book" && "active"}`}
              type={"button"}
            >
              <Book />
              Book
            </button>
          </section>
          <div></div>
        </>
      )}

      {thoughtState.threadParent && (
        <>
          <section>
            <Link
              to={`${appSettings.routes.thread}/${thoughtState.threadParent.id}`}
              className={`thread-link`}
            >
              {thoughtState.threadParent.title}
            </Link>
          </section>
          <div></div>
        </>
      )}

      {saveError && <span className={`save-error-message`}>{saveError}</span>}
    </form>
  );
}
