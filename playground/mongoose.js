

const  mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TestMongoose', {
    useMongoClient: true
});

var Todos = mongoose.model('Todos',{
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
    quantity: {
      type: Number,
        default: 0
    }
});

var  todo1 = new Todos({
   name: 'Trung6 test trim  '
});

todo1.save().then((result) => {
    console.log(JSON.stringify(result));
}, (error) => {
    console.log(error);
});
