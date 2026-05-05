const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// CONFIG
const HARBOR_URL =
  "https://harborscale.com/api/v2/ingest/har_49fdfQtQmQMq";

// IMPORTANT: store this safely in production (env var recommended)
const API_KEY = "REPLACE_WITH_YOUR_KEY";

app.post("/telemetry", async (req, res) => {
  try {
    console.log("📥 Incoming data:", req.body);

    const response = await axios.post(HARBOR_URL, req.body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    console.log("✅ Forwarded successfully");

    res.status(response.status).send(response.data);
  } catch (err) {
    console.error("❌ Proxy error:", err.message);

    res.status(500).json({
      error: "Proxy failed",
      details: err.message,
    });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("SIM7600 Proxy is running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${PORT}`);
});
