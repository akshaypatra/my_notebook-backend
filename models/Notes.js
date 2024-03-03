const mongoose=require('mongoose');
const {Schema}=require('mongoose');

const NotesSchema = new Schema({
    notes:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    tag:{
        type: String,
        default:"General"
    },
    date:{
        type:Date,
        default:Date.now
    }

});

module.exports= mongoose.model('notes',NotesSchema);