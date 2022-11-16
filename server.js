const express = require('express');
const { fstat } = require('fs');
const { request } = require('http');
const path = require('path');
const notesData = require('./db/db.json');
const uuid = require('./helpers/uuid')

const app = express();
const PORT = 3001;


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
app.get('/api/notes', (req, res) => res.json(notesData));

app.post('/api/notes', (req, res) => {
    // Inform the client that their POST request was received
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            notes_id: uuid(),
        };

        const noteString = JSON.stringify(newNote);

        fs.writeFile('./db/db.json', noteString, (err) =>
            err
                ? console.error(err)
                : console.log(
                    `Note has been written to JSON file`
                )
        );
        
        const response = {
            status: 'success',
            body: newReview,
          };
      
          console.log(response);
          res.status(201).json(response);
        } else {
          res.status(500).json('Error in posting review');
        }

    //     readAndAppend(newNote, './db/db.json');
    //     res.json(`Note added successfully 🚀`);
    // } else {
    //     res.error('Error in adding note');
    // }

    // // Log our request to the terminal
    // console.info(`${req.method} request received to add a note`);
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
