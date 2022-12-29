import React, { useState } from "react";
import { getDataLabel } from "commonFunctions/clipBoard";
import LabelInput from "../labelInput";
import styles from "./SearchBox.module.css";

export interface SearchBoxProps {
  originalSearchList: string[];
  searchFilter: (searchTerm: string, permission: string) => boolean;
  addSearchResult: (result: string, rindex: number, searchTerm: string) => void;
  className?: string;
  classOverride?: string;
  placeholder?: string;
}

const SearchBox = ({
  originalSearchList,
  searchFilter,
  addSearchResult,
  className = "",
  classOverride,
  placeholder,
  ...props
}: SearchBoxProps) => {
  const [inputFocus, setInputFocus] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchList, setSearchList] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    let newlist = originalSearchList.filter((p) =>
      searchFilter(e.target.value, p)
    );

    setSearchList([...newlist]);
  };

  const handleAddSearchResult = (e: any) => {
    let dataValue = getDataLabel<string>(e, "data-value");
    let dataIndex = getDataLabel<number>(e, "data-index");

    if (dataValue && dataIndex) {
      addSearchResult(dataValue, dataIndex, searchTerm);

      handleSearch({ target: { value: searchTerm } } as any);
    }
  };

  return (
    <div className={classOverride ?? `search-box-container ${className}`}>
      <LabelInput
        variant={"search"}
        label={"Permission"}
        placeholder={placeholder ?? "Add Permission"}
        children={null}
        For={"Search"}
        name={"Search"}
        InputWidth={`large`}
        type={"search"}
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => {
          setInputFocus(true);
          setSearchList([
            ...originalSearchList.filter((p) => searchFilter("", p)),
          ]);
        }}
        {...props}
      />
      <div
        className={`search-result-list ${
          (searchTerm || inputFocus) && "search-result-list-show"
        }`}
      >
        <span
          className={`search-result-box search-result-box-cancel`}
          onClick={() => {
            setInputFocus(false);
            setSearchTerm("");
          }}
        >
          Cancel
        </span>
        {(searchTerm || inputFocus) &&
          searchList.map(
            (permission, pIndex) =>
              permission.includes(searchTerm.toLowerCase()) && (
                <span
                  key={pIndex}
                  data-value={permission}
                  data-index={pIndex}
                  className={`search-result-box`}
                  onClick={handleAddSearchResult}
                >
                  {permission}
                </span>
              )
          )}
      </div>
    </div>
  );
};

export default SearchBox;
