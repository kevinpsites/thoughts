import appSettings from "appSettings.json";
import { convertRawApiThought } from "commonFunctions/textFunctions";
import { RawThought, ThoughtState } from "types/globalTypes";

export const getThoughts = async (
  userId: number
): Promise<{
  id: string;
  thoughts: ThoughtState;
  error: string;
  details?: any;
}> => {
  try {
    const res = await fetch(
      `${appSettings.apiAddress}/thoughts?userId=${userId}`
    );

    const json: RawThought = await res.json().then((suc) => suc.thoughts);
    return {
      ...convertRawApiThought(json),
      error: "",
    };
  } catch (error) {
    return {
      id: "",
      thoughts: { thoughts: [] },
      error: "There was an issue",
      details: error,
    };
  }
};

export const postThoughts = async (
  id: string,
  thoughts: ThoughtState,
  userId: number
) => {
  try {
    const res = await fetch(`${appSettings.apiAddress}/thoughts`, {
      method: "post",
      body: JSON.stringify({
        id,
        thoughts: JSON.stringify(thoughts),
        userId,
      }),
    });

    return res.json();
  } catch (error) {
    return { error: "There was an issue", details: error };
  }
};
