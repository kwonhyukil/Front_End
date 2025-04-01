import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    id: null,
    name: "",
    email: "",
    picture: "",
    isLoggedIn: false,
  }),
  actions: {
    setUser(user) {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
      this.picture = user.picture;
      this.isLoggedIn = true;
    },
    logout() {
      this.id = null;
      this.name = "";
      this.email = "";
      this.picture = "";
      this.isLoggedIn = false;
    },
  },
});
