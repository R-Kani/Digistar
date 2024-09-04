const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

const db =  require("./database/db");
const query = require("./database/query");
db.connectDB();

let users = [];

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// Route to GET all users - returns the users array as JSON
app.get('/users', (req, res) => {
  query.getAllUsers().then((users) => {
    res.status(200).json(users);
  }).catch((err) => {
    res.status(500).json({message: 'Internal Server Error'});
  });
});

// Route to GET a single user by index
app.get('/users/:id', (req, res) => {
    id = req.params.id;
    query.getUserById(id).then((user)=>{
        if (user){
            res.json(user);
        }else{
            res.status(404).json({message: 'User not found'});
        }
    }).catch((err) => {
        res.status(500).json({message: 'Internal Server Error'});
    });
});

// Route to POST a new user - adds a new user to the users array
app.post('/users', (req, res) => {
    
    query.createUser(req.body).then((user) =>{
        res.status(201).json(user);
    }).catch((err) => {
        res.status(500).json({message: 'Internal Server Error'});
    });
});

// Route to PUT (update) a user by index
app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    query.updateUser(id, req.body).then((user)=> {
        if(user){
            res.json(user);
        }else{
            res.status(404).json({message: 'User not found'});
        }
    }).catch((err) => {
        res.status(500).json({message: 'Internal Server Error'});
    });
});

// Route to DELETE a user by index
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    query.deleteUser(id).then((user)=> {
        if(user){
            res.json();
        }else{
            res.status(404).json({message: 'User not found'});
        }
    }).catch((err) => {
        res.status(500).json({message: 'Internal Server Error'});
    });
});

// Route to search for a user by name
app.get('/search', (req, res) => {
    const name = req.query.name;
    query.searchUserByName(name).then((users) =>{
        res.json(users);
    }).catch((err) => {
        res.status(500).json({message: 'Internal Server Error'});
    });
});

app.listen(PORT, () => {
  console.log(`API server is running at http://localhost:${PORT}`);
});