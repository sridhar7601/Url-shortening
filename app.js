const express = require('express');
const shortid = require('shortid');
const copyPaste = require('copy-paste');
const app = express();

// Create an object to store the URLs
const urlDatabase = {};

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Shorten URL route
app.post('/shorten', (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = shortid.generate();

  // Store the shortened URL in the database
  urlDatabase[shortURL] = longURL;

  // Return the shortened URL
  res.send({ shortURL: `${req.hostname}/${shortURL}` });
});

// Redirect route
app.get('/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});

// Copy button functionality
const copyToClipboard = (text) => {
  copyPaste.copy(text, () => {
    console.log('Copied to clipboard:', text);
  });
};

app.post('/copy', (req, res) => {
  const shortURL = req.body.shortURL;
  copyToClipboard(shortURL);
  res.send({ message: 'URL copied to clipboard' });
});
