export default {
  props: ["tempProduct", "addToCart"],
  data() {
    return {
      productModal: null,
      qty: 1,
    };
  },
  methods: {
    open() {
      this.productModal.show();
    },
    close() {
      this.productModal.hide();
    },
  },
  //當 tempProduct的值有變化的時候 我們再做重置，watch是監聽 tempProduct 的值有沒有變化而已，有變化就把數量變成 1
  watch: {
    tempProduct() {
      this.qty = 1;
    },
  },
  template: "#userProductModal",
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.modal);
    // new 開頭的 叫做函式建構子 / 叫做建立實體， new 後面接的命名習慣上會是大寫
  },
}