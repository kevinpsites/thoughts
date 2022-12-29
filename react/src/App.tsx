import React, {
  createContext,
  Reducer,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Routes, Route, Link } from "react-router-dom";
import {
  DeviceType,
  AppUser,
  Thought,
  ThoughtActions,
  ThoughtState,
  ThreadParent,
} from "./types/globalTypes";
import "./App.css";
import useDeviceType from "hooks/useDeviceType";
import { ReactComponent as Settings } from "icons/settings.svg";
import NewThoughtPage from "components/pages/newThought.tsx/newThoughtPage";
import ThoughtsPage from "components/pages/thoughtsPage/thoughtsPage";
import SettingsPage from "components/pages/settingsPage/settings";
import { initialThoughtState, thoughtReducer } from "reducers/thoughtReducer";
import NavBar from "components/navbar/navbar";
import appSettings from "appSettings.json";
import useLocalStorageItem from "hooks/useLocalStorageItem";
import useEffectAfterInitialLoad from "hooks/useEffectAfterInitialLoad";
import ThreadPage from "components/pages/threadPage/threadPage";
import SearchPage from "components/pages/searchPage/searchPage";
import { extractCommonTags } from "commonFunctions/textFunctions";

function App() {
  const deviceType = useDeviceType();
  const [getLocalThoughts, setLocalThoughts, clearLocalThoughts] =
    useLocalStorageItem<ThoughtState>("thought-local-thoughts");

  const [getLocalSettings, setLocalSettings] = useLocalStorageItem<{
    settings: { offlineMode: boolean };
  }>("thought-app-settings");
  let localSettings = getLocalSettings();

  const [offlineMode, setOfflineMode] = useState<boolean>(
    localSettings ? localSettings.settings.offlineMode : false
  );

  const [commonTags, setCommonTags] = useState<string[]>([]);

  const [thoughtState, thoughtDispatch] = useReducer<
    Reducer<ThoughtState, ThoughtActions>
  >(thoughtReducer, getLocalThoughts() ?? initialThoughtState);

  const [currentParentThread, setCurrentParentThread] =
    useState<ThreadParent>();

  const findFavorites = () => {
    return thoughtState.thoughts.filter((t) => t.favorite);
  };

  const findThought = (thoughtId: string): Thought | undefined => {
    return thoughtState.thoughts.find((t) => t.thoughtId === thoughtId);
  };

  const findThreadThoughts = ({
    id,
    title,
    type,
  }: ThreadParent): Thought[] | undefined => {
    setCurrentParentThread({ id, title, type });
    return thoughtState.thoughts.filter(
      (t) => t.thoughtId === id || t.threadParent?.id === id
    );
  };

  const clearThread = () => {
    setCurrentParentThread(undefined);
  };

  const findThreads = (): Thought[] => {
    return thoughtState.thoughts.filter((t) => !t.threadParent);
  };

  const toggleOfflineMode = (newValue: boolean) => {
    setOfflineMode(newValue);

    let finalSettings = {
      ...(localSettings ?? {}),
      settings: {
        ...(localSettings?.settings ?? {}),
        offlineMode: newValue,
      },
    };

    setLocalSettings({ ...finalSettings });
    if (newValue) {
      setLocalThoughts(thoughtState);
    } else {
      clearLocalThoughts();
    }
  };

  useEffectAfterInitialLoad(() => {
    if (offlineMode) {
      setLocalThoughts(thoughtState);
    }
  }, [thoughtState]);

  useEffect(() => {
    setCommonTags(extractCommonTags(thoughtState));
  }, [thoughtState.thoughts.length]);

  return (
    <AppContext.Provider
      value={{
        deviceType,
        appUser: null,
        setAppUser: () => null,
        thoughtState,
        thoughtDispatch,
        findFavorites,
        findThought,
        findThreadThoughts,
        clearThread,
        findThreads,
        offlineMode,
        setOfflineMode: toggleOfflineMode,
        commonTags,
      }}
    >
      <div className="App">
        <Link to={"/settings"} className="settings-button">
          <Settings />
        </Link>
        <Routes>
          <Route
            path={`${appSettings.routes.new}`}
            element={<NewThoughtPage />}
          />
          <Route
            path={`${appSettings.routes.search}`}
            element={<SearchPage />}
          />
          <Route
            path={`${appSettings.routes.settings}`}
            element={<SettingsPage />}
          />
          <Route
            path={`${appSettings.routes.thread}/:threadId`}
            element={<ThreadPage />}
          />
          <Route
            path={`${appSettings.routes.favorites}`}
            element={<ThreadPage favorite={true} />}
          />

          {/* Catch all */}
          <Route path="/" element={<ThoughtsPage />}></Route>
        </Routes>

        <NavBar currentParentThread={currentParentThread} />
      </div>
    </AppContext.Provider>
  );
}

export default App;

export interface MainAppContext {
  deviceType: DeviceType;
  appUser: AppUser | null;
  setAppUser: (user: AppUser | null) => void;
  thoughtDispatch: React.Dispatch<ThoughtActions>;
  thoughtState: ThoughtState;
  findFavorites: () => Thought[];
  findThought: (thoughtId: string) => Thought | undefined;
  findThreadThoughts: (thread: ThreadParent) => Thought[] | undefined;
  clearThread: () => void;
  findThreads: () => Thought[];
  offlineMode: boolean;
  setOfflineMode: (v: boolean) => void;
  commonTags: string[];
}

export const AppContext = createContext<MainAppContext>({
  deviceType: DeviceType.Desktop,
  appUser: null,
  setAppUser: () => null,
  thoughtState: { thoughts: [] },
  findFavorites: () => [],
  thoughtDispatch: (a: ThoughtActions) => null,
  findThought: (t: string) => undefined,
  findThreadThoughts: (thread: ThreadParent) => undefined,
  clearThread: () => null,
  findThreads: () => [],
  offlineMode: false,
  setOfflineMode: (v: boolean) => null,
  commonTags: [],
});
export const useAppContext = () => useContext(AppContext);
