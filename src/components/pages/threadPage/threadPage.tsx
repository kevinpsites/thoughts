import React, { useState } from "react";
import { useAppContext } from "App";
import { Link, useNavigate, useParams } from "react-router-dom";
import ThoughtDisplayBox from "components/common/thoughtBoxes/thoughtDisplayBox";
import { Thought } from "types/globalTypes";
import { ReactComponent as BackArrow } from "icons/arrowBack.svg";
import { useEffect } from "react";

export default function ThreadPage() {
  const { findThought, findThreadThoughts } = useAppContext();
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
    if (tempParentThought) {
      let foundThreadThoughts = findThreadThoughts(
        tempParentThought.threadParent ?? {
          id: tempParentThought.thoughtId,
          title: tempParentThought.title,
        }
      );
      setThreadThoughts(foundThreadThoughts ?? []);
    }
  }, [threadId]);

  return (
    <>
      <Link to={"/"} className="back-button">
        <BackArrow />
      </Link>
      <h1>{parentThought ? parentThought.title : "Thoughts"}</h1>

      <article className={`thought-page body`}>
        {!parentThought
          ? "Loading..."
          : threadThoughts.map((thought, tIndex) => (
              <ThoughtDisplayBox
                key={tIndex}
                existingThought={thought}
                addToThreadParent={addToThread}
              />
            ))}
      </article>
    </>
  );
}
