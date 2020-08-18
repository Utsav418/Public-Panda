var mongoose        =   require("mongoose");
var Campground      =   require("./models/campground");
var Comment         =   require("./models/comment");
var data = [
                {   name: "Night Site", 
                    image: "http://3.bp.blogspot.com/-EZslw2DfT5E/VFEMGzI_XYI/AAAAAAAAFuk/U-S7ouns-1A/s1600/Camping-In-Iceland-National-Park-Hd-Wallpaper-.jpg",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tellus lectus, congue nec est et, elementum mattis nisl. Aenean at tortor a odio porta scelerisque. Vivamus a auctor sem. Nullam venenatis velit at magna maximus vestibulum. Cras laoreet quam vitae ex porttitor, sed rhoncus ligula posuere. Integer lacinia elementum mi, a faucibus mauris accumsan quis. Suspendisse sagittis efficitur mattis. Quisque pharetra et nisi at bibendum. Mauris urna magna, fringilla non varius non, semper ut felis. Nam laoreet nec nisl in dignissim. Quisque dictum pharetra ligula at malesuada."
                },
                {   name: "Cloud's Rest", 
                    image: "https://www.pixelstalk.net/wp-content/uploads/2016/10/Po-pro-camping-on-the-bay-images.jpg",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tellus lectus, congue nec est et, elementum mattis nisl. Aenean at tortor a odio porta scelerisque. Vivamus a auctor sem. Nullam venenatis velit at magna maximus vestibulum. Cras laoreet quam vitae ex porttitor, sed rhoncus ligula posuere. Integer lacinia elementum mi, a faucibus mauris accumsan quis. Suspendisse sagittis efficitur mattis. Quisque pharetra et nisi at bibendum. Mauris urna magna, fringilla non varius non, semper ut felis. Nam laoreet nec nisl in dignissim. Quisque dictum pharetra ligula at malesuada."
                },
                {   name: "Valley Flora", 
                    image: "http://cfim.ca/wp-content/uploads/2017/08/camping-2.jpg",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tellus lectus, congue nec est et, elementum mattis nisl. Aenean at tortor a odio porta scelerisque. Vivamus a auctor sem. Nullam venenatis velit at magna maximus vestibulum. Cras laoreet quam vitae ex porttitor, sed rhoncus ligula posuere. Integer lacinia elementum mi, a faucibus mauris accumsan quis. Suspendisse sagittis efficitur mattis. Quisque pharetra et nisi at bibendum. Mauris urna magna, fringilla non varius non, semper ut felis. Nam laoreet nec nisl in dignissim. Quisque dictum pharetra ligula at malesuada."
                }
            ]

// function seedDB(){
// //Remove all campgrounds
//     Campground.remove({}, function(err){
//             if(err)
//             {
//                 console.log(err);
//             }
//                 console.log("removed campgrounds");    
                
    //         //Add a few campgrounds
    //         data.forEach(function(seed){
    //              Campground.create(seed, function(err, campground){
    //               if(err)
    //                 {
    //                     console.log(err);
    //                 }
    //               else
    //                 {
    //                     console.log("Added A Campground");
    //                     //Addd a few comments
    //                     Comment.create({
    //                                      text: "This place is great,but I wish there was internet",
    //                                      author: "Homer"
    //                                     }, function(err, comment){
    //                                         if(err)
    //                                         {
    //                                             console.log(err);
    //                                         }
    //                                         else
    //                                         {
    //                                             campground.comments.push(comment);
    //                                             campground.save();
    //                                             console.log("Created a new comment");
    //                                         }
    //                                     });
    //                 }
    //   }) ;
    // });
   //  });
//}

//module.exports = seedDB;