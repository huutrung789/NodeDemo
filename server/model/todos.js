var  mongoose = require('mongoose');
var Todos = mongoose.model('Todos', {
   name: {
       type: String,
       required: true,
       minlength: 1,
       trim: true
   },
    completed: {
        type: Boolean,
        default: true
    },
    creator: {
       type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});


module.exports.Todos = Todos;