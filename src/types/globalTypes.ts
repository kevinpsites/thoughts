export enum DeviceType {
  Tablet = "tablet",
  Mobile = "mobile",
  Desktop = "desktop",
}

export interface AppUser {
  email: string;
  name: string;
}

export interface reducerAction {
  type: string;
  payload: any;
}

export interface Thought {
  thought: string;
  title: string;
  tags: string[];
  thoughtId: string;
  threadParent?: ThreadParent;
  createdOn: string;
  modifiedOn: string;
  type?: ThoughtType;
  favorite?: boolean;
}

export type ThoughtType = "Thought" | "Book";

export interface ThreadParent {
  id: string;
  title: string;
  type?: ThoughtType;
}

export type Reducer<S, A> = (prevState: S, action: A) => S;

export interface ThoughtState {
  thoughts: Thought[];
}

export type ThoughtActions =
  | { type: "ADD_THOUGHT"; payload: { thought: Thought } }
  | { type: "EDIT_THOUGHT"; payload: { thought: Thought } }
  | { type: "DELETE_THOUGHT"; payload: { thoughtId: string } }
  | { type: "OFFLINE_UPLOAD"; payload: ThoughtState };
