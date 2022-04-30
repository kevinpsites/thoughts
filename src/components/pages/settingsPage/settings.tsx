import React, { useEffect, useState } from "react";
import ToggleSwitch from "components/common/toggleSwitch";
import { useAppContext } from "App";
import {
  convertThoughtFromRaw,
  downloadFile,
} from "commonFunctions/fileFunctions";

function SettingsPage() {
  const { offlineMode, setOfflineMode, thoughtState } = useAppContext();
  const handleOfflineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOfflineMode(e.target.checked);
  };

  const [jsonURL, setJSONUrl] = useState("");
  const [textURL, setTextUrl] = useState("");

  const generateJSONURLLink = async () => {
    setJSONUrl(await downloadFile(thoughtState, "json"));
  };

  const generateTextURLLink = async () => {
    let finalThoughString = "";

    thoughtState.thoughts.forEach((thought) => {
      let rawString = convertThoughtFromRaw(thought);
      finalThoughString += rawString + "\n\n\n";
    });

    setTextUrl(await downloadFile(finalThoughString, "text"));
  };

  useEffect(() => {
    if (thoughtState) {
      generateJSONURLLink();
      generateTextURLLink();
    }
  }, [thoughtState]);

  return (
    <>
      <h1>Settings</h1>
      <article className="body ">
        <section className="settings-page">
          <div>
            <span>Offline Mode:</span>
            <ToggleSwitch
              htmlFor="offline-mode"
              onChange={handleOfflineChange}
              initialValue={offlineMode}
            />
          </div>

          <div className="export-button-row">
            <button>
              {jsonURL && (
                <a href={jsonURL} download={"thoughts.json"}>
                  Export Thoughts as JSON
                </a>
              )}
            </button>{" "}
            |
            <button>
              {textURL && (
                <a href={textURL} download={"thoughts.txt"}>
                  Export Thoughts as Text
                </a>
              )}
            </button>
          </div>
        </section>
      </article>
    </>
  );
}

export default SettingsPage;
