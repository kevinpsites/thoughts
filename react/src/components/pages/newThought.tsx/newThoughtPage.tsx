import React, { useState, useEffect } from "react";
import appSettings from "appSettings.json";
import { useAppContext } from "App";
import ThoughtEditBox from "components/common/thoughtBoxes/thoughtEditBox";
import { useQuery } from "hooks/useQuery";
import { useNavigate } from "react-router-dom";
import { Thought } from "types/globalTypes";

export default function NewThoughtPage() {
  const { thoughtDispatch, findThought } = useAppContext();
  let navigate = useNavigate();
  const query = useQuery();
  const thoughtId = query.get("thought");

  const [existingThought, setExistingThought] = useState<Thought | undefined>();

  const handleSave = (thought: Thought, parentThreadId?: string | null) => {
    thoughtDispatch({ type: "ADD_THOUGHT", payload: { thought } });

    navigate(
      parentThreadId
        ? `${appSettings.routes.thread}/${parentThreadId}`
        : appSettings.routes.home
    );
  };

  const handleEdit = (thought: Thought) => {
    if (existingThought) {
      let editedThought: Thought = {
        ...thought,
        thoughtId: existingThought.thoughtId,
        threadParent: existingThought.threadParent,
        createdOn: existingThought.createdOn,
        modifiedOn: new Date().toUTCString(),
      };

      thoughtDispatch({
        type: "EDIT_THOUGHT",
        payload: { thought: editedThought },
      });

      navigate(
        existingThought.threadParent
          ? `${appSettings.routes.thread}/${existingThought.threadParent.id}`
          : appSettings.routes.home
      );
      return;
    }

    navigate(appSettings.routes.home);
  };

  useEffect(() => {
    if (thoughtId) {
      let thought = findThought(thoughtId);
      if (thought) {
        setExistingThought({ ...thought });
      }
    }
  }, [thoughtId]);

  return (
    <>
      <h1></h1>
      <article className={`new-thought-page body`}>
        {existingThought ? (
          <ThoughtEditBox
            saveThought={handleEdit}
            existingThought={existingThought}
          />
        ) : (
          <ThoughtEditBox saveThought={handleSave} />
        )}
      </article>
    </>
  );
}
