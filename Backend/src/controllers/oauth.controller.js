import { google } from "googleapis";
import { GoogleConnection } from "../models/googleConnections.model.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });


export const startGoogleOAuth = (req, res) => {
  const formId = req.query.formId || req.body?.formId; 
  if (!formId) {
    return res.status(400).send("formId is required");
  }
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // get refresh token
    prompt: "consent",
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ],
    state: formId,
  });

  res.redirect(authUrl);
};


export const handleGoogleOAuthCallback = async (req, res) => {
  try {
    const { code, state: formId } = req.query;

    if (!formId) {
      return res.status(400).send("Form ID missing in OAuth state");
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();

    let connection = await GoogleConnection.findOne({ formId, googleEmail: email });

    if (!connection) {
      connection = new GoogleConnection({
        formId,
        googleEmail: email,
        refreshToken: tokens.refresh_token,
        accessToken: tokens.access_token,
        profilePicture: payload.picture || null,
        accountName: payload.name,
        sheetId: "", 
        sheetName: "",
        addedFields: [],
      });
    } else {
      connection.refreshToken = tokens.refresh_token || connection.refreshToken;
      connection.accessToken = tokens.access_token;
    }

    await connection.save();

    res.redirect(`${process.env.FRONTEND_URL}/sheets/create`);
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/oauth-error`);
  }
};

export const getFormGoogleAccounts = async (req, res) => {
  try {
    const { formId } = req.params;

    const connections = await GoogleConnection.find({ formId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Connected Google accounts fetched",
      connections,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
