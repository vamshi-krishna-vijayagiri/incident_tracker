const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");
const incidentsRouter = require("./routes/incidents");
const authRouter = require("./routes/auth");
const assigneesRouter = require("./routes/assignees");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Incident Tracker API" });
});

app.use("/api/incidents", incidentsRouter);
app.use("/api/auth", authRouter);
app.use("/api/assignees", assigneesRouter);

// Start server after database initialization
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });

