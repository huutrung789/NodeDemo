const {SHA256} = require('crypto-js');

const  jwt = require('jsonwebtoken');


var string = 'My name Trung 3';
var hashString = SHA256(string).toString();
console.log('Hashing SHA256: ', hashString);

var data = {
    id: 5
}

var secret = 'fhsdkjfksf';
var token = jwt.sign(data, secret);
console.log(token);

var decoded = jwt.verify(token, secret);
console.log(decoded);
