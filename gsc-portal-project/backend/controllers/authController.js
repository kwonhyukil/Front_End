const axios = require("axios");
const jwt = require("jsonwebtoken");
const {
  googleClientID,
  googleClientSecret,
  googleRedirectURI,
  jwtSecret,
  frontendURL,
} = require("../config/keys");

// 🔹 Google OAuth 로그인 요청
exports.googleLogin = (req, res) => {
  console.log("✅ Google 로그인 요청 시작");
  console.log("🔗 Redirecting to Google OAuth: ", googleRedirectURI);

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientID}&redirect_uri=${encodeURIComponent(
    googleRedirectURI
  )}&response_type=code&scope=openid email profile&access_type=offline&prompt=consent`;

  res.redirect(googleAuthUrl);
};

// 🔹 Google OAuth 콜백 처리
exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      console.error("❌ Authorization Code가 없습니다!");
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    console.log("✅ Authorization Code 수신:", code);

    // 🔹 Google에서 Access Token 요청
    console.log("🔄 Google에 Access Token 요청 중...");

    const params = new URLSearchParams();
    params.append("client_id", googleClientID);
    params.append("client_secret", googleClientSecret);
    params.append("redirect_uri", encodeURIComponent(googleRedirectURI)); // ✅ 정확한 URI 인코딩
    params.append("grant_type", "authorization_code");
    params.append("code", code);

    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("✅ Google에서 받은 Access Token 데이터:", data);

    const { access_token, id_token } = data;

    if (!access_token) {
      console.error("❌ Access Token이 존재하지 않습니다.");
      return res.status(400).json({ error: "Failed to retrieve access token" });
    }

    // 🔹 Google에서 사용자 정보 가져오기
    console.log("🔄 Google에서 사용자 정보 가져오는 중...");

    const { data: userInfo } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    console.log("👤 Google 사용자 정보:", userInfo);

    // 🔹 JWT 생성 후 프론트엔드로 전달
    const token = jwt.sign(
      {
        user: {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
        },
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    console.log("🔑 JWT 생성 완료:", token);
    console.log(
      "🔄 프론트엔드로 리다이렉트:",
      `${frontendURL}/auth/callback?token=${token}`
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // 로컬 개발 환경에서는 false, 배포 시 true
      sameSite: "Lax",
    });

    res.redirect(`${frontendURL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error(
      "❌ Google OAuth 오류:",
      error.response ? error.response.data : error.message
    );

    res.status(500).json({
      error: "Google 로그인 실패",
      details: error.response ? error.response.data : error.message,
    });
  }
};
