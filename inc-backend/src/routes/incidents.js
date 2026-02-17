const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Get all incidents (excludes soft-deleted incidents)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM incidents WHERE deletedAt IS NULL ORDER BY id ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching incidents:", err);
    res.status(500).json({ message: "Failed to fetch incidents" });
  }
});

// Get single incident by incidentNumber (excludes soft-deleted incidents)
router.get("/:incidentNumber", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM incidents WHERE incidentNumber = ? AND deletedAt IS NULL",
      [req.params.incidentNumber]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Incident not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching incident:", err);
    res.status(500).json({ message: "Failed to fetch incident" });
  }
});

// Create incident
router.post("/", async (req, res) => {
  const {
    incidentNumber,
    assignedTo,
    status,
    assignedDate,
    expectedToComplete,
    completedDate,
  } = req.body;

  try {
    const [result] = await pool.execute(
      `
      INSERT INTO incidents 
        (incidentNumber, assignedTo, status, assignedDate, expectedToComplete, completedDate)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        incidentNumber,
        assignedTo,
        status,
        assignedDate,
        expectedToComplete,
        completedDate,
      ]
    );

    const [rows] = await pool.execute(
      "SELECT * FROM incidents WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating incident:", err);
    res.status(500).json({ message: "Failed to create incident" });
  }
});

// Update incident by incidentNumber (from URL)
router.put("/:incidentNumber", async (req, res) => {
  const { incidentNumber: currentIncidentNumber } = req.params;
  const {
    incidentNumber,
    assignedTo,
    status,
    assignedDate,
    expectedToComplete,
    completedDate,
  } = req.body;

  try {
    const [result] = await pool.execute(
      `
      UPDATE incidents
      SET incidentNumber = ?, assignedTo = ?, status = ?, assignedDate = ?, expectedToComplete = ?, completedDate = ?
      WHERE incidentNumber = ?
    `,
      [
        incidentNumber,
        assignedTo,
        status,
        assignedDate,
        expectedToComplete,
        completedDate,
        currentIncidentNumber,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Incident not found" });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM incidents WHERE incidentNumber = ?",
      [incidentNumber]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating incident:", err);
    res.status(500).json({ message: "Failed to update incident" });
  }
});

// Soft delete incident by incidentNumber
router.delete("/:incidentNumber", async (req, res) => {
  const { incidentNumber } = req.params;
  const { deletedBy } = req.body;

  try {
    const [result] = await pool.execute(
      "UPDATE incidents SET deletedAt = CURRENT_TIMESTAMP, deletedBy = ? WHERE incidentNumber = ? AND deletedAt IS NULL",
      [deletedBy || null, incidentNumber]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting incident:", err);
    res.status(500).json({ message: "Failed to delete incident" });
  }
});

module.exports = router;

