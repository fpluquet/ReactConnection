const express = require('express');
const cors = require('cors')
const fs = require("fs");
const bcrypt = require("bcrypt");
const { randomBytes } = require('crypto');
const app = express();

app.use(express.json());
app.use(cors());

const usersFile = "./users.json";
function getUsers() {
  let users;
  try {
    users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
  } catch (e) {
    users = [];
    for(let i = 0; i < 10; i++) {
      users.push({
        id: i,
        username: `User${i}`,
        passwordHash: bcrypt.hashSync(`User${i}`, 10),
        personalData: {
          firstName: `Prénom ${i}`,
          lastName: `Nom ${i}`,
          email: `user${i}@gmail.com`
        }
      })
    }
    saveUsers(users);
  }
  return users;
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

const tokensFile = "./tokens.json";

function getTokens() {
  let tokens;
  try {
    tokens = JSON.parse(fs.readFileSync(tokensFile, "utf8"));
  } catch (e) {
    tokens = [];
    saveTokens(tokens);
  }
  return tokens;
}

function saveTokens(tokens) {
  fs.writeFileSync(tokensFile, JSON.stringify(tokens, null, 2));
}

function saveToken(userId, token) {
  const tokens = getTokens();
  tokens.push({
    userId,
    token
  });
  saveTokens(tokens);
}

function generateToken() {
  return new Promise((resolve, reject) => {
    randomBytes(60, (err, buf) => {
      if (err) return reject(err);
      resolve(buf.toString('hex'));
    });
  })
}

app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const users = getUsers();
  const user = users.find(user => user.username === username);
  console.log(user, password)
  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    // générer un token aléatoire
    const token = await generateToken();
    // sauvegarder le token
    saveToken(user.id, token);
    // renvoyer le token au client
    res.json({
      id: user.id,
      username: user.username,
      token: token
    });
  } else {
    res.status(401).json({
      error: 'Incorrect username or password'
    });
  }
});

function getUserFromReq(req) {
  const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
  const tokens = getTokens();
  const tokenData = tokens.find(tokenData => tokenData.token === token);
  if (tokenData) {
    const users = getUsers();
    const user = users.find(user => user.id === tokenData.userId);
    if (user) {
      return user;
    }
  }
  throw new Error('Invalid token');
}

app.get('/me', (req, res) => {
  try {
    const user = getUserFromReq(req);
    res.json({
      id: user.id,
      username: user.username,
      personalData: user.personalData
    });
  } catch (e) {
    res.status(401).json({
      error: e.message
    });
  }
})

app.listen(8080, () => console.log('API is running on http://localhost:8080/login'));
