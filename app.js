const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;

const mongoUrl = 'mongodb+srv://stbeaudette:eNFMWbKxPk4WNAZ5@cluster0.jfily95.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection string

var http = require('http');
var server = http.createServer(app);
var path = require("path");
var helmet = require('helmet');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));
app.use(helmet());

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname,'./index.html'));
});

app.post('/register', (req, res) => {

  console.log("reach DB"); 

   MongoClient.connect(mongoUrl, function(err, client) {
    if (err) {
      console.log('Failed to connect to MongoDB:', err);
      res.status(10).send('Failed to connect to MongoDB.');
      return;
    }    

  const db = client.db();
  const collection = db.collection('PlayerDataCollection');

    collection.insertOne({ email: req.body.id, password: req.body.name }, function(err, result) {
      if (err) {
        console.log('Failed to insert document:', err);
        res.status(500).send('Failed to register user.');
      } else {
        console.log('User registered successfully:', result.ops[0]);
        res.sendStatus(200);
      } 

      client.close();
    });
  });
});

server.listen(3000,function(){ 
  console.log("Server listening on port: 3000");

});