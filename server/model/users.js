var mongoose = require('mongoose');
const validator = require('validator');
const  jwt = require('jsonwebtoken');
const  _ = require('lodash');


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

SchemeUser.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
}

SchemeUser.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access},'secret').toString();
    user.tokens.push({access, token});
    return user
            .save()
            .then(() => {
                return token;
             });
};

var Users = mongoose.model('Users', SchemeUser);


module.exports = {Users};