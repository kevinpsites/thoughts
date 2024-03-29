import React, { useEffect, useState } from "react";
import ToggleSwitch from "components/common/toggleSwitch";
import { useAppContext } from "App";
import { downloadFile } from "commonFunctions/fileFunctions";
import BackButton from "components/common/backButton";
import HiddenFileLabelInput from "components/common/formComponents/labelInput/hiddenFileLabelInput";
import { convertThoughtFromRaw } from "commonFunctions/textFunctions";
import LabelInput from "components/common/formComponents/labelInput";
import LoginComponent from "./components/loginComponent";
import UploadDownloadThoughts from "./components/uploadDownloadThoughts";

const fieldName = "thoughts";
function SettingsPage() {
  const {
    offlineMode,
    setOfflineMode,
    thoughtState,
    thoughtDispatch,
    appUser,
  } = useAppContext();
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

  const uploadData = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    if (files && files.length > 0 && files[0].type === "application/json") {
      let file = files[0];

      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = (data: any) => {
        thoughtDispatch({
          type: "OFFLINE_UPLOAD",
          payload: JSON.parse(data.target.result),
        });
      };
      // TO-DO - Add notification
    }
  };

  useEffect(() => {
    if (thoughtState) {
      generateJSONURLLink();
      generateTextURLLink();
    }
  }, [thoughtState]);

  return (
    <>
      <BackButton />
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

          <LoginComponent />

          {appUser?.user.fields.phone && <UploadDownloadThoughts />}

          <div className="export-button-row">
            <button type="button" className="form-button">
              {jsonURL && (
                <a
                  href={jsonURL}
                  download={`thoughts-${new Date().toISOString()}.json`}
                >
                  Export Thoughts as JSON
                </a>
              )}
            </button>{" "}
            |
            {/* {textURL && (
              <>
                <button>
                  <a
                    href={textURL}
                    download={`thoughts-${new Date().toISOString()}.txt`}
                  >
                    Export Thoughts as Text
                  </a>
                </button>
                |
              </>
            )} */}
            <HiddenFileLabelInput
              label={fieldName}
              For={fieldName}
              name={fieldName}
              InputWidth={`small`}
              type={"file"}
              children={undefined}
              fieldValue={fieldName}
              onFormSubmit={uploadData}
              uploadText={"Upload Thoughts"}
            />
          </div>
        </section>
      </article>
    </>
  );
}

export default SettingsPage;
