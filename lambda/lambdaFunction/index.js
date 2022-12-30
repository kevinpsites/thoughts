const api = require("lambda-api")();

const appSettings = require("./appSettings");
const airtableFunctions = require("./airtableFunctions");
const { airTableRequest } = airtableFunctions;

const authFunctions = require("./authFunctions");
const { generateNewToken } = authFunctions;

const s3Functions = require("./s3Functions");
const { retrieveThoughts, saveThoughts } = s3Functions;

const STAGE_VARIABLE = "/prod";

// Define a route
api.get(`${STAGE_VARIABLE}/status`, async (req, res) => {
  return { status: "ok" };
});

api.get(`${STAGE_VARIABLE}/error`, async (req, res) => {
  return { statusCode: 200, error: "Missing Endpoint", records: [] };
});

api.get(`${STAGE_VARIABLE}/user`, async (req, res) => {
  const query = req.query ?? {};
  const filter = `AND({phone}="${query.userId}",{pin}="${query.pin}")`;

  if ("fields[]" in query && filter) {
    let fields = query["fields[]"].split(",");
    fields.map((field) => (filter += `&fields[]=${field}`));
  }

  const airResponse = await airTableRequest(
    "get",
    appSettings.usersTable,
    filter
  );

  if (airResponse.records.length == 0) {
    return res.status(404).send({ error: "Invalid User", user: {} });
  }

  const newToken = await generateNewToken(airResponse.records[0].id);

  return res.send({
    user: airResponse.records[0],
    token: newToken,
  });

  // return res.send(response);
});

api.get(`${STAGE_VARIABLE}/thoughts`, async (req, res) => {
  const query = req.query ?? {};

  const json = await retrieveThoughts(query.userId);
  return res.send({
    thoughts: json,
  });

  // const filter = `AND({userId}="${query.userId}")`;

  // if ("fields[]" in query && filter) {
  //   let fields = query["fields[]"].split(",");
  //   fields.map((field) => (filter += `&fields[]=${field}`));
  // }

  // const airResponse = await airTableRequest(
  //   "get",
  //   appSettings.thoughtsTable,
  //   filter
  // );

  // if (airResponse.records.length == 0) {
  //   return res.status(404).send({ error: "Invalid Request", user: {} });
  // }

  // return res.send({
  //   thoughts: airResponse.records[0],
  // });
});

api.post(`${STAGE_VARIABLE}/thoughts`, async (req, res) => {
  const query = req.query ?? {};

  const body = req.body;

  const saved = await saveThoughts(body.userId, body.thoughts);

  return res.send({
    thoughts: saved,
  });

  // const airResponse = await airTableRequest(
  //   "PATCH",
  //   appSettings.thoughtsTable,
  //   "",
  //   {
  //     id: body.id,
  //     fields: {
  //       JSON: body.thoughts,
  //       userId: body.userId,
  //     },
  //   }
  // );

  // if (airResponse.records.length == 0) {
  //   return res
  //     .status(404)
  //     .send({ error: "Invalid Request", raw: JSON.stringify(airResponse) });
  // }

  // return res.send({
  //   thoughts: airResponse.records[0],
  // });
});

module.exports.handler = async (event, context) => {
  // check auth somehow?

  return await api.run(event, context);
};

module.exports.airTableRequest = airTableRequest;
