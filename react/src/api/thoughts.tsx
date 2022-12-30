import appSettings from "appSettings.json";
import { convertRawApiThought } from "commonFunctions/textFunctions";
import { RawThought, ThoughtState } from "types/globalTypes";

export const getThoughts = async (
  userId: number
): Promise<{
  thoughts: ThoughtState;
  error: string;
  details?: any;
}> => {
  try {
    const res = await fetch(
      `${appSettings.apiAddress}/thoughts?userId=${userId}`
    );

    const json: ThoughtState = await res
      .json()
      .then((suc) => JSON.parse(suc.thoughts))
      .then((suc) => JSON.parse(suc));

    return {
      thoughts: json,
      error: "",
    };
  } catch (error) {
    return {
      thoughts: { thoughts: [] },
      error: "There was an issue",
      details: error,
    };
  }
};

export const postThoughts = async (thoughts: ThoughtState, userId: number) => {
  try {
    const res = await fetch(`${appSettings.apiAddress}/thoughts`, {
      method: "post",
      body: JSON.stringify({
        thoughts: JSON.stringify(thoughts),
        userId,
      }),
    });

    return res.json();
  } catch (error) {
    return { error: "There was an issue", details: error };
  }
};
