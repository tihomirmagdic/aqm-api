"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const LocalStrategy = require('passport-local');
const keys_1 = require("./keys");
const cookieSession = require("cookie-session");
const db_1 = require("../../db");
const handler_1 = require("../../server/handler");
exports.setup = (app, passport) => {
    console.log("google keys:", keys_1.google);
    console.log("facebook keys:", keys_1.facebook);
    app.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2'],
        // Cookie Options
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    const fetchUser = async (data, done) => {
        console.log("data:", data);
        try {
            const db = db_1.dbPool.get(handler_1.getDBContext());
            let user = await db.auth.getUserByEmail({ email: data.email });
            console.log("user check result:", user);
            if (user && !user[0].enabled) {
                return done(null, false);
            }
            if (!user) {
                user = [db.owners.add('full', { name: data.name, email: data.email })];
            }
            return done(null, user[0]);
        }
        catch (error) {
            return done(error);
        }
    };
    passport.use(new GoogleStrategy({
        clientID: keys_1.google.clientID,
        clientSecret: keys_1.google.clientSecret,
        callbackURL: "/api/v1/auth/google/redirect",
        // callbackURL: "localhost:4200/auth",
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
        console.log("google passport callback:", profile);
        const data = {
            googleID: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
        };
        req.logout();
        return fetchUser(data, done);
    }));
    passport.use(new FacebookStrategy({
        clientID: keys_1.facebook.clientID,
        clientSecret: keys_1.facebook.clientSecret,
        callbackURL: "/api/v1/auth/facebook/redirect",
        profileFields: ['id', 'displayName', 'name', 'email'],
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        console.log("facebook passport callback:", profile);
        const data = {
            facebookID: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
        };
        req.logout();
        return fetchUser(data, done);
    }));
    passport.use(new LocalStrategy({
        usernameField: "email",
        passReqToCallback: true
    }, async (req, email, password, done) => {
        console.log("local passport callback:", email + "/" + password);
        const data = {
            email,
            password
        };
        console.log("data:", data);
        try {
            const db = db_1.dbPool.get(handler_1.getDBContext());
            const user = await db.auth.getUserByEmailPassword(data);
            console.log("user check result:", user);
            req.logout();
            if (!user || !user[0].enabled) {
                return done(null, false);
            }
            return done(null, user[0]);
        }
        catch (error) {
            return done(error);
        }
    }));
    return passport;
};
//# sourceMappingURL=passport-setup.js.map