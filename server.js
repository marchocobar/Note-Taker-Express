const express = require('express');
const path = require('path');
const notes = require('./db/db.json');

const app = express();
const PORT = 3001;


app.use(express.static('public'));
