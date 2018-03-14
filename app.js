var express             = require("express");
var app                 = express();
var bodyParser          = require("body-parser");
var mongoose            = require("mongoose");
var methodOverride      = require("method-override");
var expressSanitizer    = require("express-sanitizer");

// APP CONFIGURATIONS
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))

// SCHEMA DATABASE
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now()}
});

var Blog = mongoose.model("Blog", blogSchema);


//CREATE first post
// Blog.create({
//     title: "Test",
//     image: "https://farm2.staticflickr.com/1353/5168302276_f59f4561b5.jpg",
//     body: "Lorem Ipsum lorem ipsum lorem ipsum"
// });


// START - RESTful ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs"); 
});

// INDEX route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if (err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});


// NEW route
app.get("/blogs/new", function(req, res){
     res.render("new");
});


// CREATE route
app.post("/blogs", function(req, res){
    //sanitize
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //create blog
    Blog.create(req.body.blog, function(err, blog){
         if (err) {
             res.render("new");
         }else {
             res.redirect("/blogs");
         }
    });
});


// SHOW route
app.get("/blogs/:id", function(req, res){
    //retrieve data
    Blog.findById(req.params.id, function(err, blog){
         if (err){
             res.redirect("/blogs");
         }else {
             res.render("show", {blog: blog});
         }
    });
});


// EDIT route
app.get("/blogs/:id/edit", function(req, res){
    //retrieve data to update
     Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
     });
});

// UPDATE route
app.put("/blogs/:id", function(req, res){
    //sanitize
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //update
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});


// DELETE route
app.delete("/blogs/:id", function(req, res){
    //destroy
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

// END - RESTful routes

// listen PORT
// listen for request
app.listen(process.env.PORT || 8080, process.env.IP, function(){
    console.log("starting");
});
