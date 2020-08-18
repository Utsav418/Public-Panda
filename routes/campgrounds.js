var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'process.env.CLOUD_NAME', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
 
var options = {
  provider: 'here',
  httpAdapter: 'https',
  appId: process.env.APP_ID,
  appCode: process.env.APP_CODE,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all campgrounds
router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Campground.find({name: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              if(allCampgrounds.length < 1) {
                  noMatch = "No campgrounds match that query, please try again.";
              }
              res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    } else {
        // Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    }
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
  
  // get data from form and add to campgrounds array
  var name = req.body.newCampground.name;
  var desc = req.body.newCampground.description;
  var price = req.body.newCampground.price;
  geocoder.geocode(req.body.newCampground.location, function (err, data) {
    if (err || !data.length) {
      console.log("ERR  :  "+err);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;

    cloudinary.uploader.upload(req.file.path, function(result) {
        req.body.newCampground.image = result.secure_url;
            // add author to campground
      req.body.newCampground.author = {
              id: req.user._id,
              username: req.user.username
            }
      var image = req.body.newCampground.image;
      var author = {
      id: req.user._id,
      username: req.user.username
    }
    var campground = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};

    // Create a new campground and save to DB
    Campground.create(campground, function(err, newlyCreated){
        if (err) {
             req.flash('error', err.message);
             return res.redirect('back');
        }
    console.log(newlyCreated);
    res.redirect('/campgrounds');
    });
  });
});
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
          console.log(err);
        } else {
          console.log(foundCampground)
          //render show template with that campground
          res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.campground.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
 
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;

    var newData = {
          name: req.body.campground.name,
          image: req.body.campground.image, 
          description: req.body.campground.description,
          price: req.body.campground.price, 
          lat:req.body.campground.lat,
          lng:req.body.campground.lng,
          location:req.body.campground.location
      };
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });

  });
});


router.delete("/:id", function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err, campground) {
    Comment.remove({
      _id: {
        $in: campground.comments
      }
    }, function(err, comments) {
      req.flash('error', campground.name + ' deleted!');
      res.redirect('/campgrounds');
    })
  });
});

module.exports = router;