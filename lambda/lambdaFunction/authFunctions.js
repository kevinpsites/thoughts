// import { airTableRequest } from "./index";
// import { generateString } from "./textFunctions";

const { usersTable } = require("./appSettings");
const airtableFunctions = require("./airtableFunctions");
const { airTableRequest } = airtableFunctions;
const { generateString } = require("./textFunctions");

const generateNewToken = async (userId) => {
  // create new token
  let currentTime = new Date();
  let newTTL = currentTime.setHours(currentTime.getHours() + 12);
  newTTL = new Date(newTTL);

  const newUser = {
    id: userId,
    fields: {
      currentToken: `_${generateString(100)}`,
      ttl: newTTL.toISOString(),
    },
  };

  const newToken = await airTableRequest("PATCH", usersTable, "", newUser);

  if (newToken.records.length === 0) {
    return { error: "Error creating token" };
  }

  return {
    ...newUser.fields,
  };
};

module.exports.generateNewToken = generateNewToken;
