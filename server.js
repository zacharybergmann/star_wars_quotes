require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const app = express();

const MongoClient = require('mongodb').MongoClient;

let db;
MongoClient.connect(process.env.MONGOURI, (err, database) => {
  if (err) {
    console.error(err)
  } else { 
    db = database;
    app.listen(PORT, function() {
      console.log(`Server is running on ${PORT}`)
    });
  }
});    

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded( {extended: true} ));

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
});

app.post('/quotes', (req, res) => 
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Saved to database!');
      res.redirect('/');
    }
  })
);


