import {
  ChangeEvent,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import { useAppContext } from "App";
import { useNavigate, useParams } from "react-router-dom";
import ThoughtDisplayBox from "components/common/thoughtBoxes/thoughtDisplayBox";
import { Thought } from "types/globalTypes";
import { useEffect } from "react";
import BackButton from "components/common/backButton";
import {
  extractCommonTagsAndCount,
  findTextRegex,
  threadDisplayName,
} from "commonFunctions/textFunctions";
import ScrollButton from "components/common/scrollButton";
import { ReactComponent as Search } from "icons/search.svg";
import { ReactComponent as Close } from "icons/close.svg";

export default function ThreadPage({ favorite }: { favorite?: boolean }) {
  const pageRef = useRef<HTMLHeadingElement>(null);
  const topDivRef = useRef<HTMLDivElement>(null);
  const { findThought, findThreadThoughts, findFavorites } = useAppContext();
  let { threadId } = useParams<{ threadId: string }>();
  let navigate = useNavigate();
  const [commonTags, setCommonTags] = useState<{ [key: string]: number }>({});

  let tempParentThought = findThought(threadId ?? "");
  const [parentThought, setParentThought] = useState<Thought | undefined>(
    tempParentThought
  );

  const [threadThoughts, setThreadThoughts] = useState<Thought[]>([]);

  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchThoughtsList, setSearchThoughtsList] = useState<Thought[]>([]);

  const addToThread = (thought: Thought) => {
    navigate(
      `/thread/${
        thought.threadParent ? thought.threadParent : thought.thoughtId
      }`
    );
  };

  const handleFindingThread = (tempParentThought: Thought) => {
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

    setCommonTags({
      ...extractCommonTagsAndCount({ thoughts: foundThreadThoughts ?? [] }),
    });
    setThreadThoughts([...(foundThreadThoughts ?? [])]);
  };

  const handleSearching = (forceSearch?: boolean) => {
    if (forceSearch) {
      setSearching(true);
      setSearchThoughtsList([...threadThoughts.slice(1)]);
      return;
    } else if (forceSearch === false) {
      setSearching(false);
      setSearchThoughtsList([]);

      return;
    }

    if (searching) {
      setSearching(false);
      setSearchThoughtsList([]);

      return;
    }

    setSearching(true);
    setSearchThoughtsList([...threadThoughts.slice(1)]);
  };

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const findSearchThoughts = (e: {
    currentTarget: { value: string };
    key: string;
  }) => {
    if (e.key !== "Enter") {
      return;
    }

    let tempSearchTerm = e.currentTarget.value;
    if (!tempSearchTerm) {
      setSearchThoughtsList([]);
      return;
    }

    let newList: Thought[] = [];
    threadThoughts.forEach((thought) => {
      let titleMatch = findTextRegex(tempSearchTerm, thought.title);
      let bodyMatch = findTextRegex(tempSearchTerm, thought.thought);
      let parentMatch = findTextRegex(
        tempSearchTerm,
        thought.threadParent?.title ?? ""
      );

      if (titleMatch || bodyMatch || parentMatch) {
        newList.push(thought);
      }
    });

    setSearchThoughtsList([...newList]);
  };

  const searchHashTag = (tag: string) => {
    let finalTag = tag[0] === "#" ? tag : `#${tag}`;
    setSearchTerm(finalTag);
    handleSearching(true);
    findSearchThoughts({
      key: "Enter",
      currentTarget: {
        value: finalTag,
      },
    });
  };

  const scrollToTop = () => {
    topDivRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    pageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    if (tempParentThought) {
      handleFindingThread(tempParentThought);
    }

    if (favorite) {
      let foundFavorites = findFavorites();
      setCommonTags({
        ...extractCommonTagsAndCount({ thoughts: foundFavorites ?? [] }),
      });
      setThreadThoughts([...foundFavorites]);
    }
  }, [threadId, favorite]);

  return (
    <ThreadContext.Provider
      value={{
        searchHashTag,
      }}
    >
      <>
        <BackButton />
        <h1 ref={pageRef} onClick={() => scrollToTop()}>
          {favorite ? "Favorites" : threadDisplayName(parentThought?.title)}
        </h1>

        <article className={`thought-page body`}>
          {!parentThought && !favorite ? (
            "Loading..."
          ) : (
            <>
              <div ref={topDivRef}></div>
              {threadThoughts.length > 0 && !favorite && (
                <ThoughtDisplayBox
                  key={-1}
                  existingThought={threadThoughts[0]}
                  addToThreadParent={addToThread}
                />
              )}

              {!favorite && (
                <section className={`common-threads-container`}>
                  <div>
                    {searching ? (
                      <>
                        <input
                          placeholder="Search for thoughts"
                          autoFocus
                          onKeyDown={findSearchThoughts}
                          className={`thread-search-box`}
                          key={"search-box"}
                          value={searchTerm}
                          onChange={handleChangeValue}
                        />
                        <button
                          onClick={() => handleSearching()}
                          className={`close-button`}
                          tabIndex={3}
                        >
                          <Close />
                        </button>
                      </>
                    ) : (
                      <>
                        <h4>Thread Tags {"&"} Search</h4>
                        <div>
                          <Search
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSearching()}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <ul>
                    {Object.keys(commonTags).map((tag) => (
                      <li
                        key={tag}
                        className={`draft-decorator-hashtag-style thread-common-tag`}
                        onClick={() => {
                          searchHashTag(tag);
                        }}
                      >
                        #{tag} ({commonTags[tag]})
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {[
                ...(searching
                  ? searchThoughtsList
                  : threadThoughts.slice(favorite ? 0 : 1)),
              ].map((thought, tIndex) => (
                <ThoughtDisplayBox
                  key={tIndex}
                  existingThought={thought}
                  addToThreadParent={addToThread}
                />
              ))}
            </>
          )}

          {threadThoughts.length > 0 && <ScrollButton />}
        </article>
      </>
    </ThreadContext.Provider>
  );
}

export interface ThreadContextObj {
  searchHashTag: (t: string) => void;
}

export const ThreadContext = createContext<ThreadContextObj>({
  searchHashTag: (t: string) => null,
});
export const useThreadContext = () => useContext(ThreadContext);
