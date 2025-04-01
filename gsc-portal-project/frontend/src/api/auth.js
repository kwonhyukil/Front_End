export const googleLogin = () => {
  window.location.href = import.meta.env.VITE_BACKEND_URL + "/auth/google";
};
