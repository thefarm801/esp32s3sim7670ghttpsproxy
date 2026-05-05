const express = require("express");
const app = express();

app.use(express.json());

// store latest sensor data in memory
let latest = {
  temp: null,
  humidity: null,
  time: null
};

// receive ESP32 data
app.post("/data", (req, res) => {
  console.log("Received:", req.body);

  latest = {
    temp: req.body.temp,
    humidity: req.body.humidity,
    time: new Date().toISOString()
  };

  res.json({ status: "ok" });
});

// API endpoint for webpage
app.get("/data", (req, res) => {
  res.json(latest);
});

// simple dashboard
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>ESP32 Sensor Dashboard</title>
</head>
<body>
  <h1>Live Sensor Data</h1>
  <pre id="out">Loading...</pre>

  <script>
    async function load() {
      const res = await fetch('/data');
      const data = await res.json();
      document.getElementById('out').innerText =
        JSON.stringify(data, null, 2);
    }

    setInterval(load, 2000);
    load();
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
