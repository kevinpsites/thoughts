import React, { useRef, useState } from "react";
import { useAppContext } from "App";
import { Link, useNavigate, useParams } from "react-router-dom";
import ThoughtDisplayBox from "components/common/thoughtBoxes/thoughtDisplayBox";
import { Thought } from "types/globalTypes";
import { useEffect } from "react";
import BackButton from "components/common/backButton";
import { threadDisplayName } from "commonFunctions/textFunctions";
import ScrollButton from "components/common/scrollButton";

export default function ThreadPage({ favorite }: { favorite?: boolean }) {
  const pageRef = useRef<HTMLHeadingElement>(null);
  const { findThought, findThreadThoughts, findFavorites } = useAppContext();
  let { threadId } = useParams<{ threadId: string }>();
  let navigate = useNavigate();

  let tempParentThought = findThought(threadId ?? "");

  const [parentThought, setParentThought] = useState<Thought | undefined>(
    tempParentThought
  );

  const [threadThoughts, setThreadThoughts] = useState<Thought[]>([]);

  const addToThread = (thought: Thought) => {
    navigate(
      `/thread/${
        thought.threadParent ? thought.threadParent : thought.thoughtId
      }`
    );
  };

  useEffect(() => {
    pageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    if (tempParentThought) {
      let foundThreadThoughts = findThreadThoughts(
        tempParentThought.threadParent ?? {
          id: tempParentThought.thoughtId,
          title: tempParentThought.title,
          type: tempParentThought.type,
        }
      );

      if (!parentThought) {
        setParentThought({ ...tempParentThought });
      }

      setThreadThoughts([...(foundThreadThoughts ?? [])]);
    }

    if (favorite) {
      let foundFavorites = findFavorites();
      setThreadThoughts([...foundFavorites]);
    }
  }, [threadId, favorite]);

  return (
    <>
      <BackButton />
      <h1 ref={pageRef}>
        {favorite ? "Favorites" : threadDisplayName(parentThought?.title)}
      </h1>

      <article className={`thought-page body`}>
        {!parentThought && !favorite
          ? "Loading..."
          : threadThoughts.map((thought, tIndex) => (
              <ThoughtDisplayBox
                key={tIndex}
                existingThought={thought}
                addToThreadParent={addToThread}
              />
            ))}

        <ScrollButton />
      </article>
    </>
  );
}
