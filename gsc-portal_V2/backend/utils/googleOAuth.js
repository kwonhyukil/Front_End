// backend/utils/googleOAuth.js
import { google } from "googleapis";
import axios from "axios";
import keys from "../config/keys.js";

// Google OAuth2 클라이언트
const oauth2Client = new google.auth.OAuth2(
  keys.googleClientID,
  keys.googleClientSecret,
  keys.googleRedirectURI
);

export const getGoogleAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "profile", "email"],
    prompt: "consent",
  });
};

export const getGoogleUser = async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const { data } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );
    return data; // { email, name, picture ... }
  } catch (error) {
    console.error("❌ GoogleUser 오류:", error);
    return null;
  }
};

// Google Calendar 전용
export const getGoogleCalendarTokens = async (code) => {
  try {
    const calendarClient = new google.auth.OAuth2(
      keys.googleClientID,
      keys.googleClientSecret,
      keys.googleCalendarRedirectURI
    );
    const { tokens } = await calendarClient.getToken(code);
    return tokens;
  } catch (error) {
    console.error("❌ Google Calendar Token 오류:", error);
    return null;
  }
};
