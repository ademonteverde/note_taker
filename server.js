const express = require('express');
const app = express();
const fs = require('fs')
const path = require('path');
const PORT = process.env.PORT || 3000;
const { v4: uuidv4 } = require('uuid')
let notes = require('./db/db.json');

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
  });

// API route to get all notes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    res.json(notes)
  });

// API route to create a new note
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };
        notes.push(newNote); // Push the new note into the global 'notes' array
        const reviewString = JSON.stringify(notes); // Use the 'notes' array
        fs.writeFile(`./db/db.json`, reviewString, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json('Error in writing to JSON file'); // Return an error response
            } else {
                console.log(`Review has been written to JSON file`);
                res.status(201).json(notes); // Return a success response
            }
        });
    } else {
        res.status(400).json('Invalid request body'); // Return a bad request response
    }
});

// API route to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const index = notes.findIndex((note) => note.id === noteId);

  if (index !== -1) {
    notes.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
