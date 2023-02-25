let hostBase = "localhost";

//Function to register a new user
function register(){
    //Create a new user object from the form data
    let enteredUsername = document.getElementById("regUsername").value;
    let enteredPassword = document.getElementById("regPassword").value;

    let newUserSchema = {
        username: enteredUsername,
        password: enteredPassword,
        isArtist: false
    }

    if(enteredUsername == "" || enteredPassword == ""){
        alert("Please enter a username and password");
        return;
    }
    
    console.log("Entered user data: " + JSON.stringify(newUserSchema));
    //POST request to register a new user
    fetch(`http://${hostBase}:3000/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserSchema)
    }).then(response => {
        if(response.status == 200){
            window.location.href = `http://${hostBase}:3000/`;
        }else{
            document.getElementById("regUsername").value = "";
            document.getElementById("regPassword").value = "";
        }
        response.json().then(data => {
            alert(data.message);
        });
    }).catch(err => {
        console.log(err);
    });
}

//Function to login a user
function login(){
    //Create a new user object from the form data
    let enteredUsername = document.getElementById("logUsername").value;
    let enteredPassword = document.getElementById("logPassword").value;

    let loginAttemptUser = {
        username: enteredUsername,
        password: enteredPassword
    }

    if(enteredUsername == "" || enteredPassword == ""){
        alert("Please enter a username and password");
        return;
    }

    console.log("Entered user data: " + JSON.stringify(loginAttemptUser));
    //POST request to login
    fetch(`http://${hostBase}:3000/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginAttemptUser)
    }).then(response => {
        if(response.status == 200){
            window.location.href = `http://${hostBase}:3000/home`;
        }else{
            document.getElementById("logUsername").value = "";
            document.getElementById("logPassword").value = "";
        }
        response.json().then(data => {
            alert(data.message);
        });
    }).catch(err => {
        console.log(err);
    });
}

//Function to update a user's role (artist or not)
function updateRole(){
    //Remember session knows who is logged in
    fetch(`http://${hostBase}:3000/changeType`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if(response.status == 200){
            window.location.href = `http://${hostBase}:3000/account`;
        }
        response.json().then(data => {
            alert(data.message);
        });
    }).catch(err => {
        console.log(err);
    });
}

//Function to like a picture; request to add to users liked pictures, edit likes on picture
function likePicture(artworkID){
    //Remember session knows who is logged in
    fetch(`http://${hostBase}:3000/likePicture/${artworkID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if(response.status == 200){
            window.location.href = `http://${hostBase}:3000/artwork/${artworkID}`;
        }
    }).catch(err => {
        console.log(err);
    });
}

//Function to add a review to a picture
function addReview(artworkID){
    //Remember session knows who is logged in
    let artworkName = document.getElementById("artworkName").value;
    let reviewBody = document.getElementById("reviewInput").value;
    if (reviewBody == ""){
        alert("Please enter a review");
        return;
    }

    let requestBody = {
        artworkName: artworkName,
        reviewBody: reviewBody
    }

    fetch(`http://${hostBase}:3000/addReview/${artworkID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }).then(response => {
        if(response.status == 200){
            window.location.href = `http://${hostBase}:3000/artwork/${artworkID}`;
        }
    }).catch(err => {
        console.log(err);
    });
}

//Function to add artwork to the database
function addArtwork(){
    //Remember session knows who is logged in
    let artworkName = document.getElementById("artworkName").value;
    let artworkYear = document.getElementById("artworkYear").value;
    let artworkCategory = document.getElementById("artworkCategory").value;
    let artworkMedium = document.getElementById("artworkMedium").value;
    let artworkDescription = document.getElementById("artworkDescription").value;
    let artworkImage = document.getElementById("artworkImage").value;

    let requestBody = {
        artworkName: artworkName,
        artworkYear: artworkYear,
        artworkCategory: artworkCategory,
        artworkMedium: artworkMedium,
        artworkDescription: artworkDescription,
        artworkImage: artworkImage
    }

    if(artworkName == "" || artworkYear == "" || artworkCategory == "" || artworkMedium == "" || artworkDescription == "" || artworkImage == ""){
        alert("Please fill out all fields");
        return;
    }
    

    fetch(`http://${hostBase}:3000/addArtwork`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }).then(response => {
        if(response.status == 200){
            window.location.href = `http://${hostBase}:3000/home`;
        }
    }).catch(err => {
        console.log(err);
    });
}