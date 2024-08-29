const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let users = []

//get all users
app.get('/users', (req, res) => {
    res.status(200).send(users);
});

//get single user
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    res.status(200).send(users[id]);
});

//search user
app.get('/users/search', (req, res) => {
    const nama = req.query.nama;
    const user = users.find(user => user.name === nama);
    res.status(200).send(user);
});

//create user
app.post('/users', (req, res) => {
    const user = req.body;
    users.push(user);
    res.status(200).send(user);
});

//update user
app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const user = req.body;
    users[id] = user;
    res.status(200).send(user);
});

//delete user
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    users.splice(id, 1);
    res.status(200).send(users);
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
