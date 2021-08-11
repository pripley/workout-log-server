let router = require("express").Router();
let Log = require("../db").import("../models/log");
let validateSession = require("../middleware/validate-session");

// Allow user to create log
router.post("/", validateSession, (req, res) => {
  const createLogEntry = {
    description: req.body.log.description,
    definition: req.body.log.definition,
    result: req.body.log.result,
    owner_id: req.user.id,
  };
  Log.create(createLogEntry)
    .then((log) => res.status(200).json(log))
    .catch((err) => res.status(500).json(err));
});

// Get all logs for user
router.get("/", validateSession, (req, res) => {
  Log.findAll({ where: { owner_id: req.user.id } })
    .then((logs) => res.status(200).json(logs))
    .catch((err) => res.status(500).json({ error: err }));
});

// Get log by id for user
router.get("/:id", validateSession, (req, res) => {
  const query = { where: { id: req.params.id, owner_id: req.user.id } };
  Log.findAll(query).then((log) =>
    res
      .status(200)
      .json({ message: "Log found", log: log })
      .catch((err) => res.status(500).json(err))
  );
});

// Update log by user
router.put("/:id", validateSession, function (req, res) {
  const updateLogEntry = {
    description: req.body.log.description,
    definition: req.body.log.definition,
    result: req.body.log.result,
    owner_id: req.user.id,
  };

  const query = { where: { id: req.params.id, owner_id: req.user.id } };

  Log.update(updateLogEntry, query)
    .then((log) =>
      res.status(200).json({ message: "Log entry updated", logUpdates: log })
    )
    .catch((err) => res.status(500).json(err));
});

// Delete entry by user
router.delete("/:id", validateSession, function (req, res) {
  const query = { where: { id: req.params.id, owner_id: req.user.id } };

  Log.destroy(query)
    .then(() => res.status(200).json({ message: "Log entry removed" }))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
