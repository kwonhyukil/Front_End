<template>
  <div>
    <div ref="googleButton"></div>
    <p v-if="user">환영합니다, {{ user.name }}!</p>
    <p v-if="errorMessage" style="color: red;">오류 발생: {{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      errorMessage: null,
    };
  },
  mounted() {
    window.onload = () => {
      google.accounts.id.initialize({
        client_id: "325235898341-vqicpajq5p9n0knkass2dg246vgaulls.apps.googleusercontent.com",
        callback: this.handleCredentialResponse,
      });
      google.accounts.id.renderButton(this.$refs.googleButton, {
        theme: "outline",
        size: "large",
      });
    };
  },
  methods: {
    async handleCredentialResponse(response) {
      console.log("Google ID Token:", response.credential);

      try {
        const res = await fetch("http://localhost:5001/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.credential }),
        });

        if (!res.ok) throw new Error(`서버 응답 오류: ${res.status}`);

        const data = await res.json();
        console.log("서버 응답:", data);

        if (data.user) {
          this.user = data.user;
        }
      } catch (error) {
        this.errorMessage = error.message;
        console.error("로그인 오류:", error);
      }
    }
  }
};
</script>
