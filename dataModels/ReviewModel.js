//Import the mongoose module
import pkg from 'mongoose';

//mongoose modules -- you will need to add type": "module" to your package.json
const { Schema, model} = pkg;

//Define the Schema for a citizen
const reviewSchema = Schema({
    artworkID: String,
    artworkName: String,
    username: String,
    reviewBody: String
});

//Export the default so it can be imported
export default model("reviews", reviewSchema);