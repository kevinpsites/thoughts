import React, { useEffect } from "react";
import { useAppContext } from "App";
import { useNavigate } from "react-router-dom";
import ThoughtDisplayBox from "components/common/thoughtBoxes/thoughtDisplayBox";
import { Thought } from "types/globalTypes";
import appSettings from "appSettings.json";

export default function ThoughtsPage() {
  const { thoughtState, clearThread } = useAppContext();
  let navigate = useNavigate();

  const addToThread = (thought: Thought) => {
    navigate(
      `${appSettings.routes.thread}/${
        thought.threadParent ? thought.threadParent.id : thought.thoughtId
      }`
    );
  };

  useEffect(() => {
    clearThread();
  }, []);

  return (
    <>
      <h1>Thoughts</h1>

      <article className={`thought-page body`}>
        {thoughtState.thoughts.map((thought, tIndex) => (
          <ThoughtDisplayBox
            key={tIndex}
            existingThought={thought}
            addToThreadParent={addToThread}
            tabChild={true}
          />
        ))}
      </article>
    </>
  );
}
