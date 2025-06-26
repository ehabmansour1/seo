const axios = require("axios");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { keywords, location_code, language_code = "en" } = req.body;

  if (!keywords || !location_code) {
    return res
      .status(400)
      .json({ error: "keywords and location_code are required" });
  }

  const API_USERNAME = process.env.API_USERNAME;
  const API_PASSWORD = process.env.API_PASSWORD;

  const post_array = [
    {
      keywords,
      location_code,
      language_code,
      limit: 10,
    },
  ];

  try {
    const response = await axios({
      method: "post",
      url: "https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_ideas/live",
      auth: {
        username: API_USERNAME,
        password: API_PASSWORD,
      },
      data: post_array,
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
};
