import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';

dotenv.config();

// Serialize user for the session
passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
    console.log('Deserializing user:', user);
    done(null, user);
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3005/api/auth/google/callback',
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google OAuth callback received. Profile:', profile);
        
        if (!profile || !profile.emails || !profile.emails[0]) {
            console.error('Invalid profile received from Google');
            return done(new Error('Invalid profile received from Google'));
        }

        const user = {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            provider: 'google',
            avatar: profile.photos?.[0]?.value
        };

        console.log('Created user object:', user);
        return done(null, user);
    } catch (error) {
        console.error('Error in Google OAuth strategy:', error);
        return done(error, null);
    }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3005/api/auth/github/callback',
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        console.log('GitHub OAuth callback received. Profile:', profile);
        
        if (!profile || !profile.emails || !profile.emails[0]) {
            console.error('Invalid profile received from GitHub');
            return done(new Error('Invalid profile received from GitHub'));
        }

        const user = {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName || profile.username,
            provider: 'github',
            avatar: profile.photos?.[0]?.value
        };

        console.log('Created user object:', user);
        return done(null, user);
    } catch (error) {
        console.error('Error in GitHub OAuth strategy:', error);
        return done(error, null);
    }
}));

export default passport;
