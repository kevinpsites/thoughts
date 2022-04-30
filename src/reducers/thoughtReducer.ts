import { ThoughtActions, ThoughtState } from "types/globalTypes";

export const thoughtReducer = (
  state: ThoughtState,
  action: ThoughtActions
): ThoughtState => {
  switch (action.type) {
    case "ADD_THOUGHT":
      return { thoughts: [...state.thoughts, action.payload.thought] };
    case "EDIT_THOUGHT":
      let existingThoughtIndex = state.thoughts.findIndex(
        (t) => t.thoughtId === action.payload.thought.thoughtId
      );
      return {
        thoughts: [
          ...state.thoughts.slice(0, existingThoughtIndex),
          action.payload.thought,
          ...state.thoughts.slice(existingThoughtIndex + 1),
        ],
      };
    case "DELETE_THOUGHT":
      let deleteThoughtIndex = state.thoughts.findIndex(
        (t) => t.thoughtId === action.payload.thoughtId
      );

      return {
        thoughts: [
          ...state.thoughts.slice(0, deleteThoughtIndex),
          ...state.thoughts.slice(deleteThoughtIndex + 1),
        ],
      };
    default:
      return { ...state };
  }
};

export const initialThoughtState: ThoughtState = {
  thoughts: [
    {
      thought:
        '{"blocks":[{"key":"asiod","text":"#IAmHere","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
      title: "my first thought",
      tags: ["IAmHere"],
      thoughtId: "9551bc83-981e-4961-a025-1b1afdb1bfdc",
      createdOn: new Date().toUTCString(),
      modifiedOn: new Date().toUTCString(),
    },
  ],
};
