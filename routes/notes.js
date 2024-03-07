const express = require("express");
const Notes = require("../models/Notes");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { query, validationResult } = require("express-validator");

//Route 1: Get all the notes : GET "api/notes/fetchallnotes" .  login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error!");
  }
});

//Route 2: Add a new note : POST "api/notes/addnote" .  login required
router.post(
  "/addnote",
  fetchuser,
  [
    query("title", "Enter a valid title.Atleast 3 characters ").isLength({
      min: 3,
    }),

    query(
      "description",
      "Enter a valid description .Atleast 5 characters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //if there are errors return bad error and the errors
      const result = validationResult(req);
      //here ! is missing below
      if (result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      //creating a new note
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id
      });

      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server Error!");
    }
  }
);

module.exports = router;
