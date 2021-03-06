var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require('path');
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(__dirname + "/public"));

// Connect to the Mongo DB
// Previous code: mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });
// new code for Heroku mongo:
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI, 
  { useNewUrlParser: true }
  );


// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://abcnews.go.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // Now, we grab every a tag tag, and do the following:
    $(".headlines-li-div").each(function(i, element) {
      if(i < 10) {
       
      // Save an empty result object
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .find("a")
        .text()
        .trim();
      result.link = $(this)
        .find("a")
        .attr("href");
      
      db.Article.findOneAndUpdate({ title: result.title }, result, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true })
        .then(function(dbArticle) {})
        .catch(function(err) {
          console.log(err);
        });
      }

    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.put("/articles/:id", function(req, res){
  db.Article.findOneAndUpdate({
    _id: req.params.id
  }, { saved: true})
  .then(
    console.log("updated article " +req.params.id)
  );
});

/// Need one route for JSON /savedArticles
app.get("/savedArticles", function(req, res){
  db.Article.find({
    saved: true
  }).then(function(dbArticle){
    if (dbArticle) {
      console.log(`Logging dbArticle contents: ${dbArticle}`);
      res.json(dbArticle)
    } else {
      console.log(`No articles found`);
    }
  });
});

// Need one route for /saved to return '/saved' page
// app.get("/saved", function(req, res){
//   console.log(`This is the response to app.get("saved") ${res}`);
//   // res.render(path.join(__dirname, 'public', 'saved.html'));
//   res.render('saved');
// });

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
//.listen(process.env.PORT || 5000)
app.listen(process.env.PORT || 5000, function() {
  console.log("App running on port " + PORT + "!");
});
