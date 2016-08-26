const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    favlang: {
        type: String,
        required: true
    },
    location: {
        type: [Number],
        required: true
    }, // [Long, Lat]
    htmlverified: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Sets the created_at parameter equal to the current time
UserSchema.pre('save', function(next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now
    }
    next();
});

UserSchema.index({
    location: '2dsphere'
});

module.exports = mongoose.model('User', UserSchema);
