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
    case "OFFLINE_UPLOAD":
      return { thoughts: [...state.thoughts, ...action.payload.thoughts] };
    default:
      return { ...state };
  }
};

export const initialThoughtState: ThoughtState = {
  thoughts: [],
};
