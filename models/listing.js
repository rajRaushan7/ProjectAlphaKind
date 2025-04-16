const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notesSchema = new Schema({
    semester :{
        type: String,
        required: true,
    },
    subject : String,
    chapterName: String,
    image : {
        type : String,
        set : (v) => v === "" ? "https://cdn.pixabay.com/photo/2013/07/18/10/55/dna-163466_1280.jpg": v,
        default: "https://cdn.pixabay.com/photo/2013/07/18/10/55/dna-163466_1280.jpg"
    },
    path : String,
});

const Note = mongoose.model("Note", notesSchema);
module.exports = Note;