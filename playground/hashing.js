const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

// var message = 'yo yo honey singh';
// var hash = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

var data = {
    id: 10
};

var token = jwt.sign(data, 'somesecret');
console.log(token);
var decoded = jwt.verify(token, 'somesecret');
console.log('Decoded: ', decoded);