import jwt from "jsonwebtoken";

/**
 * ✅ JWT 및 Refresh Token 생성 함수
 * @param {object} user - 사용자 정보 (email, role, id 포함)
 * @returns {object} - Access Token과 Refresh Token 반환
 */
export const generateTokens = (user, generateRefreshToken = true) => {
  // 🔹 Access Token (1시간 만료)
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // 🔹 Refresh Token (7일 만료) - 기본적으로 생성하지만, 옵션으로 조절 가능
  const refreshToken = generateRefreshToken
    ? jwt.sign({ id: user.id, email: user.email }, process.env.REFRESH_SECRET, {
        expiresIn: "7d",
      })
    : null;

  return { accessToken, refreshToken };
};

/**
 * ✅ JWT 검증 함수 (AccessToken & RefreshToken)
 * @param {string} token - 검증할 JWT 토큰
 * @param {string} secret - 검증할 때 사용할 시크릿 키
 * @returns {Promise<object>} - 검증된 사용자 정보 반환
 */
export const verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject({ error: "토큰 검증 실패", details: err.message });
      }
      resolve(decoded);
    });
  });
};

/**
 * ✅ Refresh Token을 이용해 새로운 Access Token 발급
 * @param {string} refreshToken - 기존 Refresh Token
 * @returns {Promise<object>} - 새 Access Token 및 Refresh Token 반환
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = await verifyToken(refreshToken, process.env.REFRESH_SECRET);

    // 🔹 사용자 정보를 기반으로 새 JWT 발급
    const newTokens = generateTokens(decoded, false); // 새 Refresh Token 생성 X
    return { success: true, accessToken: newTokens.accessToken };
  } catch (error) {
    return { success: false, error: "Refresh Token이 유효하지 않음" };
  }
};

/**
 * ✅ JWT 토큰이 만료되었는지 확인
 * @param {string} token - 확인할 JWT 토큰
 * @returns {boolean} - 만료 여부 (true = 만료됨, false = 유효함)
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true; // 만료시간이 없으면 만료된 것으로 처리
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true; // 파싱 오류 발생 시 만료된 것으로 처리
  }
};
