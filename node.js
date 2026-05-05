const express = require("express");
const app = express();

app.use(express.json());

let latestData = {};

app.post("/data", (req, res) => {
  latestData = req.body;
  console.log("📥 Data received:", latestData);
  res.json({ status: "ok" });
});

app.get("/data", (req, res) => {
  res.json(latestData);
});

// Simple dashboard page
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>SIM7600 Dashboard</title>
      </head>
      <body>
        <h1>Live Data</h1>
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
app.listen(PORT, () => console.log("Server running"));
