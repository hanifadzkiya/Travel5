var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const userService = require("../services/userService");
const jwtService = require("../services/jwtService");
passport.serializeUser(function(user,done){
    console.log('serializeUser '+ JSON.stringify(user));
    done(null,user);
});

passport.deserializeUser(function(user,done){
    console.log('deserializeUser'+ JSON.stringify(user));
    done(null,user);
})
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(token, tokenSecret, profile, done) {
    console.log('profile: '+JSON.stringify(profile));
    //check di DB apabila hasil login google ada
    const email = profile.emails[0].value;
    const result = await userService.getByEmail(email);
    if(result){
        const jwtToken = jwtService.generateAccessToken({
        username: result.username,
        role: result.role,
        name: result.name,
        email: result.email,
        phone_number: result.phone_number,
      });
  
      return done(null,{ _token: jwtToken + "" });
    }else{
      return done(null,{ 'message': 'User not registered' });
    }
    
    // return profile;
  }
));