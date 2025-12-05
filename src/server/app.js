const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the client/public directory
app.use(express.static(path.join(__dirname, '../client/public')));
// Serve client source files (for ES modules)
app.use('/src', express.static(path.join(__dirname, '../client/src')));

module.exports = app;
