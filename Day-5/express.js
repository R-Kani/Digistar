const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { verifyToken } = require("./middlewares/jwt");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 3000;

const db = require("./database/db");
const query = require("./database/query");
db.connectDB();

let users = [];

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to GET all users - returns the users array as JSON
app.get("/users", (req, res) => {
  query
    .getAllUsers()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Route to GET a single user by index
app.get("/users/:id", verifyToken, (req, res) => {
  id = req.params.id;
  query
    .getUserById(id)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Route to POST a new user - adds a new user to the users array
app.post("/register", (req, res) => {
  const user = req.body;
  query.createUser(user).then((user) => {
    res.status(201).json(user);
  });
});

// Route to login user
app.post("/login", async (req, res) => {
  const user = req.body;
  const validUser = await login(user.username, user.password);
  res.status(201).json(validUser);
});

async function login(username, password) {
  const user = await query.searcByUsername(username);
  valid = await bcrypt.compare(password, user[0].password);
  if (!valid) {
    throw new Error("Invalid username or password");
  }
  const key = "secret";
  const token = jwt.sign({ id: user[0]._id }, key, { expiresIn: "1h" });
  return { token: token, user: user[0] };
}

// Route to PUT (update) a user by id
app.put("/users/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  query
    .updateUser(id, req.body)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Route to DELETE a user by id
app.delete("/users/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  query
    .deleteUser(id)
    .then((user) => {
      if (user) {
        res.json();
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// Route to search for a user by name
app.get("/search", verifyToken, (req, res) => {
  const name = req.query.name;
  query
    .searchUserByName(name)
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

app.listen(PORT, () => {
  console.log(`API server is running at http://localhost:${PORT}`);
});
