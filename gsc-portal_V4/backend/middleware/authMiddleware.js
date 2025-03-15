import jwt from "jsonwebtoken"; // JWT(JSON Web Token) 라이브러리 가져오기

const { JWT_SECRET } = process.env; // 환경 변수에서 JWT 비밀키 가져오기

/**
 * ✅ JWT 검증 미들웨어
 * - 클라이언트 요청에 포함된 JWT 토큰을 검증하여 인증된 사용자만 접근 허용
 */
export const authRequired = (req, res, next) => {
  try {
    // ✅ 1. Authorization 헤더 확인
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "인증 토큰이 필요합니다." }); // 🔴 인증 토큰이 없는 경우
    }

    // ✅ 2. "Bearer <토큰>" 형식에서 토큰 부분 추출
    const token = authHeader.split(" ")[1];

    // ✅ 3. JWT 토큰 검증
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ 4. 검증된 사용자 정보를 req.user에 저장
    req.user = decoded;

    // ✅ 5. 다음 미들웨어 또는 컨트롤러로 요청 전달
    next();
  } catch (error) {
    return res.status(401).json({ error: "유효하지 않은 토큰" }); // 🔴 토큰 검증 실패
  }
};
