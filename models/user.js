const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 6; //6 is a reasonable value

const userSchema = new Schema({
    name: {type: String, required: true}, 
    email: {
        type: String, 
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        minLength: 3,
        required: true
    }
}, {
    timestamps: true,
    // transform before being serialized to JSON
    // Even though it's hashed - don't serialize the password
    toJSON: {
        // ret is the instance of the user that is being serialized 
        transform: function(doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

// pre save hook will always fire right before mongoose saves this document to the database
userSchema.pre("save", async function(next) {
    // "this" is the user doc
    if (!this.isModified("password")) return next();
    // update the password with the computed hash
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    return next()
})

module.exports = mongoose.model("User", userSchema);