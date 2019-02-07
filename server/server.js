const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {ToDo} = require('./models/todo');

var app = express();

app.use(bodyParser.json());

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server running on port ' + port);
});

module.exports = {
    app
}