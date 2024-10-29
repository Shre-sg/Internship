const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./modules/db');
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(cors());



// Route handlers
app.get('/', (req, res) => {
    res.send('Hello World');
});


// Start the server
app.listen(port, () => {
    console.log(`Listening on PORT ${port}`);
});
