var express=require('express'),
    app=express(),
    mongoose=require('mongoose'),
    bodyParser=require('body-parser'), //to read data sent by form(POST req)
    methodOverride=require("method-override"),
    expressSanitizer=require("express-sanitizer");

//      APP CONFIG
//  Connecting to DB
mongoose.connect('mongodb://localhost:27017/restfulBlogApp', {useNewUrlParser: true, useUnifiedTopology: true});
//  No need to add .ejs at end of ejs files
app.set("view engine", "ejs");
//  For css file in public dir
app.use(express.static("public"));
//  To use data coming from form
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//  MOONGOOSE/MODEL CONFIG
var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog=mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Cafe Racer",
//     image: "https://images.unsplash.com/photo-1556174676-d44f85a47065?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
//     body: "Typically a café racer means lightweight sporty bikes which are usually stripped down and has styling of 60’s Gran-Prix bike and are made for quick rides over short distances rather than like sport bikes which are made for riding around the race track."
// });

//      RESTFUL ROUTES
//  ROOT ROUTE
app.get("/", function(req, res){
    res.redirect("/blogs");
});
//  INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});
//  NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});
//  CREATE ROUTE
app.post("/blogs", function(req, res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});
// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});
//  EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});
//  UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updadatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
//  DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});
app.listen("1004", function(){
    console.log("RESTful_Blog_App server started at port 1004");
});