require('dotenv').config();
var express         =    require("express"),
    app             =    express(),
    bodyParser      =    require("body-parser"),
    mongoose        =    require("mongoose"),
    flash           =    require("connect-flash"),
    passport        =    require("passport"),
    LocalStrategy   =    require("passport-local"),
    methodOverride  =    require("method-override"),
    Campground      =    require("./models/campground"),
    seedDB          =    require("./seeds"),
    User            =    require("./models/user"),
    Comment         =    require("./models/comment");
    

//Requiring Routes
    var commentRoutes       =   require("./routes/comments"),
        campgroundsRoutes   =   require("./routes/campgrounds"),
        indexRoutes          =   require("./routes/index");

//seedDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true }); 

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals  .moment =  require("moment");

//PASSPORT CONFIG

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser =    req.user;
   res.locals.error       =    req.flash("error");
   res.locals.success       =    req.flash("success");
   
   next();
});



//Using Routes
app.use(indexRoutes);
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(9929, function(){
   console.log("The YelpCamp Server Has Started ...") ;
   
});