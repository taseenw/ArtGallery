Student Name / Number: Taseen Waseq - 101222679
Class: Web Application Development
Project Title: Final Term Project (A5)
Date: 2022-12-09

Project Files
--------------
/dataModels - Contains the Mongoose schemas for the Artwork, Review, and User models.
    /ArtworkModel.js
    /ReviewModel.js
    /UserModel.js

/public
    /styles.css - CSS file containing the styles for the project
    /userOps.js - JavaScript file contains functions to handle all user operations, making the necessary server calls to complete functionality

/views
    /components
        /navBar.pug - Re-useable navigation bar component with hrefs to specific locations
    /pages - All the individual pages pug files
        /account.pug
        /addArtwork.pug
        /artist.pug
        /artists.pug
        /artwork.pug
        /home.pug
        /index.pug
        /register.pug
        /reviews.pug

database-initializer.js - JavaScript file is used to initialize the MongoDB database with the data from the gallery.json file, and an initial master user
server.js - JavaScript file contains the code for the Express server that handles the HTTP requests and responses
gallery.json - Provided json file of a variety of artwork in the assignment specs

Design Decisions
-----------------
- Calls begin from the pug pages to the userOps JavaScript file, which will then send a request to our server code
    - Used such structure for get, post, etc.
- Break down specific tasks into smaller, individual functions to make the code more modular and easier to maintain.- Always checking active session to assure zero access for users not logged in
- Use MongoDB and Mongoose to store and manage data for the application
- Error handling is done on both the local JavaScript running code and within server requests to provide users with clear feedback on any issues that may arise
    - Sending user with both the status code and message returned from API call pending error
- All HTML is done implementing template engines, using PUG files as assignment instructed
    - Navigation bar is its own re-usable component as it is to be used on all main pages

Instructions to Run
--------------------
- Open desired terminal
- Navigate to the directory containing this project files
- Run "npm install" to install all necessary dependencies
- Run "Node ./database-initializer.js" to initialize the database
- Run "Node ./server.js" to start the server
- Open desired web browser and navigate to URL "localhost:3000"
- Index html should be displayed
- Navigate the webpage as you desire
- Run "Command/Ctrl + C" in the terminal to terminate the program
