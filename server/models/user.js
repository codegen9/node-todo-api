const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
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

UserSchema.statics.findByToken = function(token) {
    var decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject(e);
    }
    var User = this;
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

UserSchema.methods.toJSON = function () {
    var user = this;
    return _.pick(user.toObject(), ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123');
    user.tokens = user.tokens.concat([{ access, token }]);
    return user.save().then(() => {
        return token;
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};