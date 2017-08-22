

const MongoCient = require('mongodb').MongoClient;

MongoCient.connect('mongodb://localhost:27017/trungDB',(error, db) => {
    if (error) {
        console.log(error);
        return console.log('Can not connect to mongoDB');
    }

    console.log('Connected to mongodb');

    // insertData(db);
    fetchAllDataCollection(db);



    db.close();
});

var insertData = (db) => {
    // db.collection('ToDos').insertOne({
    //    name: 'Lau nha',
    //    time: '5h'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert Todo');
    //     }
    //     console.log('Insert Todo:', JSON.stringify(result.ops, undefined, 2));
    // });

    //Insert a new user to Users collection

    db.collection('Users').insertOne({
        name: 'Trung4',
        age: '27'
    }).then((result) => {
        console.log(result.ops[0]._id.getTimestamp());
    }).catch((reject) => {
        console.log(reject);
    });
};

var fetchAllDataCollection = (db) => {
    db.collection('Users').find({
        name: 'Trung'
    }).toArray().then((docs) => {
        console.log('Users: ', JSON.stringify(docs, undefined,2));
    }).catch((err) => {
        console.log(err);
    });
};