import { getThoughts, postThoughts } from "api/thoughts";
import { useAppContext } from "App";
import { FormEvent, useState } from "react";

export default function UploadDownloadThoughts() {
  const { appUser, thoughtState, thoughtDispatch, thoughtId, setThoughtId } =
    useAppContext();
  const [queryStatus, setQueryStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleLocalUpload = async () => {
    setQueryStatus("loading");

    let localThoughtId = thoughtId;
    if (!localThoughtId) {
      const thoughts = await getThoughts(appUser?.user.fields.userId ?? 0);

      if (thoughts.error) {
        console.log("error", thoughts);
        setQueryStatus("error");
      } else {
        console.log("thoughts", thoughts);
        setThoughtId(thoughts.id);
        localThoughtId = thoughts.id;
      }
    }

    try {
      const sendThoughts = await postThoughts(
        localThoughtId,
        thoughtState,
        appUser?.user.fields.userId ?? 0
      );

      setQueryStatus("success");

      console.log("post suc", sendThoughts);
    } catch (error) {
      console.log("post error", error);
      setQueryStatus("error");
    }
  };

  const handleDownloadThoughts = async () => {
    setQueryStatus("loading");
    const thoughts = await getThoughts(appUser?.user.fields.userId ?? 0);
    if (thoughts.error) {
      console.log("download error", thoughts);
      setQueryStatus("error");
    } else {
      console.log("download thoughts", thoughts);
      setThoughtId(thoughts.id);
      thoughtDispatch({
        type: "OFFLINE_UPLOAD",
        payload: thoughts.thoughts,
      });
      setQueryStatus("success");
    }
  };

  return (
    <div className="export-button-row">
      <button type="button" className="form-button" onClick={handleLocalUpload}>
        Upload Local Thoughts
      </button>{" "}
      |{" "}
      <button
        type="button"
        className="form-button"
        onClick={handleDownloadThoughts}
      >
        Download Remote Thoughts
      </button>
    </div>
  );
}
