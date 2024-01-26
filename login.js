import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const app = createApp({
  data() {
    return {
      apiUrl: "https://ec-course-api.hexschool.io/v2",
      user: {
        username: "",
        password: "",
      },
      isPwVisible: false,
    };
  },
  methods: {
    async login() {
      try {
        const url = `${this.apiUrl}/admin/signin`;
        const res = await axios.post(url, this.user);
        // 存 cookie
        const { token, expired } = res.data;
        document.cookie = `token=${token}; expired=${new Date(expired)}`;
        window.location = "product.html";
        this.user = {
          username: "",
          password: "",
        };
      } catch (error) {
        alert(error.response.data.message);
      }
    },
  },
});

app.mount("#app");
