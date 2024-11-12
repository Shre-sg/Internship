const express = require('express');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');

const db = require('./modules/db');
const app = express();
const port = 10423;

//Import route
const loginRoutes = require('./modules/login');
const registerRouter = require('./modules/register');
const logoutRouter = require('./modules/logout');

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'wasssssuppp',
    resave: false,
    saveUninitialized: false,
}));


// Route handlers
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/login', loginRoutes);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);

// Start the server
app.listen(port, () => {
    console.log(`Listening on PORT ${port}`);
});