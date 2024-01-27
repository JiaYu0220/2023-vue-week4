import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

let productModal = null;
let delProductModal = null;

const app = createApp({
  data() {
    return {
      apiUrl: "https://ec-course-api.hexschool.io/v2",
      apiPath: "jiayu",
      products: [],
      tempProduct: { imagesUrl: [] },
      pagination: {},
    };
  },
  mounted() {
    // 取 token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    // 設 headers
    axios.defaults.headers.common["Authorization"] = token;
    this.checkLogin();
  },
  watch: {},
  methods: {
    async checkLogin() {
      try {
        // api
        const url = `${this.apiUrl}/api/user/check`;
        await axios.post(url);
        // 取產品資料
        this.getData();
      } catch (error) {
        alert(error.data.message);
        window.location = "index.html";
      }
    },
    async getData(page = 1) {
      try {
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
        const { data } = await axios.get(url);
        this.products = data.products;
        this.pagination = data.pagination;
      } catch (error) {
        alert(error.data.message);
      }
    },
    openModal(type, product) {
      switch (type) {
        case "edit":
          this.tempProduct = { ...product };
          productModal.show();
          break;
        case "add":
          this.tempProduct = {
            imagesUrl: [],
            is_enabled: 0,
            stock: 0,
            rate: 0,
            rateNum: 0,
            comments: [],
          };
          productModal.show();
          break;
        case "delete":
          this.tempProduct = { ...product };
          delProductModal.show();
          break;
      }
    },
  },
});

// 分頁
app.component("pagination", {
  template: `#pagination`,
  props: ["pages"],
});

// 產品 modal
app.component("productModal", {
  template: `#productModal`,
  props: ["product"],
  data() {
    return {
      apiUrl: "https://ec-course-api.hexschool.io/v2",
      apiPath: "jiayu",
    };
  },
  mounted() {
    productModal = new bootstrap.Modal(this.$refs.productModal, {
      keyboard: false,
      backdrop: "static",
    });
  },
  methods: {
    createImage() {
      this.product.imagesUrl = [""];
      // this.tempProduct.push("");
    },
    async updateProduct() {
      try {
        let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
        let http = "post";
        if (this.product.id) {
          url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
          http = "put";
        }
        const res = await axios[http](url, { data: this.product });
        alert(res.data.message);

        this.$emit("update"); //觸發外層的 getData

        productModal.hide();
      } catch (error) {
        console.log(error);
        alert(error.data.message);
      }
    },
  },
});
// 刪除 modal
app.component("delProductModal", {
  template: "#delProductModal",
  props: ["product"],
  data() {
    return {
      apiUrl: "https://ec-course-api.hexschool.io/v2",
      apiPath: "jiayu",
    };
  },
  mounted() {
    delProductModal = new bootstrap.Modal(this.$refs.delProductModal, {
      keyboard: false,
      backdrop: "static",
    });
  },
  methods: {
    async delProduct() {
      try {
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
        const res = await axios.delete(url);
        alert(res.data.message);

        this.$emit("update");
        delProductModal.hide();
      } catch (error) {
        alert(error.data.message);
      }
    },
  },
});

app.mount("#app");
