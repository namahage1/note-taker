const fs = require('fs');
const path = require("path");
const express = require('express');

const dbJson = require('./db/db.json');
const PORT = 3001;
const app = express();

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
       // review_id: uuid(),
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
  

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
  );