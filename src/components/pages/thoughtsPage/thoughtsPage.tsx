import { useEffect, useRef, useState } from "react";
import { useAppContext } from "App";
import { Link, useNavigate } from "react-router-dom";
import ThoughtDisplayBox from "components/common/thoughtBoxes/thoughtDisplayBox";
import { Thought } from "types/globalTypes";
import appSettings from "appSettings.json";
import ScrollButton from "components/common/scrollButton";
import { ReactComponent as Star } from "icons/star.svg";
import { ReactComponent as Reverse } from "icons/reverse.svg";

export default function ThoughtsPage() {
  const { thoughtState, clearThread, findThreads } = useAppContext();
  const pageRef = useRef<HTMLHeadingElement>(null);
  let navigate = useNavigate();

  const [reverse, setReverse] = useState(false);
  const toggleReverse = () => setReverse(!reverse);

  const commonThreads = findThreads();

  const addToThread = (thought: Thought) => {
    navigate(
      `${appSettings.routes.thread}/${
        thought.threadParent ? thought.threadParent.id : thought.thoughtId
      }`
    );
  };

  const orderingOfCommonThreads = (reverse?: boolean) => {
    let items = [...commonThreads];

    return reverse
      ? items.reverse().map((t, tIndex) => (
          <Link to={`${appSettings.routes.thread}/${t.thoughtId}`} key={tIndex}>
            <li>{t.title}</li>
          </Link>
        ))
      : items.map((t, tIndex) => (
          <Link to={`${appSettings.routes.thread}/${t.thoughtId}`} key={tIndex}>
            <li>{t.title}</li>
          </Link>
        ));
  };

  useEffect(() => {
    clearThread();
    pageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  return (
    <>
      <h1 ref={pageRef}>Thoughts</h1>

      {thoughtState.thoughts.length > 0 ? (
        <article className={`thought-page body`}>
          <section className={`common-threads-container`}>
            <div>
              <h4>Common Threads</h4>
              <Reverse onClick={toggleReverse} />
            </div>
            <ul>
              {
                <Link to={appSettings.routes.favorites} className={`d-flex`}>
                  <Star />
                </Link>
              }
              {orderingOfCommonThreads(reverse)}
            </ul>
          </section>
          {thoughtState.thoughts.map((thought, tIndex) => (
            <ThoughtDisplayBox
              key={tIndex}
              existingThought={thought}
              addToThreadParent={addToThread}
              tabChild={true}
            />
          ))}
          <ScrollButton />
        </article>
      ) : (
        <article className={`thought-page body`}>
          <h4 className="empty-thoughts">No thoughts, try adding one</h4>
        </article>
      )}
    </>
  );
}
