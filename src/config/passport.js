const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Model user
const User = require("../models/User");

passport.use(new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      // Match Email's user
      const user = await User.findOne(
        {
          email: email,
        });
      if (!user) {
        return done(null, false, {
          message: "Not user found",
        });
      } else {
        // Match password's user
        const match = await user.matchPassword(password);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: "Incorrect Password",
          });
        }
      }
    }
  )
);

// User Session Verificate
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  })
});
