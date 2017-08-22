
var  express = require('express');
const  bodyParser = require('body-parser');
const  {mongoose} = require('./mongoose');
const  {ObjectID} = require('mongodb').ObjectID;

var {Users} = require('./model/users');
var {Todos} = require('./model/todos');

var app = express();
// var router = express.Router();

//middleware
app.use(bodyParser.json());

//post
app.post('/todos', (req, res) => {
    console.log(req.body);
    var todo = new Todos({
        name: req.body.name
    });

    todo.save().then((docs) => {
        res.send(docs);
    }, (error) => {
        res.status(400).send(error);
    });

});


//get
app.get('/todos', (req, res) => {
    Todos.find().then((listDocs) => {
        res.send(listDocs);
    }, (err) => {
        res.status(400).send(err);
    });

});

//get Object by Id
app.post('/todoById', (req, res) => {
    console.log(req.body);
    if (!ObjectID.isValid(req.body.id)) {
        return res.status(400).send('Invalid id');
    }

    Todos.findById({
        _id: req.body.id
    }).then((docs) => {
        res.send(docs);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

var port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log('Express started on port ', port);
});

