import appSettings from "appSettings.json";

export const checkUser = async (phone: string, pin: string) => {
  try {
    const res = await fetch(
      `${appSettings.apiAddress}/user?userId=${phone}&pin=${pin}`
    );

    return res.json();
  } catch (error) {
    return { error: "There was an issue", details: error };
  }
};
