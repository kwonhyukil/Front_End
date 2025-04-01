// 이메일 도메인 검증증
export const validateEmailDomain = (email) => {
  return email.endsWith("@g.yju.ac.kr");
};
