const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const User = require("../models/User");

exports.verifyGoogleToken = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({ name, email, picture });
      console.log("🟢 새 사용자 등록:", email);
    } else {
      console.log("🔁 기존 사용자 로그인:", email);
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    });
  } catch (err) {
    console.error("❌ 구글 토큰 검증 실패:", err);
    return res.status(401).json({ error: "Invalid Google token" });
  }
};
