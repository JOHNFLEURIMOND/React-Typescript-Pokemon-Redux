//server.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const app = express();


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use(express.json());
app.use(express.static('/build'));


// Express serve up index.html file if it doesn't recognize route
app.get('/api/test', (req, res) => {
  console.log('api/test called!')

  res.status(200).send({
    message: 'Hello from the Backend...Pause!!!',
    statusLink: true,
    severity: 'info',
    timestamp: Math.round(new Date().getTime() / 1000)
  });}
);
app.use(bodyParser.json()); // get information from html forms
// Listen to whatever port above.
app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
  });
  