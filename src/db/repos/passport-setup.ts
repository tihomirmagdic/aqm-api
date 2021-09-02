// export const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const LocalStrategy = require('passport-local');
import { google, facebook } from "./keys";
import cookieSession = require('cookie-session');
import { dbPool } from "../../db";
import { getDBContext } from "../../server/handler";

export const setup = (app: any, passport: any) => {
  console.log("google keys:", google);
  console.log("facebook keys:", facebook);

  app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))

	app.use(passport.initialize());
	app.use(passport.session());

  passport.serializeUser((user: any, done: any) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done: any) => {
    done(null, user);
  });

  const fetchUser = async (data: any, done: any) => {
    console.log("data:", data);
    try {
      const db = dbPool.get(getDBContext());
      let user = await db.auth.getUserByEmail({ email: data.email } );
      console.log("user check result:", user);
      if (user && !user[0].enabled) {
        return done(null, false);
      }
      if (!user) {
        user = [db.owners.add('full', { name: data.name, email: data.email })];
      }
      return done(null, user[0]);
    } catch(error) {
      return done(error);
    }
  }

  passport.use(new GoogleStrategy({
    clientID: google.clientID,
    clientSecret: google.clientSecret,
    callbackURL: "/api/v1/auth/google/redirect",
    // callbackURL: "localhost:4200/auth",
    passReqToCallback: true
  },
    (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
      console.log("google passport callback:", profile);
      const data = {
        googleID: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      };
      req.logout();
      return fetchUser(data, done);
    }
  ));

  passport.use(new FacebookStrategy({
    clientID: facebook.clientID,
    clientSecret: facebook.clientSecret,
    callbackURL: "/api/v1/auth/facebook/redirect",
    profileFields: ['id', 'displayName', 'name', 'email'],
    passReqToCallback: true
  },
    async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
      console.log("facebook passport callback:", profile);
      const data = {
        facebookID: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      };
      req.logout();
      return fetchUser(data, done);
    }
  ));

  passport.use(new LocalStrategy({
    usernameField: "email",
    passReqToCallback: true
  },
    async (req: any, email: string, password: string, done: any) => {
      console.log("local passport callback:", email + "/" + password);
      const data = {
        email,
        password
      };
      console.log("data:", data);
      try {
        const db = dbPool.get(getDBContext());
        const user = await db.auth.getUserByEmailPassword(data);
        console.log("user check result:", user);
        req.logout();
        if (!user || !user[0].enabled) {
          return done(null, false);
        }
        return done(null, user[0]);
      } catch(error) {
        return done(error);
      }
    }
  ));

  return passport;
};
