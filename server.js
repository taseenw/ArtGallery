//Server.js is the main file that will be run to start the server, that will make requests to the database as well as render the pages
import express from 'express';
import UserModel from './dataModels/UserModel.js';
import ArtworkModel from './dataModels/ArtworkModel.js';
import ReviewModel from './dataModels/ReviewModel.js';

const app = express();

import session from 'express-session';
import { default as connectMongoDBSession} from 'connect-mongodb-session';

//Defining the location of the session in MongoDB
const MongoDBGallery = connectMongoDBSession(session);
var gallery = new MongoDBGallery({
    uri: 'mongodb://localhost:27017/gallery',
    collection: 'sessions'
  });


//Setup express-session to be used with MongoDB
app.use(session(
    { 
      secret: 'top secret key',
      resave: true,
      saveUninitialized: false,
      gallery: gallery 
    })
);

import logger from 'morgan';
import pkg from 'mongoose';
const { connect, Types } = pkg;

app.use(express.urlencoded({extended: true}));

//Import models

//process.env.PORT will see if there is a specific port set in the environment.
const PORT = process.env.PORT || 3000;

//Define base route, and logger use
let hostBase = "localhost";
app.use(logger('dev'));

app.use(express.static("public"));

//Convert any JSON stringified strings in a POST request to JSON.
app.use(express.json());

//Setting pug as our template engine.
app.set('views', './views');
app.set('view engine', 'pug');

//GET / - return the index page
app.get(['/'], (req, res) => {
    res.render('pages/index');
});

//GET /register - return the register page
app.get('/register', (req, res) => {
    res.render('pages/register');
});

//GET /home - return the home page
app.get('/home', async (req, res) => {
    if(req.session.user != null){
        const artwork = await fetchArtwork();
        //returns an array of artwork objects
        res.render('pages/home', {user: req.session.user, art: artwork});
    }else{
        res.redirect('/');
    }
});

//GET /account - return the account page
app.get('/account', (req, res) => {
    if(req.session.user != null){
        res.render('pages/account', {user: req.session.user});
    }else{
        res.redirect('/');
    }
});

//GET /artwork/:id - return the artwork page
app.get('/artwork/:id', async (req, res) => {
    if(req.session.user != null){
        try{
            let artworkToDisplay = await ArtworkModel.findOne({_id: req.params.id});
            res.render('pages/artwork', {user: req.session.user, artwork: artworkToDisplay});
        }
        catch(err){
            res.status(500).json({message: "Error finding artwork!"});
        }
    }else{
        res.redirect('/');
    }
});

//GET /likes - return the likes page
app.get('/likes', async (req, res) => {
    //Pass an object of the users liked artwork, with the name property of the artwork, photo, its id
    if(req.session.user != null){
        let likedArtwork = [];
        for(let i = 0; i < req.session.user.likedArtwork.length; i++){
            let artwork = await ArtworkModel.findOne({_id: req.session.user.likedArtwork[i]});
            likedArtwork.push({name: artwork.name, image: artwork.image, _id: artwork._id});
        }
        res.render('pages/likes', {user: req.session.user, likedArtwork: likedArtwork});
    }else{
        res.redirect('/');
    }
});

//GET /reviews - return the reviews page
app.get('/reviews', async (req, res) => {
    if(req.session.user != null){
        let reviews = await ReviewModel.find({username: req.session.user.username});
        res.render('pages/reviews', {user: req.session.user, reviews: reviews});
    }else{
        res.redirect('/');
    }
});

//GET /addArtwork - return the addArtwork page
app.get('/addArtwork', (req, res) => {
    if(req.session.user != null){
        if(req.session.user.isArtist){
            res.render('pages/addArtwork', {user: req.session.user});
        }else{
            res.redirect('/home');
        }
    }else{
        res.redirect('/');
    }
});

//Get /artists - return the artists page
app.get('/artists', async (req, res) => {
    if(req.session.user != null){
        //Because there are artworks with artists that are not in the database, we need to find all the artists that have artwork in the database
        //Store them in a list with no duplicates
        let artists = [];
        let artworks = await ArtworkModel.find();
        for(let i = 0; i < artworks.length; i++){
            if(!artists.includes(artworks[i].artist)){
                artists.push(artworks[i].artist);
            }
        }

        console.log(artists);
        res.render('pages/artists', {user: req.session.user, artists: artists});
    }else{
        res.redirect('/');
    }
});

//GET /artist/:artist - return the artist page
app.get('/artist/:artist', async (req, res) => {
    if(req.session.user != null){
        let artworks = await ArtworkModel.find({artist: req.params.artist});
        //Pass artist name too
        res.render('pages/artist', {user: req.session.user, artworks: artworks, artist: req.params.artist});
    }else{
        res.redirect('/');
    }
});

//GET /logout - logout the user
app.get('/logout', (req, res) => {
    req.session.user = null;
    req.session.destroy();
    res.redirect('/');
});



