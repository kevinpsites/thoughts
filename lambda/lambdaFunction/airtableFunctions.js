const axios = require("axios");

const airTableRequest = async (method = "GET", table, filter, body) => {
  const fetchHeaders = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIR_TABLE_KEY}`,
    },
  };

  if (method !== "get" && body) {
    fetchHeaders.data = JSON.stringify({
      records: [body],
    });
  }

  const url = `https://api.airtable.com/v0/${
    process.env.AIR_TABLE_PROJECT
  }/${table}${
    filter
      ? filter.includes("fields")
        ? `?${filter}`
        : filter.includes("records")
        ? `?${filter}`
        : `?filterByFormula=${encodeURIComponent(filter)}`
      : ""
  }`;

  console.log("url", url);

  return await axios
    .request({
      url,
      ...fetchHeaders,
    })
    .then((res) => res.data)
    .catch((err) => {
      return {
        records: [],
        url: url,
        error: JSON.stringify(err?.response?.data),
        body: [fetchHeaders.data],
      };
    });
};

module.exports.airTableRequest = airTableRequest;
