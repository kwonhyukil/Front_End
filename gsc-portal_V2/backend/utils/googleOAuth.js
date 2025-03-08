// Google OAuth API 요청 처리
import axios from "axios";

// Google 로그인 URL 생성 함수
export const getGoogleAuthUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    scope: ["openid", "profile", "email"].join(" "),
  };
  return `${rootUrl}?${new URLSearchParams(options).toString()}`;
};

// Google에서 사용자 정보 가져오기
export const getGoogleUser = async (code) => {
  try {
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });
    
    const { data: userInfo } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${data.access_token}` },
      }
    );

    return userInfo;
  } catch (error) {
    console.error("❌ Google API 요청 오류:", error);
    return null;
  }
};