//POST /register - register a new user
app.post('/register', async (req, res) => {
    try{
        const searchResult = await UserModel.findOne({username: req.body.username});

        if(searchResult == null){
            await UserModel.create(req.body);
            res.status(200).json({message: "User successfully registered!"});
        }else{
            res.status(400).json({message: "User already exists!"});
        }
    }catch(err){
        res.status(500).json({message: "Error registering user!"});
    }
});

//POST /login - login a user
app.post('/login', async (req, res) => {
    try{
        //Search just by username
        const searchResult = await UserModel.findOne({username: req.body.username});

        //Cover all cases of login
        if(searchResult == null){
            res.status(400).json({message: "User does not exist!"});
        }else if(searchResult.username == req.body.username && searchResult.password == req.body.password){
            req.session.user = searchResult;
            res.status(200).json({message: "User successfully logged in!"});
        }else{
            res.status(400).json({message: "Incorrect password!"});
        }

    }catch(err){
        res.status(500).json({message: "Error logging in user!"});
    }
});

//POST /changeType - change the type of user
app.post('/changeType', async (req, res) => {
    try{
        //Edit isArtist to be the opposite of what it currently is, and update the session
        await UserModel.updateOne({username: req.session.user.username}, {isArtist: !req.session.user.isArtist});
        req.session.user.isArtist = !req.session.user.isArtist;
        res.status(200).json({message: "User type successfully changed!"});
    }catch(err){
        res.status(500).json({message: "Error changing user type!"});
    }
});
    
//Fetch all artwork from the mongo database
async function fetchArtwork(){
    try {
      //Connect to the mongo database
      await connect('mongodb://localhost:27017/gallery', {useNewUrlParser: true, useUnifiedTopology: true})
  
      //Find all artwork
      return ArtworkModel.find();
    } catch(err) {
      console.log(err);
      return null;
    }
}
    
//POST /likePicture/:id - like a picture
app.post('/likePicture/:id', async (req, res) => {
    //We need to update the likes property of the artwork object, and the likedArtwork property of the user object
    try{
        const artwork = await ArtworkModel.findOne({_id: req.params.id});
        const user = await UserModel.findOne({username: req.session.user.username});
        //If the user has not liked the artwork yet
        if(!user.likedArtwork.includes(req.params.id)){
            //Add the artwork to the user's likedArtwork array by pushing the id
            await UserModel.updateOne({username: req.session.user.username}, {$push: {likedArtwork: req.params.id}});
            //+1 to the artwork's likes property
            await ArtworkModel.updateOne({_id: req.params.id}, {likes: artwork.likes + 1});
            //Update the session
            req.session.user.likedArtwork.push(req.params.id);
            
            res.status(200).json({message: "Picture successfully liked!"});
        }else{
            //Unlike scenario
            //Remove the artwork from the user's likedArtwork array by pulling the id
            await UserModel.updateOne({username: req.session.user.username}, {$pull: {likedArtwork: req.params.id}});
            //-1 to the artwork's likes property
            await ArtworkModel.updateOne({_id: req.params.id}, {likes: artwork.likes - 1});
            //Update the session, remove the id from the array
            req.session.user.likedArtwork.splice(req.session.user.likedArtwork.indexOf(req.params.id), 1);
            res.status(200).json({message: "Picture successfully unliked!"});
        }
    }catch(err){
        res.status(500).json({message: "Error liking picture!"});
    }
});

//POST /addReview/:id - add a review to a picture
app.post('/addReview/:id', async (req, res) => {
    try{
        //Add review to the reviews table
        let reviewBody = {
            artworkID: req.params.id,
            artworkName: req.body.artworkName,
            username: req.session.user.username,
            reviewBody: req.body.reviewBody
        }
        await ReviewModel.create(reviewBody);
        res.status(200).json({message: "Review successfully added!"});
    }catch(err){
        res.status(500).json({message: "Error adding review!"});
    }
});

//POST /addArtwork - add a new artwork
app.post('/addArtwork', async (req, res) => {
    try{
        //Add artwork to the artwork table
        let artworkBody = {
            name: req.body.artworkName,
            artist: req.session.user.username,
            year: req.body.artworkYear,
            category: req.body.artworkCategory,
            medium: req.body.artworkMedium,
            description: req.body.artworkDescription,
            image: req.body.artworkImage,
        }
        await ArtworkModel.create(artworkBody);
        res.status(200).json({message: "Artwork successfully added!"});
    }catch(err){
        res.status(500).json({message: "Error adding artwork!"});
    }
});

app.use((req, res) => {
    res.status(404).json({ error: "Not found (404)" });
});

const loadData = async () => {
	
	//Connect to the mongo database
  	const result = await connect('mongodb://localhost:27017/gallery');
    return result;
};

// Call to load the data, returns the express server will listen
// Catch and log any errors
loadData()
  .then(() => {

    app.listen(PORT);
    console.log("Listen on port:", PORT);

  })
  .catch(err => console.log(err));
