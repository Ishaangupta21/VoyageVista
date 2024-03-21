if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");

const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");

const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const user = require("./routes/user.js");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const dbUrl=process.env.ATLAS_DB_URL

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);


const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})

store.on("error",(err)=>{
  console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie: {
    expires : Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly:true,
  }
};

app.use(session(sessionOptions));
app.use(flash());

//for Authentication->needs use of session()..

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});




app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",user);



//middlewear

app.all("*", (req, res, next) => {
  throw new expressError(404, "Page not Found!!");
});

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "Something went wrong" } = err;
  res.status(statuscode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
