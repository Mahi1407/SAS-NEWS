const mongoose = require("mongoose");
const passport = require("passport");
const session = require('express-session');
const { stringify } = require("uuid");


mongoose.connect("mongodb://localhost:27017/NewsDB");
const userschema = new mongoose.Schema({
    username: String,
    password: String,
    email:String,
    savedarticles:[{author:String,content:String,description:String,publishedAt:String,title:String,url:String,urlToImage:String,source:{id:String,name:String}}],
    likedarticles:[{author:String,content:String,description:String,publishedAt:String,title:String,url:String,urlToImage:String,source:{id:String,name:String}}]
});


const sharearticleschema=new mongoose.Schema({
    author:String,
    content:String,
    description:String,
    publishedAt:String,
    title:String,
    url:String,
    urlToImage:String,
    source:{id:String,name:String},
    likescount:Number,
})


//userschema.plugin(passportlocalmongoose); //automatically do hash+salt our passwords

const usermodel = mongoose.model("user", userschema);
const sharemodel = mongoose.model("sharearticle", sharearticleschema);

//passport.use(usermodel.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    usermodel.findById(id, function(err, user) {
        done(err, user);
    });
});

module.exports = {
    User: usermodel,
    Share:sharemodel,
    
}