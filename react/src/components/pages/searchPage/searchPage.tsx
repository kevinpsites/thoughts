import React, { useRef, useState } from "react";
import { useAppContext } from "App";
import { Link, useNavigate, useParams } from "react-router-dom";
import ThoughtDisplayBox from "components/common/thoughtBoxes/thoughtDisplayBox";
import { Thought } from "types/globalTypes";
import { ReactComponent as BackArrow } from "icons/arrowBack.svg";
import { useEffect } from "react";
import LabelInput from "components/common/formComponents/labelInput";
import { findTextRegex } from "commonFunctions/textFunctions";

export default function SearchPage() {
  const { thoughtState } = useAppContext();
  let navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  const addToThread = (thought: Thought) => {
    navigate(
      `/thread/${
        thought.threadParent ? thought.threadParent : thought.thoughtId
      }`
    );
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [searchList, setSearchList] = useState<Thought[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let tempSearchTerm = e.target.value;
    setSearchTerm(tempSearchTerm);

    if (!tempSearchTerm) {
      setSearchList([]);
      searchRef.current?.focus();
      return;
    }

    let newList: Thought[] = [];
    thoughtState.thoughts.forEach((thought) => {
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

    setSearchList([...newList]);
    searchRef.current?.focus();
  };

  return (
    <>
      <Link to={"/"} className="back-button">
        <BackArrow />
      </Link>
      <h1>Search</h1>

      <article className={`search-page body`}>
        <LabelInput
          variant={"search"}
          label={"Permission"}
          placeholder={"Search"}
          children={null}
          For={"Search"}
          name={"Search"}
          InputWidth={`large`}
          type={"search"}
          value={searchTerm}
          onChange={handleSearch}
          autoFocus
          ref={searchRef}
        />
        {searchList.map((thought, tIndex) => (
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
