var mongoose = require('mongoose');
var Users = mongoose.model('Users', {
   name: {
       type: String,
       required: true,
       minlength: 1,
       trim: true
   },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

module.exports = {Users};