<template>
    <div>
        <NavBar />
        <h1>🔑 Google 로그인</h1>
        <button @click="loginWithGoogle">Google 로그인</button>
    </div>
</template>

<script>
import { onMounted } from 'vue';
import NavBar from '../components/NavBar.vue';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';


export default {
    components: { NavBar },
    setup() {
        const authStore = useAuthStore();

        // Google OAuth 로그인 요청 ( 프론트엔드에서 직접 URL 생성 X -> 백엔드 요청)
        const loginWithGoogle = () => {
            try {
                console.log("🔄 Google 로그인 버튼 클릭됨!");
                window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
                
            } catch (error) {
                console.error("🚨 Google 로그인 요청 실패:", error);
            }
        }       
    
        

        //🔹 백엔드로 Authorization Code 전송 & JWT 발급 요청 (추가 기능 ✅)
        const sendTokenTobackend = async (authCode) => {
            try{
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/google/callback?code=${authCode}`,
                    { withCredentials: true }
                );

                console.log("백엔드 응답: ", response.data);

                // JWT 토큰 저장 후 로그인 유지
                authStore.setToken(response.data.token);

                // URL에서 code 제거 (로그인 후 깔끔하게 URL 유지)
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
                console.error( "백엔드에 Authorization code 전송 실패: ", error.response?.data || error.message);
            }
        };

        // 로그인 후 URL에서 Authorization code 추출
        const handleLoginRedirect = () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const authCode = urlParams.get("code");

                if (authCode) {
                    console.log("🔑 Authorization Code:", authCode);
                    sendTokenTobackend(authCode);
                }
            } catch (error) {
                console.error("🚨 로그인 리디렉트 처리 실패:", error);
            }
        };
        // 사용자 정보 가져오기
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/user`,
                    {withCredentials: true}
                );
                console.log("사용자 정보: ". response.data)
            } catch (error) {
                console.error("사용자 정보 가져오기 실패: ", error)
            }
        };
        // 로그인 상태 확인
        onMounted(() => {
            handleLoginRedirect();
            fetchUserInfo();
        });
        
        return { loginWithGoogle };
    },
}
</script>
