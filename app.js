// REQURING ALL FILES

const express = require("express");
const mongoose = require("mongoose");
const Note = require("./models/listing.js"); // data Schema
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const multer = require("multer");
const fs = require("fs");

const app = express();
// ---------------------------------------------------------------------------------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {  // KON SE FOLDER KE ANDAR FILE KO STORE KERNA HAI
        return cb(null, './public/uploads');  // cb is CALL BACK
      },
      filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`); 
      },
});

const upload = multer({ storage });

// ---------------------------------------------------------------------------------------
// CONNECT OT DATABASE 

main().then(() => {
    console.log("connecting to DataBase");
}).catch((err) => {
    console.log(err);
});


async function main() {
    await mongoose.connect("mongodb+srv://raj1618192:zNZufSheuGHCIZbp@cluster0.mbphveh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
};
// -----------------------------------------------------------------------------------------------------
// APP.SET

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use("/public/uploads", express.static(path.join(__dirname, "public/uploads")));
// -----------------------------------------------------------------------------------------------------
//  ALL APIs

// HOME ROUTE
app.get('/' , (req, res) => {
    res.render('listing/home.ejs');
})

// SEMESTER ROUTE
app.get('/semester', (req, res) => {
    res.render('listing/semester.ejs');
});

// SUBJECT ROUTE
app.get('/subjects', async (req, res) => {
    let id = req.query.id;
    let allNotes = await Note.find({ semester: `${id}`});
    res.render('listing/subjects.ejs', {id, allNotes});
});

// NOTES ROUTE
app.get('/notes', async (req, res) => {
    let sub = req.query.sub;
    let allNotes = await Note.find({ subject: `${sub}` });
    res.render("listing/notes.ejs", { allNotes });
});

// ALL NOTES ROUTE
app.get("/all-notes", async(req, res) => {
    let allNotes = await Note.find({});
    res.render("listing/all-notes.ejs", {allNotes});
})
app.get("/all-notes/delete", async(req, res) => {
    let allNotes = await Note.find({});
    res.render("listing/all-notes-delete.ejs", {allNotes});
})

// OPEN NOTES ROUTE
app.get('/show-notes', async (req, res) => {
    let path = req.query.path;
    res.render("listing/open-notes", {path});
});

// DOWNLOAD NOTES
app.get("/download", (req, res) => {
    let path = req.query.path;
    res.download(`./public/${path}`);
});

// DELETE ROUTE
app.delete("/notes/:id", async (req, res) => {
    let {id} = req.params;  // id created by database
    let notes = await Note.findById(id);
    let originalPath = notes.path;
    let path = "public/" + originalPath;
    fs.unlinkSync(path); // delete file from folder
    const referer = req.get("Referer");
    await Note.findByIdAndDelete(id);
    res.redirect(referer || "/");
});

// UPLOAD ROUTE
app.get("/upload-file", (req, res) => {
    res.render("listing/upload-file.ejs");
});
app.post("/upload-file", upload.single("pdf"), (req, res) => {
    let originalPath = req.file.path;
    let path = originalPath.replace("public/", "");
    res.render("listing/upload", {path});
});

app.post("/upload", async (req, res) => {
    const newNote = new Note(req.body.listing);
    await newNote.save();
    res.redirect("/all-notes");
});

// EDIT
app.get("/edit/:id", async (req, res) => {
    let { id } = req.params;
    let notes = await Note.findById(id);
    res.render("listing/edit.ejs", {notes});
});
app.put("/notes/:id", async (req, res) => {
    let {id} = req.params;
    await Note.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/all-notes/delete");
})
// ------------------------------------------------------------------------------------------

const port = process.env.PORT || 3031;
app.listen(port, () => {
    console.log("app is listening to port: 3031");
});