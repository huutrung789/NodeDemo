var mongoose = require('mongoose');
const validator = require('validator');
const  jwt = require('jsonwebtoken');
const  _ = require('lodash');
const bcrypt = require('bcryptjs');


var SchemeUser = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});


//tooks 'pre' - action: 'save' - hashing password before 'save' to DB
SchemeUser.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')) {

        bcrypt.genSalt(10).then((salt) => {
            console.log('salt: ', salt);
            bcrypt.hash(user.password, salt).then((hash) => {
                //update user document and call next ('save') action
                user.password = hash;
                next();
            }).catch((err) => {
                console.log(err);
            });
        }).catch((error) => {
            console.log(error);
            // next()
        });

    } else {
        next()
    }

});

//Overwrite method -- overwrite may cause to unpredictable result
SchemeUser.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
}


//Statics
SchemeUser.statics.findByToken = function(token) {
    var user = this;
    var decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return Promise.reject(err);
    }
    console.log('decoded: ',decoded);
    return Users.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

SchemeUser.statics.findOneCredentials = function (email, password) {
    var User = this;
    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject({'error': 'No user found'});
        }

        //validate password
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password).then((result) => {
            return resolve(user);
            }).catch((err) => {
            return reject(err);
            });
        });


    }).catch((error) => {
        return Promise.reject(error);

        //Or
        // return new Promise((resolve, reject) => {
        //     reject(error);
        // });
    });

};


SchemeUser.methods.removeToken = function (token) {
    var user = this;
    return user.update({
        $pull:
            {tokens: {token}}
    });
};

//Define new method of Schema
// NOTE: methods must be added to the schema before compiling it with mongoose.model()
SchemeUser.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
    user.tokens.push({access, token});
    return user
            .save()
            .then(() => {
                // return new Promise((resolve, reject) => {
                //     resolve(token);
                // });
                return token;
             });
};

//Call this after above methods adding
var Users = mongoose.model('Users', SchemeUser);


module.exports = {Users};