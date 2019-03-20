require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {ToDo} = require('./models/todo');
const {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.post('/todos', (req, res) => {
    var toDo = new ToDo({
        text: req.body.text
    });
    toDo.save().then((savedToDo) => {
        res.send(savedToDo);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    ToDo.findByIdAndRemove(id).then((toDo) => {
        if (!toDo) res.status(404).send();
        res.status(200).send({toDo});
    }).catch((e) => {
        res.status(400).send(e)
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    ToDo.findById(id).then((toDo) => {
        if (!toDo) res.status(404).send();
        res.send({toDo});
    }).catch((e) => {
        res.status(404).send(e);
    });
});

app.get('/todos', (req, res) => {
    ToDo.find().then((toDos) => {
        res.send({toDos});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    ToDo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((toDo) => {
        if (!toDo) {
            res.status(404).send();
        }
        res.status(200).send({toDo});
    }, (e) => {
        res.status(400).send(e);
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server running on port ' + port);
});

module.exports = {
    app
}