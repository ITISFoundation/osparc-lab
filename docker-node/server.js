'use strict';

const express = require('express')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// Application
const app = express()
app.get('/', (req, res) => {
  res.send('Hoi zaeme!')
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
