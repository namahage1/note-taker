const fs = require('fs');
const path = require("path");
const express = require('express');

const dbJson = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const app = express();

const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));


app.get('/api/notes',(req,res) =>{
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNote = JSON.parse(data);
      res.json(parsedNote);
    }
  })
});

app.get('/notes',(req,res) =>{
  res.sendFile(path.join(__dirname,"./public/notes.html"));
});

app.get('*',(req,res) =>{
  res.sendFile(path.join(__dirname,"./public/index.html"));
});



app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a notes`);
   
   // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuidv4()
      };
  
      // Obtain existing reviews
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNote = JSON.parse(data);
  
          // Add a new review
          parsedNote.push(newNote);
  
          // Write updated reviews back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNote, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
  });
  
  // DELETE route to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const idToDelete = req.params.id;

  // Read the contents of the db.json file
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error reading database file.');
      }

      let notes = JSON.parse(data);

      // Find the index of the note with the matching ID
      const indexToDelete = notes.findIndex(note => note.id === idToDelete);

      if (indexToDelete === -1) {
          return res.status(404).send('Note not found');
      }

      // Remove the note with the matching ID
      notes.splice(indexToDelete, 1);

      // Write the updated list of notes back to the db.json file
      fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Error writing to database file.');
          }

          res.json({ message: 'Note deleted successfully' });
      });
  });
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
  );