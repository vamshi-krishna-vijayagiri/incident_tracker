const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Get all assignees (master data)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name FROM assignees ORDER BY name ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching assignees:", err);
    res.status(500).json({ message: "Failed to fetch assignees" });
  }
});

module.exports = router;
