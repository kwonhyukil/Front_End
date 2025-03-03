// JWT 생성 및 검증
import jwt from "jsonwebtoken";

export const generateJWT = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role, picture: user.picture },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};


