
var  express = require('express');
var config = require('./config/config.js');
const  bodyParser = require('body-parser');
const  {mongoose} = require('./mongoose');
const  {ObjectID} = require('mongodb').ObjectID;

var {Users} = require('./model/users');
var {Todos} = require('./model/todos');
var {authenticate} = require('./middleware/authenticate');

var app = express();
var router = express.Router();

//middleware
app.use(bodyParser.json());


// ===== TODO API ====
//post - create todos
app.post('/todos', authenticate, (req, res) => {
    console.log(req.body);
    var todo = new Todos({
        name: req.body.name,
        creator: req.user._id
    });

    todo.save().then((docs) => {
        res.send(docs);
    }, (error) => {
        res.status(400).send({"error": error.toString()});
    });

});


//get
app.get('/todos', authenticate,(req, res) => {
    Todos.find().then((listDocs) => {
        res.send(listDocs);
    }, (err) => {
        res.status(400).send({"error": err.toString()});
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
        res.status(400).send({"error": error.toString()});
    });
});

//Delete Object by Id
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({'Error': 'Invalid id'});
    }

    Todos.findByIdAndRemove({_id: id}).then((docs) => {
        if (!docs) {
            return res.status(400).send({'Error': 'No item with id'});
        }

        res.json(docs);
    }, (error) => {
        res.status(400).send({"error": error.toString()});
    });
});



// ====== USERS API ===========


//Authenticate
app.post('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// //Login

//Login 1
app.post('/users/login', (req, res) => {
    Users.findOneCredentials(req.body.email, req.body.password)
        .then((user) => {
            return user.generateAuthToken().then((token) => {
                res.header({'x-auth': token}).send(user);
        });
    }).catch((err) => {
        console.log(err);
        res.status(400).send({"error": error.toString()});
    });
});


//Try Login 2: chainable Promises - not success
app.post('/users/login2', (req, res) => {
    Users.findOneCredentials(req.body.email, req.body.password)
        .then((user) => {
            return user.generateAuthToken();
        }).then((token) => {
            res.header({'x-auth': token}).send(user);
        }).catch((err) => {
            res.status(400).send({"error": err.toString()});
        });
});


//Logout
app.delete('/users/logout', authenticate, (req, res) => {
    var token = req.header('x-auth');
    console.log(req.user);
    req.user.removeToken(token).then((user) => {
        res.send(user);
    }).catch((err) => {
        res.status(400).send({"error": err.toString()});
    });
});

//Signup
app.post('/users/signup', (req, res) => {
    var body = req.body;
    var user = new  Users ({
        email: body.email,
        password: body.password
    });

    //Chainable Promises
    user.save()
        .then(() => {
            return user.generateAuthToken();
        }).then((token) => {
            res.header({'x-auth': token}).send(user);
        }).catch((error) => {
            res.status(400).send({"error": error.toString()});
        });
});


var port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log('Express started on port ', port);
});

