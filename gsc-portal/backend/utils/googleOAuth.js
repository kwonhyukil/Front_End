// Google OAuth API 요청 처리
import axios from "axios";
import keys from "../config/keys.js";

export const getGoogleUser = async (code) => {
  const tokenResponse = await axios.post(
    "https://oauth2.googleapis.com/token",
    new URLSearchParams({
      client_id: keys.googleClientID,
      client_secret: keys.googleClientSecret,
      redirect_uri: keys.googleRedirectURI,
      grant_type: "authorization_code",
      code: code,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  if (!tokenResponse.data.access_token) return null;

  const userInfoResponse = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    { headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` } }
  );

  return userInfoResponse.data;
};

export const getGoogleAuthUrl = () => {
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
    keys.googleClientID
  }&redirect_uri=${encodeURIComponent(
    keys.googleRedirectURI
  )}&response_type=code&scope=openid email profile&prompt=consent`;
};
