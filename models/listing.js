const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    pdfURL: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    // uploadedAt: {
    //     type: Date,
    //     default: Date.now
    // }
});

const Note = mongoose.model("Note", notesSchema);
module.exports = Note;