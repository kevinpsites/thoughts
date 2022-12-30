import { getThoughts, postThoughts } from "api/thoughts";
import { useAppContext } from "App";
import { FormEvent, useState } from "react";

export default function UploadDownloadThoughts() {
  const { appUser, thoughtState, thoughtDispatch } = useAppContext();
  const [queryStatus, setQueryStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleLocalUpload = async () => {
    setQueryStatus("loading");

    try {
      const sendThoughts = await postThoughts(
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
      thoughtDispatch({
        type: "OFFLINE_UPLOAD",
        payload: thoughts.thoughts,
      });
      setQueryStatus("success");
    }
  };

  return (
    <div className="export-button-row">
      {queryStatus === "loading" ? (
        "loading"
      ) : (
        <>
          <button
            type="button"
            className="form-button"
            onClick={handleLocalUpload}
          >
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
        </>
      )}

      {queryStatus === "error" ? "ERROR please check logs" : ""}
    </div>
  );
}
