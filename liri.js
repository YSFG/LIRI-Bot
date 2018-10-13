//import modules and packages
const request = require("request");
const Spotify = require("node-spotify-api");
const moment = require("moment");
const fs = require("fs");

//turn on dotenv to load up environment variables from .env file

require("dotenv").config();

const spotifyKeys = require("./keys.js");
const action = process.argv[2];

switch (action) {
    case "concert-this":
        const artist = process.argv[3];
        concert(artist);
        break;

    case "spotify-this-song":
        const songName = process.argv[3];
        spotify(songName);
        break;

    case "movie-this":
        const movieName = process.argv[3];
        movie(movieName);
        break;

    case "do-what-it-says":
        dowhat();
        break;
};
//Bands In Town
function concert(artist) {
    
    const queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            for (var i = 0; i < JSON.parse(body).length; i++) {
                console.log("Venue Name: " + JSON.parse(body)[i].venue.name);

                console.log("Venue Location: " + JSON.parse(body)[i].venue.city + ", " + JSON.parse(body)[i].venue.region + ", " + JSON.parse(body)[i].venue.country);

                console.log("Event Date: " + moment(JSON.parse(body)[i].datetime).format('MM/DD/YYYY'));
                console.log('---------------------------');
            }

        }

    })
}

//Spotify
function spotify(songName) {
    //turn on new spotify app
    const spotify = new Spotify(spotifyKeys.spotify);

    if (songName === undefined) {
        songName = 'The Sign Ace of Base';
    };

    spotify.search({ type: 'track', query: songName, limit: 10 }, function (err, data) {
        if (err) {
            return console.log('Error occured: ' + err);
        }

        for (var i = 0; i < data.tracks.items.length; i++) {

            console.log("Artist(s): " + data.tracks.items[i].artists[0].name);
            console.log("Songs Title: " + data.tracks.items[i].name);
            console.log("Album: " + data.tracks.items[i].album.name);
            console.log("Preview Song: " + data.tracks.items[i].preview_url);
            console.log('---------------------------');
        }
    })
}

//OMDB 
function movie(movieName) {
    
    if (movieName === undefined) {
        movieName = "Mr. Nobody";
    };

    const queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=c6c6f479";
    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
           
            console.log('---------------------------');
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log('---------------------------');
        }

    });
}

//DO WHAT IT SAYS
function dowhat() {
  
fs.readFile("random.txt", "utf8", function(error, data) {
    
    if (error) {
      return console.log(error);
    }
      
    console.log(data);
     
    var dataArr = data.split(",");
  
    console.log(dataArr);
    switch (dataArr[0]) {
        case "concert-this":
            concert(dataArr[1]);
            break;
    
        case "spotify-this-song":
            spotify(dataArr[1]);
            break;
    
        case "movie-this":
            movie(dataArr[1]);
            break;    
    };
  
  });

}
