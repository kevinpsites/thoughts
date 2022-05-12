import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "App";
import { Thought } from "types/globalTypes";
import DraftEditor from "components/common/draftEditor/draftEditor";
import { ReactComponent as MoreDots } from "icons/moreDots.svg";
import { ReactComponent as CopyContent } from "icons/copyContent.svg";
import { ReactComponent as Edit } from "icons/edit.svg";
import { ReactComponent as TrashCan } from "icons/trashCan.svg";
import { copyThoughtToClipBoard } from "commonFunctions/clipBoard";
import appSettings from "appSettings.json";

interface ThoughtDisplayBoxProps {
  existingThought: Thought;
  addToThreadParent: (t: Thought) => void;
  editThoughtParent?: (t: Thought) => void;
  tabChild?: boolean;
}

export default function ThoughtDisplayBox({
  existingThought,
  editThoughtParent,
  addToThreadParent,
  tabChild,
}: ThoughtDisplayBoxProps) {
  const { thoughtDispatch } = useAppContext();
  let navigate = useNavigate();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const editThought = () => {
    if (editThoughtParent) {
      editThoughtParent(existingThought);
    } else {
      navigate(
        `/new?thought=${existingThought.thoughtId}${
          existingThought.threadParent
            ? `&thread=${existingThought.threadParent.id}&threadTitle=${existingThought.threadParent.title}`
            : ""
        }`
      );
    }
  };

  const addToThread = () => addToThreadParent(existingThought);

  const thoughtButtonMoreActions = [
    {
      title: "Edit",
      action: editThought,
      icon: <Edit />,
    },
    {
      title: "Copy",
      action: () => {
        copyThoughtToClipBoard(existingThought);
        // call dispatch to send alert
        setMoreMenuOpen(false);
      },
      icon: <CopyContent />,
    },
    {
      title: "Delete",
      action: () => {
        thoughtDispatch({
          type: "DELETE_THOUGHT",
          payload: { thoughtId: existingThought.thoughtId },
        });
        setMoreMenuOpen(false);
      },
      icon: <TrashCan />,
      className: "delete-button",
    },
  ];

  const handleModalDismissal = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      setMoreMenuOpen(false);
    }
  };

  return (
    <>
      <section
        className={`thought-box ${
          tabChild && existingThought.threadParent && "thread-box-child"
        }`}
      >
        {existingThought.title && (
          <>
            <h3 className={`thought-box-title`} onClick={addToThread}>
              {existingThought.title}
            </h3>
            <button
              className={`more-button`}
              onClick={() => setMoreMenuOpen(true)}
            >
              <MoreDots />
            </button>
          </>
        )}

        {existingThought.thought ? (
          <DraftEditor
            editing={false}
            startingThought={existingThought.thought}
            id={existingThought.thoughtId}
            decoratorTypes={["HashTag"]}
            placeholder={""}
          />
        ) : (
          <div></div>
        )}

        {existingThought.threadParent && (
          <>
            {!existingThought.title ? (
              <button
                className={`more-button`}
                onClick={() => setMoreMenuOpen(true)}
              >
                <MoreDots />
              </button>
            ) : (
              <div></div>
            )}

            <section>
              <Link
                to={`${appSettings.routes.thread}/${existingThought.threadParent.id}`}
                className={`thread-link`}
              >
                {existingThought.threadParent.title}
              </Link>
            </section>
          </>
        )}
      </section>

      <article
        className={`more-menu-modal ${
          !moreMenuOpen && "more-menu-modal-closed"
        }`}
        onClick={handleModalDismissal}
      >
        <section
          className={`more-menu-container ${
            !moreMenuOpen && "more-menu-container-closed"
          }`}
        >
          <h2>More Information</h2>
          <section>
            <div>Created on</div>
            <div className={`date-container`}>
              {new Date(existingThought.createdOn).toLocaleDateString()}
            </div>
            <div>Modified on</div>
            <div className={`date-container`}>
              {new Date(existingThought.modifiedOn).toLocaleDateString()}
            </div>
          </section>
          <section>
            {thoughtButtonMoreActions.map(
              ({ action, title, icon, className }, bIndex) => (
                <button key={bIndex} className={className} onClick={action}>
                  {icon} {title}
                </button>
              )
            )}
          </section>
        </section>
      </article>
    </>
  );
}
