import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GoogleConnection } from '../models/googleConnections.model.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL, // e.g., /auth/google/callback?formId=xxx
        scope: [
          'profile',
          'email',
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.file',
        ],
        accessType: 'offline', // get refresh token
        prompt: 'consent',     // force consent screen
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value.toLowerCase();
          const formId = profile._json?.formId || null; // pass via OAuth state/query

          if (!formId) {
            throw new Error('Form ID is required to connect Google account.');
          }

          // Check if a GoogleConnection already exists for this form + email
          let connection = await GoogleConnection.findOne({
            formId,
            googleEmail: email,
          });

          if (!connection) {
            connection = new GoogleConnection({
              formId,
              googleEmail: email,
              refreshToken,
              accessToken,
              profilePicture: profile.photos[0]?.value || null,
              accountName: profile.displayName,
              sheetId: '',      // will be set later when sheet is created/linked
              sheetName: '',
              addedFields: [],
            });
          } else {
            // Update tokens if changed
            connection.refreshToken = refreshToken || connection.refreshToken;
            connection.accessToken = accessToken;
          }

          await connection.save();

          return done(null, connection);
        } catch (err) {
          console.error('Google OAuth error:', err);
          return done(err, null);
        }
      }
    )
  );
};

export default configurePassport;