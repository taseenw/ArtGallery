//Import the mongoose module
import pkg from 'mongoose';

//mongoose modules -- you will need to add type": "module" to your package.json
const { Schema, model} = pkg;

//Define the Schema for a user
const userSchema = Schema({
    username: String,
    password: String,
    isArtist: {
        type: Boolean,
        default: false
    },
    // following: list of strings
    following: {
        type: [String],
        default: []
    },
    followers: {
        type: [String],
        default: []
    },
    likedArtwork: {
        type: [String],
        default: []
    }
});

//Export the default so it can be imported
export default model("users", userSchema);