//Import all the necessary modules
import ArtworkModel from './dataModels/ArtworkModel.js';
import UserModel from './dataModels/UserModel.js';
import fs from 'fs';
import path from 'path';
import pkg from 'mongoose';
const { connect, connection } = pkg;

//Declare empty array to hold artwork, mongodb url
let artwork = [];
const url = 'mongodb://localhost:27017/gallery';

//Read in artwork from json file, remember the new like field will be set default by the model
const gallery = fs.readFileSync(path.join('gallery.json'), 'utf8');
artwork = JSON.parse(gallery);

console.log(artwork);

//Initialize and create artwork objects
let artworkInit = async () => {
    try{
        for(let i = 0; i < artwork.length; i++){
            await ArtworkModel.create(artwork[i]);
        }
    }catch(err){
        console.log(err);
    }
}

//Initiazlie and create master user
let masterUserInit = async () => {
    try{
        await UserModel.create({username: "master", password: "master", isArtist: true});
    }catch(err){
        console.log(err);
    }
}


const loadData = async () => {
	
	//Connect to mongo, remove possible existing database, and create new one.
  	await connect(url);
	await connection.dropDatabase();

	//Create artworks
	await artworkInit();

    //Create master user
    await masterUserInit();

}

loadData()
  .then((result) => {
	console.log("Closing database connection.");
 	connection.close();
  })
  .catch(err => console.log(err));