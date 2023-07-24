const http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;

const mongoUri = 'mongodb+srv://stbeaudette:aoFxtSTNG5rJvheP@cluster0.jfily95.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB Atlas connection URI

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (req.method === 'POST' && pathname === '/register') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const { email, password } = JSON.parse(body);

      MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
        if (err) {
          console.log('Failed to connect to MongoDB:', err);
          res.statusCode = 500;
          res.end('Failed to connect to MongoDB.');
          return;
        }

        const db = PlayerDataDB.db();
        const collection = db.collection('PlayerDataCollection');

        collection.insertOne({ email: email, password: password }, function(err, result) {
          if (err) {
            console.log('Failed to insert document:', err);
            res.statusCode = 500;
            res.end('Failed to register user.');
          } else {
            console.log('User registered successfully:', result.ops[0]);
            res.statusCode = 200;
            res.end('Registration successful!');
          }

          client.close();
        });
      });
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

const port = 8080; // Set the desired port number

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
