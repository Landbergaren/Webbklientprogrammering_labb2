/* jshint esversion: 6 */
/* jscs:disable maximumLineLength */

const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const clone = require('clone');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.listen(port);

const names = ['Olivia', 'Sophia', 'Amelia', 'Lily', 'Emily', 'Ava', 'Isla', 'Isabella', 'Mia', 'Isabelle', 'Muhammad', 'Oliver', 'Harry', 'Jack', 'George', 'Noah', 'Leo', 'Jacob', 'Oscar', 'Charlie'];
const words = ['vivamus', 'lacinia', 'urna', 'dolor', 'sagittis', 'imperdiet', 'ligula', 'pulvinar', 'a', 'donec', 'ut', 'lacinia', 'justo', 'vivamus', 'tincidunt', 'rhoncus', 'lorem', 'aliquam', 'varius', 'dui', 'nec', 'mollis', 'viverra', 'arcu', 'mi'];

const capitalize = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

const commenter = function () {
  return names[Math.floor(Math.random() * names.length)];
};

const message = function () {
  let res = capitalize(words[Math.floor(Math.random() * words.length)]);
  for (let i = 0; i < 3 + Math.random() * 7; i++)
    res += ' ' + words[Math.floor(Math.random() * words.length)];

  return res;
};

const comment = function (depth = 0, msg = null) {
  if (depth >= 5)
    return {
      id: ('' + Math.random()).substring(2),
      commenter: commenter(),
      message: msg || message(),
      likes: Math.floor(Math.random() * 100),
      creation: new Date(),
      answers: [],
    };

  const answers = [];
  while (Math.random() < Math.pow(2, -depth) && answers.length < 10)
    answers.push(comment(depth + 1));

  return {
    id: ('' + Math.random()).substring(2),
    commenter: commenter(),
    message: msg || message(),
    likes: Math.floor(Math.random() * 100),
    creation: new Date(),
    answers: answers,
  };
};

const comments = [];
for (let i = 0; i < 3 + Math.random() * 7; i++)
  comments.push(comment());

const update = function (id, callback, elem) {
  if (elem && elem.id === id) {
    callback(elem);
    return true;
  }

  let res;
  if (elem && elem.answers)
    for (const answer of elem.answers)
      if (update(id, callback, answer))
        return true;

  if (elem)
    return false;

  for (const answer of comments)
    if (update(id, callback, answer))
      return true;

  return false;
};

const like = function (id) {
  update(id, res => {
    res.likes += 1;
  });
};

const edit = function (id, message) {
  update(id, res => {
    res.message = message;
  });
};

const answer = function (id, message) {
  update(id, res => {
    res.answers.push(comment(5, message));
  });
};

const cutOff = function () {
  const _comments = clone(comments);
  for (let i = 0; i < _comments.length; i++)
    for (let j = 0; j < _comments[i].answers.length; j++)
      for (let k = 0; k < _comments[i].answers[j].answers.length; k++)
        _comments[i].answers[j].answers[k].answers = [];

  return _comments;
};

app.post('/like/:id', function (req, res) {
  const id = req.params.id;
  like(id);
  if (req.body.deep)
    res.json(comments);
  else
    res.json(cutOff());
});

app.post('/comment', function (req, res) {
  const message = req.body.message;

  if (message) {
    comments.push(comment(5, message));
    if (req.body.deep)
      res.json(comments);
    else
      res.json(cutOff());
  } else {
    res.sendStatus(404);
  }
});

app.post('/answer/:id', function (req, res) {
  const id = req.params.id;
  const message = req.body.message;

  let comment;
  if (message) {
    answer(id, message);
  } else {
    res.sendStatus(400);
    return;
  }

  if (req.body.deep)
    res.json(comments);
  else
    res.json(cutOff());
});

app.post('/edit/:id', function (req, res) {
  const id = req.params.id;
  const message = req.body.message;

  let comment;
  if (message) {
    edit(id, message);
  } else {
    res.sendStatus(400);
    return;
  }

  if (req.body.deep)
    res.json(comments);
  else
    res.json(cutOff());
});

app.get('/deep', function (req, res) {
  res.json(comments);
});

app.get('/shallow', function (req, res) {
  res.json(cutOff());
});

console.log(`App listening on port ${port}`);
