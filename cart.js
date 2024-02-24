import userModal from "./userModal.js";
const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "owen-hexschool";
  //步驟 3：定義表單驗證規則 全部加入(CDN版本）
  Object.keys(VeeValidateRules).forEach((rule) => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });
  
  // 步驟 4 : 讀取外部的資源
  VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
  
  // Activate the locale
  VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
  });


 

const app = Vue.createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
      status: {
        addCartLoading: '',
        cartQtyLoading: '',
      },
      carts: {},
      form: {
        //結帳表單
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  methods: {
    getProducts() {
      axios.get(`${apiUrl}/api/${apiPath}/products/all`).then((res) => {
        console.log(res);
        this.products = res.data.products;
      });
    },
    openModal(product) {
      this.tempProduct = product;
      this.$refs.userModal.open();
    },
    addToCart(product_id, qty = 1) {
      const order = {
        product_id,
        qty,
      };
      // console.log(order); 確認點擊加入購物車時先看有沒有反應再去抓api
      // Loading...
      this.status.addCartLoading = product_id; // 加入購物車過程中要把id 給儲存起來
      axios
        .post(`${apiUrl}/api/${apiPath}/cart`, { data: order })
        .then((res) => {
          console.log(res);
          this.status.addCartLoading = ""; // 加入購物車完成之後就把它清掉
          this.getCart(); //當點擊已經加入到購物車的品項 會讓購物車裡的數量加 1，意思是當品項加入購物車後這行程式碼就是會重新取得產品列表的數量，新的數量覆蓋舊的數量看起來像加 1
          this.$refs.userModal.close();
        });
    },
    changeCartQty(item, qty = 1) {
      const order = {
        product_id: item.product_id,
        qty,
      };
      
      this.status.cartQtyLoading = item.id; 
      // console.log(order)
      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data: order })
        .then((res) => {
          console.log(res);
          this.status.cartQtyLoading = '';
          this.getCart(); 

        });
    },
    removeCartItem(id) {
      this.status.cartQtyLoading = id;
      axios
        .delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
        .then((res) => {
          this.status.cartQtyLoading = '';
          this.getCart(); 
        });
    },
    getCart() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`).then((res) => {
        console.log(res);
        this.carts = res.data.data;
        console.log(this.carts);
      });
    },
    // 最後兩個是表單驗證用的
    onSubmit() {
      console.log(this.form.user);
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "需要正確的電話號碼";
    },
  },
  components: {
    userModal,
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

// 步驟 1：在html 加入 VeeValidation 相關資源
// 步驟 2 : 註冊註冊全域的表單驗證元件（VForm, VField, ErrorMessage）元件
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);
app.mount("#app");

// export default cart
