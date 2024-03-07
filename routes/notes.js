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


//Route 3: Update existing  notes : PUT "api/notes/updatenote" .  login required
router.put(
    "/updatenote/:id",
    fetchuser,
    async (req, res) => {

        try {
            
        
        const {title,description,tag}=req.body;

        //create a newNote object
        const newNote={};
        if(title){newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};

        //find the note to update and updating it
        let note=await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not found")
        }

        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not allowed")
        }

        note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
        res.json({note});
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server Error!");
        }
    });


//Route 4: Deleting existing  note : DELETE "api/notes/deletenote" .  login required
router.delete(
    "/deletenote/:id",
    fetchuser,
    async (req, res) => {

        try {
            


        //find the note to delete and deleting it
        let note=await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not found")
        }

        //Allow deletion if user own this note
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not allowed")
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success":"Note has been deleted",note:note});
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server Error!");
        }
    });

module.exports = router;
