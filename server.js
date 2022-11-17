const express = require('express');
const fs = require('fs');
const path = require('path');
const notesData = require('./db/db.json');
const uuid = require('./helpers/uuid');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils')

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.static('public'));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//GET api route for db.json
app.get('/api/notes', (req, res) => 
readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

app.post('/api/notes', (req, res) => {
    // Inform the client that their POST request was received
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        readAndAppend(newNote, './db/db.json');

        
        const response = {
            status: 'success',
            body: newNote,
          };
      
          console.log(response);
          res.status(201).json(response);
        } else {
          res.status(500).json('Error in posting note');
        }


});

app.delete('/api/notes/:id', (req, res) => {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id).toString();

  
    noteList = noteList.filter(selected =>{
        return selected.id != noteId;
    })

    
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
  
});
    


    
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
