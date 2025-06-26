const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(express.json());

const API_USERNAME = "support@rankcoda.com";
const API_PASSWORD = "3945f939eaf6483f";

app.post("/get-keyword-ideas", async (req, res) => {
  try {
    const { keywords, location_code, language_code = "en" } = req.body;

    if (!keywords || !location_code) {
      return res
        .status(400)
        .json({ error: "keywords and location_code are required" });
    }

    const post_array = [
      {
        keywords,
        location_code,
        language_code,
        limit: 3,
      },
    ];

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

    res.json(response.data);
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
