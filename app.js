//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

let articles = [];

const homeArticle1 = new Article({
    title: "Home",
    content: homeStartingContent
});

const homeArticle2 = new Article({
    title: "Article Two",
    content: aboutContent
});

const homeArticle3 = new Article({
    title: "Article Test",
    content: contactContent
});

const defaultArticles = [homeArticle1, homeArticle2, homeArticle3];

app.get("/", function(req, res){
    
    Article.find({}, function(err, articles){
        
        if(articles.length === 0){
            Article.insertMany(defaultArticles, function(err){
            if(err){
            console.log(err);
            } else{
            console.log("Successfully saved default articles in db!");
                }
            });
            res.redirect("/");
        } else{
            res.render("home", {
            posts: articles
    });
        }
    });
    
});

app.get("/about", function(req, res){
    res.render("about", {
        aboutContent: aboutContent
    });
});

app.get("/contact", function(req, res){
    res.render("contact", {
        contactContent: contactContent
    });
});

app.get("/compose", function(req, res){
    res.render("compose");
});

app.post("/compose", function(req, res){
    const article = new Article ({
      title: req.body.postTitle,
      content: req.body.postBody
    });
            article.save();
            res.redirect("/");
});

app.get("/posts/:postName", function(req, res){
    Article.findOne({title: req.params.postName}, function(err, article){
        if (err){
            console.log("there is an error in getting post" + err);
                } else {
                   if (article === null){
                    res.render("post", {
                    postTitle: "There is no article with title: " + req.params.postName,
                    postContent: ""
                    });   
                   } else {
                    res.render("post", {
                    postTitle: article.title,
                    postContent: article.content
                    });
                   }
                }
    }
                    );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
